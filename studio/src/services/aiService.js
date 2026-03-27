/**
 * AI Service – unified entry point for all AI tool calls
 * Each tool registers a provider config; this layer dispatches to the right adapter.
 */

import { callGradioApi, resolveFileUrl } from './providers/huggingface';

// ── Provider Registry ─────────────────────────────────────────
export const providers = {
  'camera-edit': {
    id: 'camera-edit',
    name: '镜头角度编辑',
    desc: '上传产品图，AI 生成不同拍摄角度的变体',
    space: 'linoyts/Qwen-Image-Edit-Angles',
    apiName: '/infer_edit_camera_angles',
    params: [
      { key: 'rotate_deg',    label: '水平旋转',  type: 'slider', min: -90, max: 90, step: 15, default: 0, unit: '°' },
      { key: 'move_forward',  label: '推拉距离',  type: 'slider', min: 0,   max: 10, step: 1,  default: 0 },
      { key: 'vertical_tilt', label: '俯仰角度',  type: 'slider', min: -1,  max: 1,  step: 0.5, default: 0 },
      { key: 'wideangle',     label: '广角镜头',  type: 'checkbox', default: false },
    ],
    advanced: [
      { key: 'num_inference_steps', label: '推理步数', type: 'slider', min: 1, max: 20, step: 1, default: 4 },
      { key: 'true_guidance_scale', label: '引导强度', type: 'slider', min: 1, max: 10, step: 0.5, default: 1.0 },
    ],
    inputType: 'image',
    outputType: 'image',
  },
};

// ── Mock fallback (offline / demo) ────────────────────────────
async function mockGenerate(providerId, _params, delay = 2000) {
  await new Promise(r => setTimeout(r, delay));
  // Return a placeholder — in real usage this would be an image URL
  return { success: true, mock: true, providerId };
}

// ── Public API ────────────────────────────────────────────────

/**
 * Call an AI provider
 * @param {string} providerId
 * @param {object} params - { image?: File|Blob, ...providerParams }
 * @param {object} opts - { onProgress?, signal?, useMock? }
 * @returns {Promise<{ imageUrl: string|null, seed: number, prompt: string }>}
 */
export async function generate(providerId, params = {}, opts = {}) {
  const provider = providers[providerId];
  if (!provider) throw new Error(`Unknown provider: ${providerId}`);

  if (opts.useMock) return mockGenerate(providerId, params);

  try {
    const data = buildArgs(provider, params);
    const result = await callGradioApi(provider.space, provider.apiName, data, opts);

    // Parse result — Gradio returns an array
    const imageData = result?.[0];
    const seed = result?.[1];
    const prompt = result?.[2];

    let imageUrl = null;
    if (imageData?.url) {
      imageUrl = imageData.url;
    } else if (imageData?.path) {
      imageUrl = resolveFileUrl(provider.space, imageData.path);
    } else if (typeof imageData === 'string') {
      imageUrl = imageData.startsWith('http') ? imageData : resolveFileUrl(provider.space, imageData);
    }

    return { imageUrl, seed, prompt };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.error(`AI Service [${providerId}] error:`, err);
    throw err;
  }
}

/**
 * Build ordered args array for a Gradio API call
 */
function buildArgs(provider, params) {
  // For camera-edit specifically
  if (provider.id === 'camera-edit') {
    return [
      params.image || null,             // image
      params.rotate_deg ?? 0,           // rotate_deg
      params.move_forward ?? 0,         // move_forward
      params.vertical_tilt ?? 0,        // vertical_tilt
      params.wideangle ?? false,        // wideangle
      params.seed ?? 0,                 // seed
      true,                             // randomize_seed
      params.true_guidance_scale ?? 1.0,// true_guidance_scale
      params.num_inference_steps ?? 4,  // num_inference_steps
      null,                             // height (auto)
      null,                             // width (auto)
      null,                             // prev_output
    ];
  }

  // Generic fallback: pass params values in order of provider.params
  return [...(provider.params || []), ...(provider.advanced || [])].map(
    p => params[p.key] ?? p.default
  );
}

export function getProvider(id) {
  return providers[id] || null;
}

export function listProviders() {
  return Object.values(providers);
}

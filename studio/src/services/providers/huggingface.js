/**
 * HuggingFace Gradio Space adapter
 * Handles the Gradio queue protocol: join → poll SSE → get result
 */

const HF_BASE = 'https://{space}.hf.space';

function getSpaceUrl(space) {
  // "linoyts/Qwen-Image-Edit-Angles" → "linoyts-qwen-image-edit-angles.hf.space"
  return HF_BASE.replace('{space}', space.replace('/', '-').toLowerCase());
}

/**
 * Convert a File/Blob to base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a file to the Gradio Space and get a file reference
 */
async function uploadFile(spaceUrl, file) {
  const formData = new FormData();
  formData.append('files', file);
  const res = await fetch(`${spaceUrl}/upload`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const paths = await res.json();
  return paths[0]; // returns path string
}

/**
 * Call a Gradio Space API endpoint using the queue protocol
 * @param {string} space - e.g. "linoyts/Qwen-Image-Edit-Angles"
 * @param {string} apiName - e.g. "/infer_edit_camera_angles"
 * @param {Array} data - ordered arguments matching the API
 * @param {function} onProgress - optional progress callback
 * @param {AbortSignal} signal - optional abort signal
 * @returns {Promise<any>} - the result data
 */
export async function callGradioApi(space, apiName, data, { onProgress, signal } = {}) {
  const spaceUrl = getSpaceUrl(space);

  // Step 1: Join the queue
  const joinRes = await fetch(`${spaceUrl}/api${apiName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data }),
    signal,
  });

  if (!joinRes.ok) {
    // Try queue-based approach for spaces that use it
    return callGradioQueueApi(spaceUrl, apiName, data, { onProgress, signal });
  }

  const result = await joinRes.json();
  return result.data;
}

/**
 * Queue-based Gradio API (for spaces with GPU queue)
 */
async function callGradioQueueApi(spaceUrl, apiName, data, { onProgress, signal } = {}) {
  // Join queue
  const joinRes = await fetch(`${spaceUrl}/queue/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data,
      fn_index: 0,
      session_hash: Math.random().toString(36).slice(2),
    }),
    signal,
  });

  if (!joinRes.ok) throw new Error(`Queue join failed: ${joinRes.status}`);
  const { event_id } = await joinRes.json();

  // Poll SSE for result
  return new Promise((resolve, reject) => {
    const es = new EventSource(`${spaceUrl}/queue/data?session_hash=${event_id}`);

    if (signal) {
      signal.addEventListener('abort', () => {
        es.close();
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }

    es.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.msg === 'process_completed') {
        es.close();
        if (msg.output?.error) reject(new Error(msg.output.error));
        else resolve(msg.output?.data);
      } else if (msg.msg === 'progress') {
        onProgress?.(msg.progress_data);
      } else if (msg.msg === 'estimation') {
        onProgress?.({ queue_size: msg.queue_size, rank: msg.rank });
      }
    };

    es.onerror = () => {
      es.close();
      reject(new Error('SSE connection failed'));
    };
  });
}

/**
 * Helper: convert HF file path in result to full URL
 */
export function resolveFileUrl(space, filePath) {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  const spaceUrl = getSpaceUrl(space);
  return `${spaceUrl}/file=${filePath}`;
}

export { uploadFile, getSpaceUrl, fileToBase64 };

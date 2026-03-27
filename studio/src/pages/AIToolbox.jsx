import { useState } from 'react';
import { Camera, FileText, Image, Film, Sticker, Wand2, ArrowLeft, ChevronRight, ChevronDown, Upload, Sparkles, Plus, SlidersHorizontal, X, Check, Eye, RefreshCw, Pencil, Trash2, BookmarkCheck, Download, Copy, Maximize2, LayoutGrid } from 'lucide-react';
import { providers } from '../services/aiService';
import { getCategories, filterTemplates } from '../data/promptTemplates';

/* ── Glass styles ──────────────────────────────────────────────── */
const glassCard = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  border: 'var(--glass-border)',
  boxShadow: 'var(--shadow-glass)',
  borderRadius: 'var(--radius-lg)',
};

const glassHeader = {
  background: 'var(--glass-bg-heavy)',
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  borderBottom: '1px solid rgba(0,0,0,0.04)',
};

const inputStyle = {
  flex: 1, width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(0,0,0,0.06)', fontSize: 13,
  color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit',
  background: 'rgba(255,255,255,0.6)',
  backdropFilter: 'blur(8px)',
  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
};

/* ── Tool registry ─────────────────────────────────────────────── */
const tools = [
  {
    id: 'camera-edit',
    name: '镜头角度编辑',
    desc: '上传产品白底图，AI 生成多角度产品图',
    icon: Camera,
    color: '#0071E3',
    tags: ['电商', '产品图', 'AI'],
    status: 'ready',
  },
  {
    id: 'storyboard',
    name: '分镜头脚本',
    desc: '编写分镜头提示词，AI 逐镜生成画面',
    icon: Film,
    color: '#5856D6',
    tags: ['视频', '分镜', 'AI'],
    status: 'ready',
  },
  {
    id: 'ai-image',
    name: 'AI 生图',
    desc: '输入描述提示词，批量生成高质量图片',
    icon: Image,
    color: '#34C759',
    tags: ['生图', '设计', 'AI'],
    status: 'ready',
  },
  {
    id: 'ai-sticker',
    name: 'AI 图标',
    desc: '多风格图标 / 贴纸生成',
    icon: Sticker,
    color: '#FF6B9D',
    tags: ['图标', '贴纸', 'AI'],
    status: 'ready',
  },
  {
    id: 'text-wash',
    name: '文案洗稿',
    desc: '粘贴抖音链接或文本，AI 识别并改写文案',
    icon: FileText,
    color: '#FF9F0A',
    tags: ['文案', '洗稿', 'AI'],
    status: 'coming',
  },
  {
    id: 'ai-magic',
    name: '更多工具',
    desc: '持续上新中...',
    icon: Wand2,
    color: 'var(--color-text-tertiary)',
    tags: [],
    status: 'coming',
  },
];

/* ── Shared constants ──────────────────────────────────────────── */
const COVER_COLORS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
];

const VARIANT_COUNT = 4;
const makeVariants = (existing = []) => {
  const base = existing.length;
  return [...existing, ...Array.from({ length: VARIANT_COUNT }, (_, i) => ({ id: Date.now() + base + i, seed: Math.floor(Math.random() * COVER_COLORS.length) }))];
};

const defaultShots = [
  { id: 1, name: '开场疑问', prompt: '主播正脸，疑问表情，特写镜头，留白', status: 'idle', variants: [], selected: null },
  { id: 2, name: '产品展示', prompt: '产品堆叠展示画面，俯拍平铺', status: 'idle', variants: [], selected: null },
  { id: 3, name: '数据对比', prompt: '产品对比 + 数据卡片，数据动态入场', status: 'idle', variants: [], selected: null },
  { id: 4, name: '搭配演示', prompt: '主播演示搭配误区，产品 + 手部特写', status: 'idle', variants: [], selected: null },
  { id: 5, name: '互动收尾', prompt: '主播正脸，互动收尾，表情轻松，眼神直视', status: 'idle', variants: [], selected: null },
];

const RATIOS = [
  { label: '1:1', w: 1, h: 1 },
  { label: '4:3', w: 4, h: 3 },
  { label: '3:4', w: 3, h: 4 },
  { label: '16:9', w: 16, h: 9 },
  { label: '9:16', w: 9, h: 16 },
];

const IMAGE_STYLES = ['写实摄影', '插画风', '3D 渲染', '水彩', '赛博朋克', '动漫'];

/* ── Shared UI components ──────────────────────────────────────── */

function PrimaryBtn({ children, onClick, size = 'md' }) {
  const pad = size === 'sm' ? '7px 14px' : '9px 18px';
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 'var(--radius-sm)', fontSize: size === 'sm' ? 12 : 13,
      fontWeight: 500, fontFamily: 'inherit',
      background: 'var(--color-primary)', color: '#FFFFFF',
      border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
      transition: 'all var(--transition-smooth)',
      boxShadow: '0 2px 8px rgba(0, 113, 227, 0.2)',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 113, 227, 0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 113, 227, 0.2)'; }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12,
      fontWeight: 500, fontFamily: 'inherit',
      background: 'rgba(255,255,255,0.5)', color: 'var(--color-text-secondary)',
      border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
      backdropFilter: 'blur(8px)',
      transition: 'all var(--transition-fast)',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
    >{children}</button>
  );
}

function IconBtn({ children, onClick, hoverColor = 'var(--color-primary)' }) {
  return (
    <button onClick={onClick} style={{
      padding: 6, borderRadius: 8, background: 'none', border: 'none',
      cursor: 'pointer', color: 'var(--color-text-quaternary)',
      transition: 'all var(--transition-fast)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}
      onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-quaternary)'; e.currentTarget.style.background = 'none'; }}
    >{children}</button>
  );
}

function PreviewModal({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeInSoft 150ms ease',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }} />
      <div style={{
        position: 'relative', width: 640, maxHeight: '85vh', overflowY: 'auto',
        background: 'var(--glass-bg-heavy)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: 'var(--glass-border)',
        boxShadow: 'var(--shadow-lg)',
        borderRadius: 'var(--radius-xl)',
        animation: 'slideUp 250ms cubic-bezier(0.25,0.1,0.25,1)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>{title}</span>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-text-tertiary)', transition: 'all var(--transition-fast)',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
          ><X size={15} /></button>
        </div>
        <div style={{ padding: '20px 24px' }}>{children}</div>
      </div>
    </div>
  );
}

function PromptTemplatePanel({ toolType, onSelect }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const categories = getCategories(toolType);
  const templates = filterTemplates(toolType, category);

  return (
    <div style={{ marginBottom: 14 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12,
        fontWeight: 500, fontFamily: 'inherit',
        background: open ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
        color: open ? 'var(--color-primary)' : 'var(--color-text-secondary)',
        border: `1px solid ${open ? 'rgba(0,113,227,0.15)' : 'rgba(0,0,0,0.06)'}`,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all var(--transition-fast)',
      }}>
        <BookmarkCheck size={12} /> 提示词模版
        <ChevronDown size={11} style={{ transition: 'transform var(--transition-base)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {open && (
        <div style={{ marginTop: 12, animation: 'fadeIn 200ms ease' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
            <button onClick={() => setCategory('all')} style={{
              padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
              background: category === 'all' ? 'var(--color-text)' : 'rgba(255,255,255,0.5)',
              color: category === 'all' ? '#FFFFFF' : 'var(--color-text-secondary)',
              border: `1px solid ${category === 'all' ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>全部</button>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{
                padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
                background: category === c ? 'var(--color-text)' : 'rgba(255,255,255,0.5)',
                color: category === c ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: `1px solid ${category === c ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {templates.map(t => (
              <div key={t.id} onClick={() => { onSelect(t.prompt); setOpen(false); }} style={{
                padding: '14px 16px',
                background: 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(0,0,0,0.04)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>{t.prompt}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
                  {t.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 500 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Variant strip (shared across generation tools) ────────────── */

function VariantStrip({ variants, selected, icon, onSelect, onPreview, onMore }) {
  return (
    <div style={{ padding: '10px 14px 12px 48px', animation: 'fadeIn 250ms ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          生成变体（{variants.length} 张）
        </span>
        {selected !== null && (
          <span style={{ fontSize: 10, color: 'var(--color-green)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Check size={10} /> 已选中
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {variants.map((v, vi) => {
          const isSel = selected === v.id;
          return (
            <div key={v.id} style={{ position: 'relative' }}>
              <div
                onClick={() => onSelect(v.id)}
                style={{
                  width: 88, height: 66, borderRadius: 'var(--radius-xs)',
                  background: COVER_COLORS[v.seed % COVER_COLORS.length],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  border: isSel ? '2px solid var(--color-primary)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)',
                  boxShadow: isSel ? '0 0 0 2px rgba(0,113,227,0.2)' : 'none',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.border = '2px solid rgba(0,0,0,0.15)'; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.border = '2px solid transparent'; }}
              >
                {icon}
                <div
                  onClick={e => { e.stopPropagation(); onPreview(v.id); }}
                  style={{
                    position: 'absolute', top: 3, right: 3, width: 20, height: 20, borderRadius: 4,
                    background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity var(--transition-fast)', cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                >
                  <Eye size={11} color="#FFF" />
                </div>
              </div>
              {isSel && (
                <div style={{
                  position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
                  background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  <Check size={9} color="#FFF" strokeWidth={3} />
                </div>
              )}
              <div style={{ fontSize: 9, color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: 3 }}>#{vi + 1}</div>
            </div>
          );
        })}
        <div
          onClick={onMore}
          style={{
            width: 88, height: 66, borderRadius: 'var(--radius-xs)',
            border: '1.5px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-bg)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <Plus size={14} color="var(--color-text-tertiary)" />
          <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 2 }}>再生成</span>
        </div>
      </div>
    </div>
  );
}

/* ── Item row header (shared) ──────────────────────────────────── */

function ItemRowHeader({ item, index, editing, setEditing, draft, setDraft, onSave, onCancel, onDelete, onGenerate }) {
  const isIdle = item.status === 'idle';
  const isGenerating = item.status === 'generating';
  const isDone = item.status === 'done';

  return (
    <div style={{ flex: 1, padding: '12px 14px', minWidth: 0, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', background: 'var(--color-text)',
        color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 600, flexShrink: 0, marginTop: 2,
      }}>{index + 1}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'fadeIn 100ms ease' }}>
            <input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} placeholder="名称" style={{ ...inputStyle, fontWeight: 500 }} />
            <textarea value={draft.prompt} onChange={e => setDraft(d => ({ ...d, prompt: e.target.value }))} placeholder="描述提示词" rows={2} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <PrimaryBtn size="sm" onClick={onSave}>保存</PrimaryBtn>
              <GhostBtn onClick={onCancel}>取消</GhostBtn>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{item.name}</span>
              {isDone && item.selected !== null && (
                <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-green-bg)', color: 'var(--color-green)', fontWeight: 500 }}>已选</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginTop: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.prompt}</div>
          </div>
        )}
      </div>

      {!editing && !isGenerating && (
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <IconBtn onClick={() => setEditing(true)}><Pencil size={12} /></IconBtn>
          <IconBtn onClick={() => onDelete(item.id)} hoverColor="var(--color-red)"><Trash2 size={12} /></IconBtn>
        </div>
      )}
      {!editing && (isIdle || isDone) && (
        <button onClick={() => onGenerate(item.id)} style={{
          padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
          background: isIdle ? 'var(--color-primary)' : 'none',
          color: isIdle ? '#FFF' : 'var(--color-text-secondary)',
          border: isIdle ? 'none' : '1px solid rgba(0,0,0,0.08)',
          cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0,
          transition: 'all var(--transition-fast)',
        }}
          onMouseEnter={e => { if (isIdle) e.currentTarget.style.opacity = '0.85'; else { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; } }}
          onMouseLeave={e => { if (isIdle) e.currentTarget.style.opacity = '1'; else { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; } }}
        >{isIdle ? <><Sparkles size={10} /> 生成</> : <><RefreshCw size={10} /> 重新生成</>}</button>
      )}
      {isGenerating && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, paddingRight: 4 }}>
          <div style={{ width: 12, height: 12, border: '2px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 500 }}>生成中</span>
        </div>
      )}
    </div>
  );
}

/* ── useVariantTool hook ───────────────────────────────────────── */

function useVariantTool(initialList) {
  const [list, setList] = useState(initialList);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: '', prompt: '' });
  const [preview, setPreview] = useState(null);

  const update = (id, data) => setList(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
  const remove = (id) => setList(prev => prev.filter(s => s.id !== id));

  const generate = (id) => {
    setList(prev => prev.map(s => s.id === id ? { ...s, status: 'generating', variants: [], selected: null } : s));
    setTimeout(() => {
      setList(prev => prev.map(s => s.id === id && s.status === 'generating' ? { ...s, status: 'done', variants: makeVariants() } : s));
    }, 1500 + Math.random() * 1000);
  };

  const generateMore = (id) => {
    setList(prev => prev.map(s => s.id === id ? { ...s, status: 'generating' } : s));
    setTimeout(() => {
      setList(prev => prev.map(s => s.id === id && s.status === 'generating' ? { ...s, status: 'done', variants: makeVariants(s.variants) } : s));
    }, 1500 + Math.random() * 1000);
  };

  const selectVariant = (itemId, variantId) => {
    setList(prev => prev.map(s => s.id === itemId ? { ...s, selected: s.selected === variantId ? null : variantId } : s));
  };

  const generateAll = () => {
    const idleIds = list.filter(s => s.status === 'idle').map(s => s.id);
    idleIds.forEach((id, i) => { setTimeout(() => generate(id), i * 400); });
  };

  const startEdit = (item) => { setEditingId(item.id); setDraft({ name: item.name, prompt: item.prompt }); };
  const saveEdit = (id) => { update(id, { ...draft, status: 'idle', variants: [], selected: null }); setEditingId(null); };
  const cancelEdit = () => setEditingId(null);

  return { list, setList, editingId, draft, setDraft, preview, setPreview, update, remove, generate, generateMore, selectVariant, generateAll, startEdit, saveEdit, cancelEdit };
}

/* ── Generic tool page wrapper ─────────────────────────────────── */

function ToolPage({ toolDef, onBack, wide, children }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      <div style={{ ...glassHeader, padding: '18px 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-secondary)', background: 'none', border: 'none',
            cursor: 'pointer', transition: 'all var(--transition-fast)', flexShrink: 0,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            background: `${toolDef.color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <toolDef.icon size={17} color={toolDef.color} strokeWidth={1.8} />
          </div>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>{toolDef.name}</h2>
          </div>
        </div>
      </div>
      <div style={{ padding: wide ? '0' : '28px 40px 48px', maxWidth: wide ? 'none' : 900 }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main export
   ══════════════════════════════════════════════════════════════════ */

export default function AIToolbox() {
  const [activeTool, setActiveTool] = useState(null);
  const onBack = () => setActiveTool(null);

  const toolDef = tools.find(t => t.id === activeTool);

  if (activeTool === 'camera-edit') {
    return <CameraEditTool onBack={onBack} />;
  }
  if (activeTool === 'storyboard') {
    return <ToolPage toolDef={toolDef} onBack={onBack} wide><StoryboardToolInner /></ToolPage>;
  }
  if (activeTool === 'ai-image') {
    return <ToolPage toolDef={toolDef} onBack={onBack} wide><ImageToolInner /></ToolPage>;
  }
  if (activeTool === 'ai-sticker') {
    return <ToolPage toolDef={toolDef} onBack={onBack}><StickerToolInner /></ToolPage>;
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ ...glassHeader, padding: '36px 40px 32px' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>
          AI 工具箱
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
          独立 AI 工具集合，即开即用，不绑定项目流程
        </p>
      </div>

      <div style={{ padding: '32px 40px 48px', maxWidth: 960 }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
          animation: 'fadeIn 350ms ease',
        }}>
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} onClick={() => tool.status === 'ready' && setActiveTool(tool.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Tool card ─────────────────────────────────────────────────── */
function ToolCard({ tool, onClick }) {
  const isReady = tool.status === 'ready';
  return (
    <div
      onClick={onClick}
      style={{
        ...glassCard,
        padding: '24px',
        cursor: isReady ? 'pointer' : 'default',
        transition: 'all var(--transition-smooth)',
        opacity: isReady ? 1 : 0.55,
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { if (isReady) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; } }}
      onMouseLeave={e => { if (isReady) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-glass)'; } }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `${tool.color}12`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <tool.icon size={22} color={tool.color} strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>{tool.name}</span>
            {!isReady && (
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.04)', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>即将上线</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{tool.desc}</div>
          {tool.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {tool.tags.map(tag => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.03)', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>{tag}</span>
              ))}
            </div>
          )}
        </div>
        {isReady && <ChevronRight size={16} color="var(--color-text-quaternary)" style={{ marginTop: 2 }} />}
      </div>
    </div>
  );
}

/* ── Jimeng-style result card (shared) ─────────────────────────── */

function JimengResultCard({ result, index, icon, onPreview }) {
  return (
    <div style={{
      ...glassCard, borderRadius: 'var(--radius-md)', overflow: 'hidden',
      animation: `fadeIn ${200 + index * 50}ms ease`,
    }}>
      <div style={{
        width: '100%', aspectRatio: '1', position: 'relative',
        background: COVER_COLORS[result.seed % COVER_COLORS.length],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
        {/* Hover overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          padding: '12px', opacity: 0, transition: 'opacity 200ms ease',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0'}
        >
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onPreview} title="预览" style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            ><Maximize2 size={14} color="#FFF" /></button>
            <button title="下载" style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            ><Download size={14} color="#FFF" /></button>
            <button title="复制" style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms ease',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            ><Copy size={14} color="#FFF" /></button>
          </div>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>#{index + 1}</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Storyboard Tool — 即梦 style split layout
   ══════════════════════════════════════════════════════════════════ */

function StoryboardToolInner() {
  const [shots, setShots] = useState(defaultShots);
  const [activeShot, setActiveShot] = useState(1);
  const [ratio, setRatio] = useState('16:9');
  const [preview, setPreview] = useState(null);
  const [newName, setNewName] = useState('');
  const nextId = () => Math.max(0, ...shots.map(s => s.id)) + 1;

  const current = shots.find(s => s.id === activeShot) || shots[0];

  const updatePrompt = (prompt) => {
    setShots(prev => prev.map(s => s.id === activeShot ? { ...s, prompt } : s));
  };

  const addShot = () => {
    const name = newName.trim() || `镜头 ${shots.length + 1}`;
    const id = nextId();
    setShots(prev => [...prev, { id, name, prompt: '', status: 'idle', results: [] }]);
    setActiveShot(id);
    setNewName('');
  };

  const deleteShot = (id) => {
    if (shots.length <= 1) return;
    setShots(prev => prev.filter(s => s.id !== id));
    if (activeShot === id) setActiveShot(shots.find(s => s.id !== id)?.id);
  };

  const generateCurrent = () => {
    if (!current?.prompt.trim()) return;
    const shotId = activeShot;
    setShots(prev => prev.map(s => s.id === shotId ? { ...s, status: 'generating' } : s));
    setTimeout(() => {
      const newResults = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        seed: Math.floor(Math.random() * COVER_COLORS.length),
        status: 'done',
      }));
      setShots(prev => prev.map(s => s.id === shotId && s.status === 'generating'
        ? { ...s, status: 'done', results: [...s.results, ...newResults] }
        : s
      ));
    }, 1800 + Math.random() * 1200);
  };

  const generateAll = () => {
    shots.filter(s => s.prompt.trim() && s.status === 'idle').forEach((s, i) => {
      setTimeout(() => {
        setShots(prev => prev.map(x => x.id === s.id ? { ...x, status: 'generating' } : x));
        setTimeout(() => {
          const newResults = Array.from({ length: 4 }, (_, j) => ({
            id: Date.now() + i * 10 + j,
            seed: Math.floor(Math.random() * COVER_COLORS.length),
            status: 'done',
          }));
          setShots(prev => prev.map(x => x.id === s.id && x.status === 'generating'
            ? { ...x, status: 'done', results: [...x.results, ...newResults] }
            : x
          ));
        }, 1800 + Math.random() * 1200);
      }, i * 500);
    });
  };

  const panelStyle = {
    width: 360, minWidth: 360, height: 'calc(100vh - 62px)',
    overflowY: 'auto', padding: '24px',
    borderRight: '1px solid rgba(0,0,0,0.05)',
    background: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', gap: 16,
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 62px)' }}>
      {/* ─── Left Panel ─── */}
      <div style={panelStyle}>
        {/* Shot tabs */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>镜头列表</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{shots.length} 个镜头</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {shots.map((s, i) => {
              const isActive = s.id === activeShot;
              return (
                <div key={s.id}
                  onClick={() => setActiveShot(s.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    background: isActive ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0, 113, 227, 0.15)' : 'transparent'}`,
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? 'var(--color-primary)' : 'rgba(0,0,0,0.08)',
                    color: isActive ? '#FFF' : 'var(--color-text-tertiary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 600,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--color-primary)' : 'var(--color-text)' }}>{s.name}</div>
                    {s.prompt && <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.prompt}</div>}
                  </div>
                  {s.status === 'generating' && <div style={{ width: 10, height: 10, border: '1.5px solid var(--color-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />}
                  {s.status === 'done' && s.results.length > 0 && <span style={{ fontSize: 9, padding: '1px 5px', borderRadius: 'var(--radius-full)', background: 'var(--color-green-bg)', color: 'var(--color-green)', fontWeight: 500, flexShrink: 0 }}>{s.results.length}</span>}
                  {shots.length > 1 && (
                    <button onClick={e => { e.stopPropagation(); deleteShot(s.id); }} style={{
                      padding: 2, background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-text-quaternary)', opacity: 0, transition: 'opacity var(--transition-fast)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--color-red)'; }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '0'; }}
                    ><X size={12} /></button>
                  )}
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && addShot()} placeholder="新镜头名称..." style={{ ...inputStyle, flex: 1, padding: '7px 10px', fontSize: 11 }} />
              <button onClick={addShot} style={{
                padding: '6px 10px', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                background: 'none', border: '1px dashed rgba(0,0,0,0.12)', color: 'var(--color-text-secondary)',
                cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3,
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
              ><Plus size={11} /> 添加</button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }} />

        {/* Prompt for active shot */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>
            画面描述 — {current?.name}
          </div>
          <PromptTemplatePanel toolType="storyboard" onSelect={(p) => updatePrompt(p)} />
          <textarea
            value={current?.prompt || ''}
            onChange={e => updatePrompt(e.target.value)}
            placeholder="描述这个镜头的画面内容..."
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontSize: 13 }}
          />
        </div>

        {/* Ratio */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>画面比例</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RATIOS.map(r => (
              <button key={r.label} onClick={() => setRatio(r.label)} style={{
                flex: 1, padding: '7px 0', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                background: ratio === r.label ? 'var(--color-text)' : 'rgba(255,255,255,0.6)',
                color: ratio === r.label ? '#FFF' : 'var(--color-text-secondary)',
                border: `1px solid ${ratio === r.label ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Generate buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
          <button onClick={generateCurrent} disabled={!current?.prompt.trim() || current?.status === 'generating'} style={{
            width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)',
            background: current?.prompt.trim() ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
            color: current?.prompt.trim() ? '#FFF' : 'var(--color-text-quaternary)',
            border: 'none', cursor: current?.prompt.trim() ? 'pointer' : 'default',
            fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'all var(--transition-fast)',
            boxShadow: current?.prompt.trim() ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'none',
          }}>
            {current?.status === 'generating'
              ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.8)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> 生成中...</>
              : <><Sparkles size={14} /> 生成当前镜头</>
            }
          </button>
          {shots.filter(s => s.prompt.trim() && s.status === 'idle').length > 1 && (
            <button onClick={generateAll} style={{
              width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)',
              background: 'none', color: 'var(--color-text-secondary)',
              border: '1px solid rgba(0,0,0,0.08)', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
            ><LayoutGrid size={12} /> 全部镜头批量生成</button>
          )}
        </div>
      </div>

      {/* ─── Right Panel: Results ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', height: 'calc(100vh - 62px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
              {current?.name} — 生成结果
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              {current?.results?.length || 0} 张图片 · 每次生成 4 张
            </div>
          </div>
          {current?.results?.length > 0 && (
            <button onClick={() => setShots(prev => prev.map(s => s.id === activeShot ? { ...s, results: [], status: 'idle' } : s))} style={{
              fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>清空结果</button>
          )}
        </div>

        {(!current?.results || current.results.length === 0) ? (
          <div style={{
            ...glassCard, padding: '80px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)',
          }}>
            <Film size={40} color="var(--color-text-quaternary)" style={{ margin: '0 auto 14px' }} />
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 }}>暂无生成结果</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>在左侧输入画面描述，点击生成</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {current.results.map((r, i) => (
              <JimengResultCard key={r.id} result={r} index={i} icon={<Film size={28} color="rgba(255,255,255,0.6)" />}
                onPreview={() => setPreview(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <PreviewModal title={`${current?.name} — 预览`} onClose={() => setPreview(null)}>
          <div style={{
            width: '100%', aspectRatio: ratio === '16:9' ? '16/9' : ratio === '9:16' ? '9/16' : ratio === '4:3' ? '4/3' : ratio === '3:4' ? '3/4' : '1/1',
            maxHeight: 400, borderRadius: 'var(--radius-md)',
            background: COVER_COLORS[preview.seed % COVER_COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Film size={48} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>提示词：</span>{current?.prompt}
          </div>
        </PreviewModal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Image Tool — 即梦 style split layout
   ══════════════════════════════════════════════════════════════════ */

function ImageToolInner() {
  const [prompt, setPrompt] = useState('');
  const [refImg, setRefImg] = useState(null);
  const [ratio, setRatio] = useState('1:1');
  const [style, setStyle] = useState('写实摄影');
  const [results, setResults] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      const batch = Array.from({ length: 4 }, (_, i) => ({
        id: Date.now() + i,
        seed: Math.floor(Math.random() * COVER_COLORS.length),
        prompt: prompt,
        ratio, style,
        status: 'done',
      }));
      setResults(prev => [...batch, ...prev]);
      setGenerating(false);
    }, 2000 + Math.random() * 1500);
  };

  const handleRefUpload = () => {
    setRefImg({ name: 'reference.jpg', url: null });
  };

  const panelStyle = {
    width: 360, minWidth: 360, height: 'calc(100vh - 62px)',
    overflowY: 'auto', padding: '24px',
    borderRight: '1px solid rgba(0,0,0,0.05)',
    background: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(12px)',
    display: 'flex', flexDirection: 'column', gap: 16,
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 62px)' }}>
      {/* ─── Left Panel ─── */}
      <div style={panelStyle}>
        {/* Prompt */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>画面描述</div>
          <PromptTemplatePanel toolType="image" onSelect={(p) => setPrompt(p)} />
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="描述你想生成的画面..."
            rows={5}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontSize: 13 }}
          />
        </div>

        {/* Reference image */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>参考图（可选）</div>
          {refImg ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              background: 'var(--color-primary-bg)', borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(0,113,227,0.12)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 6,
                background: 'linear-gradient(135deg, #f0f0f3, #e0e0e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Image size={16} color="var(--color-text-quaternary)" />
              </div>
              <span style={{ flex: 1, fontSize: 11, color: 'var(--color-text)' }}>{refImg.name}</span>
              <button onClick={() => setRefImg(null)} style={{
                fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              }}>移除</button>
            </div>
          ) : (
            <div onClick={handleRefUpload} style={{
              border: '1.5px dashed rgba(0,0,0,0.1)', borderRadius: 'var(--radius-sm)',
              padding: '16px', textAlign: 'center', cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(0,113,227,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <Upload size={16} color="var(--color-text-tertiary)" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>点击上传参考图</div>
            </div>
          )}
        </div>

        {/* Ratio */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>画面比例</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {RATIOS.map(r => (
              <button key={r.label} onClick={() => setRatio(r.label)} style={{
                flex: 1, padding: '7px 0', borderRadius: 'var(--radius-sm)', fontSize: 11, fontWeight: 500,
                background: ratio === r.label ? 'var(--color-text)' : 'rgba(255,255,255,0.6)',
                color: ratio === r.label ? '#FFF' : 'var(--color-text-secondary)',
                border: `1px solid ${ratio === r.label ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
              }}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 8 }}>风格</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {IMAGE_STYLES.map(s => (
              <button key={s} onClick={() => setStyle(s)} style={{
                padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
                background: style === s ? 'var(--color-text)' : 'rgba(255,255,255,0.6)',
                color: style === s ? '#FFF' : 'var(--color-text-secondary)',
                border: `1px solid ${style === s ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Advanced toggle */}
        <button onClick={() => setShowAdvanced(!showAdvanced)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
        }}>
          <SlidersHorizontal size={11} /> 高级设置
          <ChevronDown size={11} style={{ transition: 'transform var(--transition-fast)', transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0)' }} />
        </button>
        {showAdvanced && (
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.04)', animation: 'fadeIn 150ms ease' }}>
            <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>更多参数将在 API 接入后生效</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>生成数量</span>
              <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>4</span>
            </div>
          </div>
        )}

        {/* Generate button */}
        <button onClick={handleGenerate} disabled={!prompt.trim() || generating} style={{
          width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', marginTop: 'auto',
          background: prompt.trim() ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
          color: prompt.trim() ? '#FFF' : 'var(--color-text-quaternary)',
          border: 'none', cursor: prompt.trim() ? 'pointer' : 'default',
          fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          transition: 'all var(--transition-fast)',
          boxShadow: prompt.trim() ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'none',
        }}>
          {generating
            ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.8)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> 生成中...</>
            : <><Sparkles size={14} /> 生成图片</>
          }
        </button>
      </div>

      {/* ─── Right Panel: Results ─── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', height: 'calc(100vh - 62px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>生成结果</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
              {results.length} 张图片 · 每次生成 4 张
            </div>
          </div>
          {results.length > 0 && (
            <button onClick={() => setResults([])} style={{
              fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>清空全部</button>
          )}
        </div>

        {results.length === 0 ? (
          <div style={{
            ...glassCard, padding: '80px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)',
          }}>
            <Image size={40} color="var(--color-text-quaternary)" style={{ margin: '0 auto 14px' }} />
            <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 }}>暂无生成结果</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>在左侧输入画面描述，点击生成</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {results.map((r, i) => (
              <JimengResultCard key={r.id} result={r} index={i} icon={<Image size={28} color="rgba(255,255,255,0.6)" />}
                onPreview={() => setPreview(r)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {preview && (
        <PreviewModal title="图片预览" onClose={() => setPreview(null)}>
          <div style={{
            width: '100%', aspectRatio: preview.ratio === '16:9' ? '16/9' : preview.ratio === '9:16' ? '9/16' : preview.ratio === '4:3' ? '4/3' : preview.ratio === '3:4' ? '3/4' : '1/1',
            maxHeight: 400, borderRadius: 'var(--radius-md)',
            background: COVER_COLORS[preview.seed % COVER_COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <Image size={48} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>提示词：</span>{preview.prompt}
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            <span>比例：{preview.ratio}</span>
            <span>风格：{preview.style}</span>
          </div>
        </PreviewModal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Sticker Tool
   ══════════════════════════════════════════════════════════════════ */

function StickerToolInner() {
  const styles = ['扁平插画', '3D 贴纸', '线条简约', '国风水墨'];
  const [sel, setSel] = useState('扁平插画');
  const [newName, setNewName] = useState('');
  const [newPrompt, setNewPrompt] = useState('');
  const t = useVariantTool([
    { id: 1, name: '产品图标', prompt: '护肤瓶图标，扁平风格，简洁线条', status: 'idle', variants: [], selected: null },
    { id: 2, name: '装饰贴纸', prompt: '樱花花瓣贴纸，柔和粉色', status: 'idle', variants: [], selected: null },
  ]);

  const addSticker = () => {
    if (!newName.trim() || !newPrompt.trim()) return;
    t.setList(prev => [...prev, { id: Date.now(), name: newName.trim(), prompt: newPrompt.trim(), status: 'idle', variants: [], selected: null }]);
    setNewName(''); setNewPrompt('');
  };

  const hasIdle = t.list.some(s => s.status === 'idle');
  const previewItem = t.preview ? t.list[t.preview.itemIndex] : null;
  const previewVariant = previewItem?.variants.find(v => v.id === t.preview?.variantId);

  return (
    <div>
      {t.preview && previewItem && (
        <PreviewModal title={`${previewItem.name} — 变体预览`} onClose={() => t.setPreview(null)}>
          <div style={{
            width: '100%', height: 240, borderRadius: 'var(--radius-md)',
            background: COVER_COLORS[previewVariant?.seed % COVER_COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Sticker size={48} color="rgba(255,255,255,0.6)" />
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>提示词：</span>{previewItem.prompt}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 8 }}>风格：{sel}</div>
        </PreviewModal>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {styles.map(s => (
          <button key={s} onClick={() => setSel(s)} style={{
            padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 12,
            background: sel === s ? 'var(--color-text)' : 'rgba(255,255,255,0.5)',
            color: sel === s ? '#FFFFFF' : 'var(--color-text-secondary)',
            border: `1px solid ${sel === s ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
            cursor: 'pointer', fontFamily: 'inherit',
            backdropFilter: sel === s ? 'none' : 'blur(8px)',
            transition: 'all var(--transition-fast)',
          }}>{s}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {t.list.map((stk, i) => (
          <div key={stk.id} style={{
            background: 'rgba(255,255,255,0.35)', borderRadius: 'var(--radius-sm)',
            backdropFilter: 'blur(8px)', border: `1px solid ${t.editingId === stk.id ? 'var(--color-primary)' : 'transparent'}`,
            overflow: 'hidden', transition: 'all var(--transition-fast)',
          }}>
            <ItemRowHeader
              item={stk} index={i} editing={t.editingId === stk.id}
              setEditing={() => t.startEdit(stk)} draft={t.draft} setDraft={t.setDraft}
              onSave={() => t.saveEdit(stk.id)} onCancel={t.cancelEdit}
              onDelete={t.remove} onGenerate={t.generate}
            />
            {stk.status === 'done' && stk.variants.length > 0 && (
              <VariantStrip
                variants={stk.variants} selected={stk.selected}
                icon={<Sticker size={18} color="rgba(255,255,255,0.7)" />}
                onSelect={(vid) => t.selectVariant(stk.id, vid)}
                onPreview={(vid) => t.setPreview({ itemIndex: i, variantId: vid })}
                onMore={() => t.generateMore(stk.id)}
              />
            )}
          </div>
        ))}
      </div>

      <PromptTemplatePanel toolType="sticker" onSelect={(p) => setNewPrompt(p)} />
      <div style={{ background: 'rgba(255,255,255,0.35)', border: '1.5px dashed rgba(0,0,0,0.08)', borderRadius: 'var(--radius-sm)', padding: '14px', backdropFilter: 'blur(8px)' }}>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, fontWeight: 500 }}>添加新图标</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="图标名称" style={{ ...inputStyle, width: 120, flex: 'none' }} />
          <input value={newPrompt} onChange={e => setNewPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSticker()} placeholder="描述提示词..." style={inputStyle} />
          <PrimaryBtn size="sm" onClick={addSticker}><Plus size={12} /> 添加</PrimaryBtn>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        {hasIdle && (
          <PrimaryBtn onClick={t.generateAll}><Sparkles size={13} /> 全部生成</PrimaryBtn>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Camera Edit Tool – Qwen multi-angle product image generation
   ══════════════════════════════════════════════════════════════════ */

const ANGLE_PRESETS = [
  { label: '正面', rotate: 0, tilt: 0, forward: 0 },
  { label: '左转 45°', rotate: -45, tilt: 0, forward: 0 },
  { label: '右转 45°', rotate: 45, tilt: 0, forward: 0 },
  { label: '俯拍', rotate: 0, tilt: -1, forward: 0 },
  { label: '仰拍', rotate: 0, tilt: 1, forward: 0 },
  { label: '特写', rotate: 0, tilt: 0, forward: 8 },
  { label: '左俯 45°', rotate: -45, tilt: -0.5, forward: 0 },
  { label: '右俯 45°', rotate: 45, tilt: -0.5, forward: 0 },
];

function CameraEditTool({ onBack }) {
  const [sourceImage, setSourceImage] = useState(null);
  const [params, setParams] = useState({ rotate_deg: 0, move_forward: 0, vertical_tilt: 0, wideangle: false });
  const [results, setResults] = useState([]);
  const [preview, setPreview] = useState(null);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedPresets, setSelectedPresets] = useState(new Set());

  const provider = providers['camera-edit'];

  const handleUpload = () => {
    setSourceImage({ name: 'product_white_bg.jpg', url: null });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setSourceImage({ name: file.name, url });
    }
  };

  const generateSingle = () => {
    const id = Date.now();
    const newResult = { id, label: '自定义角度', params: { ...params }, status: 'generating', imageUrl: null };
    setResults(prev => [...prev, newResult]);
    setTimeout(() => {
      setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r));
    }, 1500 + Math.random() * 1500);
  };

  const generatePreset = (preset) => {
    const id = Date.now() + Math.random();
    const newResult = {
      id, label: preset.label,
      params: { rotate_deg: preset.rotate, move_forward: preset.forward, vertical_tilt: preset.tilt, wideangle: false },
      status: 'generating', imageUrl: null,
    };
    setResults(prev => [...prev, newResult]);
    setTimeout(() => {
      setResults(prev => prev.map(r => r.id === id ? { ...r, status: 'done' } : r));
    }, 1500 + Math.random() * 1500);
  };

  const generateBatch = () => {
    const presets = ANGLE_PRESETS.filter((_, i) => selectedPresets.has(i));
    presets.forEach((preset, i) => { setTimeout(() => generatePreset(preset), i * 300); });
    setBatchMode(false);
    setSelectedPresets(new Set());
  };

  const togglePreset = (i) => {
    setSelectedPresets(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };

  const removeResult = (id) => setResults(prev => prev.filter(r => r.id !== id));

  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      <div style={{ ...glassHeader, padding: '22px 40px' }}>
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)',
          fontSize: 13, background: 'none', border: 'none', cursor: 'pointer',
          marginBottom: 14, fontFamily: 'inherit', fontWeight: 500,
        }}>
          <ArrowLeft size={14} /> AI 工具箱
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(0, 113, 227, 0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={20} color="var(--color-primary)" strokeWidth={1.8} />
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>镜头角度编辑</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>上传产品白底图，AI 生成多角度产品图</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '28px 40px 48px', maxWidth: 1080 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...glassCard, padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 12 }}>原始图片</div>
              {sourceImage ? (
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                    background: sourceImage.url ? `url(${sourceImage.url}) center/contain no-repeat` : 'linear-gradient(135deg, #f5f5f7, #e8e8ed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    {!sourceImage.url && <Image size={32} color="var(--color-text-quaternary)" />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{sourceImage.name}</span>
                    <button onClick={() => setSourceImage(null)} style={{ fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>更换</button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={handleUpload}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-sm)',
                    border: '2px dashed rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  <Upload size={24} color="var(--color-text-tertiary)" />
                  <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 8 }}>上传产品白底图</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>拖拽或点击选择</span>
                </div>
              )}
            </div>

            <div style={{ ...glassCard, padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>角度参数</div>
                <SlidersHorizontal size={13} color="var(--color-text-tertiary)" />
              </div>
              {provider.params.map(p => (
                <div key={p.key} style={{ marginBottom: 14 }}>
                  {p.type === 'slider' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{p.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--color-primary)', fontWeight: 600 }}>{params[p.key]}{p.unit || ''}</span>
                      </div>
                      <input type="range" min={p.min} max={p.max} step={p.step} value={params[p.key]}
                        onChange={e => setParams(prev => ({ ...prev, [p.key]: parseFloat(e.target.value) }))}
                        style={{ width: '100%', accentColor: 'var(--color-primary)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--color-text-quaternary)', marginTop: 2 }}>
                        <span>{p.min}</span><span>{p.max}</span>
                      </div>
                    </>
                  ) : (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={params[p.key]}
                        onChange={e => setParams(prev => ({ ...prev, [p.key]: e.target.checked }))}
                        style={{ accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.label}</span>
                    </label>
                  )}
                </div>
              ))}
              <button onClick={generateSingle} disabled={!sourceImage} style={{
                width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)',
                background: sourceImage ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
                color: sourceImage ? '#FFF' : 'var(--color-text-quaternary)',
                border: 'none', cursor: sourceImage ? 'pointer' : 'default',
                fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'all var(--transition-fast)',
              }}>
                <Sparkles size={14} /> 生成当前角度
              </button>
            </div>

            <div style={{ ...glassCard, padding: '20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>快捷角度</div>
                <button onClick={() => setBatchMode(!batchMode)} style={{ fontSize: 11, color: batchMode ? 'var(--color-primary)' : 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
                  {batchMode ? '取消多选' : '批量选择'}
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {ANGLE_PRESETS.map((preset, i) => {
                  const isSel = selectedPresets.has(i);
                  return (
                    <button key={i} onClick={() => batchMode ? togglePreset(i) : (sourceImage && generatePreset(preset))}
                      disabled={!sourceImage && !batchMode}
                      style={{
                        padding: '8px 10px', borderRadius: 'var(--radius-xs)',
                        background: isSel ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
                        border: `1px solid ${isSel ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                        cursor: sourceImage || batchMode ? 'pointer' : 'default',
                        fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
                        color: isSel ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        transition: 'all var(--transition-fast)',
                        display: 'flex', alignItems: 'center', gap: 6,
                        opacity: !sourceImage && !batchMode ? 0.4 : 1,
                      }}
                    >
                      {batchMode && (
                        <div style={{
                          width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                          border: `1.5px solid ${isSel ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)'}`,
                          background: isSel ? 'var(--color-primary)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isSel && <Check size={8} color="#FFF" strokeWidth={3} />}
                        </div>
                      )}
                      {preset.label}
                    </button>
                  );
                })}
              </div>
              {batchMode && selectedPresets.size > 0 && (
                <button onClick={generateBatch} disabled={!sourceImage} style={{
                  width: '100%', padding: '10px', marginTop: 10, borderRadius: 'var(--radius-sm)',
                  background: sourceImage ? 'var(--color-text)' : 'rgba(0,0,0,0.06)',
                  color: sourceImage ? '#FFF' : 'var(--color-text-quaternary)',
                  border: 'none', cursor: sourceImage ? 'pointer' : 'default',
                  fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Sparkles size={13} /> 批量生成 {selectedPresets.size} 个角度
                </button>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>
                生成结果
                {results.length > 0 && <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-text-tertiary)', marginLeft: 8 }}>{results.length} 张</span>}
              </div>
              {results.length > 0 && (
                <button onClick={() => setResults([])} style={{ fontSize: 11, color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>清空全部</button>
              )}
            </div>

            {results.length === 0 ? (
              <div style={{ ...glassCard, padding: '60px 40px', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
                <Camera size={36} color="var(--color-text-quaternary)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 6 }}>暂无生成结果</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>上传产品图后，选择角度开始生成</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {results.map((r, i) => (
                  <ResultCard key={r.id} result={r} index={i}
                    onPreview={() => setPreview(r)}
                    onRemove={() => removeResult(r.id)}
                    onRegenerate={() => {
                      setResults(prev => prev.map(x => x.id === r.id ? { ...x, status: 'generating' } : x));
                      setTimeout(() => {
                        setResults(prev => prev.map(x => x.id === r.id ? { ...x, status: 'done' } : x));
                      }, 1500 + Math.random() * 1500);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <div onClick={() => setPreview(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, animation: 'fadeInSoft 150ms ease',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 560, maxHeight: '80vh', overflow: 'auto',
            background: 'var(--glass-bg-heavy)',
            backdropFilter: 'blur(24px) saturate(180%)',
            border: 'var(--glass-border)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)' }}>{preview.label}</span>
              <button onClick={() => setPreview(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', display: 'flex' }}><X size={18} /></button>
            </div>
            <div style={{
              width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)',
              background: preview.imageUrl ? `url(${preview.imageUrl}) center/contain no-repeat #f5f5f7` : COVER_COLORS[results.indexOf(preview) % COVER_COLORS.length],
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              {!preview.imageUrl && <Camera size={48} color="rgba(255,255,255,0.5)" />}
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {Object.entries(preview.params).map(([k, v]) => {
                const paramDef = provider.params.find(p => p.key === k);
                if (!paramDef) return null;
                return (
                  <div key={k} style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>{paramDef.label}：</span>
                    {typeof v === 'boolean' ? (v ? '是' : '否') : `${v}${paramDef.unit || ''}`}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Result card (Camera Edit) ─────────────────────────────────── */
function ResultCard({ result, index, onPreview, onRemove, onRegenerate }) {
  const isDone = result.status === 'done';
  const isGenerating = result.status === 'generating';

  return (
    <div style={{ ...glassCard, borderRadius: 'var(--radius-md)', overflow: 'hidden', animation: 'fadeIn 250ms ease' }}>
      <div style={{
        width: '100%', aspectRatio: '1', position: 'relative',
        background: result.imageUrl ? `url(${result.imageUrl}) center/contain no-repeat #f5f5f7` : COVER_COLORS[index % COVER_COLORS.length],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isGenerating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, border: '2.5px solid rgba(255,255,255,0.8)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>生成中...</span>
          </div>
        )}
        {isDone && !result.imageUrl && <Camera size={28} color="rgba(255,255,255,0.6)" />}

        {isDone && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: 0, transition: 'opacity var(--transition-fast)',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '1'}
            onMouseLeave={e => e.currentTarget.style.opacity = '0'}
          >
            <button onClick={onPreview} style={{
              width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}><Eye size={16} color="#FFF" /></button>
            <button onClick={onRegenerate} style={{
              width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}><RefreshCw size={14} color="#FFF" /></button>
          </div>
        )}

        <button onClick={onRemove} style={{
          position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%',
          background: 'rgba(0,0,0,0.3)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0, transition: 'opacity var(--transition-fast)',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0'}
        ><X size={11} color="#FFF" /></button>
      </div>

      <div style={{ padding: '10px 12px' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)', marginBottom: 2 }}>{result.label}</div>
        <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>
          旋转 {result.params.rotate_deg}° · 推拉 {result.params.move_forward} · 俯仰 {result.params.vertical_tilt}
        </div>
      </div>
    </div>
  );
}

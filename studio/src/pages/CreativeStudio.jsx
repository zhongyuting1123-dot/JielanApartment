import { useState, useRef } from 'react';
import { Plus, ChevronRight, ChevronDown, Sparkles, Search, Check, Play, Volume2, BookmarkCheck, X, Edit3, RefreshCw, Trash2, Image, Upload, FileText, Zap, BookOpen, AlertTriangle, Copy, Download, Eye, Mic, Video, Rocket } from 'lucide-react';
import { projects, statusConfig, platformColors, clients } from '../data/mockData';
import { promptTemplates, getCategories, filterTemplates } from '../data/promptTemplates';
import { PlatformBadge, SectionDivider, DigitalHumanIllustration } from '../components/Illustrations';

/* ── Glass styles ──────────────────────────────────────────────── */
const glassCard = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  border: 'var(--glass-border)',
  boxShadow: 'var(--shadow-glass)',
  borderRadius: 'var(--radius-md)',
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
  background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
  transition: 'border-color var(--transition-fast)', boxSizing: 'border-box',
};

/* ── Shared UI ─────────────────────────────────────────────────── */

function Tag({ children, color = 'var(--color-text-secondary)', bg = 'rgba(0,0,0,0.04)' }) {
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: bg, color, fontWeight: 500 }}>{children}</span>;
}
function StatusBadge({ status }) {
  const c = { draft: { label: '草稿', color: 'var(--color-text-secondary)', bg: 'rgba(0,0,0,0.04)' }, production: { label: '生产中', color: 'var(--color-primary)', bg: 'var(--color-primary-bg)' }, completed: { label: '已完成', color: '#5856D6', bg: 'rgba(88,86,214,0.08)' }, published: { label: '已发布', color: 'var(--color-green)', bg: 'var(--color-green-bg)' } };
  const s = c[status] || c.draft;
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: s.bg, color: s.color, fontWeight: 500 }}>{s.label}</span>;
}
function PrimaryBtn({ children, onClick, size = 'md', disabled }) {
  const pad = size === 'sm' ? '7px 14px' : '9px 18px';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 'var(--radius-sm)', fontSize: size === 'sm' ? 12 : 13,
      fontWeight: 500, fontFamily: 'inherit',
      background: disabled ? 'rgba(0,0,0,0.08)' : 'var(--color-primary)', color: disabled ? 'var(--color-text-tertiary)' : '#FFFFFF',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
      transition: 'all var(--transition-smooth)', boxShadow: disabled ? 'none' : '0 2px 8px rgba(0,113,227,0.2)',
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; } }}
    >{children}</button>
  );
}
function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', background: 'none', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', transition: 'color var(--transition-fast)' }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
    >{children}</button>
  );
}
function SecondaryBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(255,255,255,0.5)', color: 'var(--color-primary)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all var(--transition-fast)' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-bg)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
    >{children}</button>
  );
}

/* ── Prompt Template Picker (inline) ──────────────────────────── */

function PromptTemplatePicker({ toolType, onSelect }) {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState('all');
  const categories = getCategories(toolType);
  const templates = filterTemplates(toolType, cat);
  return (
    <div style={{ marginBottom: 10 }}>
      <button onClick={() => setOpen(!open)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500, fontFamily: 'inherit', background: open ? 'var(--color-primary-bg)' : 'rgba(0,0,0,0.03)', color: open ? 'var(--color-primary)' : 'var(--color-text-secondary)', border: `1px solid ${open ? 'rgba(0,113,227,0.15)' : 'rgba(0,0,0,0.04)'}`, cursor: 'pointer', transition: 'all var(--transition-fast)' }}>
        <BookmarkCheck size={11} /> Prompt 模版
        <ChevronDown size={10} style={{ transition: 'transform var(--transition-base)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div style={{ marginTop: 8, animation: 'fadeIn 150ms ease' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
            <button onClick={() => setCat('all')} style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 500, background: cat === 'all' ? 'var(--color-text)' : 'rgba(0,0,0,0.03)', color: cat === 'all' ? '#FFF' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>全部</button>
            {categories.map(c => <button key={c} onClick={() => setCat(c)} style={{ padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 500, background: cat === c ? 'var(--color-text)' : 'rgba(0,0,0,0.03)', color: cat === c ? '#FFF' : 'var(--color-text-secondary)', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>{c}</button>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
            {templates.map(t => (
              <div key={t.id} onClick={() => { onSelect(t.prompt); setOpen(false); }} style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(0,0,0,0.04)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', lineHeight: 1.5, maxHeight: 30, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.prompt}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 2x2 Result Grid (mock) ───────────────────────────────────── */

function ResultGrid2x2({ generated }) {
  const placeholders = [1, 2, 3, 4];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
      {placeholders.map(i => (
        <div key={i} style={{
          aspectRatio: '1', borderRadius: 'var(--radius-sm)',
          background: generated ? `linear-gradient(${135 + i * 30}deg, rgba(0,113,227,0.06), rgba(88,86,214,0.08), rgba(52,199,89,0.05))` : 'rgba(0,0,0,0.02)',
          border: '1px solid rgba(0,0,0,0.04)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', transition: 'all var(--transition-fast)',
        }}>
          {generated ? (
            <>
              <Image size={24} color="rgba(0,0,0,0.1)" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 8px', background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', display: 'flex', gap: 6, justifyContent: 'flex-end', opacity: 0, transition: 'opacity var(--transition-fast)' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              >
                <Eye size={12} color="#FFF" style={{ cursor: 'pointer' }} />
                <Download size={12} color="#FFF" style={{ cursor: 'pointer' }} />
                <Check size={12} color="#FFF" style={{ cursor: 'pointer' }} />
              </div>
            </>
          ) : (
            <span style={{ fontSize: 11, color: 'var(--color-text-quaternary)' }}>待生成</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Reference Image Upload ───────────────────────────────────── */

function RefImageUpload({ refImg, onChange }) {
  const fileRef = useRef(null);
  return (
    <div style={{ marginBottom: 8 }}>
      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) onChange(e.target.files[0].name); }} />
      {refImg ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'rgba(0,113,227,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.1)' }}>
          <Image size={12} color="var(--color-primary)" />
          <span style={{ fontSize: 11, color: 'var(--color-primary)', flex: 1 }}>{refImg}</span>
          <X size={12} color="var(--color-text-tertiary)" style={{ cursor: 'pointer' }} onClick={() => onChange(null)} />
        </div>
      ) : (
        <button onClick={() => fileRef.current?.click()} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: 10, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(0,0,0,0.02)', color: 'var(--color-text-tertiary)', border: '1px dashed rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'all var(--transition-fast)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
        ><Upload size={10} /> 垫图（可选）</button>
      )}
    </div>
  );
}

/* ── Accordion ─────────────────────────────────────────────────── */

function Accordion({ title, badge, defaultOpen = false, locked, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ ...glassCard, overflow: 'hidden', marginBottom: 14, transition: 'box-shadow var(--transition-base)', boxShadow: open ? 'var(--shadow-md)' : 'var(--shadow-glass)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{title}</span>
          {badge && <Tag>{badge}</Tag>}
          {locked && <Tag color="var(--color-orange)" bg="var(--color-orange-bg)">需先确认方案</Tag>}
        </div>
        <ChevronDown size={15} color="var(--color-text-tertiary)" style={{ transition: 'transform var(--transition-base)', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && (
        <div style={{ padding: '4px 22px 22px', borderTop: '1px solid rgba(0,0,0,0.04)', animation: 'fadeIn 150ms ease' }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 来源层 — 三选一
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SourceLayer({ project, onSourceReady }) {
  const [mode, setMode] = useState(null);
  const [hotTopics, setHotTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [uploadText, setUploadText] = useState('');
  const [researchKw, setResearchKw] = useState('');
  const [researchResult, setResearchResult] = useState('');
  const [searching, setSearching] = useState(false);

  const client = clients.find(c => c.id === project.clientId);

  const options = [
    { id: 'trending', icon: <Zap size={16} />, label: '热点抓取', desc: '根据客户画像搜索适合的热点话题' },
    { id: 'upload', icon: <FileText size={16} />, label: '甲方文案', desc: '粘贴或上传甲方提供的原始文案' },
    { id: 'research', icon: <BookOpen size={16} />, label: '深度调研', desc: 'Gemini Deep Research 生成专业报告' },
  ];

  const fetchHotTopics = () => {
    setSearching(true);
    setTimeout(() => {
      setHotTopics([
        { id: 1, title: '烟酰胺浓度越高越好？皮肤科医生说出真相', heat: '热榜', source: '抖音' },
        { id: 2, title: '30岁后护肤重点：胶原蛋白流失怎么补', heat: '上升', source: '小红书' },
        { id: 3, title: '医美平替成分大测评，这三款性价比最高', heat: '精选', source: '小红书' },
        { id: 4, title: '敏感肌换季必看：屏障修复的3个关键步骤', heat: '热榜', source: '抖音' },
        { id: 5, title: '2025早C晚A已过时？新护肤公式火了', heat: '上升', source: 'B站' },
      ]);
      setSearching(false);
    }, 1200);
  };

  const startResearch = () => {
    setSearching(true);
    setTimeout(() => {
      setResearchResult(`## 调研报告：${researchKw}\n\n### 市场现状\n${researchKw}相关领域近年增长显著，消费者认知度不断提升...\n\n### 核心发现\n1. 目标人群对${researchKw}的关注度同比增长45%\n2. 内容偏好：短视频科普 > 图文种草 > 直播讲解\n3. 高转化关键词：功效、成分、对比、真实体验\n\n### 内容建议\n- 以"成分解读+真实体验"为核心内容方向\n- 重点布局抖音和小红书双平台\n- 建议产出频率：每周4-5条`);
      setSearching(false);
    }, 2000);
  };

  const handleConfirmSource = (sourceText) => {
    onSourceReady(sourceText);
  };

  return (
    <div style={{ marginTop: 14 }}>
      {/* Client context hint */}
      {client && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: 'rgba(0,113,227,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.08)' }}>
          <Sparkles size={13} color="var(--color-primary)" />
          <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>当前客户：<strong style={{ color: 'var(--color-text)' }}>{client.name}</strong> · {client.industry} · {client.direction}</span>
        </div>
      )}

      {/* Three options */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {options.map(o => (
          <button key={o.id} onClick={() => setMode(mode === o.id ? null : o.id)} style={{
            padding: '18px', borderRadius: 'var(--radius-sm)', textAlign: 'left',
            border: `1px solid ${mode === o.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
            background: mode === o.id ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(8px)', cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
          }}>
            <div style={{ color: mode === o.id ? 'var(--color-primary)' : 'var(--color-text-secondary)', marginBottom: 10 }}>{o.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>{o.label}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{o.desc}</div>
          </button>
        ))}
      </div>

      {/* Mode: Trending */}
      {mode === 'trending' && (
        <div style={{ marginTop: 16, animation: 'fadeIn 150ms ease' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <PrimaryBtn size="sm" onClick={fetchHotTopics} disabled={searching}>
              {searching ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> 搜索中...</> : <><Search size={12} /> 搜索匹配热点</>}
            </PrimaryBtn>
          </div>
          {hotTopics.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {hotTopics.map(t => (
                <div key={t.id} onClick={() => setSelectedTopic(t)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                  background: selectedTopic?.id === t.id ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${selectedTopic?.id === t.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)'}`,
                  borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${selectedTopic?.id === t.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {selectedTopic?.id === t.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--color-text)', lineHeight: 1.5 }}>{t.title}</span>
                  <Tag color="var(--color-primary)" bg="var(--color-primary-bg)">{t.heat}</Tag>
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{t.source}</span>
                </div>
              ))}
              {selectedTopic && (
                <div style={{ marginTop: 8 }}>
                  <PrimaryBtn size="sm" onClick={() => handleConfirmSource(`热点话题：${selectedTopic.title}`)}><Check size={12} /> 使用此热点，进入方案层</PrimaryBtn>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mode: Upload */}
      {mode === 'upload' && (
        <div style={{ marginTop: 16, animation: 'fadeIn 150ms ease' }}>
          <textarea value={uploadText} onChange={e => setUploadText(e.target.value)} placeholder="粘贴甲方提供的原始文案内容..." style={{ ...inputStyle, minHeight: 120, resize: 'vertical', lineHeight: 1.8, padding: '14px' }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <PrimaryBtn size="sm" onClick={() => handleConfirmSource(uploadText)} disabled={!uploadText.trim()}><Check size={12} /> 使用此文案，进入方案层</PrimaryBtn>
          </div>
        </div>
      )}

      {/* Mode: Research */}
      {mode === 'research' && (
        <div style={{ marginTop: 16, animation: 'fadeIn 150ms ease' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input value={researchKw} onChange={e => setResearchKw(e.target.value)} placeholder="输入核心关键词，如「烟酰胺 护肤」" style={inputStyle} />
            <PrimaryBtn size="sm" onClick={startResearch} disabled={!researchKw.trim() || searching}>
              {searching ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> 调研中...</> : <><Sparkles size={12} /> Deep Research</>}
            </PrimaryBtn>
          </div>
          {researchResult && (
            <div>
              <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid rgba(0,0,0,0.04)', maxHeight: 240, overflowY: 'auto', marginBottom: 10 }}>
                <SimpleMarkdown text={researchResult} />
              </div>
              <PrimaryBtn size="sm" onClick={() => handleConfirmSource(researchResult)}><Check size={12} /> 使用调研报告，进入方案层</PrimaryBtn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SimpleMarkdown({ text }) {
  return (
    <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--color-text)' }}>
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <div key={i} style={{ fontWeight: 600, fontSize: 13, marginTop: i > 0 ? 12 : 0, marginBottom: 2 }}>{line.slice(4)}</div>;
        if (line.startsWith('## ')) return <div key={i} style={{ fontWeight: 700, fontSize: 14, marginTop: i > 0 ? 14 : 0, marginBottom: 4 }}>{line.slice(3)}</div>;
        if (/^\d+\.\s/.test(line)) return <div key={i} style={{ paddingLeft: 8 }}>{line}</div>;
        if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 8 }}>{line}</div>;
        if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
        return <div key={i}>{line}</div>;
      })}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 方案层 — AI 生成 + 可编辑 + 联动生产层
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SchemeLayer({ sourceText, onSchemeConfirm, scheme, setScheme }) {
  const [generating, setGenerating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [contextBuild, setContextBuild] = useState('软植入');
  const [duration, setDuration] = useState('60秒');

  const contextOptions = [
    { value: '强关联', label: '强关联', desc: '每段都围绕产品，偏转化' },
    { value: '软植入', label: '软植入', desc: '前70%干货，自然过渡到产品' },
    { value: '不结合', label: '不结合', desc: '纯涨粉内容，不涉及产品' },
  ];
  const durationOptions = ['15秒', '30秒', '45秒', '60秒', '90秒', '120秒'];

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const mockScheme = `## 视频主题\n烟酰胺的 3 个真相，护肤 5 年踩坑总结\n\n## 方案参数\n- 业务结合：${contextBuild}\n- 目标时长：${duration}\n\n## 核心卖点\n成分党视角 · 科学实证 · 性价比优先\n\n## 推荐形式\n口播 + 分镜头（知识科普型）\n\n## 内容框架\n1. 开头：反常识钩子 → 引发好奇\n2. 痛点放大：常见误区\n3. 知识点1：浓度不是越高越好\n4. 知识点2：搭配禁忌\n5. 知识点3：剂型决定效果\n${contextBuild !== '不结合' ? '6. 产品引入：基于标准推荐\n' : ''}7. CTA：引导互动\n\n## 分镜头规划（${duration}）\n- 镜头1：主播正脸，反问式开场\n- 镜头2：产品特写，成分表标注\n- 镜头3：对比实验画面\n- 镜头4：数据卡片总结\n\n## 配图规划\n- 封面图：悬念标题 + 产品半身\n- 知识卡片：3个成分对比图\n- 产品主图：白底精华液特写`;
      setScheme(mockScheme);
      setGenerating(false);
    }, 1500);
  };

  const startEdit = () => { setEditDraft(scheme); setEditing(true); };
  const saveEdit = () => { setScheme(editDraft); setEditing(false); };

  return (
    <div style={{ marginTop: 14 }}>
      {sourceText && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 14, padding: '10px 14px', background: 'rgba(0,113,227,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.08)' }}>
          <FileText size={13} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, maxHeight: 48, overflow: 'hidden' }}>来源素材：{sourceText.slice(0, 100)}{sourceText.length > 100 ? '...' : ''}</div>
        </div>
      )}

      {!scheme ? (
        <div>
          {/* 方案配置区 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18, padding: '18px', background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,0,0,0.04)', backdropFilter: 'blur(8px)' }}>
            {/* 业务结合方式 */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={12} color="var(--color-primary)" /> 业务结合方式
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {contextOptions.map(o => (
                  <div key={o.value} onClick={() => setContextBuild(o.value)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    background: contextBuild === o.value ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
                    border: `1px solid ${contextBuild === o.value ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)'}`,
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all var(--transition-fast)',
                  }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${contextBuild === o.value ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {contextBuild === o.value && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-primary)' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>{o.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 1 }}>{o.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 目标时长 */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Play size={12} color="var(--color-primary)" /> 目标时长
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {durationOptions.map(d => (
                  <button key={d} onClick={() => setDuration(d)} style={{
                    padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                    fontSize: 12, fontWeight: duration === d ? 600 : 400, fontFamily: 'inherit',
                    background: duration === d ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                    color: duration === d ? '#FFF' : 'var(--color-text-secondary)',
                    border: `1px solid ${duration === d ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                    cursor: 'pointer', transition: 'all var(--transition-fast)',
                    boxShadow: duration === d ? '0 2px 8px rgba(0,113,227,0.2)' : 'none',
                  }}>{d}</button>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(0,113,227,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.06)' }}>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', lineHeight: 1.6 }}>
                  {duration === '15秒' && '⚡ 极短视频，适合信息流广告、产品闪现'}
                  {duration === '30秒' && '🎯 短视频黄金时长，适合单一卖点快速输出'}
                  {duration === '45秒' && '📱 适合抖音/快手，可展开1-2个知识点'}
                  {duration === '60秒' && '📝 标准时长，适合完整科普或产品介绍'}
                  {duration === '90秒' && '📖 中长视频，适合深度内容或故事型'}
                  {duration === '120秒' && '🎬 长视频，适合B站/视频号深度内容'}
                </div>
              </div>
            </div>
          </div>

          <PrimaryBtn onClick={generate} disabled={generating}>
            {generating ? <><RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} /> AI 生成方案中...</> : <><Sparkles size={14} /> AI 一键生成方案</>}
          </PrimaryBtn>
        </div>
      ) : (
        <div style={{ animation: 'fadeIn 200ms ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <Tag color="var(--color-green)" bg="var(--color-green-bg)">方案已生成</Tag>
            <div style={{ display: 'flex', gap: 6 }}>
              {editing ? (
                <>
                  <GhostBtn onClick={() => setEditing(false)}>取消</GhostBtn>
                  <PrimaryBtn size="sm" onClick={saveEdit}><Check size={12} /> 保存</PrimaryBtn>
                </>
              ) : (
                <>
                  <GhostBtn onClick={startEdit}><Edit3 size={12} /> 编辑方案</GhostBtn>
                  <GhostBtn onClick={generate}><RefreshCw size={12} /> 重新生成</GhostBtn>
                </>
              )}
            </div>
          </div>
          {editing ? (
            <textarea value={editDraft} onChange={e => setEditDraft(e.target.value)} style={{ ...inputStyle, minHeight: 260, resize: 'vertical', lineHeight: 1.8, padding: '14px' }} />
          ) : (
            <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: 'var(--radius-sm)', padding: '18px', border: '1px solid rgba(0,0,0,0.04)', backdropFilter: 'blur(8px)', maxHeight: 320, overflowY: 'auto' }}>
              <SimpleMarkdown text={scheme} />
            </div>
          )}
          {!editing && (
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <PrimaryBtn onClick={() => onSchemeConfirm(scheme)}><Check size={13} /> 确认方案，进入生产层</PrimaryBtn>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 生产层 — 4 Tab
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ProductionLayer({ confirmed, schemeChanged, onResetChanged, project, schemeTopic, projectStatus, onPublish, publishInfo }) {
  const [tab, setTab] = useState('script');
  const [topic, setTopic] = useState(schemeTopic || '烟酰胺的3个真相，护肤5年踩坑总结');
  const [editingTopic, setEditingTopic] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [pubTime, setPubTime] = useState('');
  const [pubLink, setPubLink] = useState('');
  const tabs = [
    { id: 'script', label: '口播稿', icon: <Mic size={13} /> },
    { id: 'copy', label: '发布文案', icon: <FileText size={13} /> },
    { id: 'images', label: '素材图片', icon: <Image size={13} /> },
    { id: 'storyboard', label: '分镜头', icon: <Video size={13} /> },
  ];

  if (!confirmed) {
    return (
      <div style={{ marginTop: 14, padding: '32px', textAlign: 'center' }}>
        <AlertTriangle size={24} color="var(--color-text-tertiary)" style={{ marginBottom: 10 }} />
        <div style={{ fontSize: 13, color: 'var(--color-text-tertiary)' }}>请先在方案层确认方案后，自动生成生产内容</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 14 }}>
      {/* 项目主题 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, padding: '12px 16px', background: 'rgba(0,113,227,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.08)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>项目主题</span>
        {editingTopic ? (
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onBlur={() => setEditingTopic(false)}
            onKeyDown={e => { if (e.key === 'Enter') setEditingTopic(false); }}
            autoFocus
            style={{ ...inputStyle, fontSize: 14, fontWeight: 600, padding: '6px 10px', background: 'rgba(255,255,255,0.8)' }}
          />
        ) : (
          <span
            onClick={() => setEditingTopic(true)}
            style={{ flex: 1, fontSize: 14, fontWeight: 600, color: 'var(--color-text)', cursor: 'pointer', padding: '4px 0' }}
            title="点击编辑主题"
          >{topic}</span>
        )}
        {!editingTopic && (
          <button onClick={() => setEditingTopic(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <Edit3 size={13} color="var(--color-text-tertiary)" />
          </button>
        )}
      </div>

      {/* Scheme changed warning */}
      {schemeChanged && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 14px', background: 'rgba(255,149,0,0.06)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,149,0,0.15)' }}>
          <AlertTriangle size={13} color="var(--color-orange)" />
          <span style={{ fontSize: 12, color: 'var(--color-orange)', flex: 1 }}>方案已更新，建议重新生成生产内容</span>
          <SecondaryBtn onClick={onResetChanged}><RefreshCw size={11} /> 一键刷新</SecondaryBtn>
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: 18 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '10px 16px', fontSize: 12, fontWeight: tab === t.id ? 600 : 400,
            color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: tab === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
            fontFamily: 'inherit', marginBottom: -1, transition: 'color var(--transition-fast)',
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {tab === 'script' && <ScriptTab project={project} />}
      {tab === 'copy' && <CopyTab />}
      {tab === 'storyboard' && <StoryboardTab />}
      {tab === 'images' && <ImagesTab />}

      {/* ── Publish Section ── */}
      <div style={{ marginTop: 28, padding: '20px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        {projectStatus === 'production' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'rgba(0,113,227,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.1)' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid var(--color-primary)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
            <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>AI 正在生成内容，请稍候...</span>
          </div>
        )}
        {projectStatus === 'completed' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              素材已就绪，剪辑发布后可在此标记状态
            </div>
            <PrimaryBtn onClick={() => setShowPublishModal(true)}>
              <Rocket size={14} /> 标记为已发布
            </PrimaryBtn>
          </div>
        )}
        {projectStatus === 'published' && (
          <div style={{ padding: '14px 18px', background: 'rgba(52,199,89,0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(52,199,89,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: publishInfo.time || publishInfo.link ? 10 : 0 }}>
              <Check size={14} color="var(--color-green)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-green)' }}>已发布</span>
            </div>
            {publishInfo.time && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
                发布时间：{publishInfo.time}
              </div>
            )}
            {publishInfo.link && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                发布链接：<a href={publishInfo.link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>{publishInfo.link}</a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Publish Modal ── */}
      {showPublishModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 150ms ease' }}
          onClick={() => setShowPublishModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#FFFFFF', borderRadius: 'var(--radius-md)', padding: '28px 32px', width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', animation: 'fadeIn 200ms ease' }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', margin: '0 0 4px' }}>标记为已发布</h3>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', margin: '0 0 20px' }}>以下信息为选填，方便后续数据回收</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>发布时间</label>
              <input type="datetime-local" value={pubTime} onChange={e => setPubTime(e.target.value)}
                style={{ ...inputStyle, width: '100%' }} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>发布链接（粘贴平台上的视频链接）</label>
              <input value={pubLink} onChange={e => setPubLink(e.target.value)}
                placeholder="https://www.douyin.com/video/..." style={{ ...inputStyle, width: '100%' }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowPublishModal(false)} style={{ padding: '8px 18px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(0,0,0,0.04)', color: 'var(--color-text-secondary)', border: 'none', cursor: 'pointer' }}>取消</button>
              <PrimaryBtn onClick={() => { onPublish({ time: pubTime || new Date().toLocaleString('zh-CN'), link: pubLink }); setShowPublishModal(false); }}>
                <Check size={13} /> 确认发布
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Tab: 口播稿 ──────────────────────────────────────────────── */

function ScriptTab({ project }) {
  const [script, setScript] = useState(`你知道为什么用了三年烟酰胺，皮肤还是没变白吗？\n\n很多人买了一堆烟酰胺产品，照镜子还是暗沉——不是产品无效，是你根本没搞清楚这三个真相。\n\n真相一：浓度不是越高越好。5%以上容易致敏，2%到4%才是黄金区间。大部分人根本不知道自己买的是多少浓度，稀里糊涂往脸上抹。\n\n真相二：搭配很关键。烟酰胺加维C同时用？你在浪费两瓶精华。这两个成分放在一起会互相干扰，效果大打折扣。\n\n真相三：剂型决定渗透率。精华的吸收效率远超乳液和面霜，同样浓度效果能差3倍。你花了面霜的钱，只吸收了精华三分之一的量。\n\n基于这三个标准，我测了市面上20款产品，最终只留下这一瓶。\n\n评论区告诉我你现在用的是哪个品牌，我帮你看看踩没踩坑。`);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [selectedVoice, setSelectedVoice] = useState('warm_f');
  const [videoStatus, setVideoStatus] = useState('idle'); // idle | queuing | generating | done
  const [videoHistory, setVideoHistory] = useState([]); // [{version, script, avatar, voice, duration, createdAt}]
  const [activeVersion, setActiveVersion] = useState(0); // index in videoHistory
  const [isPlaying, setIsPlaying] = useState(false);
  const progressRef = useRef(null);
  const timerRef = useRef(null);

  const client = clients.find(c => c.id === project?.clientId);
  const dh = client?.digitalHumans || { avatars: [], voices: [] };
  const VOICES = dh.voices.length > 0 ? dh.voices.map(v => ({ id: v.id, label: v.name, desc: v.desc || '' })) : [
    { id: 'warm_f', label: '温柔女声', desc: '亲切 · 轻柔' },
    { id: 'pro_f', label: '专业女声', desc: '沉稳 · 有质感' },
  ];

  const estimatedSeconds = Math.round(script.length / 4.5);
  const formatTime = (s) => `${Math.floor(s / 60)} 分 ${s % 60} 秒`;
  const currentVideo = videoHistory[activeVersion] || null;

  const startGenerate = () => {
    setVideoStatus('queuing');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVideoStatus('generating');
      timerRef.current = setTimeout(() => {
        const newVersion = {
          version: videoHistory.length + 1,
          script: script.slice(0, 60) + '...',
          scriptFull: script,
          avatarName: (dh.avatars[selectedAvatar] || { name: '默认形象' }).name,
          voiceLabel: VOICES.find(v => v.id === selectedVoice)?.label || '默认音色',
          duration: estimatedSeconds,
          createdAt: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        setVideoHistory(prev => [...prev, newVersion]);
        setActiveVersion(videoHistory.length); // point to the new one
        setVideoStatus('done');
        setIsPlaying(false);
      }, 3000);
    }, 2000);
  };

  const regenerate = () => {
    setIsPlaying(false);
    startGenerate();
  };

  return (
    <div>
      {/* 视频预览区域 —— 有历史版本时显示 */}
      {videoHistory.length > 0 && videoStatus !== 'queuing' && videoStatus !== 'generating' && (
        <div style={{ marginBottom: 24, animation: 'fadeIn 300ms ease' }}>
          {/* 版本切换标签栏 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Video size={14} color="var(--color-primary)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>视频预览</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <GhostBtn onClick={() => {}}><Download size={12} /> 下载</GhostBtn>
            </div>
          </div>

          {/* 版本切换按钮组 */}
          {videoHistory.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {videoHistory.map((v, i) => (
                <button key={i} onClick={() => { setActiveVersion(i); setIsPlaying(false); }} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
                  background: activeVersion === i ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                  color: activeVersion === i ? '#FFF' : 'var(--color-text-secondary)',
                  border: `1px solid ${activeVersion === i ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                  cursor: 'pointer', transition: 'all var(--transition-fast)',
                  boxShadow: activeVersion === i ? '0 2px 8px rgba(0,113,227,0.2)' : 'none',
                }}>
                  第 {v.version} 版
                  <span style={{ fontSize: 10, opacity: 0.7 }}>{v.createdAt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Mock 视频播放器 */}
          <div style={{
            position: 'relative', width: '100%', aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
            borderRadius: 'var(--radius-md)', overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}>
            {/* 数字人形象占位 */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '2px solid rgba(255,255,255,0.15)' }}>
                <DigitalHumanIllustration size={40} />
              </div>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
                {currentVideo?.avatarName || '默认形象'} · {currentVideo?.voiceLabel || '默认音色'}
              </span>
              {/* 版本角标 */}
              <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', fontSize: 10, color: '#FFF', fontWeight: 500 }}>
                V{currentVideo?.version}
              </div>
              {/* 字幕条 */}
              {isPlaying && (
                <div style={{ position: 'absolute', bottom: 48, left: '10%', right: '10%', textAlign: 'center', padding: '8px 16px', background: 'rgba(0,0,0,0.6)', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(4px)', animation: 'fadeIn 200ms ease' }}>
                  <span style={{ fontSize: 13, color: '#FFF', lineHeight: 1.6 }}>{currentVideo?.script || ''}</span>
                </div>
              )}
            </div>
            {/* 播放按钮 */}
            <div onClick={() => setIsPlaying(!isPlaying)} style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.2)',
              transition: 'background 200ms ease',
            }}>
              {!isPlaying && (
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', transition: 'transform 150ms ease' }}>
                  <Play size={24} color="#FFF" fill="#FFF" style={{ marginLeft: 3 }} />
                </div>
              )}
            </div>
            {/* 进度条 */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.15)' }}>
              <div ref={progressRef} style={{ height: '100%', background: 'var(--color-primary)', width: isPlaying ? '65%' : '0%', transition: 'width 2s linear', borderRadius: '0 2px 2px 0' }} />
            </div>
            {/* 时长标签 */}
            <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {isPlaying ? `0:${Math.floor((currentVideo?.duration || 60) * 0.65).toString().padStart(2, '0')}` : '0:00'} / {Math.floor((currentVideo?.duration || 60) / 60)}:{((currentVideo?.duration || 60) % 60).toString().padStart(2, '0')}
            </div>
          </div>

          {/* 当前版本信息 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: '8px 12px', background: 'rgba(0,113,227,0.03)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(0,113,227,0.06)' }}>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
              第 {currentVideo?.version} 版 · 时长 {formatTime(currentVideo?.duration || 60)} · {currentVideo?.avatarName} · {currentVideo?.voiceLabel} · 生成于 {currentVideo?.createdAt}
            </span>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>共 {videoHistory.length} 个版本</span>
          </div>
        </div>
      )}

      {/* 生成中状态 */}
      {(videoStatus === 'queuing' || videoStatus === 'generating') && (
        <div style={{ marginBottom: 24, padding: '28px', textAlign: 'center', background: 'rgba(0,113,227,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(0,113,227,0.08)', animation: 'fadeIn 200ms ease' }}>
          <RefreshCw size={24} color="var(--color-primary)" style={{ animation: 'spin 1.5s linear infinite', marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>
            {videoStatus === 'queuing' ? '排队中...' : '视频生成中...'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {videoStatus === 'queuing' ? '预计等待 1-2 分钟' : '正在合成数字人视频，预计 2-3 分钟'}
          </div>
          {videoStatus === 'generating' && (
            <div style={{ marginTop: 14, width: '60%', height: 4, background: 'rgba(0,0,0,0.06)', borderRadius: 2, margin: '14px auto 0', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'var(--color-primary)', borderRadius: 2, width: '60%', animation: 'progressPulse 2s ease-in-out infinite' }} />
            </div>
          )}
        </div>
      )}

      {/* 口播稿编辑区 */}
      <textarea value={script} onChange={e => setScript(e.target.value)} placeholder="口播稿内容..." style={{ ...inputStyle, minHeight: 200, resize: 'vertical', lineHeight: 1.8, padding: '14px', marginBottom: 12 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
        <PrimaryBtn size="sm"><Sparkles size={12} /> AI 重新生成文案</PrimaryBtn>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>约 {estimatedSeconds} 秒 · {formatTime(estimatedSeconds)}</span>
      </div>

      <SectionDivider label="数字人配置" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, fontWeight: 500 }}>选择数字人形象</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(dh.avatars.length > 0 ? dh.avatars : [{ id: 0, name: '默认形象', status: 'ready' }]).map((av, i) => (
              <div key={av.id} onClick={() => av.status === 'ready' && setSelectedAvatar(i)} style={{
                flex: 1, padding: '14px', textAlign: 'center',
                border: `1px solid ${selectedAvatar === i ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                borderRadius: 'var(--radius-sm)',
                background: selectedAvatar === i ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
                cursor: av.status === 'ready' ? 'pointer' : 'default',
                opacity: av.status !== 'ready' ? 0.5 : 1, transition: 'all var(--transition-fast)',
              }}>
                <div style={{ margin: '0 auto 8px' }}><DigitalHumanIllustration size={36} /></div>
                <div style={{ fontSize: 12, fontWeight: 500, color: selectedAvatar === i ? 'var(--color-primary)' : 'var(--color-text)' }}>{av.name}</div>
                <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 3 }}>{av.status === 'ready' ? '可用' : '训练中'}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 10, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}><Volume2 size={11} /> 选择音色</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {VOICES.map(v => (
              <div key={v.id} onClick={() => setSelectedVoice(v.id)} style={{
                padding: '12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                border: `1px solid ${selectedVoice === v.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                background: selectedVoice === v.id ? 'var(--color-primary-bg)' : 'rgba(255,255,255,0.5)',
                transition: 'all var(--transition-fast)',
              }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: selectedVoice === v.id ? 'var(--color-primary)' : 'var(--color-text)' }}>{v.label}</div>
                {v.desc && <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 3 }}>{v.desc}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <PrimaryBtn onClick={videoStatus === 'done' ? regenerate : startGenerate} disabled={videoStatus === 'queuing' || videoStatus === 'generating'}>
          {videoStatus === 'done' ? <><RefreshCw size={13} /> 重新生成视频</> : <><Play size={13} /> 生成数字人视频</>}
        </PrimaryBtn>
        {videoStatus === 'done' && (
          <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>修改文案或配置后，点击重新生成</span>
        )}
      </div>
    </div>
  );
}

/* ── Tab: 发布文案 ────────────────────────────────────────────── */

function CopyTab() {
  const [title, setTitle] = useState('烟酰胺的3个真相，护肤5年终于搞明白了');
  const [body, setBody] = useState('用了三年烟酰胺，皮肤还是没变白？\n不是产品无效，是你根本没搞清楚这三个关键点👇\n\n✅ 浓度：2%-4%才是黄金区间，不是越高越好\n✅ 搭配：和维C同时用=浪费两瓶精华\n✅ 剂型：精华>乳液>面霜，同浓度效果差3倍\n\n基于这3个标准，我测了市面20款，最终只留了1瓶。\n\n你现在用的是什么？评论区告诉我，帮你看看踩没踩坑～');
  const [tags, setTags] = useState('#烟酰胺 #护肤真相 #成分党 #美白 #护肤避坑');

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>标题</label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>正文</label>
        <textarea value={body} onChange={e => setBody(e.target.value)} style={{ ...inputStyle, minHeight: 180, resize: 'vertical', lineHeight: 1.8, padding: '14px' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>标签</label>
        <input value={tags} onChange={e => setTags(e.target.value)} style={inputStyle} />
      </div>
      <PrimaryBtn size="sm"><Sparkles size={12} /> AI 重新生成</PrimaryBtn>
    </div>
  );
}

/* ── Shared: Seat thumbnail ───────────────────────────────────── */
function SeatThumb({ seat, isVideo, onClick }) {
  const size = 64;
  return (
    <div onClick={onClick} style={{
      width: size, height: size, minWidth: size, borderRadius: 8, position: 'relative', overflow: 'hidden',
      border: seat === 'approved' ? '2px solid var(--color-green)' : '1px solid rgba(0,0,0,0.06)',
      background: seat === 'generating' ? 'rgba(0,113,227,0.04)' : seat ? 'linear-gradient(135deg, #E8E8ED 0%, #D1D1D6 100%)' : 'rgba(0,0,0,0.02)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: seat === 'done' || seat === 'approved' ? 'pointer' : 'default',
    }}>
      {seat === 'generating' && <div style={{ width: 16, height: 16, border: '2px solid #E8E8ED', borderTop: '2px solid #0071E3', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
      {seat === 'done' && (isVideo ? <Play size={16} color="#AEAEB2" /> : <Image size={16} color="#AEAEB2" />)}
      {seat === 'approved' && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(52,199,89,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={18} color="var(--color-green)" strokeWidth={3} />
        </div>
      )}
      {!seat && <span style={{ fontSize: 9, color: '#C7C7CC' }}>空</span>}
    </div>
  );
}

/* ── Tab: 素材图片 ────────────────────────────────────────────── */

function ImagesTab() {
  const MAX_CARDS = 8;
  const SEATS = 4;
  const initialCards = [
    { id: 1, prompt: '烟酰胺精华液，纯白背景，产品居中，柔和自然光，专业商拍质感，8K', seats: Array(SEATS).fill(null) },
    { id: 2, prompt: '16:9短视频封面，大字标题"烟酰胺3个真相"，产品半身，悬念感', seats: Array(SEATS).fill(null) },
    { id: 3, prompt: '成分功效对比卡片，简洁信息图风格，3栏对比，品牌蓝色调', seats: Array(SEATS).fill(null) },
    { id: 4, prompt: '产品使用场景，女性手持精华液，柔光浴室环境，温馨色调', seats: Array(SEATS).fill(null) },
    { id: 5, prompt: '成分安全认证卡片，检测报告风格，简洁专业，白底绿色点缀', seats: Array(SEATS).fill(null) },
  ];

  const [cards, setCards] = useState(initialCards);
  const updatePrompt = (id, prompt) => setCards(prev => prev.map(c => c.id === id ? { ...c, prompt } : c));
  const addCard = () => { if (cards.length < MAX_CARDS) setCards(prev => [...prev, { id: Date.now(), prompt: '', seats: Array(SEATS).fill(null) }]); };
  const removeCard = (id) => setCards(prev => prev.filter(c => c.id !== id));
  const toggleApprove = (cardId, si) => setCards(prev => prev.map(c => {
    if (c.id !== cardId) return c;
    const s = [...c.seats]; s[si] = s[si] === 'approved' ? 'done' : s[si] === 'done' ? 'approved' : s[si]; return { ...c, seats: s };
  }));
  const generateCard = (id) => {
    setCards(prev => prev.map(c => c.id !== id ? c : { ...c, seats: c.seats.map(s => s === 'approved' ? 'approved' : 'generating') }));
    setTimeout(() => setCards(prev => prev.map(c => c.id !== id ? c : { ...c, seats: c.seats.map(s => s === 'generating' ? 'done' : s) })), 1500 + Math.random() * 1500);
  };
  const generateAll = () => cards.forEach(c => { if (c.prompt.trim()) generateCard(c.id); });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{cards.length}/{MAX_CARDS} 组 · 模型：Nano Banana Pro</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <SecondaryBtn onClick={addCard} disabled={cards.length >= MAX_CARDS}><Plus size={11} /> 新增图片</SecondaryBtn>
          <PrimaryBtn size="sm" onClick={generateAll}><Sparkles size={12} /> 一键全部生成</PrimaryBtn>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cards.map((card, idx) => {
          const approved = card.seats.filter(s => s === 'approved').length;
          const unfilled = card.seats.filter(s => s !== 'approved').length;
          const hasGen = card.seats.some(s => s === 'done' || s === 'approved');
          return (
            <div key={card.id} style={{ ...glassCard, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Left: prompt + controls */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>图片 {idx + 1}</span>
                    {approved > 0 && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-green-bg)', color: 'var(--color-green)', fontWeight: 500 }}>✓{approved}</span>}
                  </div>
                  {cards.length > 1 && (
                    <button onClick={() => removeCard(card.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 2 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF3B30'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}><Trash2 size={12} /></button>
                  )}
                </div>
                <textarea value={card.prompt} onChange={e => updatePrompt(card.id, e.target.value)} placeholder="输入 Prompt..." style={{ ...inputStyle, minHeight: 48, resize: 'vertical', lineHeight: 1.6, padding: '8px 10px', fontSize: 12, marginBottom: 8 }} />
                <PrimaryBtn size="sm" onClick={() => generateCard(card.id)} disabled={!card.prompt.trim()}>
                  {hasGen ? <><RefreshCw size={11} /> 重新生成{approved > 0 ? `（${unfilled}张）` : ''}</> : <><Sparkles size={11} /> 生成</>}
                </PrimaryBtn>
              </div>
              {/* Right: seats in a row */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {card.seats.map((seat, si) => <SeatThumb key={si} seat={seat} isVideo={false} onClick={() => (seat === 'done' || seat === 'approved') && toggleApprove(card.id, si)} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab: 分镜头 ──────────────────────────────────────────────── */

function StoryboardTab() {
  const MAX_SHOTS = 5;
  const SEATS = 2;
  const initialShots = [
    { id: 1, prompt: '股市大盘数据上涨画面，绿色K线图向上攀升，数据卡片叠加，科技蓝色调，俯视角度', duration: 4, seats: Array(SEATS).fill(null), firstFrame: null, lastFrame: null },
    { id: 2, prompt: '原油期货价格暴跌曲线，红色下行趋势线，石油桶图标，暗色背景对比', duration: 4, seats: Array(SEATS).fill(null), firstFrame: null, lastFrame: null },
    { id: 3, prompt: '黄金金条特写，温暖灯光，价格标签显示上涨箭头，奢华质感，浅景深', duration: 3, seats: Array(SEATS).fill(null), firstFrame: null, lastFrame: null },
  ];

  const [shots, setShots] = useState(initialShots);
  const updateShot = (id, updates) => setShots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const addShot = () => { if (shots.length < MAX_SHOTS) setShots(prev => [...prev, { id: Date.now(), prompt: '', duration: 4, seats: Array(SEATS).fill(null), firstFrame: null, lastFrame: null }]); };
  const removeShot = (id) => setShots(prev => prev.filter(s => s.id !== id));
  const toggleApprove = (shotId, si) => setShots(prev => prev.map(s => {
    if (s.id !== shotId) return s;
    const ns = [...s.seats]; ns[si] = ns[si] === 'approved' ? 'done' : ns[si] === 'done' ? 'approved' : ns[si]; return { ...s, seats: ns };
  }));
  const generateShot = (id) => {
    setShots(prev => prev.map(s => s.id !== id ? s : { ...s, seats: s.seats.map(seat => seat === 'approved' ? 'approved' : 'generating') }));
    setTimeout(() => setShots(prev => prev.map(s => s.id !== id ? s : { ...s, seats: s.seats.map(seat => seat === 'generating' ? 'done' : seat) })), 2000 + Math.random() * 2000);
  };
  const generateAll = () => shots.forEach(s => { if (s.prompt.trim()) generateShot(s.id); });
  const handleFrameUpload = (shotId, frameType) => {
    updateShot(shotId, { [frameType === 'first' ? 'firstFrame' : 'lastFrame']: frameType === 'first' ? '首帧.jpg' : '尾帧.jpg' });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{shots.length}/{MAX_SHOTS} 个镜头 · 模型：Veo Lite</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <SecondaryBtn onClick={addShot} disabled={shots.length >= MAX_SHOTS}><Plus size={11} /> 新增镜头</SecondaryBtn>
          <PrimaryBtn size="sm" onClick={generateAll}><Sparkles size={12} /> 一键全部生成</PrimaryBtn>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shots.map((shot, idx) => {
          const approved = shot.seats.filter(s => s === 'approved').length;
          const unfilled = shot.seats.filter(s => s !== 'approved').length;
          const hasGen = shot.seats.some(s => s === 'done' || s === 'approved');
          return (
            <div key={shot.id} style={{ ...glassCard, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Left: controls + prompt */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>镜头 {idx + 1}</span>
                    <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'rgba(0,0,0,0.04)', color: 'var(--color-text-secondary)' }}>{shot.duration}s</span>
                    {approved > 0 && <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)', background: 'var(--color-green-bg)', color: 'var(--color-green)', fontWeight: 500 }}>✓{approved}</span>}
                  </div>
                  {shots.length > 1 && (
                    <button onClick={() => removeShot(shot.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)', padding: 2 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#FF3B30'} onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-tertiary)'}><Trash2 size={12} /></button>
                  )}
                </div>
                {/* Duration + frames in one row */}
                <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>时长</span>
                  <input type="range" min={3} max={5} step={1} value={shot.duration} onChange={e => updateShot(shot.id, { duration: Number(e.target.value) })} style={{ width: 60 }} />
                  <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>{shot.duration}s</span>
                  <div style={{ width: 1, height: 12, background: 'rgba(0,0,0,0.06)', margin: '0 2px' }} />
                  <button onClick={() => handleFrameUpload(shot.id, 'first')} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, border: '1px dashed rgba(0,0,0,0.1)', background: shot.firstFrame ? 'rgba(0,113,227,0.04)' : 'none', color: shot.firstFrame ? 'var(--color-primary)' : 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Upload size={9} /> {shot.firstFrame || '首帧'}
                    {shot.firstFrame && <X size={9} onClick={e => { e.stopPropagation(); updateShot(shot.id, { firstFrame: null }); }} />}
                  </button>
                  <button onClick={() => handleFrameUpload(shot.id, 'last')} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, border: '1px dashed rgba(0,0,0,0.1)', background: shot.lastFrame ? 'rgba(0,113,227,0.04)' : 'none', color: shot.lastFrame ? 'var(--color-primary)' : 'var(--color-text-tertiary)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Upload size={9} /> {shot.lastFrame || '尾帧'}
                    {shot.lastFrame && <X size={9} onClick={e => { e.stopPropagation(); updateShot(shot.id, { lastFrame: null }); }} />}
                  </button>
                </div>
                <textarea value={shot.prompt} onChange={e => updateShot(shot.id, { prompt: e.target.value })} placeholder="输入分镜头 Prompt..." style={{ ...inputStyle, minHeight: 48, resize: 'vertical', lineHeight: 1.6, padding: '8px 10px', fontSize: 12, marginBottom: 8 }} />
                <PrimaryBtn size="sm" onClick={() => generateShot(shot.id)} disabled={!shot.prompt.trim()}>
                  {hasGen ? <><RefreshCw size={11} /> 重新生成{approved > 0 ? `（${unfilled}个）` : ''}</> : <><Sparkles size={11} /> 生成</>}
                </PrimaryBtn>
              </div>
              {/* Right: seats */}
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {shot.seats.map((seat, si) => <SeatThumb key={si} seat={seat} isVideo={true} onClick={() => (seat === 'done' || seat === 'approved') && toggleApprove(shot.id, si)} />)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project List
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function NewProjectModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1); // 1=选客户, 2=选账号
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const handleCreate = () => {
    if (!selectedClient || !selectedAccount) return;
    const newProject = {
      id: Date.now(),
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      name: '新内容项目',
      account: selectedAccount.name,
      platform: selectedAccount.platform,
      status: 'draft',
      assigneeId: 0,
      assigneeName: '',
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    projects.push(newProject);
    onCreate(newProject.id);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }} />
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: 520, maxHeight: '80vh', overflow: 'auto', ...glassCard, padding: '28px 32px', boxShadow: 'var(--shadow-xl)', animation: 'fadeIn 200ms ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text)', margin: 0 }}>新建项目</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {step === 1 ? '第 1 步：选择客户' : '第 2 步：选择发布账号'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={18} color="var(--color-text-tertiary)" />
          </button>
        </div>

        {/* 步骤指示器 */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: s <= step ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)', transition: 'background 0.3s' }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {clients.filter(c => c.status === 'active').map(c => (
              <div key={c.id} onClick={() => { setSelectedClient(c); setSelectedAccount(null); setStep(2); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.6)',
                transition: 'all var(--transition-fast)',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(0,113,227,0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--color-primary), #5856D6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: 14, fontWeight: 600 }}>{c.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{c.industry} · {c.direction}</div>
                </div>
                <ChevronRight size={16} color="var(--color-text-tertiary)" />
              </div>
            ))}
          </div>
        )}

        {step === 2 && selectedClient && (
          <div>
            {/* 返回选客户 */}
            <button onClick={() => setStep(1)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 14, padding: 0 }}>
              ← 重新选择客户（当前：{selectedClient.name}）
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(selectedClient.accounts || []).map(acc => {
                const isSelected = selectedAccount?.id === acc.id && selectedAccount?.platform === acc.platform;
                return (
                  <div key={`${acc.platform}-${acc.id}`} onClick={() => setSelectedAccount(acc)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                    borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: `1px solid ${isSelected ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)'}`,
                    background: isSelected ? 'rgba(0,113,227,0.04)' : 'rgba(255,255,255,0.6)',
                    transition: 'all var(--transition-fast)',
                  }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,113,227,0.3)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
                  >
                    <PlatformBadge platform={acc.platform} size={28} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{acc.style}</div>
                    </div>
                    {isSelected && <Check size={16} color="var(--color-primary)" />}
                  </div>
                );
              })}
            </div>
            <button onClick={handleCreate} disabled={!selectedAccount} style={{
              width: '100%', marginTop: 20, padding: '11px 0', borderRadius: 'var(--radius-sm)',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', border: 'none', cursor: selectedAccount ? 'pointer' : 'not-allowed',
              background: selectedAccount ? 'var(--color-primary)' : 'rgba(0,0,0,0.06)',
              color: selectedAccount ? '#FFF' : 'var(--color-text-tertiary)',
              transition: 'all var(--transition-fast)',
            }}>
              创建项目
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectList({ onOpen, currentUser }) {
  const [filter, setFilter] = useState('all');
  const [showNewModal, setShowNewModal] = useState(false);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const myProjects = isAdmin ? projects : projects.filter(p => p.assigneeId === currentUser?.id);
  const filters = [
    { id: 'all', label: '全部' }, { id: 'draft', label: '草稿' },
    { id: 'production', label: '生产中' }, { id: 'completed', label: '已完成' }, { id: 'published', label: '已发布' },
  ];
  const filtered = filter === 'all' ? myProjects : myProjects.filter(p => p.status === filter);

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <div style={{ padding: '28px 40px 24px', ...glassHeader, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>创作工作台</h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6 }}>{isAdmin ? '所有内容项目的生产与管理' : '我负责的内容项目'}</p>
        </div>
        <PrimaryBtn onClick={() => setShowNewModal(true)}><Plus size={14} /> 新建项目</PrimaryBtn>
      </div>
      {showNewModal && <NewProjectModal onClose={() => setShowNewModal(false)} onCreate={(id) => { setShowNewModal(false); onOpen(id); }} />}
      <div style={{ padding: '28px 40px', maxWidth: 1080 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '7px 16px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
              background: filter === f.id ? 'var(--color-text)' : 'rgba(255,255,255,0.6)',
              color: filter === f.id ? '#FFF' : 'var(--color-text-secondary)',
              border: `1px solid ${filter === f.id ? 'var(--color-text)' : 'rgba(0,0,0,0.06)'}`,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ ...glassCard, overflow: 'hidden', animation: 'fadeIn 350ms ease' }}>
          {filtered.map((p, idx) => (
            <div key={p.id} onClick={() => onOpen(p.id)} style={{
              display: 'flex', alignItems: 'center', padding: '15px 22px',
              borderBottom: idx < filtered.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
              cursor: 'pointer', transition: 'background var(--transition-fast)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <PlatformBadge platform={p.platform} size={26} />
              <div style={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{p.clientName} · {p.account}</div>
              </div>
              {isAdmin && p.assigneeName && <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginRight: 8 }}>{p.assigneeName}</span>}
              <StatusBadge status={p.status} />
              <span style={{ fontSize: 11, color: p.status === 'published' && p.publishTime ? 'var(--color-green)' : 'var(--color-text-tertiary)', marginLeft: 16, minWidth: 90, textAlign: 'right' }}>
                {p.status === 'published' && p.publishTime ? p.publishTime : p.updatedAt}
              </span>
              <ChevronRight size={14} color="var(--color-text-quaternary)" style={{ marginLeft: 12 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Project Detail — 三层结构
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ProjectDetail({ projectId, onBack }) {
  const project = projects.find(p => p.id === projectId) || projects[0];
  const statusFlow = ['draft', 'production', 'completed', 'published'];

  const [projectStatus, setProjectStatus] = useState(project.status || 'draft');
  const currentIdx = statusFlow.indexOf(projectStatus);

  const [activeLayer, setActiveLayer] = useState('source');
  const [sourceText, setSourceText] = useState('');
  const [scheme, setScheme] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [schemeChanged, setSchemeChanged] = useState(false);
  const [confirmedScheme, setConfirmedScheme] = useState('');
  const [publishInfo, setPublishInfo] = useState({ time: '', link: '' });

  const handleSourceReady = (text) => { setSourceText(text); setActiveLayer('scheme'); };
  const handleSchemeConfirm = (s) => {
    setConfirmed(true); setConfirmedScheme(s); setSchemeChanged(false); setActiveLayer('production');
    setProjectStatus('production');
    // Simulate AI generation completing after 2s
    setTimeout(() => setProjectStatus('completed'), 2000);
  };
  const handlePublish = (info) => { setPublishInfo(info); setProjectStatus('published'); };

  const handleSetScheme = (s) => {
    setScheme(s);
    if (confirmed && s !== confirmedScheme) setSchemeChanged(true);
  };

  const layerTabs = [
    { id: 'source', label: '来源层', badge: sourceText ? '已选择' : '三选一', badgeColor: sourceText ? 'var(--color-green)' : 'var(--color-text-secondary)', badgeBg: sourceText ? 'var(--color-green-bg)' : 'rgba(0,0,0,0.04)' },
    { id: 'scheme', label: '方案层', badge: scheme ? '已生成' : '待生成', badgeColor: scheme ? 'var(--color-green)' : 'var(--color-text-secondary)', badgeBg: scheme ? 'var(--color-green-bg)' : 'rgba(0,0,0,0.04)' },
    { id: 'production', label: '生产层', badge: confirmed ? '就绪' : '需先确认方案', badgeColor: confirmed ? 'var(--color-green)' : 'var(--color-orange)', badgeBg: confirmed ? 'var(--color-green-bg)' : 'var(--color-orange-bg)' },
  ];

  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      {/* Header */}
      <div style={{ ...glassHeader, padding: '22px 40px 0' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 16, fontFamily: 'inherit', fontWeight: 500 }}>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> 所有项目
        </button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', marginBottom: 8, letterSpacing: '-0.4px' }}>{project.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}>
              <PlatformBadge platform={project.platform} size={18} />
              <span>{project.clientName} · {project.account} · {project.platform}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {statusFlow.map((st, i) => {
              const sc = statusConfig[st];
              const isPast = i < currentIdx;
              const isCurrent = i === currentIdx;
              const config = { draft: { color: 'var(--color-text-secondary)', bg: 'rgba(0,0,0,0.04)' }, production: { color: 'var(--color-primary)', bg: 'var(--color-primary-bg)' }, completed: { color: '#5856D6', bg: 'rgba(88,86,214,0.08)' }, published: { color: 'var(--color-green)', bg: 'var(--color-green-bg)' } };
              const cc = config[st];
              return (
                <div key={st} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 12px', borderRadius: 'var(--radius-full)', background: isCurrent ? cc.bg : 'transparent', color: isCurrent ? cc.color : isPast ? 'var(--color-text-tertiary)' : 'var(--color-text-quaternary)', fontSize: 11, fontWeight: isCurrent ? 600 : 400 }}>
                    {isPast && <Check size={10} />}
                    {sc.label}
                  </div>
                  {i < statusFlow.length - 1 && <ChevronRight size={10} color="var(--color-text-quaternary)" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Layer tabs */}
        <div style={{ display: 'flex', gap: 0 }}>
          {layerTabs.map(t => {
            const isActive = activeLayer === t.id;
            return (
              <button key={t.id} onClick={() => setActiveLayer(t.id)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', fontSize: 14, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                marginBottom: -1, transition: 'all var(--transition-fast)',
              }}>
                {t.label}
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: t.badgeBg, color: t.badgeColor, fontWeight: 500 }}>{t.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layer content */}
      <div style={{ padding: '28px 40px', maxWidth: 960, animation: 'fadeIn 200ms ease' }}>
        {activeLayer === 'source' && (
          <SourceLayer project={project} onSourceReady={handleSourceReady} />
        )}
        {activeLayer === 'scheme' && (
          <SchemeLayer sourceText={sourceText} onSchemeConfirm={handleSchemeConfirm} scheme={scheme} setScheme={handleSetScheme} />
        )}
        {activeLayer === 'production' && (
          <ProductionLayer confirmed={confirmed} schemeChanged={schemeChanged} onResetChanged={() => setSchemeChanged(false)} project={project} projectStatus={projectStatus} onPublish={handlePublish} publishInfo={publishInfo} />
        )}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Export
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function CreativeStudio({ initialProjectId, onClearProject, currentUser }) {
  const [selectedProject, setSelectedProject] = useState(initialProjectId || null);
  const handleBack = () => { setSelectedProject(null); if (onClearProject) onClearProject(); };
  if (selectedProject) return <ProjectDetail projectId={selectedProject} onBack={handleBack} />;
  return <ProjectList onOpen={setSelectedProject} currentUser={currentUser} />;
}

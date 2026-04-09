import { useState, useRef } from 'react';
import { Plus, ChevronRight, Globe, Users, FolderOpen, Cpu, ChevronDown, Sparkles, X, Edit3, Check, RefreshCw, Search, ChevronLeft, Upload, Video, Mic, FileText, Trash2 } from 'lucide-react';
import { clients, projects, statusConfig } from '../data/mockData';
import { ClientAvatar, PlatformBadge, DigitalHumanIllustration } from '../components/Illustrations';

const platformDot = { '抖音': '#1D1D1F', '小红书': '#FF2D55', '视频号': '#34C759', 'B站': '#FF6482', 'TikTok': '#010101', '微博': '#FF8200', '快手': '#FF4906', '微信公众号': '#07C160' };

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

function Tag({ children, color = 'var(--color-text-secondary)', bg = 'rgba(0,0,0,0.04)' }) {
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: bg, color, fontWeight: 500 }}>{children}</span>;
}

function StatusBadge({ status }) {
  const config = {
    draft:      { label: '草稿',   color: 'var(--color-text-secondary)', bg: 'rgba(0,0,0,0.04)' },
    production: { label: '生产中', color: 'var(--color-primary)',        bg: 'var(--color-primary-bg)' },
    completed:  { label: '已完成', color: '#5856D6',                     bg: 'rgba(88,86,214,0.08)' },
    published:  { label: '已发布', color: 'var(--color-green)',          bg: 'var(--color-green-bg)' },
  };
  const s = config[status] || config.draft;
  return <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: s.bg, color: s.color, fontWeight: 500 }}>{s.label}</span>;
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ padding: '28px 40px 24px', ...glassHeader, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 6 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function PrimaryBtn({ children, onClick, size = 'md', disabled }) {
  const pad = size === 'sm' ? '7px 14px' : '9px 18px';
  const fs = size === 'sm' ? 12 : 13;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 'var(--radius-sm)', fontSize: fs,
      fontWeight: 500, fontFamily: 'inherit',
      background: disabled ? 'rgba(0,0,0,0.08)' : 'var(--color-primary)',
      color: disabled ? 'var(--color-text-tertiary)' : '#FFFFFF',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all var(--transition-smooth)',
      boxShadow: disabled ? 'none' : '0 2px 8px rgba(0, 113, 227, 0.2)',
      opacity: disabled ? 0.7 : 1,
    }}
      onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
      onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.transform = 'none'; } }}
    >{children}</button>
  );
}

function SecondaryBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12,
      fontWeight: 500, fontFamily: 'inherit',
      background: 'rgba(255,255,255,0.5)', color: 'var(--color-primary)',
      border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer',
      backdropFilter: 'blur(8px)', transition: 'all var(--transition-fast)',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-bg)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
    >{children}</button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 12px', borderRadius: 'var(--radius-sm)', fontSize: 12,
      fontWeight: 500, fontFamily: 'inherit',
      background: 'none', color: 'var(--color-text-secondary)',
      border: 'none', cursor: 'pointer', transition: 'color var(--transition-fast)',
    }}
      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
    >{children}</button>
  );
}

function Card({ children, style: extraStyle = {} }) {
  return <div style={{ ...glassCard, ...extraStyle }}>{children}</div>;
}

function SectionTitle({ children, style: extraStyle = {} }) {
  return <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 14, letterSpacing: '-0.01em', ...extraStyle }}>{children}</h3>;
}

/* ── Editable markdown-like text area ──────────────────────────── */

function EditableTextArea({ value, onChange, placeholder, minHeight = 120 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', minHeight, padding: '14px 16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid rgba(0,0,0,0.08)',
        background: 'rgba(255,255,255,0.6)',
        fontSize: 13, lineHeight: 1.8, color: 'var(--color-text)',
        fontFamily: 'inherit', outline: 'none', resize: 'vertical',
        transition: 'border-color var(--transition-fast)',
        boxSizing: 'border-box',
      }}
      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
      onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
    />
  );
}

/* ── Simple markdown renderer (## headings + numbered lists) ── */

function MarkdownView({ text }) {
  if (!text) return <span style={{ color: 'var(--color-text-tertiary)', fontSize: 13 }}>暂无内容</span>;
  const lines = text.split('\n');
  return (
    <div style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--color-text)' }}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <div key={i} style={{ fontWeight: 600, fontSize: 14, marginTop: i > 0 ? 16 : 0, marginBottom: 4, color: 'var(--color-text)' }}>{line.slice(3)}</div>;
        if (/^\d+\.\s/.test(line)) return <div key={i} style={{ paddingLeft: 8 }}>{line}</div>;
        if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 8 }}>{line}</div>;
        if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
        return <div key={i}>{line}</div>;
      })}
    </div>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({ client, onClick }) {
  const dh = client.digitalHumans || { avatars: [], voices: [] };
  return (
    <div onClick={() => onClick(client)} style={{ ...glassCard, padding: '22px', cursor: 'pointer', transition: 'all var(--transition-smooth)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-glass)'; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ClientAvatar letter={client.avatar} size={42} colorIndex={client.id} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>{client.name}</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 3 }}>{client.industry} · {client.direction}</div>
          </div>
        </div>
        <ChevronRight size={14} color="var(--color-text-quaternary)" />
      </div>
      <div style={{ display: 'flex', gap: 20, borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 16 }}>
        <StatItem icon={<Globe size={13} />} label="账号" value={client.accountCount} />
        <StatItem icon={<FolderOpen size={13} />} label="项目" value={client.projectCount} />
        <StatItem icon={<Cpu size={13} />} label="数字人" value={dh.avatars.length + dh.voices.length} />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--color-text-secondary)' }}>
      {icon}
      <span style={{ fontSize: 12 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{value}</span>
    </div>
  );
}

// ─── Client Detail ───────────────────────────────────────────────────────────

function ClientDetail({ client: initialClient, onBack, onOpenProject, onUpdateClient }) {
  const [client, setClient] = useState(initialClient);
  const [tab, setTab] = useState('profile');
  const tabs = [
    { id: 'profile', label: '客户档案' },
    { id: 'accounts', label: '账号管理' },
    { id: 'avatars', label: '数字人管理' },
    { id: 'projects', label: `项目列表 (${client.projectCount})` },
  ];

  const updateClient = (updates) => {
    const updated = { ...client, ...updates };
    setClient(updated);
    onUpdateClient?.(updated);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      <div style={{ ...glassHeader, padding: '20px 40px 0' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-primary)', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 18, fontFamily: 'inherit', fontWeight: 500 }}>
          <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} /> 所有客户
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <ClientAvatar letter={client.avatar} size={48} colorIndex={client.id} />
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>{client.name}</h1>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{client.industry} · {client.direction} · 建档于 {client.createdAt}</p>
            </div>
          </div>
          <PrimaryBtn><Plus size={14} /> 新建项目</PrimaryBtn>
        </div>
        <div style={{ display: 'flex', gap: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '11px 18px', fontSize: 13,
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: tab === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              fontFamily: 'inherit', marginBottom: -1, transition: 'color var(--transition-fast)',
            }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: '28px 40px', maxWidth: 800, animation: 'fadeInSoft 200ms ease' }}>
        {tab === 'profile' && <ProfileTab client={client} onUpdate={updateClient} />}
        {tab === 'accounts' && <AccountsTab client={client} onUpdate={updateClient} />}
        {tab === 'avatars' && <AvatarsTab client={client} onUpdate={updateClient} />}
        {tab === 'projects' && <ProjectsTab client={client} onOpen={onOpenProject} />}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 1: 客户档案 — 基本信息 + 客户画像 + AI 运营方案
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ProfileTab({ client, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingPlan, setEditingPlan] = useState(false);
  const [form, setForm] = useState({ ...client.profile });
  const [basicForm, setBasicForm] = useState({ name: client.name, industry: client.industry, direction: client.direction, platforms: (client.platforms || []).join('、') });
  const [plan, setPlan] = useState(client.operationPlan || '');
  const [generating, setGenerating] = useState(false);

  const saveBasic = () => {
    const platforms = basicForm.platforms.split(/[、,，\s]+/).filter(Boolean);
    onUpdate({
      name: basicForm.name,
      industry: basicForm.industry,
      direction: basicForm.direction,
      platforms,
      avatar: basicForm.name.trim()[0] || client.avatar,
    });
    setEditingBasic(false);
  };
  const cancelBasic = () => {
    setBasicForm({ name: client.name, industry: client.industry, direction: client.direction, platforms: (client.platforms || []).join('、') });
    setEditingBasic(false);
  };

  const saveProfile = () => {
    onUpdate({ profile: { ...form } });
    setEditing(false);
  };
  const savePlan = () => {
    onUpdate({ operationPlan: plan });
    setEditingPlan(false);
  };
  const generatePlan = () => {
    setGenerating(true);
    setTimeout(() => {
      const ind = basicForm.industry || client.industry;
      const dir = basicForm.direction || client.direction;
      const plats = (client.platforms || []);
      const mockPlan = `## 运营策略概述\n基于${ind}行业特点和"${dir}"方向，建议采用内容矩阵+多平台分发策略。\n\n## 内容矩阵规划\n1. 知识科普类（40%）：行业干货、专业解读\n2. 产品种草类（30%）：使用体验、真实评测\n3. 互动引流类（20%）：话题讨论、用户共创\n4. 品牌故事类（10%）：品牌理念、幕后花絮\n\n## 发布节奏\n${plats.map(p => `- ${p}：每周 3-4 条`).join('\n')}\n\n## 增长目标路径\n- 第1月：建立内容基线，测试方向\n- 第2-3月：优化内容，月增粉3k+\n- 第4-6月：稳定输出，启动转化`;
      setPlan(mockPlan);
      onUpdate({ operationPlan: mockPlan });
      setGenerating(false);
    }, 1500);
  };

  const basicFields = [
    { key: 'name', label: '客户名称', value: client.name },
    { key: 'industry', label: '所属行业', value: client.industry },
    { key: 'direction', label: '内容方向', value: client.direction },
    { key: 'platforms', label: '运营平台', value: (client.platforms || []).join('、') || '—' },
    { label: '建档时间', value: client.createdAt, readonly: true },
  ];

  const profileFields = [
    { key: 'audience', label: '目标受众' },
    { key: 'goal', label: '运营目标' },
    { key: 'tone', label: '内容调性' },
    { key: 'avoid', label: '规避方向' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Basic info */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>基本信息</SectionTitle>
          {editingBasic
            ? <div style={{ display: 'flex', gap: 6 }}>
                <GhostBtn onClick={cancelBasic}>取消</GhostBtn>
                <PrimaryBtn size="sm" onClick={saveBasic}><Check size={12} /> 保存</PrimaryBtn>
              </div>
            : <GhostBtn onClick={() => setEditingBasic(true)}><Edit3 size={12} /> 编辑</GhostBtn>
          }
        </div>
        <Card style={{ padding: '0 22px' }}>
          {basicFields.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, padding: '13px 0', borderBottom: i < basicFields.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', alignItems: editingBasic && !f.readonly ? 'flex-start' : 'center' }}>
              <div style={{ width: 80, fontSize: 12, color: 'var(--color-text-secondary)', flexShrink: 0, fontWeight: 500, paddingTop: editingBasic && !f.readonly ? 8 : 0 }}>{f.label}</div>
              {editingBasic && !f.readonly
                ? <input value={basicForm[f.key]} onChange={e => setBasicForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.key === 'platforms' ? '用顿号分隔，如「抖音、小红书」' : ''}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                : <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{f.value}</div>
              }
            </div>
          ))}
        </Card>
      </div>

      {/* Client profile / persona */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <SectionTitle style={{ margin: 0 }}>客户画像</SectionTitle>
          {editing
            ? <div style={{ display: 'flex', gap: 6 }}>
                <GhostBtn onClick={() => { setForm({ ...client.profile }); setEditing(false); }}>取消</GhostBtn>
                <PrimaryBtn size="sm" onClick={saveProfile}><Check size={12} /> 保存</PrimaryBtn>
              </div>
            : <GhostBtn onClick={() => setEditing(true)}><Edit3 size={12} /> 编辑</GhostBtn>
          }
        </div>
        <Card style={{ padding: '0 22px' }}>
          {profileFields.map((f, i) => (
            <div key={f.key} style={{ display: 'flex', gap: 16, padding: '13px 0', borderBottom: i < profileFields.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', alignItems: editing ? 'flex-start' : 'center' }}>
              <div style={{ width: 80, fontSize: 12, color: 'var(--color-text-secondary)', flexShrink: 0, fontWeight: 500, paddingTop: editing ? 8 : 0 }}>{f.label}</div>
              {editing
                ? <input value={form[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
                : <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.7 }}>{form[f.key] || '待完善'}</div>
              }
            </div>
          ))}
        </Card>
      </div>

      {/* AI operation plan */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionTitle style={{ margin: 0 }}>AI 运营方案</SectionTitle>
            {plan && <Tag color="var(--color-green)" bg="var(--color-green-bg)">已生成</Tag>}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {editingPlan
              ? <>
                  <GhostBtn onClick={() => { setPlan(client.operationPlan || ''); setEditingPlan(false); }}>取消</GhostBtn>
                  <PrimaryBtn size="sm" onClick={savePlan}><Check size={12} /> 保存</PrimaryBtn>
                </>
              : <>
                  {plan && <GhostBtn onClick={() => setEditingPlan(true)}><Edit3 size={12} /> 编辑</GhostBtn>}
                  <SecondaryBtn onClick={generatePlan}>
                    {generating ? <><RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} /> 生成中...</> : <><Sparkles size={12} /> {plan ? '重新生成' : 'AI 生成方案'}</>}
                  </SecondaryBtn>
                </>
            }
          </div>
        </div>
        <Card style={{ padding: '20px 22px' }}>
          {editingPlan
            ? <EditableTextArea value={plan} onChange={setPlan} placeholder="输入或编辑运营方案..." minHeight={200} />
            : <MarkdownView text={plan} />
          }
        </Card>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 2: 账号管理 — 账号列表 + 展开详情/规划方案 + 添加账号弹窗
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AccountsTab({ client, onUpdate }) {
  const [expanded, setExpanded] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planDraft, setPlanDraft] = useState('');
  const [editingAccount, setEditingAccount] = useState(null);
  const [accDraft, setAccDraft] = useState({ name: '', style: '', target: '', keywords: [] });
  const [accKwInput, setAccKwInput] = useState('');

  const accountStyles = ['知识型 · 专业', '生活化 · 真实感', '干货型 · 快节奏', '视觉型 · 沉浸感', '品牌形象型', '深度解析型', '生活美学型'];

  const startEditAccount = (acc) => {
    setEditingAccount(acc.id);
    setAccDraft({ name: acc.name, style: acc.style || '', target: acc.target || '', keywords: [...(acc.keywords || [])] });
    setAccKwInput('');
  };
  const saveAccount = (accId) => {
    const updated = client.accounts.map(a => a.id === accId ? { ...a, ...accDraft } : a);
    onUpdate({ accounts: updated });
    setEditingAccount(null);
  };
  const cancelEditAccount = () => { setEditingAccount(null); };
  const addAccKw = () => { const v = accKwInput.trim(); if (v && !accDraft.keywords.includes(v)) { setAccDraft(p => ({ ...p, keywords: [...p.keywords, v] })); setAccKwInput(''); } };
  const removeAccKw = (k) => setAccDraft(p => ({ ...p, keywords: p.keywords.filter(x => x !== k) }));
  const deleteAccount = (accId) => {
    const updated = client.accounts.filter(a => a.id !== accId);
    onUpdate({ accounts: updated, accountCount: updated.length });
    setExpanded(null);
  };

  const handleAddAccount = (acc) => {
    const newAcc = { ...acc, id: Date.now() };
    // auto-generate mock plan
    const mockPlan = `## 账号定位\n${acc.target || acc.name + ' 账号'}。\n\n## 内容策略\n1. 核心内容（50%）：围绕 ${acc.keywords.join('、')} 展开\n2. 互动内容（30%）：话题讨论、用户共创\n3. 引流内容（20%）：活动预告、福利\n\n## 发布节奏\n每周 3-4 条，根据平台特点选择最佳发布时间`;
    newAcc.plan = mockPlan;
    onUpdate({ accounts: [...client.accounts, newAcc], accountCount: client.accountCount + 1 });
    setShowAdd(false);
  };

  const startEditPlan = (acc) => {
    setEditingPlan(acc.id);
    setPlanDraft(acc.plan || '');
  };

  const savePlan = (accId) => {
    const updated = client.accounts.map(a => a.id === accId ? { ...a, plan: planDraft } : a);
    onUpdate({ accounts: updated });
    setEditingPlan(null);
  };

  const regeneratePlan = (acc) => {
    const mockPlan = `## 账号定位\n${acc.style || ''}风格的${acc.platform}账号，目标：${acc.target || '待设定'}。\n\n## 内容策略\n1. 核心内容（50%）：围绕 ${acc.keywords.join('、')} 展开创作\n2. 互动引流（30%）：话题讨论、问答互动\n3. 品牌曝光（20%）：品牌故事、活动预热\n\n## 发布节奏\n每周 3-4 条，建议${acc.platform === '小红书' ? '中午12点和晚上8点' : '晚间19-21点'}发布`;
    const updated = client.accounts.map(a => a.id === acc.id ? { ...a, plan: mockPlan } : a);
    onUpdate({ accounts: updated });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle style={{ margin: 0 }}>账号列表</SectionTitle>
        <SecondaryBtn onClick={() => setShowAdd(true)}><Plus size={12} /> 添加账号</SecondaryBtn>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {client.accounts.map(acc => (
          <Card key={acc.id} style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 20px', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
              onClick={() => setExpanded(expanded === acc.id ? null : acc.id)}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <PlatformBadge platform={acc.platform} size={22} />
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{acc.name}</span>
                <Tag>{acc.style}</Tag>
              </div>
              <ChevronDown size={14} color="var(--color-text-tertiary)" style={{ transition: 'transform var(--transition-base)', transform: expanded === acc.id ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>
            {expanded === acc.id && (
              <div style={{ padding: '0 20px 18px', borderTop: '1px solid rgba(0,0,0,0.04)', animation: 'fadeIn 150ms ease' }}>
                {/* Account info */}
                <div style={{ paddingTop: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>账号信息</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {editingAccount === acc.id ? (
                        <>
                          <GhostBtn onClick={cancelEditAccount}>取消</GhostBtn>
                          <PrimaryBtn size="sm" onClick={() => saveAccount(acc.id)}><Check size={12} /> 保存</PrimaryBtn>
                        </>
                      ) : (
                        <>
                          <GhostBtn onClick={() => startEditAccount(acc)}><Edit3 size={12} /> 编辑</GhostBtn>
                          <GhostBtn onClick={() => { if (window.confirm('确定删除此账号？')) deleteAccount(acc.id); }}><Trash2 size={12} /> 删除</GhostBtn>
                        </>
                      )}
                    </div>
                  </div>

                  {editingAccount === acc.id ? (
                    <div style={{ background: 'rgba(0,0,0,0.015)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: 6 }}>账号名称</div>
                        <input value={accDraft.name} onChange={e => setAccDraft(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: 6 }}>账号风格</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {accountStyles.map(s => (
                            <button key={s} onClick={() => setAccDraft(p => ({ ...p, style: p.style === s ? '' : s }))} style={{
                              padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
                              background: accDraft.style === s ? 'var(--color-primary-bg)' : 'rgba(0,0,0,0.03)',
                              color: accDraft.style === s ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                              border: `1px solid ${accDraft.style === s ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)'}`,
                              cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                            }}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: 6 }}>目标定位</div>
                        <input value={accDraft.target} onChange={e => setAccDraft(p => ({ ...p, target: e.target.value }))} placeholder="简述账号定位和目标" style={inputStyle} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500, marginBottom: 6 }}>核心关键词</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: accDraft.keywords.length ? 8 : 0 }}>
                          {accDraft.keywords.map(k => (
                            <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 500 }}>
                              {k} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeAccKw(k)} />
                            </span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input value={accKwInput} onChange={e => setAccKwInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAccKw()} placeholder="输入关键词，回车添加" style={{ ...inputStyle, flex: 1 }} />
                          <SecondaryBtn onClick={addAccKw}><Plus size={12} /> 添加</SecondaryBtn>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                        {acc.target && <div><span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', fontWeight: 500 }}>目标定位</span><div style={{ fontSize: 13, color: 'var(--color-text)', marginTop: 4 }}>{acc.target}</div></div>}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>核心关键词</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {acc.keywords.map(k => <Tag key={k} color="var(--color-primary)" bg="var(--color-primary-bg)">{k}</Tag>)}
                      </div>
                    </>
                  )}
                </div>
                {/* Account plan */}
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)' }}>AI 账号规划方案</span>
                      {acc.plan && <Tag color="var(--color-green)" bg="var(--color-green-bg)">已生成</Tag>}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {editingPlan === acc.id
                        ? <>
                            <GhostBtn onClick={() => setEditingPlan(null)}>取消</GhostBtn>
                            <PrimaryBtn size="sm" onClick={() => savePlan(acc.id)}><Check size={12} /> 保存</PrimaryBtn>
                          </>
                        : <>
                            {acc.plan && <GhostBtn onClick={() => startEditPlan(acc)}><Edit3 size={12} /> 编辑</GhostBtn>}
                            <SecondaryBtn onClick={() => regeneratePlan(acc)}><Sparkles size={12} /> {acc.plan ? '重新生成' : 'AI 生成'}</SecondaryBtn>
                          </>
                      }
                    </div>
                  </div>
                  {editingPlan === acc.id
                    ? <EditableTextArea value={planDraft} onChange={setPlanDraft} minHeight={140} />
                    : <div style={{ background: 'rgba(0,0,0,0.015)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}><MarkdownView text={acc.plan} /></div>
                  }
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
      {showAdd && <AddAccountModal onClose={() => setShowAdd(false)} onAdd={handleAddAccount} />}
    </div>
  );
}

function AddAccountModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ platform: '', name: '', style: '', keywords: [], target: '' });
  const [kwInput, setKwInput] = useState('');
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: null })); };

  const platforms = ['抖音', '小红书', '视频号', 'TikTok', 'B站', '微博', '快手', '微信公众号'];
  const styles = ['知识型 · 专业', '生活化 · 真实感', '干货型 · 快节奏', '视觉型 · 沉浸感', '品牌形象型', '深度解析型', '生活美学型'];

  const addKw = () => { const v = kwInput.trim(); if (v && !form.keywords.includes(v)) { set('keywords', [...form.keywords, v]); setKwInput(''); } };
  const removeKw = (k) => set('keywords', form.keywords.filter(x => x !== k));

  const handleSubmit = () => {
    const e = {};
    if (!form.platform) e.platform = true;
    if (!form.name.trim()) e.name = true;
    setErrors(e);
    if (Object.keys(e).length === 0) onAdd(form);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInSoft 150ms ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: 480, maxHeight: '85vh', overflowY: 'auto', background: 'var(--glass-bg-heavy)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: 'var(--glass-border)', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-xl)', animation: 'slideUp 250ms cubic-bezier(0.25,0.1,0.25,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>添加账号</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>创建后自动生成 AI 账号规划方案</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '22px 28px 6px' }}>
          <FormField label="平台" required>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {platforms.map(p => (
                <button key={p} onClick={() => set('platform', form.platform === p ? '' : p)} style={{
                  padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
                  background: form.platform === p ? 'var(--color-text)' : 'rgba(255,255,255,0.5)',
                  color: form.platform === p ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: `1px solid ${form.platform === p ? 'var(--color-text)' : errors.platform ? 'var(--color-red)' : 'rgba(0,0,0,0.06)'}`,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                }}>{p}</button>
              ))}
            </div>
          </FormField>
          <FormField label="账号名称" required>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="如 @品牌名官方" style={{ ...inputStyle, borderColor: errors.name ? 'var(--color-red)' : undefined }} />
          </FormField>
          <FormField label="账号风格">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {styles.map(s => (
                <button key={s} onClick={() => set('style', form.style === s ? '' : s)} style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 500,
                  background: form.style === s ? 'var(--color-primary-bg)' : 'rgba(0,0,0,0.03)',
                  color: form.style === s ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  border: `1px solid ${form.style === s ? 'var(--color-primary)' : 'rgba(0,0,0,0.04)'}`,
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all var(--transition-fast)',
                }}>{s}</button>
              ))}
            </div>
          </FormField>
          <FormField label="核心关键词">
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: form.keywords.length ? 8 : 0 }}>
              {form.keywords.map(k => (
                <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-primary-bg)', color: 'var(--color-primary)', fontWeight: 500 }}>
                  {k} <X size={10} style={{ cursor: 'pointer' }} onClick={() => removeKw(k)} />
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={kwInput} onChange={e => setKwInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKw()} placeholder="输入关键词，回车添加" style={{ ...inputStyle, flex: 1 }} />
              <SecondaryBtn onClick={addKw}><Plus size={12} /> 添加</SecondaryBtn>
            </div>
          </FormField>
          <FormField label="目标定位">
            <input value={form.target} onChange={e => set('target', e.target.value)} placeholder="简述账号定位和目标" style={inputStyle} />
          </FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px 22px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(255,255,255,0.5)', color: 'var(--color-text-secondary)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}>取消</button>
          <PrimaryBtn onClick={handleSubmit}><Plus size={13} /> 创建账号</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 3: 数字人管理 — 形象克隆 + 音色克隆
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AvatarsTab({ client, onUpdate }) {
  const dh = client.digitalHumans || { avatars: [], voices: [] };
  const [showAdd, setShowAdd] = useState(null); // 'avatar' | 'voice' | null

  const handleAdd = (type, item) => {
    const key = type === 'avatar' ? 'avatars' : 'voices';
    const updated = { ...dh, [key]: [...dh[key], { ...item, id: Date.now(), status: 'training' }] };
    onUpdate({ digitalHumans: updated });
    setShowAdd(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* 形象克隆 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Video size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
            <SectionTitle style={{ margin: 0 }}>形象克隆</SectionTitle>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>{dh.avatars.length} 个</span>
          </div>
          <SecondaryBtn onClick={() => setShowAdd('avatar')}><Plus size={12} /> 克隆新形象</SecondaryBtn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {dh.avatars.map(av => (
            <Card key={av.id} style={{ overflow: 'hidden' }}>
              <div style={{ height: 100, background: 'linear-gradient(135deg, rgba(88,86,214,0.08), rgba(0,113,227,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={28} color="rgba(88,86,214,0.4)" strokeWidth={1.5} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{av.name}</div>
                {av.desc && <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 8, lineHeight: 1.5 }}>{av.desc}</div>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tag color={av.status === 'ready' ? 'var(--color-green)' : 'var(--color-orange)'} bg={av.status === 'ready' ? 'var(--color-green-bg)' : 'var(--color-orange-bg)'}>{av.status === 'ready' ? '可用' : '训练中'}</Tag>
                  {av.fileName && <span style={{ fontSize: 10, color: 'var(--color-text-quaternary)' }}>{av.fileName}</span>}
                </div>
              </div>
            </Card>
          ))}
          {dh.avatars.length === 0 && <div style={{ color: 'var(--color-text-tertiary)', fontSize: 13, padding: '20px 0' }}>暂无形象，点击右上角克隆新形象</div>}
        </div>
      </div>

      {/* 音色克隆 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Mic size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
            <SectionTitle style={{ margin: 0 }}>音色克隆</SectionTitle>
            <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', background: 'rgba(0,0,0,0.04)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>{dh.voices.length} 个</span>
          </div>
          <SecondaryBtn onClick={() => setShowAdd('voice')}><Plus size={12} /> 克隆新音色</SecondaryBtn>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {dh.voices.map(v => (
            <Card key={v.id} style={{ overflow: 'hidden' }}>
              <div style={{ height: 80, background: 'linear-gradient(135deg, rgba(52,199,89,0.08), rgba(0,113,227,0.06))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic size={24} color="rgba(52,199,89,0.5)" strokeWidth={1.5} />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{v.name}</div>
                {v.desc && <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 8, lineHeight: 1.5 }}>{v.desc}</div>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Tag color={v.status === 'ready' ? 'var(--color-green)' : 'var(--color-orange)'} bg={v.status === 'ready' ? 'var(--color-green-bg)' : 'var(--color-orange-bg)'}>{v.status === 'ready' ? '可用' : '训练中'}</Tag>
                  {v.fileName && <span style={{ fontSize: 10, color: 'var(--color-text-quaternary)' }}>{v.fileName}</span>}
                </div>
              </div>
            </Card>
          ))}
          {dh.voices.length === 0 && <div style={{ color: 'var(--color-text-tertiary)', fontSize: 13, padding: '20px 0' }}>暂无音色，点击右上角克隆新音色</div>}
        </div>
      </div>

      {showAdd && <AddDigitalHumanModal type={showAdd} onClose={() => setShowAdd(null)} onAdd={(item) => handleAdd(showAdd, item)} />}
    </div>
  );
}

function AddDigitalHumanModal({ type, onClose, onAdd }) {
  const isAvatar = type === 'avatar';
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = () => {
    if (!name.trim()) { setError('请输入名称'); return; }
    if (!fileName) { setError(`请上传${isAvatar ? '视频' : '音频'}文件`); return; }
    onAdd({ name: name.trim(), desc: desc.trim(), fileName });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInSoft 150ms ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: 420, background: 'var(--glass-bg-heavy)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: 'var(--glass-border)', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-xl)', animation: 'slideUp 250ms cubic-bezier(0.25,0.1,0.25,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>{isAvatar ? '克隆新形象' : '克隆新音色'}</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{isAvatar ? '上传一段视频用于形象克隆' : '上传一段音频用于音色克隆'}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}><X size={16} /></button>
        </div>
        <div style={{ padding: '22px 28px' }}>
          <FormField label={isAvatar ? '形象名称' : '音色名称'} required>
            <input value={name} onChange={e => { setName(e.target.value); setError(''); }} placeholder={`输入${isAvatar ? '形象' : '音色'}名称`} style={inputStyle} />
          </FormField>
          <FormField label="描述（选填）">
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="简要描述用途或特点" style={inputStyle} />
          </FormField>
          <FormField label={isAvatar ? '上传视频' : '上传音频'} required>
            <input ref={fileRef} type="file" accept={isAvatar ? 'video/*' : 'audio/*'} onChange={handleFile} style={{ display: 'none' }} />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed rgba(0,0,0,0.08)', borderRadius: 'var(--radius-sm)',
                padding: '24px', textAlign: 'center', cursor: 'pointer',
                background: 'rgba(255,255,255,0.4)', transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'var(--color-primary-bg)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.4)'; }}
            >
              {fileName
                ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {isAvatar ? <Video size={16} color="var(--color-primary)" /> : <Mic size={16} color="var(--color-primary)" />}
                    <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 500 }}>{fileName}</span>
                  </div>
                : <div>
                    <Upload size={24} color="var(--color-text-tertiary)" style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>点击上传{isAvatar ? '视频文件' : '音频文件'}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 4 }}>{isAvatar ? '支持 MP4、MOV、AVI 格式' : '支持 WAV、MP3 格式'}</div>
                  </div>
              }
            </div>
          </FormField>
          {error && <div style={{ fontSize: 11, color: 'var(--color-red)', marginTop: -8, marginBottom: 12 }}>{error}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px 22px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(255,255,255,0.5)', color: 'var(--color-text-secondary)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer' }}>取消</button>
          <PrimaryBtn onClick={handleSubmit}><Plus size={13} /> 开始克隆</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 4: 项目列表 — 账号筛选 + 搜索 + 分页
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const PAGE_SIZE = 5;

function ProjectsTab({ client, onOpen }) {
  const allProjects = projects.filter(p => p.clientId === client.id);
  const [search, setSearch] = useState('');
  const [filterAccount, setFilterAccount] = useState('all');
  const [page, setPage] = useState(1);

  const accountOptions = [...new Set(allProjects.map(p => p.account))];

  let filtered = allProjects;
  if (filterAccount !== 'all') filtered = filtered.filter(p => p.account === filterAccount);
  if (search.trim()) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <SectionTitle style={{ margin: 0 }}>项目列表</SectionTitle>
        <PrimaryBtn size="sm"><Plus size={12} /> 新建项目</PrimaryBtn>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
          <Search size={14} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="搜索项目名称..."
            style={{ ...inputStyle, paddingLeft: 34 }}
          />
        </div>
        {/* Account filter */}
        <select
          value={filterAccount}
          onChange={e => { setFilterAccount(e.target.value); setPage(1); }}
          style={{
            ...inputStyle, width: 'auto', minWidth: 160, cursor: 'pointer',
            appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%236E6E73%27 stroke-width=%272%27%3e%3cpolyline points=%276 9 12 15 18 9%27/%3e%3c/svg%3e")',
            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '14px',
            paddingRight: 32,
          }}
        >
          <option value="all">全部账号</option>
          {accountOptions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {/* Table */}
      <Card style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
              {['项目名称', '账号', '状态', '发布时间', ''].map((h, i) => (
                <th key={i} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 500, letterSpacing: '0.03em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '32px 18px', textAlign: 'center', fontSize: 13, color: 'var(--color-text-tertiary)' }}>暂无匹配项目</td></tr>
            )}
            {paged.map((p, i) => (
              <tr key={p.id}
                style={{ borderBottom: i < paged.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none', transition: 'background var(--transition-fast)', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '13px 18px', fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{p.name}</td>
                <td style={{ padding: '13px 18px', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: platformDot[p.platform] || '#999', display: 'inline-block' }} />
                    {p.account}
                  </span>
                </td>
                <td style={{ padding: '13px 18px' }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: '13px 18px', fontSize: 12, color: p.status === 'published' && p.publishTime ? 'var(--color-green)' : 'var(--color-text-tertiary)' }}>
                  {p.status === 'published' && p.publishTime ? (
                    <div>
                      <div>{p.publishTime}</div>
                      {p.publishLink && (
                        <a href={p.publishLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, color: 'var(--color-primary)', textDecoration: 'none' }}>
                          查看 ↗
                        </a>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-tertiary)' }}>{p.createdAt}</span>
                  )}
                </td>
                <td style={{ padding: '13px 18px' }}>
                  <button onClick={() => onOpen(p.id)} style={{ fontSize: 12, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit' }}>进入 →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>共 {filtered.length} 个项目</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <PaginationBtn disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}><ChevronLeft size={14} /></PaginationBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <PaginationBtn key={n} active={n === safePage} onClick={() => setPage(n)}>{n}</PaginationBtn>
            ))}
            <PaginationBtn disabled={safePage >= totalPages} onClick={() => setPage(safePage + 1)}><ChevronRight size={14} /></PaginationBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function PaginationBtn({ children, onClick, active, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 30, height: 30, borderRadius: 'var(--radius-sm)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: active ? 600 : 400, fontFamily: 'inherit',
      background: active ? 'var(--color-text)' : 'transparent',
      color: active ? '#FFFFFF' : disabled ? 'var(--color-text-quaternary)' : 'var(--color-text-secondary)',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all var(--transition-fast)',
    }}
      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'transparent'; }}
    >{children}</button>
  );
}

// ─── Input helpers ───────────────────────────────────────────────────────────

const inputStyle = {
  width: '100%', padding: '9px 14px', borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(0,0,0,0.08)', fontSize: 13,
  color: 'var(--color-text)', outline: 'none', fontFamily: 'inherit',
  background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
  boxSizing: 'border-box',
};

const DEFAULT_INDUSTRIES = ['美容护肤', '在线教育', '餐饮/新消费', '电商零售', '医疗健康', '科技/SaaS', '文旅/地产', '母婴', '金融', '其他'];
const DEFAULT_PLATFORMS = ['小红书', '抖音', '视频号', 'TikTok', 'B站', '微博', '快手', '微信公众号'];

function FormField({ label, required, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 6 }}>
        {label}{required && <span style={{ color: 'var(--color-red)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── New Client Modal ────────────────────────────────────────────────────────

function TagSelector({ items, selected, onSelect, multiple = false, error, customPlaceholder = '自定义，回车添加' }) {
  const [customInput, setCustomInput] = useState('');
  const [allItems, setAllItems] = useState(items);

  const handleAdd = () => {
    const val = customInput.trim();
    if (!val || allItems.includes(val)) return;
    setAllItems(prev => [...prev, val]);
    if (multiple) onSelect([...selected, val]); else onSelect(val);
    setCustomInput('');
  };

  const toggle = (item) => {
    if (multiple) onSelect(selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item]);
    else onSelect(selected === item ? '' : item);
  };

  const isActive = (item) => multiple ? selected.includes(item) : selected === item;

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
        {allItems.map(item => (
          <button key={item} onClick={() => toggle(item)} style={{
            padding: '5px 14px', borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 500,
            background: isActive(item) ? 'var(--color-text)' : 'rgba(255,255,255,0.5)',
            color: isActive(item) ? '#FFFFFF' : 'var(--color-text-secondary)',
            border: `1px solid ${isActive(item) ? 'var(--color-text)' : error ? 'var(--color-red)' : 'rgba(0,0,0,0.06)'}`,
            cursor: 'pointer', fontFamily: 'inherit', backdropFilter: isActive(item) ? 'none' : 'blur(8px)',
            transition: 'all var(--transition-fast)',
          }}>{item}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={customInput} onChange={e => setCustomInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder={customPlaceholder} style={{ ...inputStyle, flex: 1 }} />
        <button onClick={handleAdd} style={{
          padding: '7px 14px', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500,
          background: 'rgba(255,255,255,0.5)', color: 'var(--color-primary)',
          border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', fontFamily: 'inherit',
          backdropFilter: 'blur(8px)', transition: 'all var(--transition-fast)', whiteSpace: 'nowrap',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-bg)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; }}
        ><Plus size={12} /> 添加</button>
      </div>
      {error && <div style={{ fontSize: 11, color: 'var(--color-red)', marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function NewClientModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ name: '', industry: '', direction: '', platforms: [], audience: '', goal: '', tone: '', avoid: '' });
  const [errors, setErrors] = useState({});
  const set = (k, v) => { setForm(prev => ({ ...prev, [k]: v })); if (errors[k]) setErrors(prev => ({ ...prev, [k]: null })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = '请输入客户名称';
    if (!form.industry) e.industry = '请选择行业';
    if (!form.direction.trim()) e.direction = '请输入内容方向';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const mockPlan = `## 运营策略概述\n基于${form.industry}行业特点和"${form.direction}"方向，建议采用内容矩阵+多平台分发策略。\n\n## 内容矩阵规划\n1. 知识科普类（40%）：行业干货、专业解读\n2. 产品种草类（30%）：使用体验、真实评测\n3. 互动引流类（20%）：话题讨论、用户共创\n4. 品牌故事类（10%）：品牌理念、幕后花絮\n\n## 发布节奏\n${form.platforms.map(p => `- ${p}：每周 3-4 条`).join('\n') || '- 待选择平台'}\n\n## 增长目标路径\n- 第1月：建立内容基线，测试方向\n- 第2-3月：优化内容，月增粉3k+\n- 第4-6月：稳定输出，启动转化`;

    onSubmit({
      id: Date.now(),
      name: form.name.trim(),
      industry: form.industry,
      direction: form.direction.trim(),
      avatar: form.name.trim()[0],
      accountCount: form.platforms.length,
      projectCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 7),
      platforms: form.platforms,
      accounts: form.platforms.map((p, i) => ({
        id: i + 1, platform: p, name: `@${form.name.trim()}`, keywords: [], style: '待设定', target: '', plan: '',
      })),
      digitalHumans: { avatars: [], voices: [] },
      profile: {
        audience: form.audience.trim() || '待完善',
        goal: form.goal.trim() || '待完善',
        tone: form.tone.trim() || '待完善',
        avoid: form.avoid.trim() || '待完善',
      },
      operationPlan: mockPlan,
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeInSoft 150ms ease' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', width: 520, maxHeight: '85vh', overflowY: 'auto', background: 'var(--glass-bg-heavy)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: 'var(--glass-border)', boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-xl)', animation: 'slideUp 250ms cubic-bezier(0.25,0.1,0.25,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 28px 18px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.4px' }}>新增客户</h2>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 4 }}>创建客户档案，自动生成 AI 运营方案</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)', transition: 'all var(--transition-fast)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = 'var(--color-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
          ><X size={16} /></button>
        </div>
        <div style={{ padding: '22px 28px 6px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>基本信息</div>
          <FormField label="客户名称" required>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="公司或品牌名称" style={{ ...inputStyle, borderColor: errors.name ? 'var(--color-red)' : undefined }} />
            {errors.name && <div style={{ fontSize: 11, color: 'var(--color-red)', marginTop: 4 }}>{errors.name}</div>}
          </FormField>
          <FormField label="所属行业" required>
            <TagSelector items={DEFAULT_INDUSTRIES} selected={form.industry} onSelect={v => set('industry', v)} error={errors.industry} customPlaceholder="输入自定义行业，回车添加" />
          </FormField>
          <FormField label="内容方向" required>
            <input value={form.direction} onChange={e => set('direction', e.target.value)} placeholder="核心定位，如「抗衰 / 成分党」" style={{ ...inputStyle, borderColor: errors.direction ? 'var(--color-red)' : undefined }} />
            {errors.direction && <div style={{ fontSize: 11, color: 'var(--color-red)', marginTop: 4 }}>{errors.direction}</div>}
          </FormField>
          <FormField label="运营平台">
            <TagSelector items={DEFAULT_PLATFORMS} selected={form.platforms} onSelect={v => set('platforms', v)} multiple customPlaceholder="输入自定义平台，回车添加" />
          </FormField>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 14, marginTop: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>客户档案（选填）</div>
          <FormField label="目标受众"><input value={form.audience} onChange={e => set('audience', e.target.value)} placeholder="如「25-40岁女性，注重品质」" style={inputStyle} /></FormField>
          <FormField label="运营目标"><input value={form.goal} onChange={e => set('goal', e.target.value)} placeholder="如「月增粉5k+，提升品牌专业度」" style={inputStyle} /></FormField>
          <FormField label="内容调性"><input value={form.tone} onChange={e => set('tone', e.target.value)} placeholder="如「专业、亲和、有科学依据」" style={inputStyle} /></FormField>
          <FormField label="规避方向"><input value={form.avoid} onChange={e => set('avoid', e.target.value)} placeholder="如「不做夸大宣传，不对比竞品」" style={inputStyle} /></FormField>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '16px 28px 22px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
          <button onClick={onClose} style={{ padding: '9px 20px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', background: 'rgba(255,255,255,0.5)', color: 'var(--color-text-secondary)', border: '1px solid rgba(0,0,0,0.06)', cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all var(--transition-fast)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.5)'}
          >取消</button>
          <PrimaryBtn onClick={handleSubmit}><Plus size={13} /> 创建客户</PrimaryBtn>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function ClientCenter({ onOpenProject, currentUser }) {
  const [selected, setSelected] = useState(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [localClients, setLocalClients] = useState(clients);
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const myProjects = isAdmin ? projects : projects.filter(p => p.assigneeId === currentUser?.id);
  const visibleClients = isAdmin ? localClients : localClients.filter(c => myProjects.some(p => p.clientId === c.id));
  const totalAccounts = visibleClients.reduce((s, c) => s + c.accountCount, 0);
  const totalAvatars = visibleClients.reduce((s, c) => { const dh = c.digitalHumans || { avatars: [], voices: [] }; return s + dh.avatars.length + dh.voices.length; }, 0);

  const handleCreateClient = (newClient) => {
    setLocalClients(prev => [...prev, newClient]);
    setShowNewClient(false);
  };

  const handleUpdateClient = (updated) => {
    setLocalClients(prev => prev.map(c => c.id === updated.id ? updated : c));
    setSelected(updated);
  };

  if (selected) {
    return <ClientDetail client={selected} onBack={() => setSelected(null)} onOpenProject={onOpenProject} onUpdateClient={handleUpdateClient} />;
  }

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} onSubmit={handleCreateClient} />}
      <PageHeader
        title="客户中心"
        subtitle={isAdmin ? '管理客户档案、账号与数字人形象' : '查看你负责的客户信息'}
        action={isAdmin ? <PrimaryBtn onClick={() => setShowNewClient(true)}><Plus size={14} /> 新增客户</PrimaryBtn> : null}
      />
      <div style={{ padding: '32px 40px', maxWidth: 1080 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32, animation: 'fadeIn 350ms ease' }}>
          {[
            { label: '服务客户', value: visibleClients.length },
            { label: '管理账号', value: totalAccounts },
            { label: '数字人形象', value: totalAvatars },
            { label: '运行项目', value: myProjects.length },
          ].map((s, i) => (
            <div key={i} style={{ ...glassCard, padding: '20px 22px', transition: 'all var(--transition-smooth)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-glass)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, animation: 'fadeIn 450ms ease' }}>
          {visibleClients.map(c => <ClientCard key={c.id} client={c} onClick={setSelected} />)}
        </div>
      </div>
    </div>
  );
}

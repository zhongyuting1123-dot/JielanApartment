import { Sparkles, FolderOpen, ArrowRight, Users, Zap, Send, AlertCircle, ChevronRight, TrendingUp } from 'lucide-react';
import { projects, statusConfig, platformColors, clients } from '../data/mockData';
import { GreetingIllustration, ActionIcon, CornerAccent, PlatformBadge } from '../components/Illustrations';

/* ── Glass Card wrapper ────────────────────────────────────────── */
const glassCard = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
  border: 'var(--glass-border)',
  boxShadow: 'var(--shadow-glass)',
  borderRadius: 'var(--radius-lg)',
};

export default function Dashboard({ onNav, currentUser }) {
  const isAdmin = currentUser?.role === 'admin';
  const myProjects = isAdmin ? projects : projects.filter(p => p.assigneeId === currentUser?.id);
  const recentProjects = myProjects.slice(0, 5);
  const myClients = isAdmin ? clients : clients.filter(c => myProjects.some(p => p.clientId === c.id));
  const productionCount = myProjects.filter(p => p.status === 'production').length;
  const completedCount = myProjects.filter(p => p.status === 'completed').length;
  const publishedCount = myProjects.filter(p => p.status === 'published').length;
  const draftCount = myProjects.filter(p => p.status === 'draft').length;

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      {/* Top greeting banner – glass surface */}
      <div style={{
        padding: '36px 40px 32px',
        background: 'var(--glass-bg-heavy)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 400 }}>2025-03-19 · 周三</span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.6px' }}>
            早上好，{currentUser?.name || '张运营'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginTop: 8, lineHeight: 1.6 }}>
            你有 <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{productionCount}</span> 个项目正在生产中，<span style={{ color: 'var(--color-green)', fontWeight: 600 }}>{completedCount}</span> 个已完成
          </p>
        </div>
        <GreetingIllustration size={100} />
      </div>

      <div style={{ padding: '32px 40px 48px', maxWidth: 1080 }}>
        {/* Stats Row – glass cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16,
          marginBottom: 32, animation: 'fadeIn 350ms ease',
        }}>
          {[
            { label: '服务客户', value: myClients.length, icon: <Users size={18} strokeWidth={1.8} />, color: 'var(--color-primary)', trend: null },
            { label: '进行中项目', value: productionCount, icon: <Zap size={18} strokeWidth={1.8} />, color: '#34C759', trend: null },
            { label: '已完成', value: completedCount, icon: <Send size={18} strokeWidth={1.8} />, color: '#5856D6', trend: null },
            { label: '已发布', value: publishedCount, icon: <AlertCircle size={18} strokeWidth={1.8} />, color: '#34C759', trend: null },
          ].map((s, i) => (
            <div key={i} style={{
              ...glassCard,
              padding: '22px',
              transition: 'all var(--transition-smooth)',
              cursor: 'default', position: 'relative', overflow: 'hidden',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-glass)'; e.currentTarget.style.transform = 'none'; }}
            >
              <CornerAccent color={s.color} />
              <ActionIcon icon={s.icon} color={s.color} />
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-1px' }}>{s.value}</span>
                {s.trend && (
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp size={10} /> {s.trend}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Entry – glass cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
          marginBottom: 36, animation: 'fadeIn 450ms ease',
        }}>
          <QuickCard
            onClick={() => onNav('clients')}
            icon={<FolderOpen size={22} strokeWidth={1.5} />}
            title="新建项目"
            desc="前往客户中心，选择客户创建新项目"
            accent
          />
          <QuickCard
            onClick={() => onNav('studio')}
            icon={<Sparkles size={22} strokeWidth={1.5} />}
            title="进入生产"
            desc="直接跳入创作工作台，开始内容创作"
          />
        </div>

        {/* Recent Projects – glass table */}
        <div style={{ animation: 'fadeIn 550ms ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>最近项目</h3>
            <button
              onClick={() => onNav('studio')}
              style={{ fontSize: 13, color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >查看全部</button>
          </div>
          <div style={{
            ...glassCard,
            overflow: 'hidden',
          }}>
            {recentProjects.map((p, idx) => {
              const s = statusConfig[p.status];
              return (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 20px',
                  borderBottom: idx < recentProjects.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                  transition: 'background var(--transition-fast)', cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => onNav('studio')}
                >
                  <PlatformBadge platform={p.platform} size={24} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>{p.clientName}</div>
                  </div>
                  {isAdmin && p.assigneeName && (
                    <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginRight: 8 }}>{p.assigneeName}</span>
                  )}
                  <StatusBadge status={p.status} />
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', minWidth: 66, textAlign: 'right' }}>{p.updatedAt}</span>
                  <ChevronRight size={14} color="var(--color-text-quaternary)" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickCard({ onClick, icon, title, desc, accent }) {
  return (
    <div onClick={onClick} style={{
      background: accent ? 'var(--color-text)' : 'var(--glass-bg)',
      backdropFilter: accent ? 'none' : 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
      WebkitBackdropFilter: accent ? 'none' : 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
      border: accent ? 'none' : 'var(--glass-border)',
      boxShadow: accent ? 'var(--shadow-lg)' : 'var(--shadow-glass)',
      borderRadius: 'var(--radius-xl)',
      padding: '28px',
      cursor: 'pointer',
      transition: 'all var(--transition-smooth)',
      position: 'relative', overflow: 'hidden',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = accent ? '0 12px 40px rgba(0,0,0,0.2)' : 'var(--shadow-lg)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = accent ? 'var(--shadow-lg)' : 'var(--shadow-glass)'; }}
    >
      {/* Decorative gradient orb */}
      {accent && <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 120, height: 120, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,113,227,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />}
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: accent ? 'rgba(255,255,255,0.1)' : 'var(--color-primary-bg)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: accent ? '#FFFFFF' : 'var(--color-primary)',
        marginBottom: 16,
      }}>{icon}</div>
      <div style={{ fontSize: 16, fontWeight: 600, color: accent ? '#FFFFFF' : 'var(--color-text)', marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: accent ? 'rgba(255,255,255,0.55)' : 'var(--color-text-secondary)', lineHeight: 1.6 }}>{desc}</div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
        <ArrowRight size={16} color={accent ? 'rgba(255,255,255,0.4)' : 'var(--color-text-quaternary)'} />
      </div>
    </div>
  );
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

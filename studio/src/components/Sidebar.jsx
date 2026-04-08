import { useState } from 'react';
import { FileText, BarChart2, Video, MessageCircle, Clock, Search, PenLine, GitCompare, Users2, TrendingUp, DollarSign, Building2, ChevronDown, Sparkles } from 'lucide-react';
import { users, roleConfig } from '../data/mockData';

/* ── Navigation structure matching 选品助手 ─────────────────────── */

const navGroups = [
  {
    label: '工具',
    items: [
      { id: 'listing-gen',   icon: FileText,    label: 'Listing 生成' },
      { id: 'listing-score', icon: BarChart2,   label: 'Listing 打分' },
      { id: 'studio',        icon: Video,        label: '数字人视频' },
      { id: 'ai-create',     icon: Sparkles,     label: 'AI 创作' },
      { id: 'selection',     icon: BarChart2,    label: '选品打分' },
      { id: 'ai-chat',       icon: MessageCircle, label: 'AI 问一问', dot: 'blue' },
    ],
  },
  {
    label: '记录',
    items: [
      { id: 'history', icon: Clock, label: '历史记录' },
    ],
  },
  {
    label: 'AGENTS',
    items: [
      { id: 'agent-market',    icon: Search,       label: '市场研究员', dot: 'blue' },
      { id: 'agent-listing',   icon: PenLine,      label: 'Listing 写手' },
      { id: 'agent-review',    icon: GitCompare,    label: '评分分析师' },
      { id: 'agent-compete',   icon: Users2,        label: '竞品监控员', dot: 'orange' },
      { id: 'agent-trend',     icon: TrendingUp,    label: '趋势预测师' },
      { id: 'agent-price',     icon: DollarSign,    label: '定价优化师' },
      { id: 'agent-social',    icon: MessageCircle, label: '社媒运营员', dot: 'blue' },
    ],
  },
  {
    label: 'COMPANY',
    items: [
      { id: 'clients', icon: Building2, label: '客户管理' },
    ],
  },
];

export default function Sidebar({ active, onNav, currentUser, onSwitchUser }) {
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      height: '100vh',
      background: '#FFFFFF',
      borderRight: '1px solid #F0F0F0',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #4A90D9, #5B6FD6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(74,144,217,0.25)',
          }}>
            <span style={{ color: '#FFF', fontSize: 16, fontWeight: 700 }}>⬡</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.3px' }}>选品助手</div>
            <div style={{ fontSize: 11, color: '#AEAEB2', marginTop: 1 }}>Cross-Border Selection</div>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto' }}>
        {navGroups.map((group, gi) => (
          <div key={group.label} style={{ marginBottom: 8 }}>
            {/* Group label */}
            <div style={{
              fontSize: 10, fontWeight: 600, color: '#AEAEB2',
              padding: `${gi === 0 ? '4' : '12'}px 10px 6px`,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {group.label}
            </div>

            {group.items.map(({ id, icon: Icon, label, dot }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onNav(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 9,
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: 1,
                    background: isActive ? 'rgba(0, 113, 227, 0.08)' : 'transparent',
                    color: isActive ? '#0071E3' : '#6E6E73',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'inherit',
                    transition: 'all 150ms ease',
                    textAlign: 'left',
                    letterSpacing: '-0.01em',
                    position: 'relative',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.025)';
                      e.currentTarget.style.color = '#1D1D1F';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#6E6E73';
                    }
                  }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.6} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {dot && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: dot === 'blue' ? '#0071E3' : '#FF9F0A',
                      flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom status bar */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid #F0F0F0', position: 'relative' }}>
        {/* User / AI status */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 10px', borderRadius: 8,
            cursor: 'pointer', transition: 'background 150ms ease',
          }}
          onClick={() => (currentUser.role === 'admin' || currentUser.role === 'superadmin') && setShowSwitcher(!showSwitcher)}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.025)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34C759', flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 500, color: '#0071E3', flex: 1 }}>AI 运行中</span>
          <span style={{ fontSize: 11, color: '#AEAEB2' }}>14:19</span>
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', gap: 14, padding: '6px 10px 2px', fontSize: 11, color: '#AEAEB2' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0071E3' }} /> AI 引擎在线
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0071E3' }} /> Amazon API
          </span>
        </div>

        {/* User switcher dropdown */}
        {showSwitcher && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 10, right: 10,
            marginBottom: 4, background: '#FFFFFF',
            border: '1px solid #F0F0F0', boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
            borderRadius: 10, overflow: 'hidden',
            animation: 'fadeIn 150ms ease', zIndex: 100,
          }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 600, color: '#AEAEB2', letterSpacing: '0.06em', textTransform: 'uppercase' }}>切换用户视角</div>
            {users.map(u => (
              <div key={u.id} onClick={() => { onSwitchUser(u); setShowSwitcher(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', cursor: 'pointer',
                background: currentUser.id === u.id ? 'rgba(0,113,227,0.06)' : 'transparent',
                transition: 'background 150ms ease',
              }}
                onMouseEnter={e => { if (currentUser.id !== u.id) e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
                onMouseLeave={e => { if (currentUser.id !== u.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#FFF', fontWeight: 600,
                }}>{u.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1D1D1F' }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: '#AEAEB2' }}>{roleConfig[u.role]?.label}</div>
                </div>
                {currentUser.id === u.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0071E3' }} />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Version */}
      <div style={{ padding: '4px 18px 12px', fontSize: 10, color: '#C7C7CC', textAlign: 'right' }}>
        选品助手 · v2.5 · 2024
      </div>
    </aside>
  );
}

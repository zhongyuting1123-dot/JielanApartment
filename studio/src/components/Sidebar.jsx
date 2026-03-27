import { useState } from 'react';
import { LayoutDashboard, Users, Sparkles, BarChart2, Settings, LogOut, ChevronDown, Box } from 'lucide-react';
import { users, roleConfig } from '../data/mockData';

const nav = [
  { id: 'dashboard', icon: LayoutDashboard, label: '工作台' },
  { id: 'clients',   icon: Users,           label: '客户中心' },
  { id: 'studio',    icon: Sparkles,        label: '创作工作台' },
  { id: 'analytics', icon: BarChart2,       label: '数据看板' },
  { id: 'settings',  icon: Settings,        label: '设置' },
];

const toolNav = [
  { id: 'toolbox', icon: Box, label: 'AI 工具箱' },
];

export default function Sidebar({ active, onNav, currentUser, onSwitchUser }) {
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <aside style={{
      width: 240,
      minWidth: 240,
      height: '100vh',
      background: 'var(--glass-bg-heavy)',
      backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
      WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
      borderRight: 'var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      overflowY: 'auto',
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ padding: '28px 20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'var(--color-text)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}>
            <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 700, letterSpacing: '-0.5px' }}>广</span>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>Content Studio</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)', letterSpacing: '0.02em', marginTop: 1 }}>广创云</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)', padding: '8px 10px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          导航
        </div>
        {nav.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                background: isActive
                  ? 'rgba(0, 113, 227, 0.10)'
                  : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'inherit',
                transition: 'all 150ms ease',
                textAlign: 'left',
                letterSpacing: '-0.01em',
                backdropFilter: isActive ? 'blur(8px)' : 'none',
                WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.7} />
              <span>{label}</span>
            </button>
          );
        })}

        {/* Separator + AI Toolbox */}
        <div style={{ margin: '10px 10px 6px', borderTop: '1px solid rgba(0,0,0,0.06)' }} />
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)', padding: '4px 10px 6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          AI 应用
        </div>
        {toolNav.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                cursor: 'pointer',
                marginBottom: 2,
                background: isActive
                  ? 'rgba(0, 113, 227, 0.10)'
                  : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                fontFamily: 'inherit',
                transition: 'all 150ms ease',
                textAlign: 'left',
                letterSpacing: '-0.01em',
                backdropFilter: isActive ? 'blur(8px)' : 'none',
                WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                  e.currentTarget.style.color = 'var(--color-text)';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2 : 1.7} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 12px 16px', borderTop: '1px solid rgba(0,0,0,0.04)', position: 'relative' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 10,
          transition: 'background 150ms ease',
          cursor: 'pointer',
        }}
          onClick={() => (currentUser.role === 'admin' || currentUser.role === 'superadmin') && setShowSwitcher(!showSwitcher)}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}88)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#FFFFFF', fontWeight: 600,
            boxShadow: `0 2px 6px ${currentUser.color}33`,
          }}>{currentUser.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{currentUser.name}</span>
              <span style={{
                fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-full)',
                background: roleConfig[currentUser.role]?.bg || 'rgba(0,0,0,0.04)',
                color: roleConfig[currentUser.role]?.color || 'var(--color-text-secondary)',
                fontWeight: 500,
              }}>{roleConfig[currentUser.role]?.label || '成员'}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>{currentUser.department}</div>
          </div>
          {(currentUser.role === 'admin' || currentUser.role === 'superadmin') && <ChevronDown size={12} color="var(--color-text-tertiary)" style={{ transition: 'transform 150ms ease', transform: showSwitcher ? 'rotate(180deg)' : 'rotate(0)' }} />}
        </div>

        {/* User switcher dropdown (admin only) */}
        {showSwitcher && (
          <div style={{
            position: 'absolute', bottom: '100%', left: 12, right: 12,
            marginBottom: 4,
            background: 'var(--glass-bg-heavy)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: 'var(--glass-border)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            animation: 'fadeIn 150ms ease',
            zIndex: 100,
          }}>
            <div style={{ padding: '10px 14px 6px', fontSize: 10, fontWeight: 600, color: 'var(--color-text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>切换用户视角</div>
            {users.map(u => (
              <div key={u.id} onClick={() => { onSwitchUser(u); setShowSwitcher(false); }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', cursor: 'pointer',
                background: currentUser.id === u.id ? 'var(--color-primary-bg)' : 'transparent',
                transition: 'background 150ms ease',
              }}
                onMouseEnter={e => { if (currentUser.id !== u.id) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={e => { if (currentUser.id !== u.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#FFFFFF', fontWeight: 600,
                }}>{u.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)' }}>{roleConfig[u.role]?.label || '成员'}</div>
                </div>
                {currentUser.id === u.id && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

import { useState } from 'react';
import { Users, Shield, User, FolderOpen, UserPlus, Phone, Lock, X, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { users as initialUsers, projects, permissionModules, roleConfig } from '../data/mockData';

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

function getProjectCount(userId) {
  return projects.filter(p => p.assigneeId === userId).length;
}

/* ─── Toggle Switch ──────────────────────────────────────────── */

function Toggle({ checked, onChange, disabled }) {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: checked ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 200ms ease',
        position: 'relative',
        flexShrink: 0,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <div style={{
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#FFFFFF',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
        position: 'absolute',
        top: 2,
        left: checked ? 20 : 2,
        transition: 'left 200ms ease',
      }} />
    </div>
  );
}

/* ─── Main Settings Component ────────────────────────────────── */

export default function Settings({ currentUser, userList, onUpdateUsers }) {
  const isSuperAdmin = currentUser.role === 'superadmin';
  const isAdmin = currentUser.role === 'admin';

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 300ms ease' }}>
      {/* Header */}
      <div style={{
        ...glassHeader,
        padding: '28px 36px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Shield size={18} color="var(--color-text)" strokeWidth={1.8} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px', margin: 0 }}>设置</h1>
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
          {isSuperAdmin ? '系统管理 · 账号与权限控制' : isAdmin ? '管理团队成员与项目分配' : '查看个人信息与项目'}
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 36px 36px', overflowY: 'auto' }}>
        {isSuperAdmin
          ? <SuperAdminView currentUser={currentUser} userList={userList} onUpdateUsers={onUpdateUsers} />
          : isAdmin
            ? <AdminView currentUser={currentUser} userList={userList} />
            : <MemberView currentUser={currentUser} />
        }
      </div>
    </div>
  );
}

/* ─── Super Admin View ───────────────────────────────────────── */

function SuperAdminView({ currentUser, userList, onUpdateUsers }) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleTogglePermission = (userId, moduleKey) => {
    const updated = userList.map(u => {
      if (u.id === userId && u.role !== 'superadmin') {
        return {
          ...u,
          permissions: { ...u.permissions, [moduleKey]: !u.permissions[moduleKey] },
        };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleChangeRole = (userId, newRole) => {
    const updated = userList.map(u => {
      if (u.id === userId && u.role !== 'superadmin') {
        return { ...u, role: newRole };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleToggleActive = (userId) => {
    const updated = userList.map(u => {
      if (u.id === userId && u.role !== 'superadmin') {
        return { ...u, active: u.active === false ? true : false };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleAddUser = (newUser) => {
    const nextId = Math.max(...userList.map(u => u.id)) + 1;
    const colors = ['#5856D6', '#AF52DE', '#FF2D55', '#007AFF', '#5AC8FA', '#FF9500'];
    const color = colors[nextId % colors.length];
    const user = {
      id: nextId,
      name: newUser.name,
      role: 'member',
      avatar: newUser.name.charAt(0),
      department: newUser.department || '广创部',
      color,
      phone: newUser.phone,
      permissions: { ai_toolbox: true, digital_ops: true },
    };
    onUpdateUsers([...userList, user]);
    setShowAddModal(false);
  };

  // Exclude superadmin from list display — they manage but aren't managed
  const managedUsers = userList.filter(u => u.role !== 'superadmin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Section: Account Management */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>账号管理</span>
            <span style={{
              fontSize: 11, color: 'var(--color-text-tertiary)',
              background: 'rgba(0,0,0,0.04)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 500,
            }}>{managedUsers.length} 个账号</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--color-text)',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <UserPlus size={14} strokeWidth={2} />
            添加账号
          </button>
        </div>

        {/* Account Table */}
        <div style={{ ...glassCard, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 130px 120px 80px ' + permissionModules.map(() => '100px').join(' '),
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            background: 'rgba(0,0,0,0.01)',
            gap: 8,
          }}>
            <span style={thStyle}>成员</span>
            <span style={thStyle}>手机号</span>
            <span style={thStyle}>角色</span>
            <span style={{ ...thStyle, textAlign: 'center' }}>状态</span>
            {permissionModules.map(m => (
              <span key={m.key} style={{ ...thStyle, textAlign: 'center' }}>{m.label}</span>
            ))}
          </div>

          {/* Table rows */}
          {managedUsers.map((u, i) => {
            const isActive = u.active !== false;
            return (
            <div key={u.id} style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 130px 120px 80px ' + permissionModules.map(() => '100px').join(' '),
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < managedUsers.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none',
              transition: 'background 150ms ease',
              gap: 8,
              opacity: isActive ? 1 : 0.5,
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Name + avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: '#FFFFFF', fontWeight: 600,
                  boxShadow: `0 2px 6px ${u.color}33`,
                  flexShrink: 0,
                }}>{u.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 1 }}>{u.department}</div>
                </div>
              </div>

              {/* Phone — 不隐藏 */}
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                {u.phone || '—'}
              </div>

              {/* Role dropdown */}
              <div>
                <select
                  value={u.role}
                  onChange={e => handleChangeRole(u.id, e.target.value)}
                  style={{
                    padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                    fontSize: 11, fontWeight: 500, fontFamily: 'inherit',
                    border: '1px solid rgba(0,0,0,0.08)',
                    background: 'rgba(255,255,255,0.6)',
                    color: roleConfig[u.role]?.color || 'var(--color-text)',
                    cursor: 'pointer', outline: 'none',
                    transition: 'border-color var(--transition-fast)',
                  }}
                >
                  <option value="admin">管理员</option>
                  <option value="member">成员</option>
                </select>
              </div>

              {/* Active toggle */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <Toggle
                  checked={isActive}
                  onChange={() => handleToggleActive(u.id)}
                />
              </div>

              {/* Permission toggles */}
              {permissionModules.map(m => (
                <div key={m.key} style={{ display: 'flex', justifyContent: 'center' }}>
                  <Toggle
                    checked={u.permissions?.[m.key] ?? true}
                    onChange={() => handleTogglePermission(u.id, m.key)}
                    disabled={!isActive}
                  />
                </div>
              ))}
            </div>
            );
          })}
        </div>
      </div>

      {/* Permission legend */}
      <div style={{ ...glassCard, padding: '16px 20px' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 10 }}>权限模块说明</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {permissionModules.map(m => (
            <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-primary)',
                flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text)', minWidth: 80 }}>{m.label}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{m.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add user modal */}
      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} onAdd={handleAddUser} />}
    </div>
  );
}

/* ─── Add User Modal ─────────────────────────────────────────── */

function AddUserModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('广创部');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = '请输入姓名';
    if (!/^1\d{10}$/.test(phone)) e.phone = '请输入正确的手机号';
    if (password.length < 6) e.password = '密码至少 6 位';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onAdd({ name: name.trim(), phone, password, department });
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.25)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      animation: 'fadeIn 200ms ease',
    }} onClick={onClose}>
      <div style={{
        width: 420,
        background: 'var(--glass-bg-heavy)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: 'var(--glass-border)',
        boxShadow: 'var(--shadow-xl)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        animation: 'fadeIn 250ms ease',
      }} onClick={e => e.stopPropagation()}>
        {/* Modal header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>添加账号</div>
            <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>新成员默认拥有全部模块权限</div>
          </div>
          <button onClick={onClose} style={{
            width: 28, height: 28, borderRadius: '50%',
            border: 'none', background: 'rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'background 150ms ease',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
          >
            <X size={14} color="var(--color-text-secondary)" />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <FormField label="姓名" error={errors.name}>
            <input
              value={name} onChange={e => setName(e.target.value)}
              placeholder="输入成员姓名"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
          </FormField>

          <FormField label="手机号" error={errors.phone}>
            <div style={{ position: 'relative' }}>
              <Phone size={14} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                placeholder="输入 11 位手机号"
                style={{ ...inputStyle, paddingLeft: 34 }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
              />
            </div>
          </FormField>

          <FormField label="初始密码" error={errors.password}>
            <div style={{ position: 'relative' }}>
              <Lock size={14} color="var(--color-text-tertiary)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="至少 6 位"
                style={{ ...inputStyle, paddingLeft: 34, paddingRight: 38 }}
                onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
              />
              <button onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {showPwd
                  ? <EyeOff size={14} color="var(--color-text-tertiary)" />
                  : <Eye size={14} color="var(--color-text-tertiary)" />
                }
              </button>
            </div>
          </FormField>

          <FormField label="部门">
            <input
              value={department} onChange={e => setDepartment(e.target.value)}
              placeholder="部门名称"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}
            />
          </FormField>
        </div>

        {/* Modal footer */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', gap: 10,
          padding: '16px 24px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(0,0,0,0.01)',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF',
            fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 150ms ease',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'}
          >取消</button>
          <button onClick={handleSubmit} style={{
            padding: '8px 24px', borderRadius: 'var(--radius-sm)',
            border: 'none', background: 'var(--color-text)',
            fontSize: 13, fontWeight: 600, color: '#FFFFFF',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'opacity 150ms ease',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >确认添加</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin View (unchanged logic) ───────────────────────────── */

function AdminView({ currentUser, userList }) {
  const displayUsers = userList.filter(u => u.role !== 'superadmin');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Users size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>团队管理</span>
          <span style={{
            fontSize: 11, color: 'var(--color-text-tertiary)',
            background: 'rgba(0,0,0,0.04)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 500,
          }}>{displayUsers.length} 人</span>
        </div>

        <div style={{ ...glassCard, overflow: 'hidden' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 100px 120px 100px',
            padding: '12px 20px',
            borderBottom: '1px solid rgba(0,0,0,0.04)',
            background: 'rgba(0,0,0,0.01)',
          }}>
            <span style={thStyle}>成员</span>
            <span style={thStyle}>角色</span>
            <span style={thStyle}>部门</span>
            <span style={{ ...thStyle, textAlign: 'right' }}>负责项目</span>
          </div>

          {displayUsers.map((u, i) => {
            const projectCount = getProjectCount(u.id);
            return (
              <div key={u.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 120px 100px',
                padding: '14px 20px',
                alignItems: 'center',
                borderBottom: i < displayUsers.length - 1 ? '1px solid rgba(0,0,0,0.03)' : 'none',
                transition: 'background 150ms ease',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${u.color}, ${u.color}88)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: '#FFFFFF', fontWeight: 600,
                    boxShadow: `0 2px 6px ${u.color}33`,
                    flexShrink: 0,
                  }}>{u.avatar}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</div>
                    {currentUser.id === u.id && (
                      <div style={{ fontSize: 10, color: 'var(--color-text-tertiary)', marginTop: 1 }}>当前用户</div>
                    )}
                  </div>
                </div>
                <div><RoleBadge role={u.role} /></div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{u.department}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                  <FolderOpen size={13} color="var(--color-text-tertiary)" strokeWidth={1.7} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{projectCount}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>个</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Member View ────────────────────────────────────────────── */

function MemberView({ currentUser }) {
  const myProjectCount = getProjectCount(currentUser.id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 520 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <User size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>我的信息</span>
        </div>

        <div style={{ ...glassCard, padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `linear-gradient(135deg, ${currentUser.color}, ${currentUser.color}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#FFFFFF', fontWeight: 600,
              boxShadow: `0 2px 8px ${currentUser.color}33`,
            }}>{currentUser.avatar}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>{currentUser.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                <RoleBadge role={currentUser.role} />
                <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{currentUser.department}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <InfoRow label="姓名" value={currentUser.name} />
            <InfoRow label="角色" value={roleConfig[currentUser.role]?.label || '成员'} />
            <InfoRow label="部门" value={currentUser.department} />
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <FolderOpen size={15} color="var(--color-text-secondary)" strokeWidth={1.8} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', letterSpacing: '-0.2px' }}>我的项目</span>
        </div>

        <div style={{ ...glassCard, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-sm)',
              background: 'var(--color-primary-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FolderOpen size={20} color="var(--color-primary)" strokeWidth={1.7} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>{myProjectCount}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>个负责项目</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Shared sub-components ──────────────────────────────────── */

function RoleBadge({ role }) {
  const cfg = roleConfig[role] || roleConfig.member;
  return (
    <span style={{
      fontSize: 11, padding: '2px 8px', borderRadius: 'var(--radius-full)',
      background: cfg.bg,
      color: cfg.color,
      fontWeight: 500,
    }}>{cfg.label}</span>
  );
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text)', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: 11, color: '#FF3B30', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
      <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)', width: 60, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

/* ─── Shared styles ──────────────────────────────────────────── */

const thStyle = {
  fontSize: 11, fontWeight: 600, color: 'var(--color-text-tertiary)', letterSpacing: '0.04em',
};

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid rgba(0,0,0,0.08)',
  background: 'rgba(255,255,255,0.6)',
  fontSize: 13,
  color: 'var(--color-text)',
  fontFamily: 'inherit',
  outline: 'none',
  transition: 'border-color 150ms ease',
  boxSizing: 'border-box',
};

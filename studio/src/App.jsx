import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClientCenter from './pages/ClientCenter';
import CreativeStudio from './pages/CreativeStudio';
import AIToolbox from './pages/AIToolbox';
import Settings from './pages/Settings';
import { EmptyStateIllustration } from './components/Illustrations';
import { users } from './data/mockData';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [studioProjectId, setStudioProjectId] = useState(null);
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [userList, setUserList] = useState(users);

  const handleOpenProject = (id) => {
    setStudioProjectId(id);
    setPage('studio');
  };

  const handleNav = (id) => {
    setPage(id);
    if (id !== 'studio') setStudioProjectId(null);
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Sidebar active={page} onNav={handleNav} currentUser={currentUser} onSwitchUser={setCurrentUser} />
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {page === 'dashboard' && <Dashboard onNav={handleNav} currentUser={currentUser} />}
        {page === 'clients'   && <ClientCenter onOpenProject={handleOpenProject} currentUser={currentUser} />}
        {page === 'studio'    && (
          <CreativeStudio
            initialProjectId={studioProjectId}
            onClearProject={() => setStudioProjectId(null)}
            currentUser={currentUser}
          />
        )}
        {page === 'toolbox'   && <AIToolbox />}
        {page === 'analytics' && <Placeholder type="analytics" title="数据看板" desc="月度数据回收与复盘看板" />}
        {page === 'settings'  && <Settings currentUser={currentUser} userList={userList} onUpdateUsers={setUserList} />}
      </main>
    </div>
  );
}

function Placeholder({ type, title, desc }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8, animation: 'fadeIn 300ms ease',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        padding: '48px 56px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
        WebkitBackdropFilter: 'blur(var(--glass-blur)) saturate(var(--glass-saturate))',
        border: 'var(--glass-border)',
        boxShadow: 'var(--shadow-glass)',
        borderRadius: 'var(--radius-xl)',
      }}>
        <div style={{ marginBottom: 4 }}>
          <EmptyStateIllustration type={type} size={140} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{desc}</div>
        <div style={{
          fontSize: 11, color: 'var(--color-primary)', marginTop: 8,
          padding: '5px 14px',
          background: 'var(--color-primary-bg)',
          borderRadius: 'var(--radius-full)',
          fontWeight: 500,
        }}>即将上线</div>
      </div>
    </div>
  );
}

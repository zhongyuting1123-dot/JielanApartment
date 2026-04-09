import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ClientCenter from './pages/ClientCenter';
import CreativeStudio from './pages/CreativeStudio';
import AIToolbox from './pages/AIToolbox';
import AICreate from './pages/AICreate';
import Settings from './pages/Settings';
import SocialAgent from './pages/SocialAgent';
import { EmptyStateIllustration } from './components/Illustrations';
import { users } from './data/mockData';

export default function App() {
  const [page, setPage] = useState('listing-score');
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

  /* Pages from 广创云 that are fully implemented */
  const gcPages = {
    studio: true,
    clients: true,
    toolbox: true,
    'ai-create': true,
    'agent-social': true,
  };

  /* Placeholder info for pages from 选品助手 (not yet implemented) */
  const placeholders = {
    'listing-gen':     { title: 'Listing 生成', desc: 'AI 智能生成高转化 Listing 文案' },
    'listing-score':   { title: 'Listing 打分', desc: '粘贴 Listing 全文，AI 按 A10 / COSMO / Rufus / IDQ 四维 100 分制评分' },
    'selection':       { title: '选品打分', desc: '多维度数据分析，AI 智能选品评估' },
    'ai-chat':         { title: 'AI 问一问', desc: '跨境电商全能 AI 助手' },
    'history':         { title: '历史记录', desc: '查看所有 AI 操作历史' },
    'agent-market':    { title: '市场研究员', desc: 'AI Agent 自动市场调研与竞品分析' },
    'agent-listing':   { title: 'Listing 写手', desc: 'AI Agent 自动撰写高转化 Listing' },
    'agent-review':    { title: '评分分析师', desc: 'AI Agent 自动分析评论与评分趋势' },
    'agent-compete':   { title: '竞品监控员', desc: 'AI Agent 持续监控竞品动态变化' },
    'agent-trend':     { title: '趋势预测师', desc: 'AI Agent 预测市场趋势和销售走向' },
    'agent-price':     { title: '定价优化师', desc: 'AI Agent 动态定价策略优化' },
    'agent-social':    { title: '社媒运营员', desc: 'AI Agent 自动管理社交媒体运营策略' },
    'dashboard':       { title: '工作台', desc: '综合数据概览与运营工作台' },
    'analytics':       { title: '数据看板', desc: '月度数据回收与复盘看板' },
    'settings':        { title: '设置', desc: '系统配置与团队管理' },
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', background: '#F8F9FA' }}>
      <Sidebar active={page} onNav={handleNav} currentUser={currentUser} onSwitchUser={setCurrentUser} />
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
        {/* 广创云 fully implemented pages */}
        {page === 'clients' && <ClientCenter onOpenProject={handleOpenProject} currentUser={currentUser} />}
        {page === 'studio' && (
          <CreativeStudio
            initialProjectId={studioProjectId}
            onClearProject={() => setStudioProjectId(null)}
            currentUser={currentUser}
          />
        )}
        {page === 'toolbox' && <AIToolbox />}
        {page === 'ai-create' && <AICreate />}
        {page === 'agent-social' && <SocialAgent />}
        {page === 'settings' && <Settings currentUser={currentUser} userList={userList} onUpdateUsers={setUserList} />}

        {/* Placeholder for 选品助手 existing pages & new Agent pages */}
        {!gcPages[page] && page !== 'settings' && placeholders[page] && (
          <Placeholder title={placeholders[page].title} desc={placeholders[page].desc} />
        )}
      </main>
    </div>
  );
}

function Placeholder({ title, desc }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8, animation: 'fadeIn 300ms ease',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        padding: '48px 56px',
        background: '#FFFFFF',
        border: '1px solid #F0F0F0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        borderRadius: 16,
      }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.5px' }}>{title}</div>
        <div style={{ fontSize: 13, color: '#6E6E73', maxWidth: 280, textAlign: 'center', lineHeight: 1.6 }}>{desc}</div>
        <div style={{
          fontSize: 11, color: '#0071E3', marginTop: 8,
          padding: '5px 14px',
          background: 'rgba(0,113,227,0.06)',
          borderRadius: 9999,
          fontWeight: 500,
        }}>即将上线</div>
      </div>
    </div>
  );
}

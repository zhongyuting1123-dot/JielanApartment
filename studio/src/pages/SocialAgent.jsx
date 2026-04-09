import { useState } from 'react';
import { Target, Rocket, Coins, FileText, ChevronRight, ExternalLink, Clock } from 'lucide-react';

/* ─── mock data ─── */
const stats = [
  { label: '已完成项目', value: '32', sub: '本月 +8', icon: Target, color: '#0071E3' },
  { label: '已发布项目', value: '24', sub: '发布率 75%', icon: Rocket, color: '#34C759' },
  { label: 'Token 用量', value: '1.2M', sub: '本月消耗', icon: Coins, color: '#FF9500' },
  { label: '累计生成内容', value: '156', sub: '口播 + 文案 + 分镜 + 图片', icon: FileText, color: '#AF52DE' },
];

const recentProjects = [
  { client: '盛禾美学', topic: '烟酰胺3个真相', platform: '抖音', status: '生产中', statusColor: '#0071E3' },
  { client: '盛禾种草', topic: '春季护肤必备好物', platform: '小红书', status: '已发布', statusColor: '#34C759', publishTime: '2026-04-08 19:30', publishLink: 'https://www.xiaohongshu.com/explore/abc123' },
  { client: 'JielanApt', topic: '公寓投资指南', platform: 'TikTok', status: '草稿', statusColor: '#8E8E93' },
  { client: '盛禾美学', topic: '成分党必看', platform: '抖音', status: '已完成', statusColor: '#6E6E73' },
  { client: '盛禾种草', topic: '敏感肌急救', platform: '小红书', status: '已发布', statusColor: '#34C759', publishTime: '2026-04-06 20:15', publishLink: 'https://www.xiaohongshu.com/explore/def456' },
];

/* ─── Platform badge colors ─── */
const platformColors = {
  '抖音': '#1D1D1F',
  '小红书': '#FF2D55',
  'TikTok': '#1D1D1F',
  '视频号': '#07C160',
  'B站': '#00A1D6',
  '快手': '#FF4906',
};

export default function SocialAgent() {
  return (
    <div style={{ flex: 1, overflow: 'auto', animation: 'fadeIn 250ms ease' }}>
      {/* Header */}
      <div style={{
        padding: '28px 40px',
        borderBottom: '1px solid #F0F0F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1D1D1F', margin: 0, letterSpacing: '-0.4px' }}>
            社媒运营员
          </h1>
          <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 4 }}>
            Social Media Operator · 模型: Gemini 3.1 Pro
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#8E8E93' }}>最近运行: 3分钟前</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#FF3B30',
            padding: '3px 10px', borderRadius: 9999,
            background: 'rgba(255,59,48,0.08)',
            letterSpacing: '0.5px',
          }}>LIVE</span>
        </div>
      </div>

      <div style={{ padding: '28px 40px', maxWidth: 1100 }}>
        {/* Agent Card */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '20px 24px',
          background: '#FFFFFF',
          border: '1px solid #F0F0F0',
          borderRadius: 14,
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          marginBottom: 24,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'linear-gradient(135deg, #0071E3, #34AADC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Target size={24} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1D1D1F' }}>社媒运营员</div>
            <div style={{ fontSize: 12, color: '#8E8E93', marginTop: 2 }}>
              Social Media Operator · 模型: Gemini 3.1 Pro
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14,
          marginBottom: 28,
        }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              padding: '20px 22px',
              background: '#FFFFFF',
              border: '1px solid #F0F0F0',
              borderRadius: 14,
              boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: '#8E8E93', fontWeight: 500 }}>{s.label}</span>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${s.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <s.icon size={14} color={s.color} />
                </div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1D1D1F', letterSpacing: '-0.5px' }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#8E8E93', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #F0F0F0',
          borderRadius: 14,
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 22px',
            borderBottom: '1px solid #F5F5F5',
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#8E8E93' }}>近期项目</span>
          </div>
          {recentProjects.map((p, i) => (
            <div key={i} style={{
              padding: '14px 22px',
              borderBottom: i < recentProjects.length - 1 ? '1px solid #F8F8F8' : 'none',
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: p.statusColor,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: '#1D1D1F', fontWeight: 500 }}>
                    {p.client}
                  </span>
                  <span style={{ fontSize: 13, color: '#6E6E73' }}>·</span>
                  <span style={{ fontSize: 13, color: '#6E6E73' }}>{p.topic}</span>
                  <span style={{ fontSize: 13, color: '#6E6E73' }}>·</span>
                  <span style={{
                    fontSize: 11, padding: '2px 8px', borderRadius: 6,
                    background: `${platformColors[p.platform] || '#1D1D1F'}10`,
                    color: platformColors[p.platform] || '#1D1D1F',
                    fontWeight: 500,
                  }}>{p.platform}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500,
                    padding: '3px 10px', borderRadius: 6,
                    background: p.status === '生产中' ? 'rgba(0,113,227,0.08)' :
                               p.status === '已发布' ? 'rgba(52,199,89,0.08)' :
                               p.status === '草稿' ? 'rgba(0,0,0,0.04)' :
                               'rgba(0,0,0,0.04)',
                    color: p.statusColor,
                  }}>{p.status}</span>
                  <ChevronRight size={14} color="#C7C7CC" />
                </div>
              </div>
              {p.status === '已发布' && (p.publishTime || p.publishLink) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8, marginLeft: 19 }}>
                  {p.publishTime && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#8E8E93' }}>
                      <Clock size={10} /> {p.publishTime}
                    </span>
                  )}
                  {p.publishLink && (
                    <a href={p.publishLink} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#0071E3', textDecoration: 'none' }}
                      onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      <ExternalLink size={10} /> 查看发布内容
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

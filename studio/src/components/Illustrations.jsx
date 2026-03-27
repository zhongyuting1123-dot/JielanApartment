// ─── Apple-style SVG Illustrations & Decorative Elements ─────────────────────

// Abstract wave decoration for headers
export function WaveDecor({ width = 200, height = 60, color = 'var(--color-primary)' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 200 60" fill="none" style={{ opacity: 0.07 }}>
      <path d="M0 30C20 10 40 50 60 30C80 10 100 50 120 30C140 10 160 50 180 30C190 20 200 25 200 30V60H0V30Z" fill={color} />
      <path d="M0 40C25 20 50 55 75 35C100 15 125 55 150 35C175 15 200 40 200 40V60H0V40Z" fill={color} opacity="0.5" />
    </svg>
  );
}

// Dashboard greeting illustration - abstract composition
export function GreetingIllustration({ size = 120 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle */}
      <circle cx="60" cy="60" r="56" fill="var(--color-bg-secondary)" />
      {/* Abstract shapes */}
      <rect x="35" y="30" width="24" height="24" rx="6" fill="var(--color-primary)" opacity="0.12" />
      <rect x="40" y="35" width="24" height="24" rx="6" fill="var(--color-primary)" opacity="0.2" />
      <circle cx="72" cy="42" r="14" fill="var(--color-primary)" opacity="0.08" />
      {/* Chart bars */}
      <rect x="36" y="68" width="8" height="20" rx="2" fill="var(--color-primary)" opacity="0.15" />
      <rect x="48" y="58" width="8" height="30" rx="2" fill="var(--color-primary)" opacity="0.25" />
      <rect x="60" y="63" width="8" height="25" rx="2" fill="var(--color-primary)" opacity="0.18" />
      <rect x="72" y="52" width="8" height="36" rx="2" fill="var(--color-primary)" opacity="0.3" />
      {/* Sparkle */}
      <circle cx="88" cy="34" r="3" fill="var(--color-primary)" opacity="0.35" />
      <circle cx="30" cy="55" r="2" fill="var(--color-primary)" opacity="0.2" />
    </svg>
  );
}

// Empty state illustration for placeholder pages
export function EmptyStateIllustration({ type = 'default', size = 140 }) {
  if (type === 'analytics') {
    return (
      <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
        <circle cx="70" cy="70" r="64" fill="var(--color-bg-secondary)" />
        {/* Pie chart */}
        <path d="M70 30A40 40 0 0 1 110 70H70V30Z" fill="var(--color-primary)" opacity="0.2" />
        <path d="M110 70A40 40 0 0 1 70 110V70H110Z" fill="var(--color-primary)" opacity="0.12" />
        <path d="M70 110A40 40 0 0 1 30 70H70V110Z" fill="var(--color-primary)" opacity="0.08" />
        <path d="M30 70A40 40 0 0 1 70 30V70H30Z" fill="var(--color-primary)" opacity="0.15" />
        <circle cx="70" cy="70" r="16" fill="var(--color-bg-elevated)" />
        {/* Trend line */}
        <path d="M25 100L45 90L60 95L80 78L100 82L115 68" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        {/* Dots */}
        <circle cx="45" cy="90" r="2.5" fill="var(--color-primary)" opacity="0.25" />
        <circle cx="80" cy="78" r="2.5" fill="var(--color-primary)" opacity="0.25" />
        <circle cx="115" cy="68" r="2.5" fill="var(--color-primary)" opacity="0.25" />
      </svg>
    );
  }
  if (type === 'settings') {
    return (
      <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
        <circle cx="70" cy="70" r="64" fill="var(--color-bg-secondary)" />
        {/* Gear outer */}
        <path d="M70 35L75 42L83 38L84 47L93 48L89 56L97 61L91 67L96 75L87 76L87 85L78 82L73 90L67 83L60 88L57 79L48 80L50 71L42 66L49 60L45 52L54 51L55 42L63 45L70 35Z"
          fill="var(--color-primary)" opacity="0.1" stroke="var(--color-primary)" strokeWidth="1" strokeOpacity="0.12" />
        <circle cx="70" cy="65" r="12" fill="var(--color-bg-elevated)" stroke="var(--color-primary)" strokeWidth="1" strokeOpacity="0.1" />
        {/* Toggle switches */}
        <rect x="40" y="95" width="28" height="10" rx="5" fill="var(--color-primary)" opacity="0.15" />
        <circle cx="60" cy="100" r="4" fill="var(--color-primary)" opacity="0.25" />
        <rect x="75" y="95" width="28" height="10" rx="5" fill="var(--color-text-quaternary)" opacity="0.3" />
        <circle cx="82" cy="100" r="4" fill="var(--color-text-tertiary)" opacity="0.4" />
      </svg>
    );
  }
  // default
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none">
      <circle cx="70" cy="70" r="64" fill="var(--color-bg-secondary)" />
      <rect x="42" y="38" width="56" height="64" rx="8" fill="var(--color-bg-elevated)" stroke="var(--color-primary)" strokeWidth="1" strokeOpacity="0.1" />
      <rect x="50" y="50" width="28" height="3" rx="1.5" fill="var(--color-primary)" opacity="0.2" />
      <rect x="50" y="58" width="40" height="3" rx="1.5" fill="var(--color-primary)" opacity="0.1" />
      <rect x="50" y="66" width="35" height="3" rx="1.5" fill="var(--color-primary)" opacity="0.1" />
      <rect x="50" y="78" width="20" height="8" rx="4" fill="var(--color-primary)" opacity="0.15" />
    </svg>
  );
}

// Quick action card icon with decorative background
export function ActionIcon({ icon, color = 'var(--color-primary)', bg }) {
  return (
    <div style={{
      width: 44, height: 44, borderRadius: 12,
      background: bg || `color-mix(in srgb, ${color} 8%, transparent)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      <div style={{ color, display: 'flex' }}>{icon}</div>
    </div>
  );
}

// Client avatar with gradient and pattern
export function ClientAvatar({ letter, size = 40, colorIndex = 0 }) {
  const palettes = [
    { bg: 'linear-gradient(135deg, #1D1D1F 0%, #3A3A3C 100%)', text: '#FFFFFF' },
    { bg: 'linear-gradient(135deg, #0071E3 0%, #34AADC 100%)', text: '#FFFFFF' },
    { bg: 'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)', text: '#FFFFFF' },
    { bg: 'linear-gradient(135deg, #FF6482 0%, #FF2D55 100%)', text: '#FFFFFF' },
    { bg: 'linear-gradient(135deg, #34C759 0%, #30D158 100%)', text: '#FFFFFF' },
  ];
  const p = palettes[colorIndex % palettes.length];
  const radius = size > 44 ? 14 : size > 36 ? 10 : 8;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: p.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.38, color: p.text, fontWeight: 600,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Subtle pattern overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.8) 0%, transparent 50%)',
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{letter}</span>
    </div>
  );
}

// Digital human placeholder illustration
export function DigitalHumanIllustration({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Head */}
      <circle cx="16" cy="11" r="6" fill="var(--color-primary)" opacity="0.15" />
      {/* Body */}
      <path d="M8 28C8 22.477 11.582 18 16 18C20.418 18 24 22.477 24 28" fill="var(--color-primary)" opacity="0.1" />
      {/* AI sparkle */}
      <path d="M23 7L24.5 4L26 7L29 8.5L26 10L24.5 13L23 10L20 8.5L23 7Z" fill="var(--color-primary)" opacity="0.25" />
    </svg>
  );
}

// Stat card decorative corner accent
export function CornerAccent({ color = 'var(--color-primary)', position = 'topRight' }) {
  const isRight = position.includes('Right');
  const isTop = position.includes('top');
  return (
    <div style={{
      position: 'absolute',
      [isTop ? 'top' : 'bottom']: 0,
      [isRight ? 'right' : 'left']: 0,
      width: 40, height: 40,
      overflow: 'hidden',
      opacity: 0.06,
      pointerEvents: 'none',
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx={isRight ? 40 : 0} cy={isTop ? 0 : 40} r="36" fill={color} />
      </svg>
    </div>
  );
}

// Platform icon badges
export function PlatformBadge({ platform, size = 20 }) {
  const configs = {
    '抖音': { bg: '#1D1D1F', letter: '抖' },
    '小红书': { bg: '#FF2D55', letter: '红' },
    '视频号': { bg: '#34C759', letter: '视' },
    'B站': { bg: '#FF6482', letter: 'B' },
  };
  const c = configs[platform] || { bg: 'var(--color-text-secondary)', letter: '?' };
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25,
      background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, color: '#FFFFFF', fontWeight: 600,
    }}>{c.letter}</div>
  );
}

// Section divider with label
export function SectionDivider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 16px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--color-separator)' }} />
      {label && <span style={{ fontSize: 11, color: 'var(--color-text-tertiary)', letterSpacing: '0.05em', whiteSpace: 'nowrap', fontWeight: 500 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--color-separator)' }} />
    </div>
  );
}

// Tool icon with background
export function ToolIcon({ icon, active = false }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 8,
      background: active ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: active ? '#FFFFFF' : 'var(--color-text-secondary)',
      transition: 'all 150ms ease',
    }}>
      {icon}
    </div>
  );
}

// Production step indicator
export function StepIndicator({ step, total, active = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === step ? 16 : 6, height: 6,
          borderRadius: 3,
          background: i === step ? 'var(--color-primary)' : i < step ? 'var(--color-primary)' : 'var(--color-border-light)',
          opacity: i <= step ? 1 : 0.5,
          transition: 'all 200ms ease',
        }} />
      ))}
    </div>
  );
}

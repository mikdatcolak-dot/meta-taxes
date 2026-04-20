// Rockads Web App — Shared Components
// Load with <script type="text/babel" src="Components.jsx">

const COLORS = {
  primary: '#007CE1',
  primaryDark: '#004A87',
  primarySoft: '#E5F1FF',
  primaryBorder: '#CCE5F9',
  secondary: '#009A6D',
  neutral900: '#151B26',
  neutral700: '#4B5061',
  neutral500: '#747A8E',
  neutral400: '#898FA5',
  neutral200: '#E5E9EF',
  neutral100: '#F7F9FB',
  success: '#05CC85',
  successBg: '#EDFFF9',
  successText: '#007A4F',
  error: '#E13023',
  errorBg: '#FFE7E6',
  errorText: '#BF1E12',
  warning: '#F3CD02',
  warningBg: '#FCF8DE',
  warningText: '#705E00',
};

const sidebarStyles = {
  sidebar: {
    width: 230, minWidth: 230, height: '100%',
    background: '#fff', borderRight: `1px solid ${COLORS.neutral200}`,
    display: 'flex', flexDirection: 'column',
    fontFamily: "'Red Hat Display', sans-serif",
    flexShrink: 0,
  },
  logoArea: {
    padding: '16px 20px 14px',
    borderBottom: `1px solid ${COLORS.neutral200}`,
  },
  logoText: {
    fontSize: 20, fontWeight: 700, color: COLORS.primary, letterSpacing: '-0.02em',
  },
  navItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 20px', fontSize: 13, fontWeight: active ? 600 : 500,
    color: active ? COLORS.primary : COLORS.neutral700,
    background: active ? COLORS.primarySoft : 'transparent',
    cursor: 'pointer', userSelect: 'none',
    borderLeft: active ? `3px solid ${COLORS.primary}` : '3px solid transparent',
  }),
  subItem: (active) => ({
    padding: '6px 20px 6px 48px', fontSize: 12, fontWeight: 500,
    color: active ? COLORS.primary : COLORS.neutral500,
    background: active ? COLORS.primarySoft : 'transparent',
    cursor: 'pointer', userSelect: 'none',
  }),
  divider: { height: 1, background: COLORS.neutral200, margin: '6px 0' },
  sectionFooter: { marginTop: 'auto', borderTop: `1px solid ${COLORS.neutral200}`, padding: '12px 20px' },
};

// Icon placeholder — simple SVG squares representing icon positions
function Icon({ name, size = 16, color = 'currentColor' }) {
  const icons = {
    dashboard: 'M3 3h7v7H3zm8 0h7v7h-7zM3 11h7v7H3zm8 0h7v7h-7z',
    accounts: 'M20 7H4a2 2 0 00-2 2v8a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-16-2h16V4H4v1z',
    credit: 'M3 6a2 2 0 012-2h14a2 2 0 012 2v2H3V6zm0 4h18v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6z',
    clients: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    automations: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    ads: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77',
    billing: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    reports: 'M18 20V10M12 20V4M6 20v-6',
    settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
    bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0',
    search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
    plus: 'M12 5v14M5 12h14',
    chevronDown: 'M6 9l6 6 6-6',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
    arrowRight: 'M5 12h14M12 5l7 7-7 7',
    close: 'M6 18L18 6M6 6l12 12',
    menu: 'M4 6h16M4 12h16M4 18h16',
    user: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z',
  };
  const d = icons[name] || icons.dashboard;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Sidebar({ active, onNav }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'ad-accounts', label: 'Ad Accounts', icon: 'accounts' },
    { id: 'credit-accounts', label: 'Credit Accounts', icon: 'credit' },
    { id: 'clients', label: 'Clients', icon: 'clients' },
    { id: 'automations', label: 'Ad Automations', icon: 'automations' },
    null,
    { id: 'ads-manager', label: 'Ads Manager', icon: 'ads', badge: 'New' },
    { id: 'billing', label: 'Billing', icon: 'billing', sub: ['Invoices', 'Receipts'] },
    { id: 'reports', label: 'Reports', icon: 'reports' },
    { id: 'settings', label: 'Settings', icon: 'settings', sub: ['Account Settings', 'Invoice Information', 'User Management'] },
  ];

  const [openSub, setOpenSub] = React.useState(null);

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.logoArea}>
        <div style={sidebarStyles.logoText}>rockads</div>
      </div>
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {navItems.map((item, i) => {
          if (!item) return <div key={i} style={sidebarStyles.divider} />;
          const isActive = active === item.id;
          const hasSub = item.sub && item.sub.length > 0;
          const isOpen = openSub === item.id;
          return (
            <div key={item.id}>
              <div
                style={sidebarStyles.navItem(isActive)}
                onClick={() => {
                  onNav(item.id);
                  if (hasSub) setOpenSub(isOpen ? null : item.id);
                }}
              >
                <Icon name={item.icon} size={16} color={isActive ? COLORS.primary : COLORS.neutral500} />
                {item.label}
                {item.badge && (
                  <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 700, background: COLORS.error, color: '#fff', borderRadius: 4, padding: '2px 5px' }}>
                    {item.badge}
                  </span>
                )}
                {hasSub && (
                  <span style={{ marginLeft: 'auto', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                    <Icon name="chevronDown" size={12} color={COLORS.neutral500} />
                  </span>
                )}
              </div>
              {hasSub && isOpen && item.sub.map(s => (
                <div key={s} style={sidebarStyles.subItem(false)} onClick={() => onNav(item.id)}>
                  {s}
                </div>
              ))}
            </div>
          );
        })}
      </nav>
      <div style={sidebarStyles.sectionFooter}>
        <div style={{ fontSize: 11, color: COLORS.neutral400 }}>Rockads v2.4.1</div>
      </div>
    </div>
  );
}

function TopBar({ title, breadcrumb }) {
  return (
    <div style={{
      height: 56, background: '#fff', borderBottom: `1px solid ${COLORS.neutral200}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', flexShrink: 0,
    }}>
      <div style={{ fontFamily: "'Red Hat Display', sans-serif" }}>
        {breadcrumb ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: COLORS.neutral500, cursor: 'pointer' }}>{breadcrumb}</span>
            <Icon name="chevronDown" size={12} color={COLORS.neutral400} />
            <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.neutral900 }}>{title}</span>
          </div>
        ) : (
          <span style={{ fontSize: 18, fontWeight: 700, color: COLORS.neutral900 }}>{title}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <Icon name="bell" size={20} color={COLORS.neutral500} />
          <div style={{ position: 'absolute', top: -3, right: -3, width: 8, height: 8, background: COLORS.error, borderRadius: '50%', border: '1.5px solid #fff' }} />
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3CD02', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#705E00', cursor: 'pointer' }}>
          R
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Active:   { bg: COLORS.successBg, color: COLORS.successText, dot: COLORS.success },
    Banned:   { bg: COLORS.errorBg, color: COLORS.errorText, dot: COLORS.error },
    Pending:  { bg: COLORS.warningBg, color: COLORS.warningText, dot: COLORS.warning },
    Inactive: { bg: COLORS.neutral100, color: COLORS.neutral700, dot: COLORS.neutral400 },
  };
  const s = map[status] || map.Inactive;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

function PlatformIcon({ platform }) {
  const styles = {
    Meta:   { bg: '#1877F2', letter: 'M', color: '#fff' },
    Google: { bg: '#EA4335', letter: 'G', color: '#fff' },
    Snap:   { bg: '#FFFC00', letter: 'S', color: '#000' },
    TikTok: { bg: '#010101', letter: 'T', color: '#fff' },
    X:      { bg: '#000', letter: 'X', color: '#fff' },
  };
  const s = styles[platform] || { bg: COLORS.primarySoft, letter: platform?.[0] || '?', color: COLORS.primary };
  return (
    <span style={{ width: 24, height: 24, borderRadius: 4, background: s.bg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: s.color, flexShrink: 0 }}>
      {s.letter}
    </span>
  );
}

Object.assign(window, { COLORS, Icon, Sidebar, TopBar, StatusBadge, PlatformIcon });

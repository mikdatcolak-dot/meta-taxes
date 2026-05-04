// Rockads — Ad Account List

const AD_ACCOUNTS_DATA = [
  {
    id: '4521',
    name: '#4521 - Rockads Demo EU - PP - MTC',
    status: 'Active',
    balance: 5000.00,
    platform: 'Meta',
    bmId: '3195248127164882',
    creditAccount: 'Main Wallet',
    creditAccountId: '645722',
    taxData: [
      { date: '05.05.2026', country: 'DE', flag: '🇩🇪', countryName: 'Germany', spend: 5000.00, rate: 0.03, tax: 150.00 },
    ],
    adSpendData: [
      { spend: '$5.000,00', impression: 298700, clicks: 7920, ctr: '2.65%', reach: 275000, uniqueClicks: 7500, date: '05.05.2026' },
    ],
    effectiveTaxRate: 3.00,
  },
  {
    id: '8458',
    name: '#8458 - Rockads Test 01 - PP - RHK',
    status: 'Active',
    balance: 0.00,
    platform: 'Meta',
    bmId: '8847291034756123',
    creditAccount: 'Main Wallet',
    creditAccountId: '645722',
    taxData: [
      { date: '20.05.2026', country: 'AT', flag: '🇦🇹', countryName: 'Austria', spend: 5000.00, rate: 0.05, tax: 250.00 },
    ],
    adSpendData: [
      { spend: '$5.000,00', impression: 312400, clicks: 8640, ctr: '2.77%', reach: 290000, uniqueClicks: 8200, date: '20.05.2026' },
    ],
    effectiveTaxRate: 5.00,
  },
];

function AdAccountList({ onSelectAccount }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, fontFamily: "'Red Hat Display', sans-serif", overflowY: 'auto', height: '100%' }}>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1.5px solid ${COLORS.neutral200}`, borderRadius: 8, padding: '0 12px', height: 36, width: 240 }}>
            <Icon name="search" size={13} color={COLORS.neutral400} />
            <input placeholder="Search accounts..." style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: "'Red Hat Display', sans-serif", background: 'transparent', width: '100%', color: COLORS.neutral900 }} />
          </div>
        </div>
        <button style={{
          height: 36, padding: '0 16px', background: COLORS.primary, color: '#fff',
          border: 'none', borderRadius: 8, fontFamily: "'Red Hat Display', sans-serif",
          fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="plus" size={14} color="#fff" /> Add Account
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(21,27,38,0.06)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ACCOUNT NAME', 'PLATFORM', 'STATUS', 'BALANCE', 'META TAX', 'CREDIT ACCOUNT', 'ACTIONS'].map(h => (
                <th key={h} style={{ fontSize: 10, fontWeight: 700, color: COLORS.neutral500, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '10px 16px', textAlign: 'left', background: COLORS.neutral100, borderBottom: `1px solid ${COLORS.neutral200}`, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AD_ACCOUNTS_DATA.map((acc, i) => (
              <tr
                key={acc.id}
                onClick={() => onSelectAccount(acc)}
                style={{ borderBottom: `1px solid ${COLORS.neutral100}`, cursor: 'pointer', transition: 'background 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.background = COLORS.neutral100}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >
                {/* Account Name */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>{acc.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.neutral500, marginTop: 1 }}>BM ID: {acc.bmId}</div>
                    </div>
                  </div>
                </td>

                {/* Platform */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: '#1877F2' }}>
                    <span style={{ width: 16, height: 16, borderRadius: 3, background: '#1877F2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>M</span>
                    Meta
                  </span>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: COLORS.successBg, color: COLORS.successText }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.success }} />
                    Active
                  </span>
                </td>

                {/* Balance */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: acc.balance > 0 ? COLORS.neutral900 : COLORS.neutral400, fontFamily: "'Inter', sans-serif" }}>
                    ${acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </div>
                </td>

                {/* Meta Tax */}
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 4, background: '#FFF8E1', color: '#705E00', fontSize: 12, fontWeight: 700, border: '1px solid #F3CD0240' }}>
                    ~{acc.effectiveTaxRate.toFixed(1)}%
                  </span>
                </td>

                {/* Credit Account */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary }}>{acc.creditAccount}</div>
                  <div style={{ fontSize: 11, color: COLORS.neutral500 }}>ID: {acc.creditAccountId}</div>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 16px' }}>
                  <button
                    onClick={e => { e.stopPropagation(); onSelectAccount(acc); }}
                    style={{ height: 30, padding: '0 12px', background: COLORS.primarySoft, border: `1px solid ${COLORS.primaryBorder}`, borderRadius: 6, color: COLORS.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Red Hat Display', sans-serif" }}
                  >
                    View Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Object.assign(window, { AdAccountList, AD_ACCOUNTS_DATA });

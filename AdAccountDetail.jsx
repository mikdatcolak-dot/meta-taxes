// Rockads — Ad Account Detail (with Meta Taxes tab)

function AdAccountDetail({ account, onBack }) {
  const [activeTab, setActiveTab] = React.useState('Ad Spend');
  const tabs = ['Transactions', 'Settings', 'Additional Info', 'Ad Spend', 'Meta Taxes'];

  const TAX_SPEND_DATA = account?.taxData || [];
  const AD_SPEND_DATA = account?.adSpendData || [];

  // Trust score gauge
  const score = 62;
  const radius = 64, cx = 80, cy = 80;
  const startAngle = -210, endAngle = 30;
  const totalDeg = endAngle - startAngle;
  const filledDeg = (score / 100) * totalDeg;
  const toRad = d => (d * Math.PI) / 180;
  const arcPath = (start, end, r) => {
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  const totalTax = TAX_SPEND_DATA.reduce((s, r) => s + r.tax, 0);
  const totalSpend = TAX_SPEND_DATA.reduce((s, r) => s + r.spend, 0);
  const effectiveRate = totalSpend > 0 ? totalTax / totalSpend * 100 : 0;

  // Aggregate by country
  const byCountry = Object.values(
    TAX_SPEND_DATA.reduce((acc, row) => {
      if (!acc[row.country]) acc[row.country] = { ...row, spend: 0, tax: 0, count: 0 };
      acc[row.country].spend += row.spend;
      acc[row.country].tax += row.tax;
      acc[row.country].count++;
      return acc;
    }, {})
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, fontFamily: "'Red Hat Display', sans-serif", overflowY: 'auto', height: '100%' }}>
      {/* ── HEADER CARD ── */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(21,27,38,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {/* Meta logo */}
            <div style={{ width: 36, height: 36, borderRadius: 6, background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.neutral900 }}>{account?.name || '#0001 – Rockads B2B – CR'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 9999, fontSize: 12, fontWeight: 600, background: '#EDFFF9', color: '#007A4F' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#05CC85' }} />Active
                </span>
              </div>
              <div style={{ fontSize: 12, color: COLORS.neutral500 }}>BM ID: {account?.bmId || '—'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 12, color: COLORS.primary, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Ads Manager <Icon name="arrowRight" size={11} color={COLORS.primary} /></div>
              <div style={{ fontSize: 12, color: COLORS.primary, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>Credit Account: {account?.creditAccount || 'Main Wallet'} <Icon name="arrowRight" size={11} color={COLORS.primary} /></div>
              <div style={{ fontSize: 11, color: COLORS.neutral500 }}>ID: {account?.creditAccountId || '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.neutral100}` }}>
            <div style={{ fontSize: 12, color: COLORS.neutral500, marginBottom: 4 }}>Current balance</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontWeight: 700, color: COLORS.neutral900 }}>${(account?.balance ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
              <button style={{ height: 36, padding: '0 14px', background: COLORS.primary, border: 'none', borderRadius: 8, fontFamily: "'Red Hat Display', sans-serif", fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>+ Add Balance</button>
            </div>
            <div style={{ fontSize: 12, color: COLORS.primary, marginTop: 8, cursor: 'pointer', fontWeight: 500 }}>Transfer To Credit Account</div>
          </div>

          {/* Meta Tax notice inline */}
          <div style={{
            marginTop: 14, padding: '8px 12px',
            background: '#FFF8E1', border: '1px solid #F3CD0270', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 12, color: '#705E00',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F3CD02" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14l2 2 4-4"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              <span><strong>Meta Ad Tax applies</strong> to spend from this account — effective rate ~{effectiveRate.toFixed(2)}% across active countries.</span>
            </div>
            <span onClick={() => setActiveTab('Meta Taxes')} style={{ fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap', marginLeft: 12 }}>
              View Tax Breakdown →
            </span>
          </div>
        </div>

        {/* Trust Score */}
        <div style={{ width: 220, background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(21,27,38,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.neutral900, marginBottom: 8 }}>Trust Score</div>
          <svg width={160} height={110} viewBox="0 0 160 110">
            <path d={arcPath(startAngle, endAngle, radius)} stroke={COLORS.neutral200} strokeWidth={12} fill="none" strokeLinecap="round" />
            <path d={arcPath(startAngle, startAngle + filledDeg, radius)} stroke="#F3CD02" strokeWidth={12} fill="none" strokeLinecap="round" />
            <circle cx={cx + radius * Math.cos(toRad(startAngle + filledDeg))} cy={cy + radius * Math.sin(toRad(startAngle + filledDeg))} r={8} fill="#F3CD02" />
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLORS.neutral900} fontFamily="Red Hat Display">Medium</text>
          </svg>
          <div style={{ fontSize: 11, color: COLORS.neutral500, textAlign: 'center', lineHeight: 1.5 }}>
            This score is calculated based on key metrics such as your payment history, ad policy compliance, and account activity.
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(21,27,38,0.06)' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.neutral200}` }}>
          {tabs.map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{
              padding: '12px 20px', fontSize: 13, fontWeight: activeTab === t ? 600 : 500,
              color: activeTab === t ? (t === 'Meta Taxes' ? '#B45309' : COLORS.primary) : COLORS.neutral500,
              borderBottom: activeTab === t ? `2px solid ${t === 'Meta Taxes' ? '#F3CD02' : COLORS.primary}` : '2px solid transparent',
              cursor: 'pointer', marginBottom: -1,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {t === 'Meta Taxes' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={activeTab === t ? '#F3CD02' : COLORS.neutral400} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14l2 2 4-4"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              )}
              {t}
            </div>
          ))}
        </div>

        <div style={{ padding: 20 }}>
          {/* ── AD SPEND TAB ── */}
          {activeTab === 'Ad Spend' && (
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: COLORS.neutral100, border: `1.5px solid ${COLORS.neutral200}`, borderRadius: 8, padding: '0 12px', height: 36, flex: '0 0 200px' }}>
                  <Icon name="search" size={13} color={COLORS.neutral400} />
                  <input placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: "'Red Hat Display', sans-serif", background: 'transparent', width: '100%' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.neutral100, border: `1.5px solid ${COLORS.neutral200}`, borderRadius: 8, padding: '0 12px', height: 36, fontSize: 12, color: COLORS.neutral500, cursor: 'pointer' }}>
                  <Icon name="calendar" size={13} color={COLORS.neutral400} /> Select Date
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['SPEND', 'IMPRESSION', 'CLICKS', 'CTR', 'REACH', 'UNIQUE CLICKS', 'DATE'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 700, color: COLORS.neutral500, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px', textAlign: 'left', background: COLORS.neutral100, borderBottom: `1px solid ${COLORS.neutral200}` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AD_SPEND_DATA.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.neutral100}` }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: COLORS.neutral900, fontFamily: "'Inter', sans-serif" }}>{row.spend}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral700, fontFamily: "'Inter', sans-serif" }}>{row.impression}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral700, fontFamily: "'Inter', sans-serif" }}>{row.clicks}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral700, fontFamily: "'Inter', sans-serif" }}>{row.ctr}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral700, fontFamily: "'Inter', sans-serif" }}>{row.reach}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral700, fontFamily: "'Inter', sans-serif" }}>{row.uniqueClicks}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.neutral500, fontFamily: "'Inter', sans-serif" }}>{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── META TAXES TAB ── */}
          {activeTab === 'Meta Taxes' && (
            <div>
              {/* Summary cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                <div style={{ background: '#FFF8E1', border: '1px solid #F3CD02', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#705E00', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Tax Paid</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: '#B45309' }}>-${totalTax.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#92400E', marginTop: 4 }}>All time</div>
                </div>
                <div style={{ background: COLORS.neutral100, border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.neutral500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Taxed Spend</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.neutral900 }}>${totalSpend.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: COLORS.neutral500, marginTop: 4 }}>Across {byCountry.length} countries</div>
                </div>
                <div style={{ background: COLORS.neutral100, border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.neutral500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Effective Tax Rate</div>
                  <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.neutral900 }}>{effectiveRate.toFixed(2)}%</div>
                  <div style={{ fontSize: 11, color: COLORS.neutral500, marginTop: 4 }}>Weighted average</div>
                </div>
              </div>

              {/* Country summary */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.neutral900, marginBottom: 12 }}>By Country</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  {byCountry.map(row => (
                    <div key={row.country} style={{ border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 14, background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.neutral900 }}>{row.flag} {row.countryName}</span>
                        <span style={{ background: '#FFF8E1', color: '#705E00', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{(row.rate * 100).toFixed(1)}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.neutral500 }}>
                        <span>Spend: <strong style={{ color: COLORS.neutral900 }}>${row.spend.toFixed(2)}</strong></span>
                        <span>Tax: <strong style={{ color: '#B45309' }}>-${row.tax.toFixed(2)}</strong></span>
                      </div>
                      {/* mini bar */}
                      <div style={{ marginTop: 10, height: 4, background: COLORS.neutral200, borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${(row.tax / totalTax) * 100}%`, background: '#F3CD02', borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detail table */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.neutral900, marginBottom: 12 }}>Transaction Log</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['DATE', 'COUNTRY', 'AD SPEND', 'TAX RATE', 'TAX CHARGED'].map(h => (
                        <th key={h} style={{ fontSize: 10, fontWeight: 700, color: COLORS.neutral500, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px', textAlign: 'left', background: COLORS.neutral100, borderBottom: `1px solid ${COLORS.neutral200}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TAX_SPEND_DATA.map((row, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${COLORS.neutral100}` }}>
                        <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.neutral500, fontFamily: "'Inter', sans-serif" }}>{row.date}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>{row.flag} {row.countryName}</td>
                        <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral900, fontFamily: "'Inter', sans-serif" }}>${row.spend.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ background: '#FFF8E1', color: '#705E00', padding: '2px 8px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{(row.rate * 100).toFixed(1)}%</span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#B45309', fontFamily: "'Inter', sans-serif" }}>-${row.tax.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ borderTop: `2px solid ${COLORS.neutral200}`, background: COLORS.neutral100 }}>
                      <td colSpan={2} style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: COLORS.neutral900 }}>Total</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: COLORS.neutral900, fontFamily: "'Inter', sans-serif" }}>${totalSpend.toFixed(2)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.neutral500 }}>~{effectiveRate.toFixed(2)}% avg</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: '#B45309', fontFamily: "'Inter', sans-serif" }}>-${totalTax.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Other tabs */}
          {activeTab !== 'Ad Spend' && activeTab !== 'Meta Taxes' && (
            <div style={{ fontSize: 13, color: COLORS.neutral500, padding: '20px 0' }}>{activeTab} content</div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AdAccountDetail });

// Rockads — Credit Account Detail (with Meta Tax Block + Tax Transactions)

const TAX_RATES = {
  'AT': { name: 'Austria', flag: '🇦🇹', rate: 0.05 },
  'DE': { name: 'Germany', flag: '🇩🇪', rate: 0.03 },
  'GB': { name: 'United Kingdom', flag: '🇬🇧', rate: 0.02 },
  'FR': { name: 'France', flag: '🇫🇷', rate: 0.025 },
  'NL': { name: 'Netherlands', flag: '🇳🇱', rate: 0.02 },
  'ES': { name: 'Spain', flag: '🇪🇸', rate: 0.015 },
};

const TRANSACTIONS = [
  { date: '20.05.2026\n13:05', accountName: '#8458 - Rockads Test 01 - PP - RHK', kind: 'Meta Ad Tax', country: 'AT', amount: -100.00, tax: 0, commission: 0, actor: 'System', isTax: true },
  { date: '20.05.2026\n13:00', accountName: '#8458 - Rockads Test 01 - PP - RHK', kind: 'Meta Ad Tax', country: 'DE', amount: -90.00, tax: 0, commission: 0, actor: 'System', isTax: true },
  { date: '15.05.2026\n14:00', accountName: '#8458 - Rockads Test 01 - PP - RHK', kind: 'Withdraw From Ad Account', country: null, amount: +5000.00, tax: 0, commission: 0, actor: 'Mikdat Çolak', isTax: false },
  { date: '10.05.2026\n10:00', accountName: '#8458 - Rockads Test 01 - PP - RHK', kind: 'Transfer To Ad Account', country: null, amount: -10000.00, tax: 0, commission: 0, actor: 'Mikdat Çolak', isTax: false },
  { date: '05.05.2026\n11:30', accountName: '#4521 - Rockads Demo EU - PP - MTC', kind: 'Meta Ad Tax', country: 'DE', amount: -150.00, tax: 0, commission: 0, actor: 'System', isTax: true },
  { date: '01.05.2026\n09:00', accountName: '#4521 - Rockads Demo EU - PP - MTC', kind: 'Transfer To Ad Account', country: null, amount: -10000.00, tax: 0, commission: 0, actor: 'Mikdat Çolak', isTax: false },
];

function TaxBadge({ country }) {
  const info = TAX_RATES[country];
  if (!info) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 7px', borderRadius: 4,
      background: '#FFF8E1', color: '#705E00',
      fontSize: 11, fontWeight: 600, border: '1px solid #F3CD02',
    }}>
      {info.flag} {info.name} · {(info.rate * 100).toFixed(1)}%
    </span>
  );
}

function fmt(n) {
  if (n === 0) return '$0,00';
  const sign = n > 0 ? '+' : '';
  return sign + '$' + Math.abs(n).toFixed(2).replace('.', ',');
}

// 5% of transaction amount rule:
// Ad Account Transfer → block +5%  (reserve grows)
// Ad Spend           → actual tax deducted from block
// Withdraw           → block -5%  (reserve released on withdrawal)
const BLOCK_HISTORY = [
  { date: '20.05.2026', time: '13:00', type: 'Ad Spend',            account: '#8458 - Rockads Test 01 - PP - RHK', txAmount: 5000.00,  change: -250.00, balance: 250.00 },
  { date: '15.05.2026', time: '14:00', type: 'Withdraw',            account: '#8458 - Rockads Test 01 - PP - RHK', txAmount: 5000.00,  change: -250.00, balance: 500.00 },
  { date: '10.05.2026', time: '10:00', type: 'Ad Account Transfer', account: '#8458 - Rockads Test 01 - PP - RHK', txAmount: 10000.00, change: +500.00, balance: 750.00 },
  { date: '05.05.2026', time: '11:30', type: 'Ad Spend',            account: '#4521 - Rockads Demo EU - PP - MTC', txAmount: 5000.00,  change: -250.00, balance: 250.00 },
  { date: '01.05.2026', time: '09:00', type: 'Ad Account Transfer', account: '#4521 - Rockads Demo EU - PP - MTC', txAmount: 10000.00, change: +500.00, balance: 500.00 },
];

const TYPE_CONFIG = {
  'Ad Account Transfer': { color: '#DC2626', bg: '#FEE2E2' },
  'Ad Spend':            { color: '#16A34A', bg: '#DCFCE7' },
  'Withdraw':            { color: '#16A34A', bg: '#DCFCE7' },
};

function BlockHistoryModal({ onClose, blockedTax, available }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,27,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, width: 660, maxHeight: '82vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 50px rgba(21,27,38,0.25)', fontFamily: "'Red Hat Display', sans-serif" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E5E9EF', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#151B26' }}>Block History</div>
            <div style={{ fontSize: 12, color: '#747A8E', marginTop: 2 }}>Tax reserve changes — Main Wallet · ID: 645722</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <Icon name="close" size={18} color="#747A8E" />
          </button>
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '16px 24px', borderBottom: '1px solid #E5E9EF' }}>
          <div style={{ background: '#FFF8E1', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#705E00', marginBottom: 4, fontWeight: 600 }}>Current Block</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#B45309' }}>${blockedTax.toFixed(2)}</div>
          </div>
          <div style={{ background: '#F7F9FB', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#747A8E', marginBottom: 4, fontWeight: 600 }}>Available Balance</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#151B26' }}>${available.toFixed(2)}</div>
          </div>
          <div style={{ background: '#F7F9FB', borderRadius: 8, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#747A8E', marginBottom: 4, fontWeight: 600 }}>Total Entries</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#151B26' }}>{BLOCK_HISTORY.length}</div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 90px 90px 100px', gap: 12, padding: '8px 24px', background: '#F7F9FB', borderBottom: '1px solid #E5E9EF', alignItems: 'center' }}>
          <div />
          <div style={{ fontSize: 10, fontWeight: 700, color: '#747A8E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transaction</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#747A8E', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Tx Amount</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#747A8E', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Change</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', background: '#FFF8E1', borderRadius: 4, padding: '3px 8px' }}>Block Balance</div>
        </div>

        {/* History rows */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {BLOCK_HISTORY.map((entry, i) => {
            const isIncrease = entry.change > 0;
            const cfg = TYPE_CONFIG[entry.type] || TYPE_CONFIG['Ad Account Transfer'];
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 90px 90px 100px', gap: 12, padding: '12px 24px', borderBottom: '1px solid #F7F9FB', alignItems: 'center' }}>
                {/* Direction icon */}
                <div style={{ width: 32, height: 32, borderRadius: 8, background: isIncrease ? '#FEE2E2' : '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: isIncrease ? '#DC2626' : '#16A34A' }}>{isIncrease ? '↑' : '↓'}</span>
                </div>

                {/* Type + account + date */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#151B26' }}>{entry.type}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: cfg.bg, color: cfg.color }}>{entry.type === 'Ad Account Transfer' ? 'Transfer' : entry.type === 'Ad Spend' ? 'Spend' : 'Withdraw'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#747A8E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.account}
                  </div>
                  <div style={{ fontSize: 10, color: '#898FA5', marginTop: 1, fontFamily: "'Inter', sans-serif" }}>{entry.date} {entry.time}</div>
                </div>

                {/* Tx Amount */}
                <div style={{ textAlign: 'right', fontSize: 13, color: '#4B5061', fontFamily: "'Inter', sans-serif" }}>
                  ${entry.txAmount.toFixed(2)}
                </div>

                {/* Change */}
                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: isIncrease ? '#DC2626' : '#16A34A', fontFamily: "'Inter', sans-serif" }}>
                  {isIncrease ? '+' : '-'}${Math.abs(entry.change).toFixed(2)}
                </div>

                {/* Block Balance */}
                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: '#B45309', fontFamily: "'Inter', sans-serif", background: '#FFFBEB', borderRadius: 6, padding: '4px 8px' }}>
                  ${entry.balance.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CreditAccountDetail({ onSelectAdAccount }) {
  const [activeTab, setActiveTab] = React.useState('Transactions');
  const [filter, setFilter] = React.useState('all');
  const [taxModalOpen, setTaxModalOpen] = React.useState(false);
  const [blockHistoryOpen, setBlockHistoryOpen] = React.useState(false);

  const totalBalance = 84660.00;
  const blockedTax = 250.00;
  const available = totalBalance - blockedTax;

  const filtered = filter === 'tax'
    ? TRANSACTIONS.filter(t => t.isTax)
    : filter === 'transfers'
    ? TRANSACTIONS.filter(t => !t.isTax)
    : TRANSACTIONS;

  const taxBreakdown = Object.entries(TAX_RATES).map(([code, info]) => {
    const txs = TRANSACTIONS.filter(t => t.country === code);
    const total = txs.reduce((s, t) => s + Math.abs(t.amount), 0);
    return { code, ...info, total };
  }).filter(r => r.total > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 24, fontFamily: "'Red Hat Display', sans-serif", overflowY: 'auto', height: '100%' }}>

      {/* ── BALANCE HEADER CARD ── */}
      <div style={{ background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(21,27,38,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          {/* Left: balances */}
          <div style={{ display: 'flex', gap: 48 }}>
            {/* Available */}
            <div>
              <div style={{ fontSize: 12, color: COLORS.neutral500, marginBottom: 4, fontWeight: 500 }}>Available Balance</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.neutral900 }}>${available.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).replace('.', ',')}</div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: COLORS.neutral200, alignSelf: 'stretch' }} />
            {/* Blocked */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ fontSize: 12, color: '#705E00', fontWeight: 500 }}>Blocked (Tax Reserve)</div>
                <span onClick={() => setBlockHistoryOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', background: '#F3CD02', color: '#705E00', fontSize: 10, fontWeight: 800, cursor: 'pointer', userSelect: 'none' }}>↕</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#705E00' }}>
                ${blockedTax.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).replace('.', ',')}
              </div>
              <div style={{ fontSize: 11, color: COLORS.neutral400, marginTop: 3 }}>Reserved for Meta Ad Taxes</div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: COLORS.neutral200, alignSelf: 'stretch' }} />
            {/* Total */}
            <div>
              <div style={{ fontSize: 12, color: COLORS.neutral500, marginBottom: 4, fontWeight: 500 }}>Total Balance Amount</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.neutral400 }}>${totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 }).replace('.', ',')}</div>
            </div>
          </div>

          {/* Right: meta + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8 }}>
<button style={{
                height: 36, padding: '0 16px', background: COLORS.primary, color: '#fff',
                border: 'none', borderRadius: 8, fontFamily: "'Red Hat Display', sans-serif",
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>+ Add Balance</button>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 11, color: COLORS.neutral500 }}>
              <span>Credit Account ID: <strong style={{ color: COLORS.neutral700 }}>645722</strong></span>
              <span>Name: <strong style={{ color: COLORS.neutral700 }}>Main Wallet</strong></span>
            </div>
          </div>
        </div>

        {/* Tax Reserve Info Banner */}
        <div style={{
          marginTop: 16, padding: '10px 14px',
          background: COLORS.neutral100, border: `1px solid ${COLORS.neutral200}`, borderRadius: 6,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: 12, color: COLORS.neutral700, lineHeight: 1.5,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.neutral400} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>
            <strong style={{ color: COLORS.neutral900 }}>Meta Ad Tax Reserve Active:</strong> A portion of your balance is blocked to cover Meta's country-based ad taxation.
            Taxes are deducted automatically when ad spend is detected. <span onClick={() => setTaxModalOpen(true)} style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600, color: COLORS.primary }}>View breakdown →</span>
          </span>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ background: '#fff', border: `1px solid ${COLORS.neutral200}`, borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(21,27,38,0.06)' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${COLORS.neutral200}` }}>
          {['Transactions', 'Bank Transfers'].map(t => (
            <div key={t} onClick={() => setActiveTab(t)} style={{
              padding: '12px 20px', fontSize: 13, fontWeight: activeTab === t ? 600 : 500,
              color: activeTab === t ? COLORS.primary : COLORS.neutral500,
              borderBottom: activeTab === t ? `2px solid ${COLORS.primary}` : '2px solid transparent',
              cursor: 'pointer', marginBottom: -1,
            }}>{t}</div>
          ))}
        </div>

        {activeTab === 'Transactions' && (
          <div style={{ padding: 20 }}>
            {/* Filters + Search */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: COLORS.neutral100, border: `1.5px solid ${COLORS.neutral200}`, borderRadius: 8, padding: '0 12px', height: 36, flex: '0 0 220px' }}>
                <Icon name="search" size={13} color={COLORS.neutral400} />
                <input placeholder="Search" style={{ border: 'none', outline: 'none', fontSize: 12, fontFamily: "'Red Hat Display', sans-serif", background: 'transparent', width: '100%', color: COLORS.neutral900 }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: COLORS.neutral100, border: `1.5px solid ${COLORS.neutral200}`, borderRadius: 8, padding: '0 12px', height: 36, fontSize: 12, color: COLORS.neutral500, cursor: 'pointer' }}>
                <Icon name="calendar" size={13} color={COLORS.neutral400} />
                Select Date
              </div>
              {/* Kind filter pills */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {[['all', 'All'], ['tax', 'Meta Tax Only'], ['transfers', 'Transfers Only']].map(([val, label]) => (
                  <button key={val} onClick={() => setFilter(val)} style={{
                    height: 32, padding: '0 12px', borderRadius: 6,
                    border: `1.5px solid ${filter === val ? COLORS.primary : COLORS.neutral200}`,
                    background: filter === val ? COLORS.primarySoft : '#fff',
                    color: filter === val ? COLORS.primary : COLORS.neutral500,
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Red Hat Display', sans-serif",
                  }}>{label}</button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr>
                    {['TRANSACTION DATE', 'ACCOUNT NAME', 'KIND', 'COUNTRY / TAX', 'AMOUNT', 'TAX & FEES', 'COMMISSION', 'ACTOR', 'ACTIONS'].map(h => (
                      <th key={h} style={{ fontSize: 10, fontWeight: 700, color: COLORS.neutral500, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '8px 12px', textAlign: 'left', background: COLORS.neutral100, borderBottom: `1px solid ${COLORS.neutral200}`, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tx, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${COLORS.neutral100}`, background: tx.isTax ? '#FFFDF0' : '#fff' }}>
                      <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: "'Inter', sans-serif", color: COLORS.neutral500, whiteSpace: 'pre-line' }}>{tx.date}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>{tx.accountName}</div>
                        {tx.isTax && <div style={{ fontSize: 10, color: COLORS.neutral400 }}>Auto-deducted</div>}
                      </td>
<td style={{ padding: '10px 12px' }}>
                        {tx.isTax ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 4, background: '#FFF8E1', color: '#705E00', fontSize: 12, fontWeight: 600, border: '1px solid #F3CD0250' }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#F3CD02" strokeWidth="2.5"><path d="M9 14l2 2 4-4"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                            {tx.kind}
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 500, color: COLORS.neutral900 }}>{tx.kind}</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        {tx.country ? <TaxBadge country={tx.country} /> : <span style={{ fontSize: 12, color: COLORS.neutral300 }}>—</span>}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 700, color: tx.amount > 0 ? COLORS.successText : tx.isTax ? '#B45309' : COLORS.neutral900, fontFamily: "'Inter', sans-serif" }}>
                        {fmt(tx.amount)}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: COLORS.neutral500, fontFamily: "'Inter', sans-serif" }}>{fmt(tx.tax)}</td>
                      <td style={{ padding: '10px 12px', fontSize: 13, color: tx.commission !== 0 ? COLORS.neutral900 : COLORS.neutral400, fontFamily: "'Inter', sans-serif" }}>
                        {tx.commission !== 0 ? fmt(tx.commission) : '—'}
                      </td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.neutral700 }}>{tx.actor}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: COLORS.neutral400 }}>—</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Bank Transfers' && (
          <div style={{ padding: 40, textAlign: 'center', color: COLORS.neutral400, fontSize: 13 }}>No bank transfers to display.</div>
        )}
      </div>

      {/* ── BLOCK HISTORY MODAL ── */}
      {blockHistoryOpen && <BlockHistoryModal onClose={() => setBlockHistoryOpen(false)} blockedTax={blockedTax} available={available} />}

      {/* ── TAX RESERVE MODAL ── */}
      {taxModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,27,38,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setTaxModalOpen(false)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, width: 460, boxShadow: '0 20px 50px rgba(21,27,38,0.25)', fontFamily: "'Red Hat Display', sans-serif" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.neutral900 }}>Meta Ad Tax Rates</div>
                <div style={{ fontSize: 12, color: COLORS.neutral500, marginTop: 2 }}>Country-based rates applied to ad spend</div>
              </div>
              <button onClick={() => setTaxModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Icon name="close" size={18} color={COLORS.neutral500} />
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr>
                  {['Country', 'Tax Rate'].map(h => (
                    <th key={h} style={{ fontSize: 11, fontWeight: 600, color: COLORS.neutral500, textAlign: 'left', padding: '6px 10px', background: COLORS.neutral100, borderBottom: `1px solid ${COLORS.neutral200}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { flag: '🇦🇹', name: 'Austria',        rate: 0.05 },
                  { flag: '🇫🇷', name: 'France',         rate: 0.03 },
                  { flag: '🇮🇹', name: 'Italy',          rate: 0.03 },
                  { flag: '🇪🇸', name: 'Spain',          rate: 0.03 },
                  { flag: '🇹🇷', name: 'Türkiye',        rate: 0.05 },
                  { flag: '🇬🇧', name: 'United Kingdom', rate: 0.02 },
                ].map(row => (
                  <tr key={row.name} style={{ borderBottom: `1px solid ${COLORS.neutral100}` }}>
                    <td style={{ padding: '10px 10px', fontSize: 13, fontWeight: 600, color: COLORS.neutral900 }}>{row.flag} {row.name}</td>
                    <td style={{ padding: '10px 10px' }}>
                      <span style={{ background: '#FFF8E1', color: '#705E00', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{(row.rate * 100).toFixed(1)}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ background: '#F0F3F8', borderRadius: 8, padding: 12, fontSize: 12, color: COLORS.neutral700, lineHeight: 1.6 }}>
              <strong>How it works:</strong> Meta charges country-based taxes on ad spend. Rockads maintains a tax reserve on your credit account to ensure seamless tax payments. The blocked amount is released or adjusted based on actual spend.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CreditAccountDetail });

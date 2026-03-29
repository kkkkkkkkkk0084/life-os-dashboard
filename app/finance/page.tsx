export default function FinancePage() {
  const fixedCosts = [
    { label: '家賃', amount: 52000 },
    { label: '携帯', amount: 8000 },
    { label: 'ネット', amount: 5000 },
    { label: '電気', amount: 4000 },
    { label: 'ガス', amount: 3000 },
    { label: '水道', amount: 1700 },
    { label: '奨学金返済', amount: 7000 },
    { label: 'ヘアカット', amount: 6000 },
  ];
  const total = fixedCosts.reduce((sum, item) => sum + item.amount, 0);

  const largeExpenses = [
    { label: '学費', amount: 170000, date: '2026-03-23', done: true },
    { label: '賃貸更新', amount: 47000, date: '2026-04-24', done: false },
    { label: '火災保険', amount: 18000, date: '2026-05-27', done: false },
  ];

  return (
    <div>
      <h2 className="text-green-400 font-mono text-lg font-bold tracking-widest mb-6">▶ FINANCE STATUS</h2>

      {/* 固定費 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
        <h3 className="text-green-400 font-mono text-sm font-bold mb-4 tracking-widest">月間固定費</h3>
        <div className="space-y-2">
          {fixedCosts.map(({ label, amount }) => (
            <div key={label} className="flex justify-between items-center py-1 border-b border-gray-800">
              <span className="text-gray-400 font-mono text-sm">{label}</span>
              <span className="text-green-400 font-mono text-sm">¥{amount.toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 mt-2">
            <span className="text-white font-mono text-sm font-bold">合計</span>
            <span className="text-green-400 font-mono text-lg font-bold">¥{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 収入 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
        <h3 className="text-green-400 font-mono text-sm font-bold mb-4 tracking-widest">月間収入</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-mono text-sm">インターン（TOKIUM）</span>
          <span className="text-green-400 font-mono text-lg font-bold">¥200,000</span>
        </div>
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700">
          <span className="text-white font-mono text-sm font-bold">月間余剰</span>
          <span className="text-green-400 font-mono text-lg font-bold">¥{(200000 - total).toLocaleString()}</span>
        </div>
      </div>

      {/* 大型支出 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-yellow-400 font-mono text-sm font-bold mb-4 tracking-widest">⚠ 大型支出予定</h3>
        <div className="space-y-2">
          {largeExpenses.map(({ label, amount, date, done }) => (
            <div key={label} className={`flex justify-between items-center py-2 border-b border-gray-800 ${done ? 'opacity-40' : ''}`}>
              <div>
                <span className={`font-mono text-sm ${done ? 'line-through text-gray-500' : 'text-white'}`}>{label}</span>
                <span className="text-gray-500 font-mono text-xs ml-2">{date}</span>
              </div>
              <span className={`font-mono text-sm ${done ? 'text-gray-500' : 'text-yellow-400'}`}>¥{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

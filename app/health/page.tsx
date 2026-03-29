export default function HealthPage() {
  const exerciseMenu = [
    { day: '月', menu: '腕立て・腹筋・スクワット 20回×5セット' },
    { day: '火', menu: 'プランク 1分×5セット' },
    { day: '水', menu: '2km全力走' },
    { day: '木', menu: '腕立て・腹筋・スクワット 20回×5セット' },
    { day: '金', menu: 'プランク 1分×5セット' },
    { day: '土', menu: '2km全力走 or 長距離ウォーク' },
    { day: '日', menu: 'REST' },
  ];

  const mealPlan = [
    { label: '朝', menu: 'なし（プロテイン）' },
    { label: '昼', menu: 'ブロッコリー + キムチ + 納豆 + めかぶ + ごま油 + 豆腐' },
    { label: '夜', menu: 'ゆで卵 + プロテイン or 健康食（週2-3回外食OK）' },
  ];

  const today = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', weekday: 'short' }).replace('曜日', '');

  return (
    <div>
      <h2 className="text-blue-400 font-mono text-lg font-bold tracking-widest mb-6">▶ HEALTH STATUS</h2>

      {/* 運動メニュー */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-4">
        <h3 className="text-blue-400 font-mono text-sm font-bold mb-4 tracking-widest">週間運動メニュー</h3>
        <div className="space-y-2">
          {exerciseMenu.map(({ day, menu }) => (
            <div key={day} className={`flex items-center gap-3 py-2 border-b border-gray-800 ${day === today ? 'bg-blue-950 rounded px-2' : ''}`}>
              <span className={`font-mono text-sm font-bold w-4 ${day === today ? 'text-blue-400' : 'text-gray-500'}`}>{day}</span>
              <span className={`font-mono text-sm ${day === today ? 'text-white' : 'text-gray-400'}`}>{menu}</span>
              {day === today && <span className="text-blue-400 font-mono text-xs ml-auto">TODAY</span>}
            </div>
          ))}
        </div>
      </div>

      {/* 食事プラン */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h3 className="text-blue-400 font-mono text-sm font-bold mb-4 tracking-widest">固定食事プラン</h3>
        <div className="space-y-3">
          {mealPlan.map(({ label, menu }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-blue-400 font-mono text-xs font-bold w-4 mt-0.5">{label}</span>
              <span className="text-gray-400 font-mono text-sm">{menu}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-600 font-mono text-xs mt-4">月間食費目標: ¥8,000</p>
      </div>
    </div>
  );
}

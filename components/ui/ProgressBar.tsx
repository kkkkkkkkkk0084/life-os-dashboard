type Props = {
  value: number;
  max: number;
  color?: string;
  label?: string;
};

export default function ProgressBar({ value, max, color = '#00ff88', label }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs mb-1 font-mono">
          <span className="text-gray-400">{label}</span>
          <span style={{ color }}>{value}/{max}</span>
        </div>
      )}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

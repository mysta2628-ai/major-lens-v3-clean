export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-[#7a867c] mb-2">
        <span>Progress</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 bg-[#e7ebe3] rounded-full overflow-hidden">
        <div className="h-full bg-[#29443a] transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

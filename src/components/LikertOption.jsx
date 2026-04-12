export default function LikertOption({ label, value, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(value)}
      className={`rounded-[20px] border px-4 py-4 text-left transition w-full ${selected ? "border-[#29443a] bg-[#29443a] text-white" : "border-[#d9ddd5] bg-white text-[#486156] hover:bg-[#f8f8f4]"}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    </button>
  );
}

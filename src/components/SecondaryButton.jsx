export default function SecondaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-full border border-[#d1d7cd] bg-white px-6 py-3 text-sm font-medium text-[#29443a] transition hover:bg-[#f4f5f0]"
    >
      {children}
    </button>
  );
}

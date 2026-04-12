export default function PrimaryButton({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="rounded-full bg-[#29443a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#21352d]"
    >
      {children}
    </button>
  );
}

export default function Card({ children, className = "" }) {
  return (
    <div className={`rounded-[28px] border border-[#dfe3db] bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

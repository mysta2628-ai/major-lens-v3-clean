import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center justify-between rounded-full border border-[#dfe3db] bg-white px-6 py-4 shadow-sm">
        <Link to="/" className="text-lg font-semibold tracking-[-0.02em]">
          Major Lens
        </Link>

        <nav className="hidden gap-6 text-sm text-[#5f6d62] md:flex">
          <Link to="/assessment">Assessment</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/compare">Compare</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/next">Next Steps</Link>
        </nav>
      </div>
    </header>
  );
}

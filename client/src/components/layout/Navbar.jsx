import { Link } from "react-router-dom";
import { ROUTES } from "../../constants/routes.js";

export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={ROUTES.home} className="text-lg font-bold tracking-tight">
          FrameForge AI
        </Link>
        <div className="flex items-center gap-6 text-sm text-[var(--color-text-muted)]">
          <Link to={ROUTES.templates} className="hover:text-[var(--color-text)]">
            Templates
          </Link>
          <Link to={ROUTES.login} className="hover:text-[var(--color-text)]">
            Sign in
          </Link>
        </div>
      </nav>
    </header>
  );
}

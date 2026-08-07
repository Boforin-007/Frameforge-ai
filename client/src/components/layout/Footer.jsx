export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-6">
      <p className="text-center text-sm text-[var(--color-text-muted)]">
        &copy; {new Date().getFullYear()} FrameForge AI
      </p>
    </footer>
  );
}

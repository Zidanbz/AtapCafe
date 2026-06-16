type MobileShellProps = {
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
};

export function MobileShell({ children, className = "", flush = false }: MobileShellProps) {
  return (
    <main className="min-h-screen w-full px-0 py-0 text-[#231f1a] sm:flex sm:items-start sm:justify-center sm:px-6 sm:py-10">
      <section
        className={[
          "relative min-h-screen w-full max-w-[430px] overflow-hidden bg-[#f3f0ea] shadow-[0_32px_120px_rgba(0,0,0,0.58)] sm:min-h-[807px] sm:rounded-[28px]",
          flush ? "" : "pb-24",
          className,
        ].join(" ")}
      >
        {children}
      </section>
    </main>
  );
}

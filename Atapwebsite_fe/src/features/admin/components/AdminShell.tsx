import { AdminNav } from "@/features/admin/components/AdminNav";

type AdminShellProps = {
  children: React.ReactNode;
  flush?: boolean;
  navigation?: boolean;
};

export function AdminShell({ children, flush = false, navigation = false }: AdminShellProps) {
  return (
    <main className="min-h-screen bg-[#f3f0ea] text-[#231f1a]">
      <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${flush ? "" : "py-4 sm:py-6"}`}>
        {navigation ? <AdminNav /> : null}
        {children}
      </div>
    </main>
  );
}

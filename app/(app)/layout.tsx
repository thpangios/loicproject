import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(900px_420px_at_12%_-6%,rgba(198,154,86,0.08),transparent_58%),linear-gradient(180deg,rgba(29,48,77,0.42)_0%,rgba(17,30,51,0.22)_34%,rgba(10,19,36,0)_100%)]">
        <Topbar />
        <main className="flex-1 px-8 py-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

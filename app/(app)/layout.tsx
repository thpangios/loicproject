import { DemoDataBootstrap } from "@/components/demo-data-bootstrap";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg">
      <DemoDataBootstrap />
      <Sidebar />
      <div className="relative flex-1 min-w-0 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(860px_440px_at_12%_-6%,rgba(111,211,225,0.1),transparent_58%),radial-gradient(760px_440px_at_100%_-8%,rgba(215,155,71,0.12),transparent_54%),linear-gradient(180deg,rgba(29,48,77,0.32)_0%,rgba(9,18,33,0)_40%)]" />
        <div className="relative flex min-h-screen flex-col">
          <Topbar />
          <main className="flex-1 w-full max-w-[1480px] mx-auto px-5 py-6 md:px-8 md:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

import { TopNav } from "@/components/app/top-nav";
import { StatusBar } from "@/components/app/status-bar";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <TopNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <StatusBar />
    </div>
  );
}

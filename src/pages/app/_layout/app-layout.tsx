import { AppHeader } from "@/components/custom/app-header";
import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

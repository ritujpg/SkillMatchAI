import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#F5F9FF_0%,#FFFFFF_320px)]">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-8">
        <Outlet />
      </main>
    </div>
  );
}

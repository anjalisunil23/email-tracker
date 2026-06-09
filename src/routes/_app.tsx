import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { isAuthenticated, getToken } from "@/lib/auth";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { initSocket, disconnectSocket } from "@/services/socketClient";

export const Route = createFileRoute("/_app")({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: "/" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded?.user?.id) {
          initSocket(decoded.user.id);
        }
      } catch (e) {
        console.error("Invalid token", e);
      }
    }
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full grid-cols-[260px_1fr] bg-background">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <TopNavbar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

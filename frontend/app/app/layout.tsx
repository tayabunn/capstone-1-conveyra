import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AppSidebar } from "@/components/app-layout/app-sidebar";
import { AppHeader } from "@/components/app-layout/app-header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // If session is missing or invalid, redirect to /sign-in
  if (!user) {
    redirect("/sign-in?redirect=/app");
  }

  return (
    <div className="flex h-screen bg-background bg-grid-subtle text-foreground selection:bg-brand selection:text-brand-foreground overflow-hidden">
      {/* 1. Desktop Persistent Sidebar */}
      <div className="hidden md:flex shrink-0">
        <AppSidebar user={user} />
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AppHeader user={user} />
        
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

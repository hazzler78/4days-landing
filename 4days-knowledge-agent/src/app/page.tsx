import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { ChatInterface } from "@/components/chat/chat-interface";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col h-screen">
      <Header userEmail={user?.email} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="lg:hidden p-2 border-b border-border">
            <MobileSidebar />
          </div>
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}

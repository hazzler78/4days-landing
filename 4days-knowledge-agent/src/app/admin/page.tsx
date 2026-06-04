import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={user?.email} />
      <AdminPanel />
    </div>
  );
}

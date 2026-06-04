import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Header userEmail={user?.email} />
      <SettingsPanel />
    </div>
  );
}

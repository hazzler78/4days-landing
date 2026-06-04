"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <Card className="w-full max-w-md border-brand-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
            <Mail className="h-6 w-6 text-brand-accent" />
          </div>
          <CardTitle>Kolla din e-post</CardTitle>
          <CardDescription>
            Vi har skickat en magic link till <strong>{email}</strong>.
            Klicka på länken för att logga in.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-brand-primary/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Logga in</CardTitle>
        <CardDescription>
          Ange din e-postadress för att få en inloggningslänk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-post</Label>
            <Input
              id="email"
              type="email"
              placeholder="namn@4days.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Skickar...
              </>
            ) : (
              "Skicka magic link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

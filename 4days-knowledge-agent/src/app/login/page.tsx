import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-primary via-brand-primary to-brand-primary/90 p-4">
      <div className="mb-8 text-center text-white">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent font-bold text-brand-primary text-2xl">
          4D
        </div>
        <h1 className="text-3xl font-bold">4days Knowledge Agent</h1>
        <p className="mt-2 text-brand-accent/80">
          Intern AI-assistent för 4days AI AB
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-slate-50 pt-24 pb-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-2 text-sm font-semibold text-accent">
            404 – sidan hittades inte
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand sm:text-4xl">
            Hoppsan, den här sidan har tagit ledigt.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Sidan du letar efter finns inte längre eller har flyttat. Men det du
            söker finns förmodligen bland våra guider.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/guider">Till alla guider</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">Till startsidan</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">

        <div className="flex-1 flex flex-col items-center gap-10 justify-center max-w-5xl p-5 mt-24">
          <Hero />
          <div className="flex-1 flex flex-row items-start justify-center">
            <AuthButton />
          </div>
        </div>

        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
        </footer>

      </div>
    </main>
  );
}

import { NextLogo } from "./next-logo";
import { SupabaseLogo } from "./supabase-logo";

export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <h1 className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">Sweevy</h1>
      <p className="text-2xl lg:text-3xl !leading-tight mx-auto max-w-xl text-center">
        Every version of your resumé, all in one place.
      </p>
    </div>
  );
}

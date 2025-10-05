"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function ResumeButton() {
  const router = useRouter();

  const goToResume = async () => {
    router.push("/protected");
  };

  return <Button variant="outline" onClick={goToResume}>My Resumé →</Button>;
}

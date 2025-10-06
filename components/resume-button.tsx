"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ResumeButton() {
  const router = useRouter();

  const goToResume = async () => {
    router.push("/protected");
  };

  return <Button variant="outline" onClick={goToResume}>My Resumé →</Button>;
}

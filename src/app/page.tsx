"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirige a la página de perfil
    router.push("/profile");
  }, [router]);

  return null; // No renderiza nada, ya que se redirige inmediatamente
}

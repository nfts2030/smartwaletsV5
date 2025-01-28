"use client";

import { Inter } from "next/font/google";
import Hero from "./hero/Hero";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`flex flex-col min-h-screen ${inter.className}`}>
      <Hero />
    </main>
  );
}
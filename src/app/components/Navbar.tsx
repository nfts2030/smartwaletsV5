"use client";

import { client } from "../client";
import { useActiveWallet } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { usePathname } from "next/navigation"; // Import usePathname
import Link from "next/link";
import Image from "next/image";

const wallets = [
  inAppWallet({
    auth: {
      options: ["email"],
    },
  }),
];

export default function Navbar() {
  const walletInfo = useActiveWallet();
  const pathname = usePathname(); // Get the current route

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side content */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/img/thirdweb-wordmark-dark.png"
                  alt="Logo"
                  width={150}
                  height={32}
                  className="h-8 w-auto"
                />
                <span
                  className={`ml-2 text-xl font-bold text-foreground font-medieval ${
                    pathname === "/"
                      ? "bg-yellow-100 px-2 py-1 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 text-gray-900 font-extrabold"
                      : ""
                  }`}
                >
                  Home
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/profile"
                className={`inline-flex items-center px-3 py-1 text-sm font-medium ${
                  pathname === "/profile"
                    ? "bg-blue-100 rounded-lg shadow-md transform transition-all duration-200 hover:scale-105 text-gray-900 font-extrabold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Right side button */}
          <div className="flex items-center">
            <ConnectButton
              client={client}
              wallets={wallets}
              connectButton={{
                label: "Sign in",
              }}
              connectModal={{ size: "compact" }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
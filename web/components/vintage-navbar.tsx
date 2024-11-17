"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LogoSvg from "../public/logo.svg";
import { VintageItemPageComponent } from "./vintage-item-page";
import { WalletComponents } from "./wallet-connect";

export function VintageNavbarComponent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const connectWallet = () => {
    // Implement your wallet connection logic here
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    // Implement your wallet disconnection logic here
    setIsConnected(false);
  };

  return (
    <nav className="bg-sepia-100 border-b-2 border-sepia-300 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 relative">
          <LogoSvg className="w-48 h-24 absolute top-0" />
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <VintageItemPageComponent />
          <WalletButton
            isConnected={isConnected}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
          />
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-sepia-800" />
            ) : (
              <Menu className="h-6 w-6 text-sepia-800" />
            )}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 p-4 bg-sepia-50 rounded-lg shadow-inner">
          <VintageItemPageComponent />
          <NavLink href="/explore" mobile>
            Explore
          </NavLink>
          <NavLink href="/collections" mobile>
            Collections
          </NavLink>
          <NavLink href="/about" mobile>
            About
          </NavLink>
          <WalletButton
            isConnected={isConnected}
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            mobile
          />
        </div>
      )}
    </nav>
  );
}

function NavLink({
  href,
  children,
  mobile = false,
}: {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`text-sepia-800 hover:text-sepia-600 transition-colors duration-200
        ${mobile ? "block py-2 text-lg" : "text-lg font-medium"}
        hover:underline underline-offset-4 decoration-2 decoration-sepia-400`}
    >
      {children}
    </Link>
  );
}

function WalletButton({}: {
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  mobile?: boolean;
}) {
  return <WalletComponents />;
}

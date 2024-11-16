"use client";

import { VintageItemsGridComponent } from "@/components/vintage-items-grid";
import { VintageNavbarComponent } from "@/components/vintage-navbar";
import { useAccount } from "wagmi";

export default function Home() {
  return <AccountInfo />;
}

function AccountInfo() {
  const { address, isConnected, chain } = useAccount();
  console.log({ address, isConnected, chain });

  return (
    <>
      <VintageNavbarComponent />
      <VintageItemsGridComponent />
    </>
  );
}

"use client";

import { VintageItemsGridComponent } from "@/components/vintage-items-grid";
import { VintageNavbarComponent } from "@/components/vintage-navbar";

export default function Home() {
  return <AccountInfo />;
}

function AccountInfo() {
  return (
    <>
      <VintageNavbarComponent />
      <VintageItemsGridComponent />
    </>
  );
}

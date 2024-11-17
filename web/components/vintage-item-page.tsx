"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { VintageItemPanelComponent } from "./vintage-item-panel";

interface VintageItem {
  id: number;
  name: string;
  description: string;
  status: "verified" | "pending";
  image: string;
  price: number;
  numOfAttestations?: number;
  yearOfOriginalPurchase?: number;
  numOfOwners?: number;
  currentOwner?: string;
  nounUrl: string;
  category?: string;
  metaMaskAddress?: string;
  isOwner?: boolean;
  isOpen?: boolean;
}

export function VintageItemPageComponent() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<VintageItem | undefined>(
    undefined
  );

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
    setItemToEdit(undefined); // Clear any previous edit item
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setItemToEdit(undefined);
  };

  const handleSubmit = async (item: VintageItem) => {
    console.log("slkdnflskdnfsnsnf item:", item);

    // Here you would typically save the item to your backend
  };

  return (
    <div className="">
      <div className="space-x-4">
        <Button
          className="h-[48px] w-[200px] font-bold bg-[#1e293b]"
          onClick={handleOpenPanel}
        >
          Add New Item
        </Button>
      </div>
      <VintageItemPanelComponent
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onSubmit={handleSubmit}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}

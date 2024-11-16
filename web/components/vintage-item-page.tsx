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

  const handleSubmit = (item: VintageItem) => {
    console.log("Submitted item:", item);
    // Here you would typically save the item to your backend
  };

  // const handleEdit = () => {
  //   // This is just a sample item. In a real application, you'd fetch this from your data source.
  //   const sampleItem: VintageItem = {
  //     id: 1,
  //     name: "Vintage Watch",
  //     description: "A beautiful vintage watch from the 1950s",
  //     status: "verified",
  //     image: "https://example.com/watch.jpg",
  //     price: 500,
  //     numOfAttestations: 3,
  //     yearOfOriginalPurchase: 1955,
  //     numOfOwners: 2,
  //     currentOwner: "John Doe",
  //     nounUrl: "https://example.com/watch-noun",
  //     category: "Accessories",
  //     metaMaskAddress: "0x1234...",
  //     isOwner: true,
  //   };
  //   setItemToEdit(sampleItem);
  //   setIsPanelOpen(true);
  // };

  return (
    <div className="p-6">
      <div className="space-x-4">
        <Button onClick={handleOpenPanel}>Add New Item</Button>
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

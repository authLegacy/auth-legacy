"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useConfirmAuthenticity } from "@/hooks/useConfirmAuthenticity";
import useFetchVintageItems from "@/hooks/useFetchVintageItems";
import useVintageStore from "@/store/vintageStore";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { AlertCircle, CheckCircle, Grid, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { OldWindowFrameComponent } from "./old-window-frame";
import { VintageItem } from "./vintage-item-detail";

interface VintageItemCardProps {
  item: VintageItem;
  handleVerify: (item: VintageItem) => void;
}

function VintageItemCard({ item, handleVerify }: VintageItemCardProps) {
  const { updateItem } = useVintageStore();
  return (
    <div className=" min-h-[400px] min-w-full md:min-w-[200px] lg:min-w-[400px] bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-2 right-2 flex items-center bg-white bg-opacity-75 rounded-full px-2 py-1">
          {item.status === "verified" ? (
            <>
              <CheckCircle className="text-green-500 h-4 w-4 mr-1" />
              <span className="text-green-500 text-xs font-semibold">
                Authenticity Verified
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="text-yellow-500 h-4 w-4 mr-1" />
              <span className="text-yellow-500 text-xs font-semibold">
                Authenticity Pending
              </span>
            </>
          )}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">
          {item.name}
        </h2>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <p className="text-lg font-bold text-gray-600 flex gap-2 items-center">
          <Image
            src={item.nounUrl}
            alt={item.name}
            height={60}
            width={60}
            style={{ borderRadius: "50%" }}
          />
          <span>${Number(item.price).toFixed(2)}</span>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleVerify(item);
              updateItem(item.id, { ...item, status: "verified" });
            }}
          >
            Verify
          </Button>
        </p>
      </div>
    </div>
  );
}

function AnimatedHeading() {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2 animate-fade-in-down">
        Timeless Treasures Emporium
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 italic animate-fade-in-up">
        Where Every Item Tells a Story
      </p>
    </div>
  );
}

export function VintageItemsGridComponent() {
  const { items } = useVintageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useFetchVintageItems();
  const { mutate: confirmAuthenticity } = useConfirmAuthenticity(
    "0x1B72b2d12f7153b6C4d203D004790d9c8E40DbA4", // Replace with your NFT contract address
    84532 // Replace with your chain ID
  );

  const handleVerify = () => {
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    confirmAuthenticity(Number(1));

    setIsModalOpen(false);
  };

  const router = useRouter();

  const { data: signer } = useWalletClient();
  const { address } = useAccount();
  console.log("Signer=========:", signer);
  console.log("Address:", address);

  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: "Your Items", icon: ShoppingBag },
    { name: "All Items", icon: Grid },
  ];

  const filteredItems =
    selectedTab === 0 ? items.filter((item) => item.isOwner) : items;

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedHeading />
      <TabGroup selectedIndex={selectedTab} onChange={setSelectedTab}>
        <TabList className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                ${
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                }`
              }
            >
              <div className="flex items-center justify-center">
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.name}
              </div>
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabs.map((tab, idx) => (
            <TabPanel
              key={idx}
              className={`rounded-xl bg-white p-3
                ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <OldWindowFrameComponent key={item.id} title={item.name}>
                    <div
                      onClick={() => {
                        router.push(`/${item.id}`);
                      }}
                    >
                      <VintageItemCard
                        key={item.id}
                        item={item}
                        handleVerify={handleVerify}
                      />
                    </div>
                  </OldWindowFrameComponent>
                ))}
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
      <VerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
      />
    </div>
  );
}
interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
}
const VerificationModal = ({
  isOpen,
  onClose,
  onApprove,
}: VerificationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify the item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-4">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-center text-sm text-gray-500">
            Are you sure you want to verify this item?
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onApprove} className="w-full">
            Verify Authenticity
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import useFetchVintageItems from "@/hooks/useFetchVintageItems";
import useVintageStore from "@/store/vintageStore";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { SupportChat } from "@pushprotocol/uiweb";
import { AlertCircle, CheckCircle, Grid, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { OldWindowFrameComponent } from "./old-window-frame";
import { VintageItem } from "./vintage-item-detail";

interface VintageItemCardProps {
  item: VintageItem;
}

function VintageItemCard({ item }: VintageItemCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
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
          <img
            src={item.nounUrl}
            alt="Seller"
            className="h-12 w-12 rounded-full"
          />
          <span>${item.price.toFixed(2)}</span>
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
  useFetchVintageItems();

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
                      <VintageItemCard key={item.id} item={item} />
                    </div>
                  </OldWindowFrameComponent>
                ))}
              </div>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
      {address && signer && (
        <SupportChat
          account={address}
          signer={signer}
          env={"staging" as any}
          modalTitle="Inquire About Item"
          greetingMsg="Antique Pocket Watch Inquiry"
          supportAddress="0x87E36CB1998aeef490b46E3690396961dF6a41FB"
        />
      )}
    </div>
  );
}

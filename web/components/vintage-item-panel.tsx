"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApprove } from "@/hooks/useApprove";
import { useMintNft } from "@/hooks/useMintNft";
import { useSellItem } from "@/hooks/useSoldItem";
import useVintageStore from "@/store/vintageStore";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NftMintedSuccess } from "./nft-minted-success";
import { NftSoldSuccess } from "./sold-success";
import { Textarea } from "./ui/textarea";

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

interface VintageItemPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: VintageItem) => void;
  itemToEdit?: VintageItem;
}

export function VintageItemPanelComponent({
  isOpen,
  onClose,
  onSubmit,
  itemToEdit,
}: VintageItemPanelProps) {
  const [item, setItem] = useState<VintageItem>({
    id: 0,
    name: "",
    description: "",
    status: "pending",
    image: "",
    price: 0,
    nounUrl: "",
  });

  const { addItem } = useVintageStore();
  const [isMinted, setMinted] = useState(false);
  const [isSold, setSold] = useState(false);
  const { address } = useAccount();

  useEffect(() => {
    return () => {
      setMinted(false);
      setSold(false);
    };
  }, []);

  const { mutate: mintNft } = useMintNft(
    "0xE4c9b734aA2E6362769461be2224cabdf7D7e25A", // Replace with nft contract address
    84532 // Replace with your chain ID
  );
  const { mutate: approve, isSuccess: approveSuccess } = useApprove(
    "0x1B72b2d12f7153b6C4d203D004790d9c8E40DbA4", // Replace with garden contract address
    84532 // Replace with your chain ID
  );

  const { mutate: sellItem } = useSellItem(
    "0x1B72b2d12f7153b6C4d203D004790d9c8E40DbA4", // Replace with garden contract address
    84532 // Replace with your chain ID
  );

  useEffect(() => {
    if (itemToEdit) {
      setItem(itemToEdit);
    }
  }, [itemToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("item", item);
    item.isOpen = true;
    item.nounUrl = "/pfp.svg";
    item.isOwner = true;
    item.image = "/bg.jpeg";
    try {
      e.preventDefault();
      onSubmit(item);
      mintNft("anything");
      setItem({
        id: 0,
        name: "",
        description: "",
        status: "pending",
        image: "",
        price: 0,
        nounUrl: "",
      });
      setMinted(true);
    } catch (e) {
      console.error("Error in handleSubmit:", e);
      setMinted(false);
      setSold(true);
    } finally {
      setTimeout(() => {
        addItem(item);
        onClose();
        setMinted(false);
        setSold(false);
      }, 5000);
    }
    setTimeout(() => {
      addItem(item);
      onClose();
      setMinted(false);
      setSold(false);
    }, 5000);
  };

  const handleSell = async () => {
    try {
      await sellItem({
        nftAddress:
          "0xE4c9b734aA2E6362769461be2224cabdf7D7e25A" as `0x${string}`,
        tokenId: 0,
        price: BigInt(Math.floor(0.1 * 10 ** 18)), // Convert price to bigint
      });
      setSold(true);

      setTimeout(() => {
        onClose();
        setMinted(false);
        setSold(false);
      }, 7000);
    } catch (e) {
      console.error("Error in handleSell:", e);
      setSold(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approve({
        spender: address as `0x${string}`, // Replace with actual spender address (e.g., marketplace contract)
        tokenId: 9, // Ensure the tokenId exists and is owned by the sender
      });

      console.log("Approval successful!");
    } catch (error) {
      console.error("Error in handleApprove:", error);
    }
  };

  return (
    <div
      className={`z-10 fixed inset-y-0 right-0 w-90 sm:w-[400px] md:w-[600px] lg:w-[800px]  bg-background shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      {!isMinted ? (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {itemToEdit ? "Edit" : "Add"} Vintage Item
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={item.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                required
                value={item.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cars">Cars </SelectItem>
                  <SelectItem value="watch">Watch</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="jewelry">Jewelry</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="toys">Toys</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="instruments">Instruments</SelectItem>
                  <SelectItem value="decor">Decor</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="vehicles">Vehicles</SelectItem>
                  <SelectItem value="coins">Coins</SelectItem>
                  <SelectItem value="stamps">Stamps</SelectItem>
                  <SelectItem value="timepieces">Timepieces</SelectItem>
                  <SelectItem value="ceramics">Ceramics</SelectItem>
                  <SelectItem value="lighting">Lighting</SelectItem>
                  <SelectItem value="kitchenware">Kitchenware</SelectItem>
                  <SelectItem value="maps">Maps</SelectItem>
                  <SelectItem value="sports-memorabilia">
                    Sports Memorabilia
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                value={item.image}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={item.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="yearOfOriginalPurchase">
                Year of Original Purchase
              </Label>
              <Input
                required
                id="yearOfOriginalPurchase"
                name="yearOfOriginalPurchase"
                type="number"
                min={1800}
                value={item.yearOfOriginalPurchase || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="currentOwner">Current Owner</Label>
              <Input
                required
                id="currentOwner"
                name="currentOwner"
                value={item.currentOwner || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={item.description}
                onChange={handleChange}
                required
                className="h-[300px]"
              />
            </div>

            <Button type="submit" className="w-full">
              {itemToEdit ? "Update" : "Mint"} Item
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center">
          {!isSold && (
            <NftMintedSuccess
              handleSell={handleSell}
              handleApprove={handleApprove}
              isApprove={approveSuccess}
            />
          )}
        </div>
      )}
      {isSold && <NftSoldSuccess />}
    </div>
  );
}

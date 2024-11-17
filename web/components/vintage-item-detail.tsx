"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useVintageStore from "@/store/vintageStore";
import { Award, Clock, DollarSign, Flower, Users } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export interface VintageItem {
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

export function VintageItemDetail() {
  const [isHovered, setIsHovered] = useState(false);
  const params = useParams();
  const id = params.id;
  const { items } = useVintageStore();
  const item = items.find((item) => item.id === Number(id));
  if (!item) {
    return <LoadingSkeleton />;
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      furniture: "🪑",
      clothing: "👗",
      jewelry: "💍",
      art: "🎨",
      electronics: "📻",
      books: "📚",
      toys: "🧸",
      default: "🏺",
    };
    return emojiMap[category.toLowerCase()] || emojiMap.default;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative w-full h-[50vh] mb-8">
        <Image
          src={item.nounUrl}
          alt={item.name}
          height={60}
          width={60}
          style={{ borderRadius: "50%" }}
        />
        <Image
          src={item.image}
          alt={item.name}
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute top-4 right-4">
          <Badge
            variant={item.status === "verified" ? "default" : "secondary"}
            className="text-lg px-4 py-2"
          >
            {item.status}
          </Badge>
        </div>
      </div>
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-4xl font-bold flex items-center">
              <span
                className="mr-2 text-5xl"
                role="img"
                aria-label={`Category: ${item.category}`}
              >
                {item?.category && getCategoryEmoji(item?.category)}
              </span>
              {item.name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl mb-6">{item.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">
                ${Number(item.price).toFixed(2)}
              </span>
            </div>
            {item.numOfAttestations !== undefined && (
              <div className="flex items-center">
                <Award className="mr-2 h-6 w-6 text-primary" />
                <span>
                  <span className="font-semibold">Attestations:</span>{" "}
                  {item.numOfAttestations}
                </span>
              </div>
            )}
            {item.yearOfOriginalPurchase && (
              <div className="flex items-center">
                <Clock className="mr-2 h-6 w-6 text-primary" />
                <span>
                  <span className="font-semibold">Year of Purchase:</span>{" "}
                  {item.yearOfOriginalPurchase}
                </span>
              </div>
            )}
            {item.numOfOwners !== undefined && (
              <div className="flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" />
                <span>
                  <span className="font-semibold">Number of Owners:</span>{" "}
                  {item.numOfOwners}
                </span>
              </div>
            )}
          </div>
          {item.currentOwner && (
            <div className="mb-6">
              <span className="font-semibold">Current Owner:</span>{" "}
              {item.currentOwner}
            </div>
          )}
          <div className="text-center">
            {item.isOwner && (
              <Button
                onClick={() => {}}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="mr-2">Delist the Vintage Item</span>
                <Flower
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "rotate-45" : ""
                  }`}
                />
              </Button>
            )}
            {!item.isOwner && item.status === "verified" && (
              <Button
                size={"lg"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => {}}
              >
                <span className="mr-2">Buy the Vintage Item</span>
                <Flower
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "rotate-45" : ""
                  }`}
                />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="w-full h-[50vh] mb-8 rounded-lg" />
      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-12 w-3/4" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6 mb-2" />
          <Skeleton className="h-6 w-4/6 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-full mb-6" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}

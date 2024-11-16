"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NFTMintCard } from "@coinbase/onchainkit/nft";
import {
  NFTAssetCost,
  NFTCollectionTitle,
  NFTCreator,
  NFTMintButton,
  NFTQuantitySelector,
} from "@coinbase/onchainkit/nft/mint";
import { NFTMedia } from "@coinbase/onchainkit/nft/view";

import { CheckCircle, Flower } from "lucide-react";
import { useState } from "react";

interface Props {
  handleSell: () => void;
}

export function NftMintedSuccess(props: Props) {
  const { handleSell } = props;
  const [isHovered, setIsHovered] = useState(false);
  const [isMintSubmited, setIsMintSubmited] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-4 w-full flex flex-col justify-center items-center">
      <NFTMintCard
        contractAddress="0xC230dF736dFecc3F086043b20F18560a8Db19F19"
        tokenId="1"
      >
        <NFTCreator />
        <NFTMedia />
        <NFTCollectionTitle />
        <NFTQuantitySelector />
        <NFTAssetCost />
        <NFTMintButton />
      </NFTMintCard>
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-orange-200">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Avatar className="w-240 h-240 border-4 border-orange-300">
            <AvatarImage
              src="https://noun-api.com/beta/pfp?head=196&glasses=20&background=1&body=18&accessory=15&size=420"
              alt="Vintage Garden Logo"
            />
            <AvatarFallback>VG</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-serif text-orange-500">
            Congratulations!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-orange-700">
            You&apos;ve successfully minted your NFT!
          </p>
          <div className="flex justify-center">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          <p className="text-sm text-gray-600">
            Your unique piece is now part of the Vintage Garden collection.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 ease-in-out transform"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleSell}
          >
            <span className="mr-2">Sell on Vintage Garden</span>
            <Flower
              className={`w-5 h-5 transition-transform duration-300 ${
                isHovered ? "rotate-45" : ""
              }`}
            />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

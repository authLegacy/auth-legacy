"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function NftSoldSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-green-100 flex items-center justify-center p-4 w-full">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-2 border-green-200">
        <CardHeader className="flex flex-col items-center space-y-2">
          <Avatar className="w-240 h-240 border-4 border-green-300">
            <AvatarImage
              src="https://noun-api.com/beta/pfp?head=196&glasses=20&background=1&body=14&accessory=3&size=420"
              alt="Vintage Garden Logo"
            />
            <AvatarFallback>VG</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl font-serif text-green-500">
            Congratulations!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-lg text-green-700">
            You&apos;ve successfully Sold your item!
          </p>
          <div className="flex justify-center">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          <p className="text-sm text-gray-600">
            Your unique piece is now part of the Vintage Garden collection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

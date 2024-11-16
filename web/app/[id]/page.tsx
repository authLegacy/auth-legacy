import {
  VintageItem,
  VintageItemDetail,
} from "@/components/vintage-item-detail";

const page = () => {
  const vintageItem: VintageItem = {
    id: 1,
    name: "Antique Pocket Watch",
    description:
      "A beautifully crafted antique pocket watch from the late 19th century, featuring intricate engravings and a functioning mechanism.",
    status: "verified",
    image: "/watch.jpg?height=500&width=1200",
    price: 1500, // in USD
    numOfAttestations: 10,
    yearOfOriginalPurchase: 1895,
    numOfOwners: 3,
    isOwner: true,
    currentOwner: "John Doe",
    nounUrl: "https://noun-api.com/beta/pfp?head=223&glasses=20&background=1",
    category: "Timepieces",
  };
  return <VintageItemDetail item={vintageItem} />;
};

export default page;

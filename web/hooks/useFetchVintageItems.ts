import { VintageItem } from "@/components/vintage-item-detail";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import useVintageStore from "../store/vintageStore";

const vintageItems: VintageItem[] = [
  {
    id: 1,
    name: "Antique Pocket Watch",
    description:
      "A beautifully crafted timepiece from the 19th century. This exquisite piece features intricate engravings and a polished gold finish.",
    status: "verified",
    image: "/watch.jpg?height=400&width=300",
    price: 299.99,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: true,
  },
  {
    id: 2,
    name: "Vintage Typewriter",
    description:
      "A classic Remington typewriter from the 1950s. This well-preserved machine still produces crisp, clean type and comes with its original case.",
    status: "pending",
    image: "/watch.jpg?height=400&width=300",
    price: 189.5,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: false,
  },
  {
    id: 3,
    name: "Classic Vinyl Record",
    description:
      "Original pressing of a legendary jazz album. This rare find is in excellent condition and includes the original album artwork.",
    status: "verified",
    image: "/watch.jpg?height=400&width=300",
    price: 79.99,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: false,
  },
  {
    id: 4,
    name: "Retro Camera",
    description:
      "A fully functional Polaroid camera from the 1970s. This iconic instant camera has been carefully restored and comes with a pack of film.",
    status: "pending",
    image: "/watch.jpg?height=400&width=300",
    price: 129.0,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: true,
  },
  {
    id: 5,
    name: "Antique Oil Lamp",
    description:
      "A beautifully preserved oil lamp from the Victorian era. This elegant piece features hand-painted glass and intricate metalwork.",
    status: "verified",
    image: "/watch.jpg?height=400&width=300",
    price: 159.95,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: true,
  },
  {
    id: 6,
    name: "Vintage Radio",
    description:
      "A working tube radio from the 1940s, restored to its former glory. This art deco masterpiece produces warm, rich sound quality.",
    status: "pending",
    image: "/watch.jpg?height=400&width=300",
    price: 249.99,
    nounUrl: "/pfp.svg",
    isOwner: false,
    isOpen: true,
  },
];

const fetchVintageItems = async (): Promise<VintageItem[]> => {
  //   const response = await fetch("/api/vintage-items"); // Replace with your API URL
  //   if (!response.ok) {
  //     throw new Error("Failed to fetch vintage items");
  //   }
  return vintageItems;
  //   return response.json(); // Ensure the endpoint returns an array of VintageItem
};

const useFetchVintageItems = (): UseQueryResult<VintageItem[]> => {
  const { setItems } = useVintageStore();

  const query = useQuery<VintageItem[], Error>({
    queryKey: ["vintageItems"],
    queryFn: fetchVintageItems,
  });

  // Use useEffect to update Zustand store on successful data fetch
  useEffect(() => {
    if (query.data) {
      setItems(query.data); // Set the entire list in the Zustand store
    }
  }, [query.data, setItems]);

  return query;
};

export default useFetchVintageItems;

import { VintageItem } from "@/components/vintage-item-detail";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import useVintageStore from "../store/vintageStore";

const vintageItems: VintageItem[] = [
  {
    id: 1,
    name: "Vintage typewriter ",
    description:
      " featuring a vintage typewriter from the 1920s. Let me know if you'd like me to proceed with creating the other four images featuring different vintage items!",
    status: "verified",
    image: "/1.jpeg?height=400&width=300",
    price: 299.99,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: true,
  },
  {
    id: 2,
    name: "Classic Vintage Watch",
    description:
      "The 19th century, A stunning gold pocket watch with intricate engravings and Roman numeral dials. ",
    status: "pending",
    image: "/watch.jpeg",
    price: 189.5,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: false,
  },

  {
    id: 3,
    name: "Victorian Era Glass Oil Lamp",
    description:
      "A beautifully preserved Victorian-era oil lamp with a hand-blown glass reservoir and intricately designed metal base. The lamp's soft, warm glow captures the charm of simpler times",
    status: "pending",
    image: "/6.jpeg",
    price: 129.0,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: true,
  },
  {
    id: 4,
    name: "Vintage Pocket Watch",
    description:
      "The 19th century, A stunning gold pocket watch with intricate engravings and Roman numeral dials. ",
    status: "verified",
    image: "/watch.jpeg",
    price: 79.99,
    nounUrl: "/pfp.svg",
    isOwner: true,
    isOpen: false,
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

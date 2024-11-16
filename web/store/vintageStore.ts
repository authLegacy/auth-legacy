import { create } from "zustand";

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

interface VintageStore {
  items: VintageItem[];
  selectedItem: VintageItem | null;
  addItem: (item: VintageItem) => void;
  removeItem: (id: number) => void;
  selectItem: (id: number) => void;
  setItems: (items: VintageItem[]) => void;
  updateItem: (id: number, updatedItem: Partial<VintageItem>) => void;
}

const useVintageStore = create<VintageStore>((set) => ({
  items: [],
  selectedItem: null,
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  selectItem: (id) =>
    set((state) => ({
      selectedItem: state.items.find((item) => item.id === id) || null,
    })),
  updateItem: (id, updatedItem) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    })),
  setItems: (items) => set({ items }),
}));

export default useVintageStore;

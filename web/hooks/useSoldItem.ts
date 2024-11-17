import { useMutation } from "@tanstack/react-query";
import {
  getWalletClient,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { type Address } from "viem";
import { simulateContract } from "viem/actions";
import { useConfig, type Config } from "wagmi";

// ABI for the contract
export const marketAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "VintageGarden__AlreadyOpenForSale",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "VintageGarden__ItemNotOnHold",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "seller", type: "address" }],
    name: "VintageGarden__NoPendingProceeds",
    type: "error",
  },
  {
    inputs: [],
    name: "VintageGarden__NotApprovedForMarketplace",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "VintageGarden__NotBuyer",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "VintageGarden__NotOpenForSale",
    type: "error",
  },
  { inputs: [], name: "VintageGarden__NotOwner", type: "error" },
  { inputs: [], name: "VintageGarden__PriceMustBeAboveZero", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "VintageGarden__PriceNotMet",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "seller", type: "address" }],
    name: "VintageGarden__TransferFailed",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "attester",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "attestationId",
        type: "uint64",
      },
    ],
    name: "AuthenticityAttested",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ItemBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
    ],
    name: "ItemOnHold",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "price",
        type: "uint256",
      },
    ],
    name: "ItemPutOnSale",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "seller",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "SaleCanceled",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "buyItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "cancelSale",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "confirmAuthenticity",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "confirmDelivery",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
    ],
    name: "getListing",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "price", type: "uint256" },
          {
            internalType: "uint256",
            name: "numOfAttestations",
            type: "uint256",
          },
          { internalType: "uint256", name: "numOfOwners", type: "uint256" },
          { internalType: "bool", name: "openForSale", type: "bool" },
          { internalType: "bool", name: "onHold", type: "bool" },
          { internalType: "address", name: "seller", type: "address" },
          { internalType: "address", name: "buyer", type: "address" },
        ],
        internalType: "struct VintageGarden.Listing",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "seller", type: "address" }],
    name: "getPendingProceeds",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "i_schemaId",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "i_spInstance",
    outputs: [{ internalType: "contract ISP", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "uint256", name: "price", type: "uint256" },
    ],
    name: "sellItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "tokenToNumOfAttestations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawPendingProceeds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const useSellItem = (
  marketContractAddress: Address,
  chainId: number
) => {
  const wagmiConfig = useConfig();

  return useMutation({
    mutationFn: async ({
      nftAddress,
      tokenId,
      price,
    }: {
      nftAddress: Address;
      tokenId: number;
      price: bigint;
    }) => {
      try {
        return await sellItem(
          nftAddress,
          tokenId,
          price,
          marketContractAddress,
          chainId,
          wagmiConfig
        );
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });
};

const sellItem = async (
  nftAddress: Address,
  tokenId: number,
  price: bigint,
  marketContractAddress: Address,
  chainId: number,
  wagmiConfig: Config
) => {
  debugger;
  const signer = await getWalletClient(wagmiConfig);
  if (!signer) throw new Error("Signer is not available");

  try {
    // Simulate the contract interaction
    const { request: sellRequest } = await simulateContract(signer, {
      address: marketContractAddress,
      abi: marketAbi,
      functionName: "sellItem",
      args: [nftAddress, tokenId, price], // Pass the required arguments
    });

    // Send the transaction
    const hash = await writeContract(wagmiConfig, sellRequest);

    // Wait for transaction confirmation
    await waitForTransactionReceipt(wagmiConfig, { hash, chainId });

    return hash; // Return transaction hash
  } catch (error) {
    console.error("Selling failed", error);
    throw error;
  }
};

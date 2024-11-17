import { useMutation } from "@tanstack/react-query";
import {
  getWalletClient,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { type Address } from "viem";
import { simulateContract } from "viem/actions";
import { useConfig, type Config } from "wagmi";
import { marketAbi } from "./useSoldItem";

export const useConfirmAuthenticity = (
  nftContractAddress: Address,
  chainId: number
) => {
  const wagmiConfig = useConfig();

  return useMutation({
    mutationFn: async (tokenId: number) => {
      try {
        return await confirmAuthenticity(
          tokenId,
          nftContractAddress,
          chainId,
          wagmiConfig
        );
      } catch (err) {
        console.error("Authenticity confirmation failed:", err);
        throw err;
      }
    },
  });
};

const confirmAuthenticity = async (
  tokenId: number,
  nftContractAddress: Address,
  chainId: number,
  wagmiConfig: Config
) => {
  const signer = await getWalletClient(wagmiConfig);
  if (!signer) throw new Error("Signer is not available");

  try {
    // Simulate the contract interaction
    const { request: confirmRequest } = await simulateContract(signer, {
      address: nftContractAddress, // Contract address of the NFT
      abi: marketAbi, // ABI of the contract
      functionName: "confirmAuthenticity", // Contract function name
      args: ["0xE4c9b734aA2E6362769461be2224cabdf7D7e25A", tokenId], // Pass the tokenId as an argument
    });

    // Send the transaction
    const hash = await writeContract(wagmiConfig, confirmRequest);

    // Wait for transaction confirmation
    await waitForTransactionReceipt(wagmiConfig, { hash, chainId });

    return hash; // Return the transaction hash
  } catch (error) {
    console.error("Confirmation failed:", error);
    throw error;
  }
};

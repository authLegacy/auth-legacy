import { useMutation } from "@tanstack/react-query";
import {
  getWalletClient,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { type Address } from "viem";
import { simulateContract } from "viem/actions";
import { useConfig, type Config } from "wagmi";
import { nftAbi } from "./useMintNft";

export const useApprove = (nftContractAddress: Address, chainId: number) => {
  const wagmiConfig = useConfig();

  return useMutation({
    mutationFn: async ({
      spender,
      tokenId,
    }: {
      spender: Address;
      tokenId: number;
    }) => {
      try {
        return await approve(
          spender,
          tokenId,
          nftContractAddress,
          chainId,
          wagmiConfig
        );
      } catch (err) {
        console.error("Error in approval:", err);
        throw err;
      }
    },
  });
};

const approve = async (
  spender: Address,
  tokenId: number,
  nftContractAddress: Address,
  chainId: number,
  wagmiConfig: Config
) => {
  const signer = await getWalletClient(wagmiConfig);
  if (!signer) throw new Error("Signer is not available");

  try {
    debugger;
    // Simulate the contract interaction
    const { request: approveRequest } = await simulateContract(signer, {
      address: spender,
      abi: nftAbi,
      functionName: "approve",
      args: [nftContractAddress, tokenId], // Correct order: spender first, tokenId second
    });

    // Send the transaction
    const hash = await writeContract(wagmiConfig, approveRequest);

    // Wait for transaction confirmation
    await waitForTransactionReceipt(wagmiConfig, { hash, chainId });

    return hash; // Return the transaction hash
  } catch (error) {
    console.error("Approval failed:", error);
    throw error;
  }
};

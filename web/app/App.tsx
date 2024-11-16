"use client";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "viem";
import { mainnet } from "viem/chains";
import { createConfig, WagmiProvider } from "wagmi";

// Configuration for Wagmi
const config = createConfig({
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http(),
  },
});

// QueryClient instance for React Query
const queryClient = new QueryClient();

const childrenButton = (
  <div data-testid="exampleChild">Connect a new wallet!</div>
) as React.ReactElement;

import { ReactNode } from "react";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "162841ee-ccb4-4d7a-8e49-52e5e1e7823c", // Replace with your actual environment ID
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>{children}</DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>
  );
}

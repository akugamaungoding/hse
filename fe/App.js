import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppNavigator } from "./src/navigation/AppNavigator";
import FlashMessage from "react-native-flash-message";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { initSecurityScanner } from "@/utils/security";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ErrorBoundary>
            <AppNavigator />
          </ErrorBoundary>
          <FlashMessage position="top" />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

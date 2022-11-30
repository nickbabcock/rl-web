import "@/styles/tailwind.css";
import "@/styles/global.css";
import type { AppProps } from "next/app";
import { ReplayParserProvider } from "@/features/worker";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReplayParserProvider>
        <Component {...pageProps} />
      </ReplayParserProvider>
    </QueryClientProvider>
  );
}

export default MyApp;

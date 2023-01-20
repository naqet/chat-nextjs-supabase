import { useState } from "react";
import type { AppProps } from "next/app";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  type Session,
  SessionContextProvider,
} from "@supabase/auth-helpers-react";
import "@picocss/pico";
import Layout from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Database } from "@/types/supabase";

export default function App({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabase] = useState(() => createBrowserSupabaseClient<Database>());
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionContextProvider
      supabaseClient={supabase}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

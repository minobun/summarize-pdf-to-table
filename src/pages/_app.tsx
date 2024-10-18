import ToastProvider from "@/providers/ToastProvider";
import type { AppProps } from "next/app";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <Head>
        <title>Tablify PDF</title>
      </Head>
      <Component {...pageProps} />
    </ToastProvider>
  );
}

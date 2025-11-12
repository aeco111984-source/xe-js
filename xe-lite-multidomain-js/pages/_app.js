import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Ticker />
      <main className="container py-6">
        <Component {...pageProps} />
      </main>
    </>
  );
}

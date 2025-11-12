import { useEffect } from "react";
import { getSiteEntry } from "@/components/useSiteConfig";

export default function Charts() {
  const site = getSiteEntry();

  useEffect(() => {
    // Top overview widget
    if (!document.getElementById("tv-market-overview")) {
      const script = document.createElement("script");
      script.id = "tv-market-overview";
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
      script.async = true;
      script.innerHTML = JSON.stringify({
        colorTheme: "light",
        dateRange: "1D",
        showChart: true,
        locale: "en",
        width: "100%",
        height: 420,
        showSymbolLogo: true,
        isTransparent: false,
        tabs: [
          {
            title: "FX Majors",
            symbols: [
              { s: "FX:EURUSD" },
              { s: "FX:GBPUSD" },
              { s: "FX:USDJPY" },
              { s: "FX:AUDUSD" },
              { s: "FX:USDCAD" },
              { s: "FX:USDCHF" }
            ]
          },
          {
            title: "Crypto",
            symbols: [
              { s: "BINANCE:BTCUSDT" },
              { s: "BINANCE:ETHUSDT" }
            ]
          },
          {
            title: "Indices",
            symbols: [
              { s: "FOREXCOM:SPXUSD" },
              { s: "FOREXCOM:NSXUSD" },
              { s: "FOREXCOM:DE30EUR" }
            ]
          }
        ]
      });
      document.querySelector(".tv-charts-overview")?.appendChild(script);
    }

    // Bottom advanced candlestick chart
    if (!document.getElementById("tv-advanced-chart")) {
      const script2 = document.createElement("script");
      script2.id = "tv-advanced-chart";
      script2.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script2.async = true;
      script2.innerHTML = JSON.stringify({
        symbol: "FX:EURUSD",
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1", // candles
        locale: "en",
        allow_symbol_change: true,
        backgroundColor: "#000000",
        width: "100%",
        height: 420,
        studies: ["MACD@tv-basicstudies"]
      });
      document.querySelector(".tv-charts-advanced")?.appendChild(script2);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8">
      <h1
        className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-sm text-center md:text-left"
        style={{ color: "var(--brand,#FF7A00)" }}
      >
        Charts
      </h1>

      <div className="card mb-6">
        <h2 className="font-semibold mb-2 text-lg">Market Overview</h2>
        <div className="tv-charts-overview" style={{ minHeight: 420 }} />
      </div>

      <div className="card">
        <h2 className="font-semibold mb-2 text-lg">
          EUR/USD – MT4 Style Candles
        </h2>
        <p className="text-xs text-gray-500 mb-2">
          Drag, zoom, and change symbols directly within the chart.
        </p>
        <div className="tv-charts-advanced" style={{ minHeight: 420 }} />
      </div>
    </div>
  );
}

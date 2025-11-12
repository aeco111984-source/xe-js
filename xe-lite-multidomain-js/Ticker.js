import { useEffect } from "react";

export default function Ticker() {
  useEffect(() => {
    if (document.getElementById("tv-ticker-bar")) return;

    const script = document.createElement("script");
    script.id = "tv-ticker-bar";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "FX:USDJPY", title: "USD/JPY" },
        { proName: "FX:AUDUSD", title: "AUD/USD" },
        { proName: "FX:USDCAD", title: "USD/CAD" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "OANDA:WTICOUSD", title: "US Oil" },
        { proName: "BINANCE:BTCUSDT", title: "BTC/USDT" },
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
        { proName: "FOREXCOM:NSXUSD", title: "NASDAQ 100" }
      ],
      showSymbolLogo: false,
      colorTheme: "light",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en"
    });

    const container = document.querySelector(".tv-ticker-bar-container");
    if (container) container.appendChild(script);
  }, []);

  return (
    <div className="border-b bg-white">
      <div className="tv-ticker-bar-container" />
    </div>
  );
}

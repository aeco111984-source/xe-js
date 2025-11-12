import { useEffect, useState } from "react";
import { getSiteEntry } from "./useSiteConfig";

const regionPairs = {
  SouthAsia: [
    { f: "USD", t: "INR" },
    { f: "USD", t: "PKR" },
    { f: "USD", t: "BDT" },
    { f: "PKR", t: "INR" },
  ],
  SoutheastAsia: [
    { f: "USD", t: "PHP" },
    { f: "USD", t: "VND" },
    { f: "USD", t: "MYR" },
    { f: "USD", t: "IDR" },
  ],
  LatinAmerica: [
    { f: "USD", t: "MXN" },
    { f: "USD", t: "COP" },
    { f: "USD", t: "BRL" },
  ],
  Europe: [
    { f: "EUR", t: "PLN" },
    { f: "EUR", t: "RON" },
    { f: "EUR", t: "HUF" },
    { f: "GBP", t: "EUR" },
  ],
  MEA: [
    { f: "USD", t: "EGP" },
    { f: "USD", t: "GHS" },
    { f: "USD", t: "NGN" },
  ],
};

const majors = [
  { f: "EUR", t: "USD" },
  { f: "GBP", t: "USD" },
  { f: "USD", t: "JPY" },
  { f: "AUD", t: "USD" },
  { f: "USD", t: "CAD" },
  { f: "USD", t: "CHF" },
];

function guessHomeCurrency(region) {
  if (region === "Europe") return "EUR";
  if (region === "SouthAsia") return "INR";
  if (region === "SoutheastAsia") return "PHP";
  if (region === "LatinAmerica") return "MXN";
  if (region === "MEA") return "EGP";
  return "EUR";
}

export default function Converter() {
  const site = getSiteEntry();
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState(
    site?.defaultPair?.[0] || guessHomeCurrency(site.region)
  );
  const [to, setTo] = useState(site?.defaultPair?.[1] || "USD");
  const [rate, setRate] = useState(null);
  const [converted, setConverted] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Frankfurter API (stable global feed)
  async function fetchRate(base, sym) {
    try {
      setLoading(true);
      setError("");
      if (typeof window === "undefined") return;

      const res = await fetch(
        `https://api.frankfurter.app/latest?amount=1&from=${encodeURIComponent(
          base
        )}&to=${encodeURIComponent(sym)}`
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (!data?.rates?.[sym]) throw new Error("Invalid conversion");
      const rateValue = data.rates[sym];
      setRate(rateValue);
      setConverted(amount * rateValue);
      setTimestamp(new Date());
    } catch (e) {
      console.error(e);
      setError("Could not fetch rate. Try again later.");
      setRate(null);
      setConverted(null);
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    const oldFrom = from;
    setFrom(to);
    setTo(oldFrom);
  }

  useEffect(() => {
    fetchRate(from, to);
  }, [from, to]);

  const regional = regionPairs[site.region] || [{ f: "EUR", t: "USD" }];

  return (
    <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto px-3">
      <div className="card md:col-span-2">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-3 drop-shadow-sm"
          style={{ color: "var(--brand,#FF7A00)" }}
        >
          Currency Converter
        </h1>

        {/* Amount / From / To with Swap */}
        <div className="grid sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-lg mb-2 font-medium text-gray-700">
              Amount
            </label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-md px-4 py-3 text-[1.1rem]"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-lg mb-2 font-medium text-gray-700">
                  From
                </label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  className="w-full border rounded-md px-4 py-3 text-[1.1rem]"
                />
              </div>

              <div className="flex flex-col justify-center items-center mt-6">
                <button
                  onClick={swapCurrencies}
                  className="px-4 py-3 bg-[var(--brand,#FF7A00)] text-white rounded-md hover:opacity-90 text-[1rem] font-semibold flex items-center justify-center gap-1 shadow-sm hover:scale-105 active:rotate-180 transition-transform duration-300"
                  title="Swap currencies"
                >
                  🔄 Swap
                </button>
              </div>

              <div className="flex-1">
                <label className="block text-lg mb-2 font-medium text-gray-700">
                  To
                </label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value.toUpperCase())}
                  className="w-full border rounded-md px-4 py-3 text-[1.1rem]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="btn w-full py-3 text-[1.15rem] font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={() => fetchRate(from, to)}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {/* 🎨 Result Display */}
        <div className="mt-8 card bg-white shadow-lg shadow-orange-100 border border-gray-200 text-center p-6 rounded-xl transition-all animate-fadeIn">
          {error && (
            <div className="text-red-500 text-[1.2rem] font-medium">
              {error}
            </div>
          )}

          {!error && rate && (
            <>
              <div className="text-[1.2rem] uppercase tracking-wide text-gray-500 mb-3 font-semibold">
                Result
              </div>

              <div
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ color: "var(--brand,#FF7A00)" }}
              >
                {amount} {from}
                <span className="text-gray-700 font-normal mx-1">=</span>
                {converted?.toFixed(4)} {to}
              </div>

              <div className="text-[1.1rem] text-gray-600 mt-3">
                <span className="font-semibold text-[var(--brand,#FF7A00)]">
                  Rate: {rate.toFixed(6)}
                </span>{" "}
                • Updated {timestamp ? timestamp.toLocaleTimeString() : ""}
              </div>

              <div className="text-sm text-gray-400 mt-2">
                Live market rate sourced from ECB
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="card mt-6 md:mt-0">
        <h3 className="font-semibold text-[1.2rem] mb-3">
          Popular in {site.region || "Global"}
        </h3>
        <ul className="flex flex-wrap gap-2 text-[1.1rem]">
          {regional.map((p, i) => (
            <li key={i}>
              <button
                className="bg-gray-100 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                onClick={() => {
                  setFrom(p.f);
                  setTo(p.t);
                }}
              >
                {p.f} → {p.t}
              </button>
            </li>
          ))}
        </ul>

        <h3 className="font-semibold text-[1.2rem] mt-6 mb-3">
          Global Majors
        </h3>
        <ul className="flex flex-wrap gap-2 text-[1.1rem]">
          {majors.map((p, i) => (
            <li key={i}>
              <button
                className="bg-gray-100 px-3 py-2 rounded-lg hover:bg-orange-50 transition"
                onClick={() => {
                  setFrom(p.f);
                  setTo(p.t);
                }}
              >
                {p.f} → {p.t}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

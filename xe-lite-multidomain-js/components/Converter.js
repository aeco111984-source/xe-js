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

  // ✅ Fetch from exchangerate.host /latest (stable + consistent with charts)
  async function fetchRate(base, sym) {
    try {
      setLoading(true);
      setError("");

      if (typeof window === "undefined") return;

      const res = await fetch(
        `https://api.exchangerate.host/latest?base=${encodeURIComponent(
          base
        )}&symbols=${encodeURIComponent(sym)}`
      );

      if (!res.ok) throw new Error("Network error");

      const data = await res.json();
      console.log("API response:", data);

      if (!data?.rates?.[sym]) {
        throw new Error("Invalid or missing conversion result");
      }

      const rateValue = data.rates[sym];
      const convertedValue = amount * rateValue;

      setRate(rateValue);
      setConverted(convertedValue);
      setTimestamp(new Date());
    } catch (err) {
      console.error("Conversion error:", err);
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
    <div className="grid md:grid-cols-3 gap-4">
      <div className="card md:col-span-2">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "var(--brand,#FF7A00)" }}
        >
          Currency Converter
        </h1>

        {/* Amount / From / To with Swap */}
        <div className="grid sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-sm mb-1">Amount</label>
            <input
              type="number"
              min="0"
              className="w-full border rounded-md px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
            />
          </div>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-sm mb-1">From</label>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value.toUpperCase())}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              <div className="flex flex-col justify-center items-center mt-5">
                <button
                  onClick={swapCurrencies}
                  className="px-3 py-2 bg-[var(--brand,#FF7A00)] text-white rounded-md hover:opacity-90 text-sm font-medium flex items-center justify-center gap-1"
                  title="Swap currencies"
                >
                  🔄 Swap
                </button>
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-1">To</label>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value.toUpperCase())}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            className="btn"
            onClick={() => fetchRate(from, to)}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        {/* Result display */}
        <div className="mt-4 card bg-gray-50">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {!error && rate && (
            <>
              <div className="text-sm opacity-70">Result</div>
              <div className="text-xl font-semibold mt-1">
                {amount} {from} = {converted?.toFixed(4)} {to}
              </div>
              <div className="text-xs opacity-60 mt-1">
                Rate: {rate.toFixed(6)} • Updated{" "}
                {timestamp ? timestamp.toLocaleTimeString() : ""}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside className="card">
        <h3 className="font-medium mb-2">
          Popular in {site.region || "Global"}
        </h3>
        <ul className="space-y-1">
          {regional.map((p, i) => (
            <li key={i}>
              <button
                className="underline"
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

        <h3 className="font-medium mt-4 mb-2">Global Majors</h3>
        <ul className="space-y-1">
          {majors.map((p, i) => (
            <li key={i}>
              <button
                className="underline"
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

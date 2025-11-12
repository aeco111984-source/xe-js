import { useEffect, useRef, useState } from "react";
import { getSiteEntry } from "./useSiteConfig";
import CurrencyPicker from "./CurrencyPicker";
import { fetchHybridRate } from "@/lib/fetchRate";
import "../styles/animations.css";

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
  const [source, setSource] = useState("—");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceTimer = useRef(null);

  async function handleFetch() {
    try {
      setLoading(true);
      setError("");
      const { rate, source } = await fetchHybridRate(from, to);
      setRate(rate);
      setSource(source);
      setConverted((Number(amount) || 0) * rate);
      setTimestamp(new Date());
    } catch (e) {
      console.error(e);
      setError("Could not fetch rate. Try again later.");
      setRate(null);
      setConverted(null);
      setSource("—");
    } finally {
      setLoading(false);
    }
  }

  function swap() {
    const a = from;
    setFrom(to);
    setTo(a);
  }

  useEffect(() => {
    handleFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  useEffect(() => {
    if (!rate) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setConverted((Number(amount) || 0) * rate);
    }, 150);
    return () => clearTimeout(debounceTimer.current);
  }, [amount, rate]);

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8">
      <div className="card w-full shadow-lg bg-white/80 backdrop-blur rounded-xl border border-gray-100 p-5 md:p-8 mb-8">
        <h1
          className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-sm text-center md:text-left"
          style={{ color: "var(--brand,#FF7A00)" }}
        >
          Currency Converter
        </h1>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 items-end">
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

          <div className="sm:col-span-2 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <CurrencyPicker
                  label="From"
                  value={from}
                  onChange={setFrom}
                />
              </div>
              <div className="flex flex-col justify-center items-center mt-6">
                <button
                  onClick={swap}
                  className="px-4 py-3 bg-[var(--brand,#FF7A00)] text-white rounded-md hover:opacity-90 text-[1rem] font-semibold flex items-center justify-center gap-1 shadow-md hover:scale-105 active:rotate-180 transition-transform duration-300"
                  title="Swap currencies"
                >
                  🔄 Swap
                </button>
              </div>
              <div className="flex-1">
                <CurrencyPicker label="To" value={to} onChange={setTo} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="btn w-full py-3 text-[1.15rem] font-semibold shadow-md hover:shadow-lg transition-all"
            onClick={handleFetch}
            disabled={loading}
          >
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>

        <div className="mt-10 card bg-white shadow-lg shadow-orange-100 border border-gray-200 text-center p-6 md:p-8 rounded-xl transition-all fade-in">
          {error && (
            <div className="text-red-500 text-[1.2rem] font-medium">{error}</div>
          )}

          {!error && rate && (
            <>
              <div className="text-[1.3rem] uppercase tracking-wide text-gray-500 mb-4 font-semibold">
                Result
              </div>
              <div
                className="text-3xl sm:text-4xl font-bold mb-3"
                style={{ color: "var(--brand,#FF7A00)" }}
              >
                <span className="tabular-nums font-mono">{amount}</span> {from}
                <span className="text-gray-700 font-normal mx-2">=</span>
                <span className="tabular-nums font-mono">
                  {converted?.toFixed(4)}
                </span>{" "}
                {to}
              </div>
              <div className="text-[1.1rem] text-gray-600 mt-4">
                <span className="font-semibold text-[var(--brand,#FF7A00)]">
                  Rate:{" "}
                  <span className="tabular-nums font-mono">
                    {rate.toFixed(6)}
                  </span>
                </span>{" "}
                • Source: {source} • Updated{" "}
                {timestamp ? timestamp.toLocaleTimeString() : ""}
              </div>
              <div className="text-sm text-gray-400 mt-3">
                Mid-market reference only. Exact rates and fees vary per
                provider.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

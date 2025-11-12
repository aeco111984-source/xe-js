import { useEffect, useState } from "react";

const fxPairs = [
  { from: "EUR", to: "USD", label: "EUR/USD" },
  { from: "GBP", to: "USD", label: "GBP/USD" },
  { from: "USD", to: "JPY", label: "USD/JPY" },
  { from: "AUD", to: "USD", label: "AUD/USD" },
  { from: "USD", to: "CAD", label: "USD/CAD" },
  { from: "USD", to: "CHF", label: "USD/CHF" }
];

export default function Live() {
  const [category, setCategory] = useState("fx");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // FX data from Frankfurter
  useEffect(() => {
    async function fetchFx() {
      setLoading(true);
      try {
        const all = [];
        for (const p of fxPairs) {
          const url = `https://api.frankfurter.app/latest?amount=1&from=${encodeURIComponent(
            p.from
          )}&to=${encodeURIComponent(p.to)}`;
          const res = await fetch(url);
          if (!res.ok) continue;
          const data = await res.json();
          const rate = data?.rates?.[p.to] ?? null;
          const time = data?.date ?? "";
          if (rate) {
            all.push({
              label: p.label,
              last: rate,
              change: null,
              percent: null,
              time
            });
          }
        }
        setRows(all);
      } catch (e) {
        console.error(e);
        setRows([]);
      } finally {
        setLoading(false);
      }
    }

    if (category === "fx") {
      fetchFx();
    } else {
      setRows([]);
    }
  }, [category]);

  const categories = [
    { key: "fx", label: "FX Majors" },
    { key: "metals", label: "Precious Metals" },
    { key: "indices", label: "Indices" },
    { key: "crypto", label: "Crypto" },
    { key: "energy", label: "Energy" }
  ];

  return (
    <div className="max-w-5xl mx-auto w-full px-4 md:px-8">
      <h1
        className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-sm text-center md:text-left"
        style={{ color: "var(--brand,#FF7A00)" }}
      >
        Live Prices
      </h1>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-3 py-2 text-sm rounded-md border ${
              c.key === category
                ? "bg-[var(--brand,#FF7A00)] text-white border-[var(--brand,#FF7A00)]"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* FX table */}
      {category === "fx" && (
        <div className="card overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Pair</th>
                <th className="py-2 pr-4">Last</th>
                <th className="py-2 pr-4">Change</th>
                <th className="py-2 pr-4">% Change</th>
                <th className="py-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={5}>
                    Loading latest FX prices…
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((r) => (
                  <tr key={r.label} className="border-b">
                    <td className="py-2 pr-4 font-semibold">{r.label}</td>
                    <td className="py-2 pr-4">
                      {r.last ? r.last.toFixed(6) : "—"}
                    </td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2 pr-4">{r.time}</td>
                  </tr>
                ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="py-3 text-gray-500" colSpan={5}>
                    No data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="text-xs opacity-70 mt-3">
            Data from ECB (Frankfurter). Mid-market reference rates only. Change
            and % Change coming soon.
          </p>
        </div>
      )}

      {/* Placeholders for other categories */}
      {category !== "fx" && (
        <div className="card">
          <p className="text-sm text-gray-600">
            Live {categories.find((c) => c.key === category)?.label} data is
            being wired to the fastest free APIs (CoinGecko, Twelve Data, etc.)
            and will appear here once activated.
          </p>
        </div>
      )}
    </div>
  );
}

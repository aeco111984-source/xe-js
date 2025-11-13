import { useEffect, useMemo, useState } from "react";
import currencies from "@/config/currencies.json";

export default function CurrencyPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const current = useMemo(
    () => currencies.find((c) => c.code === value),
    [value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return currencies;
    return currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="relative">
      {label && (
        <label className="block text-lg mb-2 font-medium text-gray-700">
          {label}
        </label>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-full border rounded-md px-4 py-3 text-left bg-white text-[1.1rem] flex items-center justify-between"
      >
        <span>
          {current?.flag} {current?.code} — {current?.name}
        </span>
        <span>▾</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full max-h-72 overflow-y-auto bg-white border rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search currency…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 border-b text-[1rem]"
          />

          <ul className="max-h-60 overflow-y-auto">
            {filtered.map((c) => (
              <li
                key={c.code}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                  setQuery("");
                }}
              >
                <span>{c.flag}</span>
                <span className="font-mono">{c.code}</span>
                <span className="text-gray-600">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

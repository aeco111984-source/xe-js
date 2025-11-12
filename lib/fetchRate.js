const TD_BASE = "https://api.twelvedata.com/quote";
const ECB_BASE = "https://api.frankfurter.app/latest";

export async function fetchHybridRate(from, to) {
  const amt = 1;

  // 1) Try Twelve Data if key exists
  const tdKey = process.env.NEXT_PUBLIC_TWELVE_DATA_KEY;
  if (tdKey) {
    try {
      const symbol = `${from}/${to}`;
      const url = `${TD_BASE}?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(
        tdKey
      )}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data.price) {
          const rate = Number(data.price);
          if (!isNaN(rate) && rate > 0) {
            return { rate, source: "TwelveData" };
          }
        }
      }
    } catch (e) {
      console.warn("Twelve Data failed, falling back to ECB", e);
    }
  }

  // 2) Fallback: ECB (Frankfurter)
  try {
    const url = `${ECB_BASE}?amount=${amt}&from=${encodeURIComponent(
      from
    )}&to=${encodeURIComponent(to)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("ECB network error");
    const data = await res.json();
    if (data && data.rates && data.rates[to]) {
      const rate = Number(data.rates[to]);
      if (!isNaN(rate) && rate > 0) {
        return { rate, source: "ECB" };
      }
    }
  } catch (e) {
    console.error("ECB fetch error", e);
  }

  throw new Error("Unable to fetch rate from any source");
}

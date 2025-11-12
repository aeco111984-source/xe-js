import cfg from "@/config/site.config.json";

export function getSiteEntry(){
  const host = (typeof window !== "undefined" ? window.location.hostname : "").toLowerCase();
  const entry = (cfg.sites && cfg.sites[host]) || cfg.default;
  if (typeof document !== "undefined" && entry.primaryColor) {
    document.documentElement.style.setProperty("--brand", entry.primaryColor);
  }
  return entry;
}
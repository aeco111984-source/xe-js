/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { brand: "#FF7A00", primary: "#0f172a", accent: "#06b6d4" },
      boxShadow: { card: "0 4px 12px rgba(0,0,0,0.08)" },
      borderRadius: { xl: "1rem" }
    }
  },
  plugins: []
};
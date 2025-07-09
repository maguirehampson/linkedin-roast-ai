/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--text)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        "dark-bg": "var(--dark-bg)",
        "card-bg": "var(--card-bg)",
      },
    },
  },
  plugins: [],
} 

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    'bg-pastelOrange',
    'bg-pastelYellow',
    'bg-pastelGreen',
    'bg-pastelBlue',
    'text-pastelOrange',
    'text-pastelBlue',
    'text-coral',
    'bg-coral',
    'bg-pastelYellow/20',
    'bg-pastelOrange/20',
    'bg-pastelGreen/20',
    'bg-pastelBlue/20',
    // Tailwind defaults used by DB category colors
    'bg-rose-200',
    'bg-pink-200',
    'bg-red-200',
    'bg-yellow-200',
    'bg-sky-200',
    'bg-orange-200',
    'bg-green-200',
    'bg-purple-200',
    'bg-fuchsia-200',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'ui-rounded', 'sans-serif'],
        frankRuhl: ['Frank Ruhl Libre', 'serif'],
      },
      colors: {
        pastelYellow: "#ffd4a8", // apricot peach
        pastelBlue:   "#bae6fd", // sky blue
        pastelOrange: "#fed7aa", // warm peach-orange
        pastelGreen:  "#bbf7d0", // mint green
        pastelPlum:   "#e9d5ff", // soft lavender — garnish section
        coral:        "oklch(78% 0.13 38)", // warm salmon — category-card palette tone
        coralDeep:    "oklch(70% 0.15 36)", // hover state
        choco:        "#614e3e",
        'off-white':  '#faf9f7',
      },
      borderRadius: {
        ...{
          lg: '1.25rem',
          md: '0.75rem',
          sm: '0.5rem'
        }
      }
    }
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

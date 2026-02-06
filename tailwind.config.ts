import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        pb: {
          bg: '#0a0a0a',
          surface: '#0d0d0d',
          'surface-2': '#141414',
          border: '#2a2a2a',
          text: '#f5f2eb',
          'text-muted': '#8a8580',
          'text-faint': '#4a4540',
          accent: '#c45c35',
          'accent-hover': '#d97b5a',
          brass: '#b8a67a',
        },
      },
    },
  },
  plugins: [],
};
export default config;

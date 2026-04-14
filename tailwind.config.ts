import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ien-blue':   '#1C3D50',
        'ien-teal':   '#2B7A8B',
        'ien-cream':  '#F4EFE6',
        'ien-amber':  '#B8722E',
        'ien-carbon': '#1A2326',
        'ien-gray':   '#8E9CA3',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)'],
        dm: ['var(--font-dm-sans)'],
      },
    },
  },
  plugins: [],
};
export default config;

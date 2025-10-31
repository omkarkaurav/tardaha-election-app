// /client/tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Keep your colors, borderRadius, and boxShadow here if you want,
      // but remove the `keyframes` and `animation` sections entirely.
    },
  },
  plugins: [],
};
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Your main HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // This line tells Tailwind to scan all your React components
  ],
  theme: {
    extend: {
      // ... (your theme extensions, like fontFamily, keyframes, animation)
    },
  },
  plugins: [],
}
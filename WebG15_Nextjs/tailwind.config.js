/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enable dark mode using a class
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Scan all app files
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Scan all components
    "./src/styles/**/*.css",
 // Scan styles folder for classes
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Custom CSS variable for background
        foreground: "var(--foreground)", // Custom CSS variable for foreground
      },
      animation: {
        slideUp: "slideUp 0.5s ease-in-out",
        slideDown: "slideDown 0.5s ease-in-out",
        slideLeft: "slideLeft 0.5s ease-in-out",
        slideRight: "slideRight 0.5s ease-in-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [], // Add Tailwind plugins if needed
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // --- Primary & Secondary Palettes ---
        // Using a color object for shades is the standard Tailwind approach.
        // It allows you to use classes like `bg-primary` and `bg-primary-light`.
        primary: {
          light: "#DEE8CE",
          DEFAULT: "#a4b983",
        },
        // Remove 'secondary' as it's a duplicate of 'primary'
        // and can cause confusion.
        secondary: {
          light: "#DEE8CE",
          DEFAULT: "#a4b983",
        },
        primaryDeep: {
          light: "#3b82f6",
          DEFAULT: "#2563eb",
        },

        // --- Text Colors ---
        text: {
          title: "#15141F",
          subtitle: "#44444F",
          gray: "#77777D",
        },

        // --- Grayscale Palette ---
        gray: {
          light: "#EBE9E9",
          DEFAULT: "#E1E1E1", // Renamed from grayColor
          border: "#ABB3BB",
        },
        
        // --- Functional Colors ---
        // Grouping colors by their function makes the palette more logical.
        outline: "#a4b983", // Retaining the original name as it's functional
        divider: "#DEE5FF",
        dashBorder: "#ADBAF3",
        background: "#FAFAFA",
        error: "#AE0000",
      },
    },
  },
  plugins: [],
};
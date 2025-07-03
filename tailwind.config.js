/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#121212", // Black (main brand color) changeable h jab products ka colour combination badalana ho
        "primary-dark": "#000000", // Darker black for hover states
        secondary: "#f8f8f8", // Light gray (background)
        accent: "#d4a373", // Light brown accent (thoda sa change h abso se )
        cream: "#F5F5F0", // Cream color for sections(colour combination provided wale se use kia h)
        beige: "#f9f7f3", // Beige color for backgrounds
        "warm-beige": "#f9f7f2", // Warmer beige for trending products section
        sage: "#6a705d", // Sage green color - updated to exact requested color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],  // used this standard family, ye bhi change kr skte according to need .
        serif: ['Merriweather', 'serif'],
      },
    },
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
} 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // TB-focused color palette
        'tb-primary': '#1f2937',    // Dark gray-blue
        'tb-secondary': '#dc2626',  // Red for alert/abnormal
        'tb-success': '#16a34a',    // Green for normal/negative
        'tb-warning': '#ea580c',    // Orange for caution
        'tb-light': '#f3f4f6',      // Light gray for backgrounds
        'tb-accent': '#2563eb',     // Blue for accents
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
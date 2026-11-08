/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F8F6F1", ink: "#24231F", muted: "#77766F", subtle: "#AAA49A",
        burgundy: "#783F46", sand: "#DDD5C8", beige: "#EAE5DC", taupe: "#CFC5B7"
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

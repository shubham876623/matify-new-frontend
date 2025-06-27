module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        gilroy: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          background: "#272727",
          foreground: "#ffffff",
          light: "#404040",
          dark: "#1a1a1a",
        },
        secondary: {
          background: "#ffffff",
          foreground: "#272727",
          light: "#f9fafb",
          dark: "#f5f6f6",
        },
        accent: {
          DEFAULT: "#1cc26a",
          foreground: "#ffffff",
          light: "#50d890",
          dark: "#16a05a",
        },
        border: {
          primary: "#e4e4e4",
          secondary: "#f8f8f8",
          light: "#ececec",
          dark: "#909090",
        },
        text: {
          primary: "#272727",
          secondary: "#787878",
          muted: "#a1a1a1",
          disabled: "#949494",
        },
        darkgray1: "#2d2d2d",
        darkgray2: "#2c2c2c",
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom, #2d2d2d, #2c2c2c)',
      },
    },
  },
  plugins: [],
};

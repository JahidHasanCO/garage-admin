export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#DEE8CE",        // <- this enables text-primary, bg-primary, etc.
        primaryDeep: "#a4b983",
        secondary: "#DEE8CE",
        secondaryDeep: "#a4b983",
        textTitle: "#15141F",
        textSubtitle: "#44444F",
        textGray: "#77777D",
        outline: "#a4b983",
        grayColor: "#E1E1E1",
        grayLight: "#EBE9E9",
        grayBorder: "#ABB3BB",
        divider: "#DEE5FF",
        dashBorder: "#ADBAF3",
        background: "#FAFAFA",
        error: "#AE0000",
      },
    },
  },
  plugins: [],
};

module.exports = {
  ident: "postcss",
  plugins: [
    require("autoprefixer")({
      browsers: ["> 0.1%", "ios >= 8", "not ie < 12"]
    }),
    require("postcss-plugin-px2rem")({
      rootValue: 75,
      minPixelValue: 1.01
    }),
    require("postcss-plugin-weex")()
  ]
};
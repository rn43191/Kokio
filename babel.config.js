module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["@babel/plugin-syntax-import-assertions"],
      [
        "module-resolver",
        {
          alias: {
            crypto: "crypto-browserify",
            stream: "stream-browserify",
          },
        },
      ],
    ],
  };
};
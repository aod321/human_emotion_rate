import HtmlWebpackPlugin from "html-webpack-plugin";

/** @param {import("webpack").Configuration} config */
export function webpack(config) {
  // Find the HtmlWebpackPlugin in the plugins array
  const htmlWebpackPlugin = config.plugins.find(
    (plugin) => plugin instanceof HtmlWebpackPlugin
  );

  // Update the viewport meta tag
  if (htmlWebpackPlugin) {
    htmlWebpackPlugin.userOptions.meta.viewport =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no";
  }

  return config;
}

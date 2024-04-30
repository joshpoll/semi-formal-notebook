/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, options) => {
    config.module.rules.push(
      // Rule for pyodide kernel
      {
        test: /\.whl$/,
        type: "asset/resource",
        generator: {
          filename: "pypi/[name][ext][query]",
        },
      }
    );
    return config;
  },
};

export default nextConfig;

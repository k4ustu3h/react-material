import createMDX from "@next/mdx";
import { rehypeInlineCodeProperty } from "react-shiki/web";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include markdown and MDX files
  pageExtensions: ["mdx", "ts", "tsx"],

  turbopack: {
    rules: {
      "*.raw.css": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
    },
  },

  webpack(config) {
    config.module?.rules?.push({
      test: /\.raw\.css$/,
      use: "raw-loader",
    });
    return config;
  },

  async redirects() {
    return [
      {
        source: "/docs",
        destination: "/docs/get-started/introduction",
        permanent: true,
      },
      {
        source: "/docs/get-started",
        destination: "/docs/get-started/introduction",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeInlineCodeProperty],
  },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);

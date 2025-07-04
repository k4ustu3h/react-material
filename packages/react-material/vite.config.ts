import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { glob } from "glob";
import dts from "vite-plugin-dts";
import { viteCopyPlugin } from "./vite-copy-plugin";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

// Get all component files
const componentFiles = glob.sync("components/**/*.{ts,tsx}", {
  ignore: ["components/**/index.ts", "**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
});

// Create input object for multiple entry points
const createInputs = () => {
  const inputs: Record<string, string> = {
    index: resolve(__dirname, "index.ts"),
  };

  // Add each component as a separate entry point
  componentFiles.forEach((file) => {
    const name = file.replace(/\.(ts|tsx)$/, "").replace(/^components\//, "");
    inputs[name] = resolve(__dirname, file);
  });

  return inputs;
};

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      relativeCSSInjection: true,
    }),
    dts({
      include: ["index.ts", "types.d.ts", "components", "utils"],
      exclude: ["node_modules", "dist", "types"],
      outDir: "dist/types",
      insertTypesEntry: true,
      copyDtsFiles: true,
    }),
    viteCopyPlugin({
      targets: [
        { src: "css/**/*", dest: "dist" },
      ],
    }),
  ],
  build: {
    cssCodeSplit: true,
    emptyOutDir: false,
    lib: {
      entry: createInputs(),
      fileName: (format, entryName) => {
        if (format === "es") {
          return `${entryName}.js`;
        } else {
          return `cjs/${entryName}.cjs`;
        }
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: [
        {
          format: "es",
          dir: "dist",
          preserveModules: true,
          preserveModulesRoot: ".",
          entryFileNames: "[name].js",
          chunkFileNames: "[name].js",
          exports: "named",
        },
        // {
        //   format: "cjs",
        //   dir: "dist/cjs",
        //   preserveModules: true,
        //   preserveModulesRoot: ".",
        //   entryFileNames: "[name].cjs",
        //   chunkFileNames: "[name].cjs",
        //   exports: "named",
        // },
      ],
    },
    // sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    copyPublicDir: false,
  },
  css: {
    modules: {
      localsConvention: "camelCase",
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});

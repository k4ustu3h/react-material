import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import cleanup from "rollup-plugin-cleanup";
import { glob } from "glob";

// Get all component files
const componentFiles = glob.sync("components/**/*.{ts,tsx}", {
  ignore: ["components/**/index.ts", "**/*.test.{ts,tsx}", "**/*.stories.{ts,tsx}"],
});

// Create input object for multiple entry points
const createInputs = () => {
  const inputs = {
    index: "index.ts",
  };

  // Add each component as a separate entry point
  componentFiles.forEach((file) => {
    const name = file.replace(/\.(ts|tsx)$/, "").replace(/^components\//, "");
    inputs[name] = file;
  });

  return inputs;
};

export default [
  // Main build configuration
  {
    input: createInputs(),
    output: [
      {
        dir: "dist",
        format: "esm",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: ".",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
      {
        dir: "dist/cjs",
        format: "cjs",
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: ".",
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
        exports: "named",
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        outDir: undefined,
        declaration: false,
        emitDeclarationOnly: false,
      }),
      cleanup({
        comments: "none",
        extensions: [".ts", ".tsx"],
      }),
      terser(),
      postcss(),
      copy({
        targets: [
          // { src: "components/misc/fonts/**/*", dest: "dist/fonts" },
          { src: "../../node_modules/material-symbols/*.woff2", dest: "dist" },
          { src: "css/**/*", dest: "dist" },
        ],
      }),
    ],
    external: ["react", "react-dom"],
  },
  // Type definitions
  {
    input: createInputs(),
    output: {
      dir: "dist/types",
      format: "es",
      preserveModules: true,
      preserveModulesRoot: ".",
    },
    plugins: [dts.default(), postcss()],
    external: [/\.scss$/, /\.css$/],
  },
];

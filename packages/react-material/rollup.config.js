import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";

import packageJson from "./package.json";

export default [
  {
    input: "index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      postcss(),
      copy({
        targets: [
          { src: "components/misc/fonts/**/*", dest: "dist/fonts" },
          { src: "css/**/*", dest: "dist" },
        ],
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "index.ts",
    output: [{ file: "dist/types.d.ts", format: "es" }],
    plugins: [dts.default(), postcss()],
    external: [/\.scss$/, /\.css$/],
  },
];

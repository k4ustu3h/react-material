import { defineConfig } from "rolldown";
import { glob } from "glob";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";

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

// Custom copy plugin for Rolldown
const copyPlugin = () => ({
  name: "copy",
  generateBundle() {
    // Create dist directory if it doesn't exist
    if (!existsSync("dist")) {
      mkdirSync("dist", { recursive: true });
    }

    // Copy material symbols fonts
    const fontFiles = glob.sync("../../node_modules/material-symbols/*.woff2");
    fontFiles.forEach(file => {
      const filename = file.split(/[/\\]/).pop(); // Handle both Unix and Windows paths
      const destPath = join("dist", filename);
      copyFileSync(file, destPath);
    });

    // Copy CSS files
    const cssFiles = glob.sync("css/**/*");
    cssFiles.forEach(file => {
      const destPath = join("dist", file);
      const destDir = dirname(destPath);
      if (!existsSync(destDir)) {
        mkdirSync(destDir, { recursive: true });
      }
      copyFileSync(file, destPath);
    });
  }
});

export default defineConfig([
  // Main build configuration - ESM
  {
    input: createInputs(),
    output: {
      dir: "dist",
      format: "esm",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: ".",
      entryFileNames: "[name].js",
      chunkFileNames: "[name].js",
    },
    external: [
      "react", 
      "react-dom",
      // External CSS imports to avoid bundling issues
      "material-symbols/index.css"
    ],
    platform: "browser",
    plugins: [copyPlugin()],
  },
  // CommonJS build
  {
    input: createInputs(),
    output: {
      dir: "dist/cjs",
      format: "cjs",
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: ".",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name].cjs",
      exports: "named",
    },
    external: [
      "react", 
      "react-dom",
      // External CSS imports to avoid bundling issues
      "material-symbols/index.css"
    ],
    platform: "node",
  },
]);

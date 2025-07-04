#!/usr/bin/env node

const { buildProd, buildDev } = require("./esbuild.config.js");

// Get the mode from command line arguments
const mode = process.argv[2] || "build";

async function main() {
  try {
    switch (mode) {
      case "build":
        await buildProd();
        break;
      case "dev":
      case "watch":
        await buildDev();
        break;
      default:
        console.error("❌ Unknown mode. Use: build or dev");
        process.exit(1);
    }
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
}

main();

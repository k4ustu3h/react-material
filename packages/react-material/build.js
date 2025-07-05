#!/usr/bin/env node

const { buildProd, buildDev } = require("./esbuild.config.js");
const { spawn } = require("child_process");
const { glob } = require("glob");
const { watch } = require("chokidar");

let devProcess = null;
let isRestarting = false;
let watcher = null;

// Get current file list
const getFileList = () => {
  try {
    const files = glob.sync("{components,utils}/**/*.{ts,tsx}", {
      ignore: [
        "**/*.test.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*_test.{ts,tsx}",
        "**/test.{ts,tsx}",
      ],
    });
    return files.sort();
  } catch (error) {
    console.error("Error getting file list:", error);
    return [];
  }
};

// Start dev build
const startDevBuild = () => {
  if (devProcess) {
    console.log("🔄 Stopping existing build...");
    devProcess.kill("SIGTERM");
  }

  console.log("🚀 Starting development build...");
  devProcess = spawn("node", ["esbuild.config.js", "dev"], {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  });

  devProcess.on("exit", (code) => {
    if (code !== 0 && !isRestarting) {
      console.error(`❌ Build exited with code ${code}`);
    }
    devProcess = null;
  });
};

// Restart build
const restartBuild = () => {
  if (isRestarting) return;
  isRestarting = true;

  console.log("\n📁  File changes detected, restarting...");

  if (devProcess) {
    devProcess.kill("SIGTERM");
  }

  setTimeout(() => {
    startDevBuild();
    isRestarting = false;
  }, 1000);
};

// Watch for file changes using chokidar
const startFileWatching = () => {
  const watchPatterns = [
    "components/**/*.{ts,tsx}",
    "utils/**/*.{ts,tsx}",
    "index.ts",
    "esbuild.config.js",
    "package.json",
  ];

//   console.log(`📊 Watching files for changes: ${watchPatterns.join(", ")}`);

  watcher = watch(watchPatterns, {
    ignored: [
      "**/*.test.{ts,tsx}",
      "**/*.stories.{ts,tsx}",
      "**/*_test.{ts,tsx}",
      "**/test.{ts,tsx}",
      "**/node_modules/**",
      "**/dist/**",
      "**/.git/**",
    ],
    ignoreInitial: true,
    persistent: true,
  });

  watcher.on("add", (path) => {
    console.log(`➕ File added: ${path}`);
    restartBuild();
  });

  watcher.on("unlink", (path) => {
    console.log(`➖ File removed: ${path}`);
    restartBuild();
  });

  watcher.on("change", (path) => {
    // Only restart for config changes, not regular file changes
    // (regular file changes are handled by esbuild's own watcher)
    if (path.includes("esbuild.config.js") || path.includes("package.json")) {
      console.log(`🔄 Config file changed: ${path}`);
      restartBuild();
    }
  });

  watcher.on("error", (error) => {
    console.error("❌ File watcher error:", error);
  });
};

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
        startDevBuild();
        startFileWatching();
        // await buildDev();
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

const cleanup = () => {
  //   console.log("\n🛑 Stopping auto-restart build...");

  if (watcher) {
    watcher.close();
  }

  if (devProcess) {
    devProcess.kill("SIGTERM");
  }

  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

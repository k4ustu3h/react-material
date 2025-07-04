#!/usr/bin/env node

const { buildProd, buildDev } = require("./esbuild.config.js");
const { spawn } = require("child_process");
const { glob } = require("glob");

let devProcess = null;
let isRestarting = false;
let fileCheckInterval = null;

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

// Poll for file changes (more reliable than fs.watch on Windows)
const startFilePolling = () => {
  let currentFiles = getFileList();
  console.log(`📊 Watching ${currentFiles.length} files for changes`);

  fileCheckInterval = setInterval(() => {
    const newFiles = getFileList();

    if (JSON.stringify(currentFiles) !== JSON.stringify(newFiles)) {
      const added = newFiles.filter((f) => !currentFiles.includes(f));
      const removed = currentFiles.filter((f) => !newFiles.includes(f));

      if (added.length > 0) {
        console.log(`➕ Added files: ${added.join(", ")}`);
      }
      if (removed.length > 0) {
        console.log(`➖ Removed files: ${removed.join(", ")}`);
      }

      currentFiles = newFiles;
      restartBuild();
    }
  }, 2000); // Check every 2 seconds
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
        startFilePolling();
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

  if (fileCheckInterval) {
    clearInterval(fileCheckInterval);
  }

  if (devProcess) {
    devProcess.kill("SIGTERM");
  }

  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

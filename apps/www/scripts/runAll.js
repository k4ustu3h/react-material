#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const SCRIPTS_DIR = import.meta.dirname;

// Define execution order for scripts
// Scripts not listed here will run after the ordered ones in alphabetical order
const SCRIPT_ORDER = ["generateIndex.js", "generateSearchIndex.js", "generateOGImages.mjs"];

/**
 * Execute a script file and return a promise
 */
function executeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Running: ${path.basename(scriptPath)}`);
    console.log(`📂 Path: ${scriptPath}`);
    console.log("─".repeat(50));

    const isESModule = scriptPath.endsWith(".mjs") || scriptPath.endsWith(".js");
    const command = "node";
    const args = [scriptPath];

    const child = spawn(command, args, {
      stdio: "inherit",
      cwd: path.dirname(scriptPath),
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`✅ ${path.basename(scriptPath)} completed successfully`);
        resolve();
      } else {
        console.log(`❌ ${path.basename(scriptPath)} failed with exit code ${code}`);
        reject(new Error(`Script ${scriptPath} failed with exit code ${code}`));
      }
    });

    child.on("error", (err) => {
      console.log(`❌ Error running ${path.basename(scriptPath)}:`, err.message);
      reject(err);
    });
  });
}

/**
 * Main function to run all scripts
 */
async function runAllScripts() {
  console.log("🔄 Starting to run all scripts in the scripts folder...\n");

  try {
    // Read all files in the scripts directory
    const files = fs.readdirSync(SCRIPTS_DIR);

    // Filter for script files (excluding this runner script)
    const allScriptFiles = files.filter((file) => {
      const isScript =
        (file.endsWith(".js") || file.endsWith(".mjs")) &&
        file !== "runAll.js" &&
        !file.startsWith("."); // Ignore hidden files
      return isScript;
    });

    if (allScriptFiles.length === 0) {
      console.log("ℹ️  No script files found to execute.");
      return;
    }

    // Sort scripts according to SCRIPT_ORDER
    const orderedScripts = [];
    const unorderedScripts = [];

    // First, add scripts in the defined order
    for (const orderedScript of SCRIPT_ORDER) {
      if (allScriptFiles.includes(orderedScript)) {
        orderedScripts.push(orderedScript);
      }
    }

    // Then add remaining scripts alphabetically
    for (const script of allScriptFiles) {
      if (!SCRIPT_ORDER.includes(script)) {
        unorderedScripts.push(script);
      }
    }
    unorderedScripts.sort(); // Sort alphabetically

    const scriptFiles = [...orderedScripts, ...unorderedScripts];

    console.log(`📋 Found ${scriptFiles.length} script(s) to run in order:`);
    scriptFiles.forEach((file, index) => {
      const orderInfo = SCRIPT_ORDER.includes(file)
        ? `(ordered: ${SCRIPT_ORDER.indexOf(file) + 1})`
        : "(alphabetical)";
      console.log(`   ${index + 1}. ${file} ${orderInfo}`);
    });

    // Run each script sequentially
    for (const scriptFile of scriptFiles) {
      const scriptPath = path.join(SCRIPTS_DIR, scriptFile);
      try {
        await executeScript(scriptPath);
      } catch (error) {
        console.error(`\n💥 Failed to execute ${scriptFile}`);
        console.error(`Error: ${error.message}`);

        // Ask if we should continue with other scripts
        console.log("\n❓ Continue with remaining scripts? (Press Ctrl+C to stop)");
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Brief pause
      }
    }

    console.log("\n🎉 All scripts execution completed!");
  } catch (error) {
    console.error("💥 Error occurred while running scripts:", error.message);
    process.exit(1);
  }
}

// Run the main function
runAllScripts().catch((error) => {
  console.error("💥 Unexpected error:", error);
  process.exit(1);
});

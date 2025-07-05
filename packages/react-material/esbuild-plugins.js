const {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  copyFileSync,
  unlinkSync,
} = require("fs");
const { dirname, basename, resolve } = require("path");
const { glob } = require("glob");
const { watch } = require("chokidar");

// Track CSS dependencies for watch mode
const cssDependencies = new Map(); // tsFile -> Set of cssFiles

/**
 * CSS processing plugin with dependency tracking
 * Injects CSS files directly into TypeScript/JavaScript files
 */
const cssPlugin = {
  name: "css-processor",
  setup(build) {
    build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
      if (args.namespace === "css-virtual") return;

      let contents;
      try {
        contents = readFileSync(args.path, "utf8");
      } catch (error) {
        console.warn(`⚠️  Warning: Could not read file ${args.path}:`, error.message);
        return;
      }

      const cssImportRegex = /import\s+["']([^"']+\.css)["'];?/g;

      let hasModifications = false;
      let transformedContents = contents;
      const matches = [...contents.matchAll(cssImportRegex)];

      if (matches.length === 0) {
        // Clear dependencies if no CSS imports
        cssDependencies.delete(args.path);
        return;
      }

      // Track CSS dependencies for this file
      const cssFiles = new Set();

      for (const match of matches) {
        const cssPath = match[1];
        const fullCssPath = resolve(dirname(args.path), cssPath);

        if (!existsSync(fullCssPath)) {
          console.warn(`⚠️  Warning: CSS file not found, skipping: ${cssPath}`);
          continue;
        }

        // Add to dependencies
        cssFiles.add(fullCssPath);

        hasModifications = true;

        try {
          // Always read fresh CSS content (no caching)
          const css = readFileSync(fullCssPath, "utf8");
          // Simplified minification for better performance
          const minifiedCss = css
            .replace(/\/\*[\s\S]*?\*\//g, "")
            .replace(/\s+/g, " ")
            .replace(/;\s*}/g, "}")
            // .replace(/\s*[{};:,>+~]\s*/g, (match) => match.trim())
            .trim();

          const cssId = fullCssPath.replace(/[^a-zA-Z0-9]/g, "_");
          const cssInjection = `
// CSS injection for ${cssPath}
if (typeof document !== 'undefined') {
  const cssId = '${cssId}';
  if (!document.head.querySelector('[data-css-id="' + cssId + '"]')) {
    const style = document.createElement('style');
    style.setAttribute('data-css-id', cssId);
    style.textContent = ${JSON.stringify(minifiedCss)};
    document.head.appendChild(style);
  }
}`;

          transformedContents = transformedContents.replace(match[0], cssInjection);
        } catch (error) {
          console.warn(`⚠️  Warning: Could not read CSS file ${fullCssPath}:`, error.message);
          continue;
        }
      }

      // Update dependencies
      if (cssFiles.size > 0) {
        cssDependencies.set(args.path, cssFiles);
      } else {
        cssDependencies.delete(args.path);
      }

      if (hasModifications) {
        return {
          contents: transformedContents,
          loader: args.path.endsWith(".tsx")
            ? "tsx"
            : args.path.endsWith(".ts")
              ? "ts"
              : args.path.endsWith(".jsx")
                ? "jsx"
                : "js",
        };
      }
    });
  },
};

/**
 * CSS file watcher plugin for development
 * Watches CSS files and triggers rebuilds when they change
 */
const cssWatchPlugin = {
  name: "css-watcher",
  setup(build) {
    let watcher;
    let isFirstBuild = true;

    build.onEnd(() => {
      // Setup watcher after the first build when dependencies are populated
      if (isFirstBuild) {
        isFirstBuild = false;

        // Get all CSS files that are being imported
        const allCssFiles = new Set();
        for (const cssFiles of cssDependencies.values()) {
          for (const cssFile of cssFiles) {
            allCssFiles.add(cssFile);
          }
        }

        if (allCssFiles.size > 0) {
          // Watch all CSS files
          watcher = watch([...allCssFiles], {
            ignoreInitial: true,
            persistent: false,
          });

          watcher.on("change", (changedFile) => {
            console.log(`📄 CSS file changed: ${basename(changedFile)}`);

            // Find all TypeScript files that depend on this CSS file
            const affectedTsFiles = [];
            for (const [tsFile, cssFiles] of cssDependencies.entries()) {
              if (cssFiles.has(changedFile)) {
                affectedTsFiles.push(tsFile);
              }
            }

            if (affectedTsFiles.length > 0) {
              console.log(
                `🔄 Triggering rebuild for affected files: ${affectedTsFiles.map((f) => f.split("\\").pop()).join(", ")}`
              );

              // Use global build context if available
              if (global._currentBuildContext && global._currentBuildContext.rebuild) {
                global._currentBuildContext.rebuild().catch((error) => {
                  console.warn("⚠️  CSS-triggered rebuild failed:", error.message);
                });
              }
            }
          });

          watcher.on("error", (error) => {
            console.warn("⚠️  CSS watcher error:", error);
          });
        }
      } else {
        // Update watcher if new CSS dependencies are found
        const allCssFiles = new Set();
        for (const cssFiles of cssDependencies.values()) {
          for (const cssFile of cssFiles) {
            allCssFiles.add(cssFile);
          }
        }

        if (watcher && allCssFiles.size > 0) {
          // Update the watcher with new files
          watcher.add([...allCssFiles]);
        }
      }
    });

    // Clean up watcher when build context is disposed
    build.onDispose(() => {
      if (watcher) {
        watcher.close();
        watcher = null;
      }
    });
  },
};

/**
 * File copy plugin for production builds
 * Copies CSS files from css directory to dist
 */
const copyPlugin = {
  name: "copy-files",
  setup(build) {
    build.onEnd(() => {
      // Only copy files in production builds for better dev performance
      if (process.env.NODE_ENV === "development") return;

      try {
        // Copy CSS files from css directory using optimized glob
        const cssFiles = glob.sync("css/**/*", { absolute: false, posix: true });
        cssFiles.forEach((file) => {
          const src = resolve(__dirname, file);
          const dest = resolve(__dirname, "dist", file);

          const destDir = dirname(dest);
          if (!existsSync(destDir)) {
            mkdirSync(destDir, { recursive: true });
          }

          if (existsSync(src)) {
            copyFileSync(src, dest);
          }
        });
      } catch (error) {
        console.warn("⚠️  CSS file copying failed:", error);
      }
    });
  },
};

/**
 * New file detector plugin for development
 * Detects when new files are added and suggests restarting
 */
const createNewFileDetectorPlugin = (getEntryPointsHash) => ({
  name: "new-file-detector",
  setup(build) {
    let startTime;
    let buildCount = 0;
    let lastEntryPointsHash = "";

    build.onStart(() => {
      startTime = Date.now();
      buildCount++;

      // Check for new files every few builds
      if (buildCount % 3 === 0) {
        const currentHash = getEntryPointsHash();
        if (lastEntryPointsHash && currentHash !== lastEntryPointsHash) {
          console.log(
            "📁 File structure changed! You may need to restart dev mode for updated entry points."
          );
        }
        lastEntryPointsHash = currentHash;
      }

      console.log("⚠️  File changed. Rebuilding...");
    });

    build.onEnd((result) => {
      const duration = Date.now() - startTime;

      if (result.errors.length > 0) {
        console.log(`❌ Build completed with errors (${(duration / 1000).toFixed(2)}s):`);
        result.errors.forEach((error) => console.error("  ", error.text));
      } else if (result.warnings.length > 0) {
        console.log(`⚠️  Build completed with warnings (${(duration / 1000).toFixed(2)}s):`);
        result.warnings.forEach((warning) => console.warn("  ", warning.text));
      } else {
        console.log(`✅ Build completed successfully! (${(duration / 1000).toFixed(2)}s)`);
      }
    });
  },
});

/**
 * Shared function to generate all DTS files
 * Used by both development and production DTS plugins
 */
async function generateAllDtsFilesShared(tsConfigPath) {
  try {
    // console.log("🔄 Generating all TypeScript declarations...");
    const startTime = Date.now();

    const { spawn } = require("child_process");

    // Build the TypeScript command with optional tsconfig path
    const tscArgs = ["run", "tsgo", "--"];

    // Add tsconfig path if provided
    if (tsConfigPath) {
      tscArgs.push("--project", tsConfigPath);
    } else {
      tscArgs.push("--project", "tsconfig.json");
    }

    const tscProcess = spawn("npm", tscArgs, {
      stdio: ["pipe", "pipe", "pipe"],
      shell: true,
      cwd: process.cwd(),
    });

    let stdout = "";
    let stderr = "";

    tscProcess.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    tscProcess.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    return new Promise((resolve, reject) => {
      tscProcess.on("close", (code) => {
        const duration = Date.now() - startTime;
        if (code === 0) {
          console.log(`✅ Declarations generated successfully! (${(duration / 1000).toFixed(2)}s)`);
          resolve();
        } else {
          console.warn(`⚠️  TypeScript declaration generation failed`);
          if (stderr) {
            console.error("TypeScript errors:");
            console.error(stdout);
          }
          reject(new Error("DTS generation failed"));
        }
      });
    });
  } catch (error) {
    console.warn(`⚠️  Error generating TypeScript declarations:`, error.message);
    throw error;
  }
}

/**
 * Development DTS generator plugin
 * Generates all TypeScript declarations once initially, then watches for changes
 */
const createDevDtsGeneratorPlugin = () => ({
  name: "dev-dts-generator",
  setup(build) {
    let dtsWatcher;
    let isInitialBuild = true;

    build.onEnd(() => {
      if (isInitialBuild) {
        isInitialBuild = false;
        // console.log("⚡ Initial build completed. Generating all TypeScript declarations...");

        // Generate all DTS files initially
        generateAllDtsFiles().then(() => {
          // Set up watcher after initial generation
          setupDtsWatcher();
        });
        return;
      }
    });

    // Function to generate all DTS files at once
    async function generateAllDtsFiles() {
      return generateAllDtsFilesShared();
    }

    // Function to set up file watcher for TypeScript files
    function setupDtsWatcher() {
      try {
        const files = glob.sync(["./components/**/*.{ts,tsx}", "./index.ts"], {
          posix: true,
          ignore: [
            "**/*.test.{ts,tsx}",
            "**/*.stories.{ts,tsx}",
            "**/*_test.{ts,tsx}",
            "**/test.{ts,tsx}",
          ],
        });

        dtsWatcher = watch(files, {
          ignoreInitial: true,
          persistent: true,
        });

        dtsWatcher.on("change", (filePath) => {
          console.log(`📝 TypeScript file changed: ${basename(filePath)}`);
          // Create a temporary tsconfig that only includes the changed file
          const tempTsConfig = {
            extends: "./tsconfig.json",
            compilerOptions: {
              declaration: true,
              emitDeclarationOnly: true,
              outDir: "dist",
            },
            include: [filePath],
          };

          // Write temporary config file
          const tempConfigPath = resolve(process.cwd(), "tsconfig.temp.json");
          writeFileSync(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));

          generateAllDtsFilesShared(tempConfigPath).catch((error) => {
            console.warn("⚠️  Failed to regenerate declarations:", error.message);
          });
        });

        dtsWatcher.on("add", (filePath) => {
          console.log(`📝 New TypeScript file added: ${basename(filePath)}`);
          console.log(`📝 TypeScript file changed: ${basename(filePath)}`);
          // Create a temporary tsconfig that only includes the changed file
          const tempTsConfig = {
            extends: "./tsconfig.json",
            compilerOptions: {
              declaration: true,
              emitDeclarationOnly: true,
              outDir: "dist",
            },
            include: [filePath.replace(/\\/g, "/")],
          };

          // Write temporary config file
          const tempConfigPath = resolve(process.cwd(), "tsconfig.temp.json");
          writeFileSync(tempConfigPath, JSON.stringify(tempTsConfig, null, 2));
          generateAllDtsFilesShared(tempConfigPath).catch((error) => {
            console.warn("⚠️  Failed to regenerate declarations:", error.message);
          });
        });

        dtsWatcher.on("error", (error) => {
          console.warn("⚠️  DTS watcher error:", error);
        });

        // console.log("🔍 TypeScript declaration watcher is ready!");
      } catch (error) {
        console.warn("⚠️  Failed to set up DTS watcher:", error.message);
      }
    }

    // Clean up watcher when build context is disposed
    build.onDispose(() => {
      if (dtsWatcher) {
        dtsWatcher.close();
        dtsWatcher = null;

        // Clean up temporary config file
        const tempConfigPath = resolve(process.cwd(), "tsconfig.temp.json");
        if (existsSync(tempConfigPath)) {
          unlinkSync(tempConfigPath);
        }
      }
    });
  },
});

/**
 * Production DTS plugin
 * Uses the shared generateAllDtsFiles function for TypeScript declaration generation
 */
const createProductionDtsPlugin = (tsConfigPath) => ({
  name: "production-dts-generator",
  setup(build) {
    build.onEnd(async (result) => {
      // Only generate DTS files if the build was successful
      if (result.errors.length === 0) {
        try {
          await generateAllDtsFilesShared(tsConfigPath);
        } catch (error) {
          console.warn("⚠️  Production DTS generation failed:", error.message);
        }
      }
    });
  },
});

module.exports = {
  cssPlugin,
  cssWatchPlugin,
  copyPlugin,
  createNewFileDetectorPlugin,
  createDevDtsGeneratorPlugin,
  createProductionDtsPlugin,
};

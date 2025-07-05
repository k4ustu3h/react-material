const { build, context } = require("esbuild");
const path = require("path");
const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } = require("fs");
const { dirname, basename } = require("path");
const { glob } = require("glob");
const {
  cssPlugin,
  cssWatchPlugin,
  copyPlugin,
  createNewFileDetectorPlugin,
  createDevDtsGeneratorPlugin,
  createProductionDtsPlugin,
} = require("./esbuild-plugins");

// Cache for entry points to avoid regenerating them
let cachedEntryPoints = null;

// Get all component files with optimized glob patterns
const getComponentFiles = () => {
  try {
    return glob.sync("components/**/*.{ts,tsx}", {
      posix: true,
      ignore: [
        "**/*.test.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*_test.{ts,tsx}",
        "**/test.{ts,tsx}",
      ],
      absolute: false, // Use relative paths for better performance
    });
  } catch (error) {
    console.warn("⚠️  Warning: Error getting component files:", error.message);
    return [];
  }
};

// Create entry points for multiple builds (cached with file watching support)
const createEntryPoints = (useCache = true) => {
  if (useCache && cachedEntryPoints) {
    return cachedEntryPoints;
  }

  const entryPoints = {};

  // Add main index file
  const mainIndexPath = resolve(__dirname, "index.ts");
  if (existsSync(mainIndexPath)) {
    entryPoints["index"] = mainIndexPath;
  } else {
    console.warn("⚠️  Warning: Main index file not found:", mainIndexPath);
  }

  // Add each component as a separate entry point
  const componentFiles = getComponentFiles();
  componentFiles.forEach((file) => {
    const fullPath = resolve(__dirname, file);
    if (existsSync(fullPath)) {
      const name = file.replace(/\.(ts|tsx)$/, "");
      entryPoints[name] = fullPath;
    } else {
      console.warn(`⚠️  Warning: Component file not found, skipping: ${file}`);
    }
  });

  // Add utility files (excluding test files) with optimized pattern
  let utilFiles = [];
  try {
    utilFiles = glob.sync("utils/**/*.{ts,tsx}", {
      posix: true,
      ignore: [
        "**/*.test.{ts,tsx}",
        "**/*.stories.{ts,tsx}",
        "**/*_test.{ts,tsx}",
        "**/test.{ts,tsx}",
      ],
      absolute: false,
    });
  } catch (error) {
    console.warn("⚠️  Warning: Error getting utility files:", error.message);
  }

  utilFiles.forEach((file) => {
    const fullPath = resolve(__dirname, file);
    if (existsSync(fullPath)) {
      const name = file.replace(/\.(ts|tsx)$/, "");
      entryPoints[name] = fullPath;
    } else {
      console.warn(`⚠️  Warning: Utility file not found, skipping: ${file}`);
    }
  });

  if (useCache) {
    cachedEntryPoints = entryPoints;
  }
  return entryPoints;
};

// Enhanced entry point manager for dev builds
const createDynamicEntryPoints = () => {
  // Always regenerate entry points for dev builds to catch new files
  return createEntryPoints(false);
};

// Base configuration for the main bundle
/**
 * @type {import("esbuild").BuildOptions}
 */
const baseConfig = {
  entryPoints: createEntryPoints(),
  bundle: false,
  outdir: "dist",
  platform: "browser",
  format: "esm",
  target: ["es2020"],
  jsx: "automatic",
  jsxImportSource: "react",
  treeShaking: true,
  write: true,
  preserveSymlinks: false,
  resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  // Optimize for faster builds
  keepNames: false,
  logLevel: "warning", // Reduce console noise
};

// Production-specific optimizations
const prodConfig = {
  ...baseConfig,
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  legalComments: "none",
  sourcemap: false,
  metafile: true, // Only generate metafile for prod builds
  plugins: [cssPlugin, createProductionDtsPlugin(resolve(__dirname, "tsconfig.json")), copyPlugin],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

// Development-specific optimizations
const devConfig = {
  ...baseConfig,
  minify: false, // Skip minification for faster dev builds
  sourcemap: true, // Enable sourcemaps for debugging
  metafile: false, // Skip metafile generation for dev builds
  plugins: [
    cssPlugin,
    cssWatchPlugin, // Add CSS watcher for development
    // Skip TypeScript declaration generation in dev for speed
    copyPlugin,
  ],
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// ESM build
const esmConfig = {
  ...prodConfig,
  format: "esm",
  outExtension: { ".js": ".js" },
  entryNames: "[dir]/[name]",
};

// Build functions
async function buildProd() {
  console.log("🚀 Building for production...");
  const startTime = Date.now();
  try {
    // Validate entry points before building
    const entryPoints = createEntryPoints(false);
    const validEntryPoints = {};

    for (const [name, path] of Object.entries(entryPoints)) {
      if (existsSync(path)) {
        validEntryPoints[name] = path;
      } else {
        console.warn(`⚠️  Warning: Entry point file not found, skipping: ${name} (${path})`);
      }
    }

    if (Object.keys(validEntryPoints).length === 0) {
      console.error("❌ No valid entry points found. Build cancelled.");
      process.exit(1);
    }

    await build({
      ...esmConfig,
      entryPoints: validEntryPoints,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Production build completed successfully! (${(duration/1000).toFixed(2)}s)`);
  } catch (error) {
    console.error("❌ Production build failed:", error);
    process.exit(1);
  }
}

// Development build with enhanced file watching
async function buildDev() {
  console.log("🔧 Building for development with watch mode...");

  // Invalidate cache for dev builds to pick up new files
  cachedEntryPoints = null;

  const getEntryPointsHash = () => {
    const entryPoints = createDynamicEntryPoints();
    return JSON.stringify(Object.keys(entryPoints).sort());
  };

  // Validate and filter entry points
  const getValidEntryPoints = () => {
    const entryPoints = createDynamicEntryPoints();
    const validEntryPoints = {};

    for (const [name, path] of Object.entries(entryPoints)) {
      if (existsSync(path)) {
        validEntryPoints[name] = path;
      } else {
        console.warn(`⚠️  Warning: Entry point file not found, skipping: ${name} (${path})`);
      }
    }

    return validEntryPoints;
  };

  try {
    const ctx = await context({
      ...devConfig,
      entryPoints: getValidEntryPoints(),
      plugins: [
        ...devConfig.plugins,
        createNewFileDetectorPlugin(getEntryPointsHash),
        createDevDtsGeneratorPlugin(),
      ],
    });

    // Store build context globally for CSS watcher access
    global._currentBuildContext = ctx;

    await ctx.watch();
    // console.log("🔍 Watching for changes... (Press Ctrl+C to stop)");

    // Keep the process alive
    process.on("SIGINT", async () => {
      // console.log("\n🛑 Stopping watch mode...");
      global._currentBuildContext = null; // Clean up global reference
      await ctx.dispose();
      process.exit(0);
    });
  } catch (error) {
    console.error("❌ Development build failed:", error);
    process.exit(1);
  }
}

// CLI handling
if (require.main === module) {
  const mode = process.argv[2] || "build";

  (async () => {
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
  })();
}

module.exports = { buildProd, buildDev };

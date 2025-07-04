const { build, context } = require("esbuild");
const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } = require("fs");
const { dirname, join } = require("path");
const { glob } = require("glob");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

// Cache for entry points to avoid regenerating them
let cachedEntryPoints = null;

// Get all component files with optimized glob patterns
const getComponentFiles = () => {
  try {
    return glob.sync("components/**/*.{ts,tsx}", {
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

// Optimized CSS processing plugin with caching
const cssPlugin = {
  name: "css-processor",
  setup(build) {
    const cssCache = new Map();

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

      if (matches.length === 0) return;

      for (const match of matches) {
        const cssPath = match[1];
        const fullCssPath = resolve(dirname(args.path), cssPath);

        if (!existsSync(fullCssPath)) {
          console.warn(`⚠️  Warning: CSS file not found, skipping: ${cssPath}`);
          continue;
        }

        hasModifications = true;
        let minifiedCss = cssCache.get(fullCssPath);

        if (!minifiedCss) {
          try {
            const css = readFileSync(fullCssPath, "utf8");
            // Simplified minification for better performance
            minifiedCss = css
              .replace(/\/\*[\s\S]*?\*\//g, "")
              .replace(/\s+/g, " ")
              .replace(/;\s*}/g, "}")
              .replace(/\s*[{};:,>+~]\s*/g, (match) => match.trim())
              .trim();

            cssCache.set(fullCssPath, minifiedCss);
          } catch (error) {
            console.warn(`⚠️  Warning: Could not read CSS file ${fullCssPath}:`, error.message);
            continue;
          }
        }

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

// Optimized file copy plugin
const copyPlugin = {
  name: "copy-files",
  setup(build) {
    build.onEnd(() => {
      // Only copy files in production builds for better dev performance
      if (process.env.NODE_ENV === "development") return;

      try {
        // Copy CSS files from css directory using optimized glob
        const cssFiles = glob.sync("css/**/*", { absolute: false });
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
  plugins: [
    cssPlugin,
    dtsPlugin({
      tsconfig: resolve(__dirname, "tsconfig.json"),
    }),
    copyPlugin,
  ],
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
    const durationText = duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
    console.log(`✅ Production build completed successfully! (${durationText})`);
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

  // Track entry points for new file detection
  let lastEntryPointsHash = "";

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
        {
          name: "new-file-detector",
          setup(build) {
            let startTime;
            let buildCount = 0;

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
              const durationText =
                duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;

              if (result.errors.length > 0) {
                console.log(`❌ Build completed with errors (${durationText}):`);
                result.errors.forEach((error) => console.error("  ", error.text));
              } else if (result.warnings.length > 0) {
                console.log(`⚠️  Build completed with warnings (${durationText}):`);
                result.warnings.forEach((warning) => console.warn("  ", warning.text));
              } else {
                console.log(`✅ Build completed successfully! (${durationText})`);
              }
            });
          },
        },
      ],
    });

    // Initialize hash
    lastEntryPointsHash = getEntryPointsHash();

    await ctx.watch();
    console.log("🔍 Watching for changes... (Press Ctrl+C to stop)");

    // Keep the process alive
    process.on("SIGINT", async () => {
      // console.log("\n🛑 Stopping watch mode...");
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

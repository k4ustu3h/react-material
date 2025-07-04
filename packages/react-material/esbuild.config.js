const { build, context } = require("esbuild");
const { resolve } = require("path");
const { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } = require("fs");
const { dirname, join } = require("path");
const { glob } = require("glob");
const { dtsPlugin } = require("esbuild-plugin-d.ts");

// Get all component files
const componentFiles = glob.sync("components/**/*.{ts,tsx}", {
  ignore: [
    "components/**/index.ts",
    "**/*.test.{ts,tsx}",
    "**/*.stories.{ts,tsx}",
    "**/*_test.{ts,tsx}",
    "**/test.{ts,tsx}",
  ],
});

// Create entry points for multiple builds
const createEntryPoints = () => {
  const entryPoints = {};

  // Add main index file
  entryPoints["index"] = resolve(__dirname, "index.ts");

  // Add each component as a separate entry point
  componentFiles.forEach((file) => {
    const name = file.replace(/\.(ts|tsx)$/, "");
    entryPoints[name] = resolve(__dirname, file);
  });

  // Add utility files (excluding test files)
  const utilFiles = glob.sync("utils/**/*.{ts,tsx}", {
    ignore: [
      "**/*.test.{ts,tsx}",
      "**/*.stories.{ts,tsx}",
      "**/*_test.{ts,tsx}",
      "**/test.{ts,tsx}",
    ],
  });

  utilFiles.forEach((file) => {
    const name = file.replace(/\.(ts|tsx)$/, "");
    entryPoints[name] = resolve(__dirname, file);
  });

  return entryPoints;
};

// Custom CSS processing plugin for separate files
const cssPlugin = {
  name: "css-processor",
  setup(build) {
    // Transform TypeScript/JavaScript files to inject CSS
    build.onLoad({ filter: /\.(ts|tsx|js|jsx)$/ }, async (args) => {
      if (args.namespace === "css-virtual") return; // Skip our own virtual modules

      const contents = readFileSync(args.path, "utf8");

      // Check if file has CSS imports
      const cssImportRegex = /import\s+["']([^"']+\.css)["'];?/g;
      let hasModifications = false;
      let transformedContents = contents;

      let match;
      while ((match = cssImportRegex.exec(contents)) !== null) {
        const cssPath = match[1];
        const fullCssPath = resolve(dirname(args.path), cssPath);

        if (existsSync(fullCssPath)) {
          hasModifications = true;
          const css = readFileSync(fullCssPath, "utf8");
          const cssId = fullCssPath.replace(/[^a-zA-Z0-9]/g, "_");

          const cssInjection = `
// CSS injection for ${cssPath}
if (typeof document !== 'undefined') {
  const cssId = '${cssId}';
  if (!document.head.querySelector('[data-css-id="' + cssId + '"]')) {
    const style = document.createElement('style');
    style.setAttribute('data-css-id', cssId);
    style.textContent = ${JSON.stringify(css)};
    document.head.appendChild(style);
  }
}`;

          transformedContents = transformedContents.replace(match[0], cssInjection);
        }
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

// File copy plugin
const copyPlugin = {
  name: "copy-files",
  setup(build) {
    build.onEnd(() => {
      //   console.log("📂 Copying static files...");

      // Copy CSS files from components and maintain structure
      try {
        // const componentCssFiles = glob.sync("components/**/*.css");
        // componentCssFiles.forEach((file) => {
        //   const src = resolve(__dirname, file);
        //   const dest = resolve(__dirname, "dist", file);

        //   // Ensure destination directory exists
        //   const destDir = dirname(dest);
        //   mkdirSync(destDir, { recursive: true });

        //   if (existsSync(src)) {
        //     copyFileSync(src, dest);
        //   }
        // });

        // Copy CSS files from css directory
        const cssFiles = glob.sync("css/**/*");
        cssFiles.forEach((file) => {
          const src = resolve(__dirname, file);
          const dest = resolve(__dirname, "dist", file);

          // Ensure destination directory exists
          const destDir = dirname(dest);
          mkdirSync(destDir, { recursive: true });

          if (existsSync(src)) {
            copyFileSync(src, dest);
          }
        });
        // console.log("✅ CSS files copied successfully!");
      } catch (error) {
        console.warn("⚠️  CSS file copying failed:", error);
      }
    });
  },
};

// Base configuration for the main bundle
const baseConfig = {
  entryPoints: createEntryPoints(),
  bundle: false,
  outdir: "dist",
  platform: "browser",
  format: "esm",
  target: ["es2020"],
  jsx: "automatic",
  jsxImportSource: "react",
  sourcemap: false,
  minify: true,
  treeShaking: true,
  metafile: true,
  write: true,
  preserveSymlinks: false,
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
  resolveExtensions: [".tsx", ".ts", ".jsx", ".js"],
  loader: {
    ".png": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".svg": "file",
    ".gif": "file",
    ".woff": "file",
    ".woff2": "file",
    ".ttf": "file",
    ".eot": "file",
  },
};

// ESM build
const esmConfig = {
  ...baseConfig,
  format: "esm",
  outExtension: { ".js": ".js" },
  entryNames: "[dir]/[name]",
};

// Development build
const devConfig = {
  ...baseConfig,
  minify: false,
  sourcemap: true,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// Build functions
async function buildProd() {
  console.log("🚀 Building for production...");
  const startTime = Date.now();
  try {
    await build(esmConfig);
    const duration = Date.now() - startTime;
    const durationText = duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
    console.log(`✅ Production build completed successfully! (${durationText})`);
  } catch (error) {
    console.error("❌ Production build failed:", error);
    process.exit(1);
  }
}

async function buildDev() {
  console.log("🔧 Building for development with watch mode...");
  try {
    const ctx = await context({
      ...devConfig,
      plugins: [
        ...devConfig.plugins,
        {
          name: "watch-warning",
          setup(build) {
            let startTime;

            build.onStart(() => {
              startTime = Date.now();
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

    await ctx.watch();
    console.log("🔍 Watching for changes... (Press Ctrl+C to stop)");

    // Keep the process alive
    process.on("SIGINT", async () => {
      console.log("\n🛑 Stopping watch mode...");
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

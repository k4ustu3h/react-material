import { Plugin } from "vite";
import { copyFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";

interface CopyTarget {
  src: string;
  dest: string;
}

interface CopyOptions {
  targets: CopyTarget[];
}

export function viteCopyPlugin(options: CopyOptions): Plugin {
  return {
    name: "vite-copy-plugin",
    generateBundle() {
      options.targets.forEach((target) => {
        const { src, dest } = target;

        // Handle glob patterns for material symbols
        if (src.includes("material-symbols/*.woff2")) {
          const nodeModulesPath = join(process.cwd(), "../../node_modules/material-symbols");
          try {
            const files = readdirSync(nodeModulesPath);
            const woff2Files = files.filter((file) => file.endsWith(".woff2"));

            woff2Files.forEach((file) => {
              const srcPath = join(nodeModulesPath, file);
              const destPath = join("dist", file);

              // Ensure destination directory exists
              mkdirSync(dirname(destPath), { recursive: true });
              copyFileSync(srcPath, destPath);
            });
          } catch (error) {
            console.warn(`Could not copy material symbols: ${error}`);
          }
        }

        // Handle CSS directory copying
        if (src.includes("css/**/*")) {
          const srcPath = join(process.cwd(), "css");
          const destPath = join("dist");

          try {
            copyDirectory(srcPath, destPath);
          } catch (error) {
            console.warn(`Could not copy CSS files: ${error}`);
          }
        }
      });
    },
  };
}

function copyDirectory(src: string, dest: string) {
  try {
    const stat = statSync(src);
    if (stat.isDirectory()) {
      mkdirSync(dest, { recursive: true });
      const files = readdirSync(src);
      files.forEach((file) => {
        const srcPath = join(src, file);
        const destPath = join(dest, file);
        copyDirectory(srcPath, destPath);
      });
    } else {
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(src, dest);
    }
  } catch (error) {
    // Silently ignore errors for non-existent files
  }
}

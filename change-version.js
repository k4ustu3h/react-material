#!/usr/bin/env node
// Script to update the version in all package.json files in the monorepo
const fs = require("fs");
const path = require("path");

// Directories to search for package.json files
const ROOT = __dirname;
const DIRS = [".", "apps", "packages"];

function findPackageJsons(baseDir) {
  const results = [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      // Skip node_modules and .git
      if (entry.name === "node_modules" || entry.name === ".git") continue;
      results.push(...findPackageJsons(fullPath));
    } else if (entry.name === "package.json") {
      results.push(fullPath);
    }
  }
  return results;
}

function updateVersion(file, newVersion) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  json.version = newVersion;
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  console.log(`Updated ${file} to version ${newVersion}`);
}

function main() {
  const newVersion = process.argv[2];
  if (!newVersion) {
    console.error("Usage: node change-version.js <new-version>");
    process.exit(1);
  }
  let allPackages = [];
  for (const dir of DIRS) {
    const absDir = path.join(ROOT, dir);
    if (fs.existsSync(absDir)) {
      allPackages.push(...findPackageJsons(absDir));
    }
  }
  // Remove duplicates
  allPackages = [...new Set(allPackages)];
  for (const pkg of allPackages) {
    updateVersion(pkg, newVersion);
  }
}

main();

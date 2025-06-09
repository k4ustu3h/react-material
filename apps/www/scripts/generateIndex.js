import fs from "fs";
import path from "path";
import { glob } from "glob";

// Configuration
const DOCS_DIR = path.join(import.meta.dirname, "../pages/docs");
const OUTPUT_FILE = path.join(import.meta.dirname, "../utils/docs-index.ts");
const META_FILE = path.join(import.meta.dirname, "../utils/meta.json");

// Function to extract metadata from MDX files
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const titleMatch = content.match(/title=\s*['"](.+?)['"]/);
  const descriptionMatch = content.match(/description=\s*['"](.+?)['"]/);

  return {
    title: titleMatch ? titleMatch[1] : path.basename(filePath, ".mdx"),
    description: descriptionMatch ? descriptionMatch[1] : "",
    path: filePath
      .replace(DOCS_DIR, "")
      .replace(/\.mdx$/, "")
      .replace(/\\/g, "/"),
  };
}

// Function to convert kebab case to title case (used for matching)
function kebabToTitleCase(kebabCase) {
  return kebabCase
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Main function
function generateIndex() {
  console.log("Generating MDX index...");

  // Load meta information
  let meta = { categoryOrder: [], documentOrder: {} };
  if (fs.existsSync(META_FILE)) {
    try {
      meta = JSON.parse(fs.readFileSync(META_FILE, "utf8"));
    } catch (error) {
      console.warn("Error parsing meta.json:", error);
    }
  }

  // Find all MDX files
  const mdxFiles = glob.sync("**/*.mdx", { cwd: DOCS_DIR });

  // Group files by category (folder)
  const categories = {};

  mdxFiles.forEach((file) => {
    const fullPath = path.join(DOCS_DIR, file);
    const pathParts = file.split("/");

    let category;
    let group = null;

    if (path.dirname(file) === ".") {
      category = "root";
    } else if (pathParts.length >= 3) {
      // This is a file in a subgroup (e.g., components/buttons/button.mdx)
      category = pathParts[0];
      group = pathParts[1];
    } else {
      // This is a file directly in a category (e.g., components/button.mdx)
      category = pathParts[0];
    }

    if (!categories[category]) {
      categories[category] = [];
    }

    const metadata = extractMetadata(fullPath);

    // If this file is part of a group, add the group information
    if (group) {
      categories[category].push({
        ...metadata,
        filePath: file,
        group: group,
        groupTitle: kebabToTitleCase(group),
      });
    } else {
      categories[category].push({
        ...metadata,
        filePath: file,
      });
    }
  });

  // Sort categories according to meta.json categoryOrder
  const sortedCategoryKeys = [...Object.keys(categories)].sort((a, b) => {
    const indexA = meta.categoryOrder.indexOf(a);
    const indexB = meta.categoryOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;

    return indexA - indexB;
  });

  let totalDocs = 0;
  // Generate the index file content
  let indexContent = `// This file is auto-generated. Do not edit manually.
// Generated on ${new Date().toISOString()}

/**
 * Documentation index structure with categories and their documents
 */
interface DocItem {
  title: string;
  description: string;
  path: string;
  group?: string;
  groupTitle?: string;
}

type DocIndex = Record<string, DocItem[]>;

const docsIndex: DocIndex = {
`;

  sortedCategoryKeys.forEach((category) => {
    indexContent += `  "${category}": [\n`;

    // Sort documents by the order specified in meta.json (if available) or alphabetically
    let sortedDocs = [...categories[category]];
    if (meta.documentOrder && meta.documentOrder[category]) {
      // This category has a manual sort order in meta.json
      sortedDocs = sortedDocs.sort((a, b) => {
        // Extract the base name without extension for matching with documentOrder
        const aBaseName = path.basename(a.filePath, ".mdx");
        const bBaseName = path.basename(b.filePath, ".mdx");

        const aTitle = kebabToTitleCase(aBaseName);
        const bTitle = kebabToTitleCase(bBaseName);

        const indexA = meta.documentOrder[category].findIndex(
          (item) => item === aBaseName || kebabToTitleCase(item) === a.title
        );
        const indexB = meta.documentOrder[category].findIndex(
          (item) => item === bBaseName || kebabToTitleCase(item) === b.title
        ); // If both items are in documentOrder, use that order
        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }

        // If only one item is in documentOrder, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // For items not in the manual sort order, sort by title regardless of grouping
        return a.title.localeCompare(b.title);

      });
    } else {
      // Categories without manual sort order in meta.json
      // Apply alphabetical sort by title, regardless of grouping
      sortedDocs.sort((a, b) => {
        // Always sort by title, regardless of grouping
        return a.title.localeCompare(b.title);
      });
    }

    sortedDocs.forEach((doc) => {
      totalDocs++;
      indexContent += `    {\n`;
      indexContent += `      title: "${doc.title}",\n`;
      indexContent += `      description: "${doc.description}",\n`;
      indexContent += `      path: "/docs${doc.path}",\n`;

      // Add group information if available
      if (doc.group) {
        indexContent += `      group: "${doc.group}",\n`;
        indexContent += `      groupTitle: "${doc.groupTitle}",\n`;
      }

      indexContent += `    },\n`;
    });

    indexContent += `  ],\n`;
  });

  indexContent += `};

export default docsIndex;
`;

  // Write the index file
  fs.writeFileSync(OUTPUT_FILE, indexContent);

  console.log(`Index generated successfully at ${OUTPUT_FILE}`);
  console.log(
    `Found ${mdxFiles.length} MDX files in ${Object.keys(categories).length} categories.`
  );
}

// Execute the generator
generateIndex();

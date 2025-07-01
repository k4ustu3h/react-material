import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(import.meta.dirname, "../pages/docs"); // Adjust if your docs are elsewhere
const OUTPUT_FILE = path.join(import.meta.dirname, "../utils/search-index.json");

async function generateSearchIndex() {
  const files = fs.readdirSync(DOCS_DIR, { recursive: true });
  const mdxFiles = files.filter((file) => file.endsWith(".md") || file.endsWith(".mdx"));

  const componentRegex = /<([A-Z][a-zA-Z0-9_]*)(?:\s+[^>]*?)?\/?(?=>)>|<\/([A-Z][a-zA-Z0-9_]*)>/g;
  const importRegex = /import\s+(?:{([^}]+)}|([A-Za-z0-9_$]+))\s+from\s+['"]([^'"]+)['"]/g;

  const documents = [];

  for (const file of mdxFiles) {
    const filePath = path.join(DOCS_DIR, file);
    let fileContent = fs.readFileSync(filePath, "utf8");

    const slug = file.replace(/\.(md|mdx)$/, ""); // Simple slug generation
    const url = `/docs/${slug}`; // Adjust your URL structure
    const titleMatch = fileContent.match(/title=\s*['"](.+?)['"]/);
    const descriptionMatch = fileContent.match(/description=\s*['"](.+?)['"]/);

    fileContent = fileContent.replaceAll(componentRegex, ""); // Remove component tags
    fileContent = fileContent.replaceAll(importRegex, ""); // Remove import statements

    documents.push({
      slug,
      title: titleMatch ? titleMatch[1] : "",
      description: descriptionMatch ? descriptionMatch[1] : "",
      content: fileContent, // Full content for indexing
    });
  }


  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(documents) // FlexSearch's export method
  );

  console.log("Search index generated!");
}

generateSearchIndex();

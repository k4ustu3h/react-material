#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { promisify } from "util";
import { Resvg } from "@resvg/resvg-js";

const execAsync = promisify(exec);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "../public");
const OG_IMAGES_DIR = path.join(PUBLIC_DIR, "og-images");
const FONT_PATH = path.join(__dirname, "../pages/fonts/DMSansVF.ttf");
const METADATA_FILE = path.join(__dirname, "../utils/search-index.json");

// Create directory if it doesn't exist
if (!fs.existsSync(OG_IMAGES_DIR)) {
  fs.mkdirSync(OG_IMAGES_DIR, { recursive: true });
}

function titleToSlug(title) {
  // Convert title to slug format
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Base pages for which to generate OG images
const basePages = [
  {
    slug: "home",
    title: "React Material",
    description: "Material Design 3 Expressive Implementation in React",
  }
];

// Function to load docs metadata if available
function loadDocsMetadata() {
  try {
    if (fs.existsSync(METADATA_FILE)) {
      const data = fs.readFileSync(METADATA_FILE, "utf-8");
      const metadata = JSON.parse(data);

      // Convert metadata object to array format needed for OG images
      return metadata.map((page) => ({
        slug: titleToSlug(page.title),
        title: page.title,
        description: page.description,
      }));
    }
  } catch (error) {
    console.error("Error loading docs metadata:", error.message);
  }

  return [];
}

// Combine base pages with extracted docs pages
const docsPages = loadDocsMetadata();
const pages = [...basePages, ...docsPages];

// Function to wrap text for SVG
function wrapText(text, maxCharsPerLine) {
  if (text.length <= maxCharsPerLine) {
    return text;
  }

  // Split into words
  const words = text.split(" ");
  let lines = [];
  let currentLine = "";

  words.forEach((word) => {
    if ((currentLine + " " + word).length <= maxCharsPerLine || currentLine === "") {
      currentLine += (currentLine === "" ? "" : " ") + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  // Limit to 2 lines and add ellipsis if needed
  if (lines.length > 2) {
    lines = lines.slice(0, 2);
    // Add ellipsis to the end of the second line if it's not already the end of the text
    if (lines[1] !== text) {
      lines[1] = lines[1].replace(/(.{3,})$/, "$1...");
    }
  }

  // Format for SVG tspan
  return lines
    .map(
      (line, i) => `<tspan x="600" dy="${i === 0 ? 0 : 40}" text-anchor="middle">${line}</tspan>`
    )
    .join("");
}

function createSvg({ title, description }) {
  // Escape special characters for XML
  const escapedTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escapedDesc = description
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="630" fill="url(#gradient)"/>
  
  <!-- Font styles -->
  <style>
    text {
      font-family: 'DM Sans', 'Arial', sans-serif;
    }
  </style>
  
  <!-- Logo -->
  <g transform="translate(520, 115) scale(4)">
    <path
      d="M20 1.5C30.2173 1.5 38.5 9.78273 38.5 20C38.5 30.2173 30.2173 38.5 20 38.5C9.78273 38.5 1.5 30.2173 1.5 20C1.5 9.78273 9.78273 1.5 20 1.5Z"
      stroke="#333333"
      stroke-width="3"
    />
    <rect
      x="7.5"
      y="7.5"
      width="25"
      height="25"
      rx="4.5"
      stroke="#333333"
      stroke-width="3"
    />
    <rect
      x="8.12132"
      y="20"
      width="16.799"
      height="16.799"
      rx="4.5"
      transform="rotate(-45 8.12132 20)"
      stroke="#333333"
      stroke-width="3"
    />
  </g>
  
  <!-- Title -->
  <text x="600" y="400" font-family="'DM Sans', Arial, sans-serif" font-size="60" text-anchor="middle" fill="#333333">
    ${escapedTitle}
  </text>
  
  <!-- Description with text wrapping using tspan elements -->
  <text x="600" y="465" font-family="'DM Sans', Arial, sans-serif" font-size="32" text-anchor="middle" fill="#666666">
    ${wrapText(escapedDesc, 50)}
  </text>
  
  <!-- Website URL -->
  <text x="600" y="570" font-family="'DM Sans', Arial, sans-serif" font-size="24" text-anchor="middle" fill="#888888">
    material.miukyo.my.id
  </text>
  
  <!-- Gradient definition -->
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(179,136,255,0.1)" />
      <stop offset="100%" stop-color="rgba(255,255,255,1)" />
    </linearGradient>
  </defs>
</svg>`;
}

async function generateOgImage({ slug, title, description }) {
  console.log(`Generating OG image for: ${slug}`);

  // Create SVG file
  const svgContent = createSvg({ title, description });
  // const svgPath = path.join(OG_IMAGES_DIR, `${slug}.svg`);
  // fs.writeFileSync(svgPath, svgContent);

  // Convert SVG to PNG using svgexport
  try {
    const resvg = new Resvg(svgContent, {
      font: {
        defaultFontFamily: "DM Sans",
        fontFiles: [FONT_PATH],
        loadSystemFonts: false, // Disable system fonts to ensure we use our embedded font
      },
      fitTo: {
        mode: "width",
        value: 1200,
      },
      background: "white", // Ensure a white background
      logLevel: "error",
    });
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    fs.writeFileSync(path.join(OG_IMAGES_DIR, `${slug}.png`), pngBuffer);
    console.log(`Generated OG image: ${slug}.png, size: ${pngBuffer.length / 1024} KB`);
  } catch (error) {
    console.error(`Error generating PNG for ${slug}:`, error.message);
  }
}

// Generate OG images for all pages
async function generateAllOgImages() {
  console.log("Starting OG image generation...");

  // Process all pages in parallel with Promise.all
  await Promise.all(
    pages.map(async (page) => {
      await generateOgImage(page);
    })
  );

  console.log("OG image generation complete!");
}

generateAllOgImages().catch(console.error);

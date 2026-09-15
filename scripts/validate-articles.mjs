import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseDocument } from "yaml";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const articlesDirectory = path.join(projectRoot, "articles");
const filenamePattern = /^\d{8}-[a-z0-9-]+\.md$/;
const allowedTypes = new Set(["tech", "idea"]);
const requiredFields = ["title", "emoji", "type", "topics", "published"];

function splitFrontMatter(content) {
  const normalized = content.replace(/^\uFEFF/, "");
  const match = normalized.match(
    /^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/,
  );

  if (!match) {
    return null;
  }

  return {
    source: match[1],
    body: normalized.slice(match[0].length),
  };
}

function collectExternalUrls(body) {
  const candidates = new Set();
  const urlPattern = /https?:\/\/[^\s<>"']+/g;

  for (const match of body.matchAll(urlPattern)) {
    candidates.add(match[0].replace(/[),.;!?]+$/g, ""));
  }

  return [...candidates];
}

function validateUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function validateFrontMatter(filename, frontMatter) {
  const errors = [];
  const document = parseDocument(frontMatter, { uniqueKeys: true });

  if (document.errors.length > 0) {
    return {
      data: null,
      errors: document.errors.map(
        (error) => `${filename}: Front Matter YAML error: ${error.message}`,
      ),
    };
  }

  const data = document.toJS();
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return {
      data: null,
      errors: [`${filename}: Front Matter must be a YAML mapping.`],
    };
  }

  for (const field of requiredFields) {
    if (!Object.hasOwn(data, field)) {
      errors.push(`${filename}: missing required Front Matter field: ${field}`);
    }
  }

  if (Object.hasOwn(data, "title") &&
      (typeof data.title !== "string" || data.title.trim() === "")) {
    errors.push(`${filename}: title must be a non-empty string.`);
  }

  if (Object.hasOwn(data, "emoji") &&
      (typeof data.emoji !== "string" || data.emoji.trim() === "")) {
    errors.push(`${filename}: emoji must be a non-empty string.`);
  }

  if (Object.hasOwn(data, "type") && !allowedTypes.has(data.type)) {
    errors.push(`${filename}: type must be either "tech" or "idea".`);
  }

  if (Object.hasOwn(data, "topics")) {
    if (!Array.isArray(data.topics)) {
      errors.push(`${filename}: topics must be an array.`);
    } else if (
      data.topics.some(
        (topic) => typeof topic !== "string" || topic.trim() === "",
      )
    ) {
      errors.push(`${filename}: every topic must be a non-empty string.`);
    }
  }

  if (Object.hasOwn(data, "published") && typeof data.published !== "boolean") {
    errors.push(`${filename}: published must be a boolean.`);
  }

  return { data, errors };
}

async function validateArticle(filename) {
  const errors = [];
  const slug = filename.slice(0, -".md".length);

  if (!filenamePattern.test(filename)) {
    errors.push(
      `${filename}: filename must match ${filenamePattern.toString()}.`,
    );
  }

  if (slug.length < 12 || slug.length > 50) {
    errors.push(
      `${filename}: Zenn article slug must be between 12 and 50 characters.`,
    );
  }

  const filePath = path.join(articlesDirectory, filename);
  const content = await readFile(filePath, "utf8");
  const parsed = splitFrontMatter(content);

  if (!parsed) {
    errors.push(`${filename}: Front Matter delimited by --- is required.`);
    return errors;
  }

  const frontMatterResult = validateFrontMatter(filename, parsed.source);
  errors.push(...frontMatterResult.errors);

  const urls = collectExternalUrls(parsed.body);
  const invalidUrls = urls.filter((url) => !validateUrl(url));
  for (const url of invalidUrls) {
    errors.push(`${filename}: invalid external URL: ${url}`);
  }

  if (frontMatterResult.data?.published === true) {
    if (parsed.body.trim() === "") {
      errors.push(`${filename}: published article body must not be empty.`);
    }

    if (!/^##\s+\S/m.test(parsed.body)) {
      errors.push(
        `${filename}: published article must contain at least one level-2 heading (##).`,
      );
    }

    const validUrls = urls.filter(validateUrl);
    if (validUrls.length === 0) {
      errors.push(
        `${filename}: published article must contain at least one valid source URL.`,
      );
    }
  }

  return errors;
}

async function main() {
  const entries = await readdir(articlesDirectory, { withFileTypes: true });
  const articleFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name)
    .sort();

  const validationResults = await Promise.all(
    articleFiles.map((filename) => validateArticle(filename)),
  );
  const errors = validationResults.flat();

  if (errors.length > 0) {
    console.error(`Article validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Validated ${articleFiles.length} article(s).`);
}

main().catch((error) => {
  console.error("Article validation could not complete:");
  console.error(error);
  process.exitCode = 1;
});

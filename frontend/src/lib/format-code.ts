import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import bash from "highlight.js/lib/languages/bash";
import yaml from "highlight.js/lib/languages/yaml";
import prettier from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginTypescript from "prettier/plugins/typescript";
import * as prettierPluginHtml from "prettier/plugins/html";
import * as prettierPluginPostcss from "prettier/plugins/postcss";
import * as prettierPluginMarkdown from "prettier/plugins/markdown";
import * as prettierPluginYaml from "prettier/plugins/yaml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("python", python);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("yaml", yaml);

type PrettierParser =
  | "babel"
  | "typescript"
  | "html"
  | "css"
  | "scss"
  | "less"
  | "json"
  | "markdown"
  | "yaml";

const LANGUAGE_TO_PARSER: Record<string, PrettierParser> = {
  javascript: "babel",
  js: "babel",
  jsx: "babel",
  typescript: "typescript",
  ts: "typescript",
  tsx: "typescript",
  html: "html",
  xml: "html",
  vue: "html",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  markdown: "markdown",
  md: "markdown",
  yaml: "yaml",
  yml: "yaml",
};

const HLJS_TO_LABEL: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  xml: "html",
  html: "html",
  css: "css",
  json: "json",
  markdown: "markdown",
  python: "python",
  sql: "sql",
  bash: "bash",
  shell: "bash",
  yaml: "yaml",
};

function normalizeLanguage(language: string) {
  return language.trim().toLowerCase();
}

export function detectCodeLanguage(code: string): string | null {
  if (!code.trim()) return null;
  const result = hljs.highlightAuto(code, [
    "javascript",
    "typescript",
    "xml",
    "css",
    "json",
    "markdown",
    "python",
    "sql",
    "bash",
    "yaml",
  ]);
  if (!result.language) return null;
  return HLJS_TO_LABEL[result.language] ?? result.language;
}

function parserFor(language: string): PrettierParser | null {
  return LANGUAGE_TO_PARSER[normalizeLanguage(language)] ?? null;
}

export function canPrettierFormat(language: string) {
  return parserFor(language) !== null;
}

export async function formatCodeWithPrettier(
  code: string,
  language: string,
): Promise<{ code: string; language: string; formatted: boolean; note?: string }> {
  const detected =
    !language.trim() || language === "plaintext" || language === "text"
      ? detectCodeLanguage(code)
      : null;
  const resolvedLanguage = detected ?? (language.trim() || "typescript");
  const parser = parserFor(resolvedLanguage);

  if (!parser) {
    return {
      code,
      language: resolvedLanguage,
      formatted: false,
      note: `Prettier doesn't support ${resolvedLanguage}. Language detected, left as-is.`,
    };
  }

  try {
    const formatted = await prettier.format(code, {
      parser,
      plugins: [
        prettierPluginBabel,
        prettierPluginEstree,
        prettierPluginTypescript,
        prettierPluginHtml,
        prettierPluginPostcss,
        prettierPluginMarkdown,
        prettierPluginYaml,
      ],
      semi: true,
      singleQuote: false,
      trailingComma: "all",
      printWidth: 80,
      tabWidth: 2,
    });

    return {
      code: formatted.trimEnd() + (code.endsWith("\n") ? "\n" : ""),
      language: resolvedLanguage,
      formatted: true,
    };
  } catch {
    return {
      code,
      language: resolvedLanguage,
      formatted: false,
      note: "Couldn't parse this snippet with Prettier. Check for syntax errors.",
    };
  }
}

#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * detect-french.cjs
 * Detects French text in a React project (JSX/TSX/JS/TS).
 *
 * Results are grouped by file and then by text.
 * Identical texts are grouped with their different line numbers.
 *
 * Installation:
 *   npm i -D @babel/parser @babel/traverse
 *
 * Usage:
 *   node detect-french.cjs [directory=src] [options]
 *
 * Options:
 *
 *   --json [name]
 *       Generates a JSON report.
 *       Without a name:
 *         detect-fr-report.json
 *       With a name:
 *         <name>-fr-report.json
 *
 *   --jsx-only
 *       Analyzes JSX only:
 *       - JSX text
 *       - JSX attributes
 *       Strings found in JavaScript/TypeScript code
 *       outside JSX are ignored.
 *
 *   --include-locales
 *       Includes the "locales" directory in the analysis.
 *       The rest of the source directory is also analyzed.
 *
 *   --only-locales
 *       Analyzes only the "locales" directory.
 *
 *   --include-locales and --only-locales
 *   cannot be used together.
 *
 *   fr.ts
 *       The "fr.ts" file is always ignored, regardless
 *       of the options used.
 *
 * Examples:
 *
 *   node detect-french.cjs
 *       Analyzes "src" without the locales.
 *
 *   node detect-french.cjs src
 *       Analyzes "src" without the locales.
 *
 *   node detect-french.cjs --include-locales
 *       Analyzes "src", including the locales.
 *
 *   node detect-french.cjs --only-locales
 *       Analyzes only "src/locales".
 *
 *   node detect-french.cjs --jsx-only
 *       Analyzes JSX text only.
 *
 *   node detect-french.cjs --json
 *       Generates "detect-fr-report.json".
 *
 *   node detect-french.cjs --json test
 *       Generates "test-fr-report.json".
 *
 *   node detect-french.cjs --only-locales --json locales
 *       Generates "locales-fr-report.json" with only the results
 *       from locale files.
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

// ---------- Arguments ----------
const args = process.argv.slice(2);
const jsonIdx = args.indexOf("--json");

const jsonOut =
  jsonIdx !== -1
    ? (
        args[jsonIdx + 1] &&
        !args[jsonIdx + 1].startsWith("--")
          ? `${args[jsonIdx + 1]}-fr-report.json`
          : "detect-fr-report.json"
      )
    : null;

const jsxOnly = args.includes("--jsx-only");
const includeLocales = args.includes("--include-locales");
const onlyLocales = args.includes("--only-locales");
const root = args.find((a, i) => !a.startsWith("--") && i !== jsonIdx + 1) || "src";

const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git", ".next", "coverage"]);

// Existing translation files: ignored unless the --include-locales argument is used
const ALWAYS_IGNORED_FILES = new Set(["fr.ts"]);
const LOCALES_DIR = "locales";

// JSX attributes that contain code/technical data rather than displayed text
const IGNORED_ATTRS = new Set([
  "className", "id", "key", "ref", "href", "src", "type", "name", "htmlFor",
  "style", "target", "rel", "role", "value", "data-testid", "to", "path", "variant",
  "size", "color", "as", "method", "action", "viewBox", "d", "fill", "stroke",
]);

// Text enclosed in "--" (or <!-- ... -->): treated as comments
const COMMENT_LIKE = /^(<!)?--[\s\S]*--(>)?$/;

const NO_TAG = "(outside JSX)";

// ---------- French detection ----------
const ACCENTS = /[àâäçéèêëîïôöûùüÿœæ]/i;

// Common words with low ambiguity compared to English / code
const FR_WORDS = new Set(`
le la les des un une et ou pour avec dans sur est sont vous nous votre notre vos nos
ce cette ces mon ma mes ton ta tes leur leurs du au aux ne que qui quoi dont où
bonjour bonsoir merci bienvenue accueil connexion déconnexion inscription
valider annuler enregistrer supprimer modifier ajouter rechercher retour suivant
fermer ouvrir envoyer chargement erreur succès utilisateur mot passe nom prénom
adresse titre oui aucun aucune tous toutes tout toute veuillez cliquez saisir
sélectionner choisir voir plus-tard compte panier commande paiement produit produits
`.split(/\s+/).filter(Boolean));

function isFrench(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  if (/^[\W\d_]+$/.test(t)) return false;
  if (/^(https?:|\/|\.|#|[a-z]+:\/\/)/i.test(t)) return false; // URLs, paths
  if (/^[a-z0-9_-]+$/.test(t) && !FR_WORDS.has(t.toLowerCase())) return false; // IDs
  if (ACCENTS.test(t)) return true;
  const words = t.toLowerCase().split(/[^a-zàâäçéèêëîïôöûùüÿœæ']+/).filter(Boolean);
  return words.some((w) => FR_WORDS.has(w.replace(/^[ldjnmst]'/, "")));
}

function jsxName(n) {
  if (!n) return "?";
  if (n.type === "JSXIdentifier") return n.name;
  if (n.type === "JSXMemberExpression") return `${jsxName(n.object)}.${jsxName(n.property)}`;
  if (n.type === "JSXNamespacedName") return `${n.namespace.name}:${n.name.name}`;
  return "?";
}

function tagForExpression(p) {
  const container = p.findParent((x) => x.isJSXExpressionContainer());
  if (!container) return NO_TAG;
  const owner = container.parent;
  if (owner.type === "JSXElement") return `<${jsxName(owner.openingElement.name)}>`;
  if (owner.type === "JSXFragment") return "<>";
  if (owner.type === "JSXAttribute") return `<${jsxName(container.parentPath.parent.name)}>`;
  return NO_TAG;
}

// ---------- File traversal ----------
function* walk(dir, insideLocales = false) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const isLocalesDir = entry.name === LOCALES_DIR;

      // --only-locales
      if (onlyLocales) {
        if (isLocalesDir) {
          yield* walk(fullPath, true);
        } else if (insideLocales) {
          yield* walk(fullPath, true);
        }
        continue;
      }

      // Normal mode
      if (isLocalesDir && !includeLocales) continue;

      yield* walk(fullPath, insideLocales || isLocalesDir);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      if (ALWAYS_IGNORED_FILES.has(entry.name)) continue;

      yield fullPath;
    }
  }
}

// file -> (exact text, including case -> line numbers)
const byFile = new Map();
let totalOccurrences = 0;
let uniqueEntries = 0;

function record(file, line, text) {
  if (!byFile.has(file)) byFile.set(file, new Map());
  const texts = byFile.get(file);
  if (!texts.has(text)) {
    texts.set(text, []);
    uniqueEntries++;
  }
  texts.get(text).push(line);
  totalOccurrences++;
}

function analyze(file) {
  const code = fs.readFileSync(file, "utf8");
  let ast;

  try {
    ast = parse(code, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript", "classProperties", "decorators-legacy"],
      errorRecovery: true,
    });
  } catch (e) {
    console.warn(`⚠️  Unable to parse ${file}: ${e.message}`);
    return;
  }

  const seen = new Set();

  const add = (node, text, kind, tag) => {
    const clean = text.replace(/\s+/g, " ").trim();

    if (!clean || !isFrench(clean)) return;
    if (COMMENT_LIKE.test(clean)) return; // "-- comment --" ignored

    const key = `${node.loc.start.line}:${node.loc.start.column}`;

    if (seen.has(key)) return;

    seen.add(key);
    record(file, node.loc.start.line, clean);
  };

  traverse(ast, {
    JSXText(p) {
      const parent = p.parent;
      const tag =
        parent.type === "JSXElement"
          ? `<${jsxName(parent.openingElement.name)}>`
          : "<>";

      add(p.node, p.node.value, "jsx-text", tag);
    },

    JSXAttribute(p) {
      const name = p.node.name.name;

      if (IGNORED_ATTRS.has(name) || String(name).startsWith("on")) return;

      const v = p.node.value;

      if (v && v.type === "StringLiteral") {
        add(
          v,
          v.value,
          `attr:${name}`,
          `<${jsxName(p.parent.name)}>`
        );
      }
    },

    StringLiteral(p) {
      const parent = p.parent;

      if (/^(Import|Export)/.test(parent.type)) return;
      if (parent.type === "JSXAttribute") return;
      if (
        parent.type === "ObjectProperty" &&
        parent.key === p.node &&
        !parent.computed
      ) {
        return;
      }
      if (
        parent.type === "CallExpression" &&
        parent.callee.name === "require"
      ) {
        return;
      }
      if (/^TS/.test(parent.type)) return;

      const tag = tagForExpression(p);

      if (jsxOnly && tag === NO_TAG) return;

      add(p.node, p.node.value, "string", tag);
    },

    TemplateLiteral(p) {
      const tag = tagForExpression(p);

      if (jsxOnly && tag === NO_TAG) return;

      const text = p.node.quasis
        .map((q) => q.value.cooked)
        .join("${…}");

      add(p.node, text, "template", tag);
    },
  });
}

// ---------- Main ----------
if (!fs.existsSync(root)) {
  console.error(`Directory not found: ${root}`);
  process.exit(1);
}

if (includeLocales && onlyLocales) {
  console.error(
    "❌ --include-locales and --only-locales cannot be used together."
  );
  process.exit(1);
}

for (const file of walk(root)) analyze(file);

// Files sorted alphabetically, texts by first occurrence line
const files = [...byFile.keys()].sort();

for (const file of files) {
  console.log(`\n📄 ${"\x1b[1m"}${file}${"\x1b[0m"}`);

  const entries = [...byFile.get(file).entries()].sort(
    (a, b) => a[1][0] - b[1][0]
  );

  for (const [text, lines] of entries) {
    console.log(`  text:     ${text}`);
    console.log(
      `  location: ${"\x1b[36m"}${lines.map((l) => `${file}:${l}`).join(", ")}${"\x1b[0m"}`
    );
  }
}

console.log(
  `\n✅ ${totalOccurrences} occurrence(s), ${uniqueEntries} unique text(s) in ${files.length} file(s).`
);

if (jsonOut) {
  const report = files.map((file) => ({
    file,
    texts: [...byFile.get(file).entries()]
      .sort((a, b) => a[1][0] - b[1][0])
      .map(([text, lines]) => ({
        text,
        locations: lines.map((l) => `${file}:${l}`),
      })),
  }));

  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), "utf8");

  console.log(`📝 Report written to ${"\x1b[32m"} ${jsonOut} ${"\x1b[0m"}`);
}

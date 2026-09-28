#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * detect-french.cjs
 * Détecte les textes en français dans un projet React (JSX/TSX/JS/TS)
 * Résultats regroupés par fichier ; dans un fichier, les textes identiques
 * (même orthographe, mêmes majuscules) sont regroupés avec leurs lignes.
 * Affichage : fichier, puis texte et location(s).
 *
 * Installation :  npm i -D @babel/parser @babel/traverse
 * Utilisation  :  node detect-french.cjs [dossier=src] [--json rapport.json] [--jsx-only]
 *
 *  --jsx-only : ne regarde que le JSX (texte + attributs), ignore les chaînes dans le code JS
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

// Fichiers de traduction déjà en place : ignorés sauf si l'argument --include-locales est utilisés
const ALWAYS_IGNORED_FILES = new Set(["fr.ts"]);
const LOCALES_DIR = "locales";

// Attributs JSX qui contiennent du code/technique, pas du texte affiché
const IGNORED_ATTRS = new Set([
  "className", "id", "key", "ref", "href", "src", "type", "name", "htmlFor",
  "style", "target", "rel", "role", "value", "data-testid", "to", "path", "variant",
  "size", "color", "as", "method", "action", "viewBox", "d", "fill", "stroke",
]);

// Textes entourés de "--" (ou <!-- ... -->) : considérés comme des commentaires
const COMMENT_LIKE = /^(<!)?--[\s\S]*--(>)?$/;

const NO_TAG = "(hors JSX)";

// ---------- Détection du français ----------
const ACCENTS = /[àâäçéèêëîïôöûùüÿœæ]/i;

// Mots courants et peu ambigus avec l'anglais / le code
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
  if (/^[\W\d_]+$/.test(t)) return false;            // uniquement symboles / chiffres
  if (/^(https?:|\/|\.|#|[a-z]+:\/\/)/i.test(t)) return false; // urls, chemins
  if (/^[a-z0-9_-]+$/.test(t) && !FR_WORDS.has(t.toLowerCase())) return false; // identifiants
  if (ACCENTS.test(t)) return true;
  const words = t.toLowerCase().split(/[^a-zàâäçéèêëîïôöûùüÿœæ']+/).filter(Boolean);
  return words.some((w) => FR_WORDS.has(w.replace(/^[ldjnmst]'/, "")));
}

// ---------- Noms de balises ----------
function jsxName(n) {
  if (!n) return "?";
  if (n.type === "JSXIdentifier") return n.name;
  if (n.type === "JSXMemberExpression") return `${jsxName(n.object)}.${jsxName(n.property)}`;
  if (n.type === "JSXNamespacedName") return `${n.namespace.name}:${n.name.name}`;
  return "?";
}

// Balise à laquelle appartient une chaîne/template (ex: {"Oui"} ou placeholder={"Nom"})
function tagForExpression(p) {
  const container = p.findParent((x) => x.isJSXExpressionContainer());
  if (!container) return NO_TAG;
  const owner = container.parent;
  if (owner.type === "JSXElement") return `<${jsxName(owner.openingElement.name)}>`;
  if (owner.type === "JSXFragment") return "<>";
  if (owner.type === "JSXAttribute") return `<${jsxName(container.parentPath.parent.name)}>`;
  return NO_TAG;
}

// ---------- Parcours des fichiers ----------
function* walk(dir, insideLocales = false) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;

      const isLocalesDir = entry.name === LOCALES_DIR;

      // --only-locales : on ne descend que dans locales
      if (onlyLocales) {
        if (isLocalesDir) {
          yield* walk(fullPath, true);
        } else if (insideLocales) {
          yield* walk(fullPath, true);
        }
        continue;
      }

      // Mode normal : locales est ignoré
      if (isLocalesDir && !includeLocales) continue;

      yield* walk(fullPath, insideLocales || isLocalesDir);
    } else if (EXTENSIONS.has(path.extname(entry.name))) {
      if (ALWAYS_IGNORED_FILES.has(entry.name)) continue;

      yield fullPath;
    }
  }
}

// fichier -> (texte exact, casse comprise -> lignes)
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
    console.warn(`⚠️  Impossible de parser ${file}: ${e.message}`);
    return;
  }

  const seen = new Set();
  const add = (node, text, kind, tag) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean || !isFrench(clean)) return;
    if (COMMENT_LIKE.test(clean)) return; // "-- commentaire --" ignoré
    const key = `${node.loc.start.line}:${node.loc.start.column}`;
    if (seen.has(key)) return;
    seen.add(key);
    record(file, node.loc.start.line, clean);
  };

  traverse(ast, {
    JSXText(p) {
      const parent = p.parent;
      const tag = parent.type === "JSXElement" ? `<${jsxName(parent.openingElement.name)}>` : "<>";
      add(p.node, p.node.value, "jsx-text", tag);
    },
    JSXAttribute(p) {
      const name = p.node.name.name;
      if (IGNORED_ATTRS.has(name) || String(name).startsWith("on")) return;
      const v = p.node.value;
      if (v && v.type === "StringLiteral") {
        add(v, v.value, `attr:${name}`, `<${jsxName(p.parent.name)}>`);
      }
    },
    StringLiteral(p) {
      const parent = p.parent;
      if (/^(Import|Export)/.test(parent.type)) return;
      if (parent.type === "JSXAttribute") return;
      if (parent.type === "ObjectProperty" && parent.key === p.node && !parent.computed) return;
      if (parent.type === "CallExpression" && parent.callee.name === "require") return;
      if (/^TS/.test(parent.type)) return;
      const tag = tagForExpression(p);
      if (jsxOnly && tag === NO_TAG) return;
      add(p.node, p.node.value, "string", tag);
    },
    TemplateLiteral(p) {
      const tag = tagForExpression(p);
      if (jsxOnly && tag === NO_TAG) return;
      const text = p.node.quasis.map((q) => q.value.cooked).join("${…}");
      add(p.node, text, "template", tag);
    },
  });
}

// ---------- Main ----------
if (!fs.existsSync(root)) {
  console.error(`Dossier introuvable : ${root}`);
  process.exit(1);
}

if (includeLocales && onlyLocales) {
  console.error("❌ --include-locales et --only-locales ne peuvent pas être utilisés ensemble.");
  process.exit(1);
}

for (const file of walk(root)) analyze(file);

// Fichiers triés par ordre alphabétique, textes par première ligne d'apparition
const files = [...byFile.keys()].sort();

for (const file of files) {
  console.log(`\n📄 ${file}`);
  const entries = [...byFile.get(file).entries()].sort((a, b) => a[1][0] - b[1][0]);
  for (const [text, lines] of entries) {
    console.log(`  texte:    ${text}`);
    console.log(`  location: ${lines.map((l) => `${file}:${l}`).join(", ")}`);
  }
}

console.log(
  `\n✅ ${totalOccurrences} occurrence(s), ${uniqueEntries} texte(s) unique(s) dans ${files.length} fichier(s).`
);

if (jsonOut) {
  const report = files.map((file) => ({
    file,
    texts: [...byFile.get(file).entries()]
      .sort((a, b) => a[1][0] - b[1][0])
      .map(([text, lines]) => ({ text, locations: lines.map((l) => `${file}:${l}`) })),
  }));
  fs.writeFileSync(jsonOut, JSON.stringify(report, null, 2), "utf8");
  console.log(`📝 Rapport écrit dans ${jsonOut}`);
}

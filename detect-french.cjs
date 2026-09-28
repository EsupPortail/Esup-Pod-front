#!/usr/bin/env node
/**
 * detect-french.cjs
 * Détecte les textes en français dans un projet React (JSX/TSX/JS/TS).
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
const jsonOut = jsonIdx !== -1 ? args[jsonIdx + 1] : null;
const jsxOnly = args.includes("--jsx-only");
const root = args.find((a, i) => !a.startsWith("--") && i !== jsonIdx + 1) || "src";

const EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const IGNORED_DIRS = new Set(["node_modules", "dist", "build", ".git", ".next", "coverage"]);

// Fichiers de traduction déjà en place : ignorés quel que soit leur dossier
const IGNORED_FILES = new Set(["fr.ts", "en.ts", "es.ts", "language.ts"]);

// Attributs JSX qui contiennent du code/technique, pas du texte affiché
const IGNORED_ATTRS = new Set([
  "className", "id", "key", "ref", "href", "src", "type", "name", "htmlFor",
  "style", "target", "rel", "role", "value", "data-testid", "to", "path", "variant",
  "size", "color", "as", "method", "action", "viewBox", "d", "fill", "stroke",
]);

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

// ---------- Parcours des fichiers ----------
function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else if (EXTENSIONS.has(path.extname(entry.name)) && !IGNORED_FILES.has(entry.name)) {
      yield path.join(dir, entry.name);
    }
  }
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
    return [];
  }

  const found = [];
  const seen = new Set();
  const add = (node, text, kind) => {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean || !isFrench(clean)) return;
    const key = `${node.loc.start.line}:${node.loc.start.column}`;
    if (seen.has(key)) return;
    seen.add(key);
    found.push({ file, line: node.loc.start.line, kind, text: clean });
  };

  traverse(ast, {
    JSXText(p) {
      add(p.node, p.node.value, "jsx-text");
    },
    JSXAttribute(p) {
      const name = p.node.name.name;
      if (IGNORED_ATTRS.has(name) || String(name).startsWith("on")) return;
      const v = p.node.value;
      if (v && v.type === "StringLiteral") add(v, v.value, `attr:${name}`);
    },
    StringLiteral(p) {
      if (jsxOnly) return;
      const parent = p.parent;
      // On ignore imports/exports, require(), clés d'objets, attributs JSX (déjà traités), types TS
      if (/^(Import|Export)/.test(parent.type)) return;
      if (parent.type === "JSXAttribute") return;
      if (parent.type === "ObjectProperty" && parent.key === p.node && !parent.computed) return;
      if (parent.type === "CallExpression" && parent.callee.name === "require") return;
      if (/^TS/.test(parent.type)) return;
      add(p.node, p.node.value, "string");
    },
    TemplateLiteral(p) {
      if (jsxOnly && p.parent.type !== "JSXExpressionContainer") return;
      const text = p.node.quasis.map((q) => q.value.cooked).join("${…}");
      add(p.node, text, "template");
    },
  });
  return found;
}

// ---------- Main ----------
if (!fs.existsSync(root)) {
  console.error(`Dossier introuvable : ${root}`);
  process.exit(1);
}

const results = [];
for (const file of walk(root)) results.push(...analyze(file));

const byFile = results.reduce((acc, r) => {
  (acc[r.file] ||= []).push(r);
  return acc;
}, {});

for (const [file, items] of Object.entries(byFile)) {
  console.log(`\n📄 ${file}`);
  for (const r of items) {
    console.log(`  L${String(r.line).padEnd(4)} [${r.kind}] ${r.text}`);
  }
}

console.log(`\n✅ ${results.length} texte(s) français dans ${Object.keys(byFile).length} fichier(s).`);

if (jsonOut) {
  fs.writeFileSync(jsonOut, JSON.stringify(results, null, 2), "utf8");
  console.log(`📝 Rapport écrit dans ${jsonOut}`);
}

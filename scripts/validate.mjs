import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  codexMarketplace: ".agents/plugins/marketplace.json",
  claudeMarketplace: ".claude-plugin/marketplace.json",
  codexManifest: "plugins/dia/.codex-plugin/plugin.json",
  claudeManifest: "plugins/dia/.claude-plugin/plugin.json",
  skill: "plugins/dia/skills/dia/SKILL.md",
};

async function json(path) {
  return JSON.parse(await readFile(resolve(root, path), "utf8"));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const codexMarketplace = await json(files.codexMarketplace);
const claudeMarketplace = await json(files.claudeMarketplace);
const codexManifest = await json(files.codexManifest);
const claudeManifest = await json(files.claudeManifest);
const skill = await readFile(resolve(root, files.skill), "utf8");

assert(codexManifest.name === "dia", "Codex plugin name must be dia");
assert(claudeManifest.name === codexManifest.name, "Plugin names must match");
assert(claudeManifest.version === codexManifest.version, "Plugin versions must match");
assert(codexMarketplace.name === "rakudeji", "Codex marketplace name must be rakudeji");
assert(claudeMarketplace.name === codexMarketplace.name, "Marketplace names must match");
assert(codexMarketplace.plugins.some(({ name }) => name === "dia"), "Codex marketplace must expose dia");
assert(claudeMarketplace.plugins.some(({ name }) => name === "dia"), "Claude marketplace must expose dia");
assert(/^---\nname: dia\ndescription: .+\n---\n/s.test(skill), "SKILL.md requires name and description frontmatter");
assert(!skill.includes("[TODO"), "SKILL.md must not contain TODO placeholders");

await Promise.all([
  access(resolve(root, "plugins/dia/skills/dia/references/cli.md")),
  access(resolve(root, "plugins/dia/skills/dia/references/tsx-authoring.md")),
  access(resolve(root, "plugins/dia/LICENSE")),
]);

console.log(`dia plugin ${codexManifest.version} is structurally valid`);

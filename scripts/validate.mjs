import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const files = {
  codexMarketplace: ".agents/plugins/marketplace.json",
  claudeMarketplace: ".claude-plugin/marketplace.json",
  codexManifest: "plugins/dia/.codex-plugin/plugin.json",
  claudeManifest: "plugins/dia/.claude-plugin/plugin.json",
  mcp: "plugins/dia/.mcp.json",
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
const mcp = await json(files.mcp);
const skill = await readFile(resolve(root, files.skill), "utf8");

assert(codexManifest.name === "dia", "Codex plugin name must be dia");
assert(claudeManifest.name === codexManifest.name, "Plugin names must match");
assert(claudeManifest.version === codexManifest.version, "Plugin versions must match");
assert(
  claudeMarketplace.plugins.find(({ name }) => name === "dia")?.version === codexManifest.version,
  "Claude marketplace version must match the plugin version",
);
assert(codexMarketplace.name === "rakudeji", "Codex marketplace name must be rakudeji");
assert(claudeMarketplace.name === codexMarketplace.name, "Marketplace names must match");
assert(codexMarketplace.plugins.some(({ name }) => name === "dia"), "Codex marketplace must expose dia");
assert(claudeMarketplace.plugins.some(({ name }) => name === "dia"), "Claude marketplace must expose dia");
assert(/^---\nname: dia\ndescription: .+\n---\n/s.test(skill), "SKILL.md requires name and description frontmatter");
assert(!skill.includes("[TODO"), "SKILL.md must not contain TODO placeholders");
assert(codexManifest.mcpServers === "./.mcp.json", "Codex manifest must declare the dia MCP companion file");
assert(
  mcp.mcpServers?.dia?.type === "http"
    && mcp.mcpServers.dia.url === "https://dia.sdweb.workers.dev/mcp",
  "dia MCP must use the production HTTPS endpoint",
);
/**
 * The skill points at dia's vocabulary; it does not restate it.
 *
 * This file used to assert the opposite — that SKILL.md still explained `validate_tsx` and the
 * Problem/Finding/Site contract — and so it held the plugin to a dia that no longer exists: those
 * tools were renamed to `check_*`, that vocabulary became `errors`/`warnings` and
 * `ErrorDiagnostic`/`WarningDiagnostic`, and the guard kept the stale text in place. A copy of a
 * contract is a copy that drifts, and a check on the copy drifts with it. So the assertions are
 * inverted: what must be present is the way to *reach* the reference, and what must be absent is
 * any word dia has since dropped.
 */
assert(
  skill.includes("diagram://reference/") && skill.includes("diagram://diagnostics/"),
  "SKILL.md must send the agent to dia's served reference and diagnostics rather than restate them",
);
assert(
  skill.includes("resources/list") && skill.includes("tools/list"),
  "SKILL.md must tell the agent to discover what this deployment actually serves",
);
assert(
  skill.includes("ErrorDiagnostic") && skill.includes("WarningDiagnostic")
    && skill.includes("fixIts") && skill.includes("primary"),
  "SKILL.md must state the current diagnostic contract",
);
/**
 * Words dia no longer emits, or never did. `validate_*` are the pre-rename tool names, `problems` /
 * `findings` / `sites` the pre-rename diagnostic vocabulary, and `dia validate` a command the CLI
 * does not have — its command list is init|add|list|render|check|lint|icons|documents|export|format|schema.
 */
for (const removed of [
  "defineComponent", "idScope", "ReplicaSet", "dia up", "@rakudeji/dia@next",
  "validate_tsx", "validate_diagram", "dia validate", "problems", "findings", "sites",
]) {
  assert(!skill.includes(removed), `SKILL.md still names removed or superseded vocabulary '${removed}'`);
}
/** The reference is served, so shipping a copy of it is the drift this plugin exists to avoid. */
for (const copied of ["cli.md", "tsx-authoring.md", "remote-mcp.md"]) {
  let present = true;
  try {
    await access(resolve(root, `plugins/dia/skills/dia/references/${copied}`));
  } catch {
    present = false;
  }
  assert(!present, `plugins/dia/skills/dia/references/${copied} restates what dia serves; delete it`);
}

await access(resolve(root, "plugins/dia/LICENSE"));

console.log(`dia plugin ${codexManifest.version} is structurally valid`);

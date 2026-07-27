# dia agent plugins

Official RAKUDEJI agent skill for authoring and refining diagrams with [`@rakudeji/dia`](https://www.npmjs.com/package/@rakudeji/dia).

The same Agent Skill and hosted dia MCP connection are packaged for Codex and Claude Code. They guide an agent through plain-data Models, reusable fact builders, JSX Views, Styles, multi-diagram projects, Problem/Finding repair, deterministic SVG rendering through the remote sandbox, local SVG/PNG rendering, visual lint, geometry inspection, and visual refinement.

The Codex-facing product boundary, remote/local workflow selection, security
model, compatibility policy, and release gates are defined in
[`docs/CodexPluginDesign.md`](docs/CodexPluginDesign.md).

## Codex

Add the marketplace and install the plugin:

```sh
codex plugin marketplace add RAKUDEJI/dia-agent-plugins
codex plugin add dia@rakudeji
```

Start a new task and invoke `$dia`, or ask Codex to create or improve a diagram with dia.

The plugin connects `https://dia.sdweb.workers.dev/mcp`. Codex can use `validate_tsx`, `render_tsx`, and `lint_tsx` for a quick stateless diagram without installing the CLI or creating a project.

## Claude Code

Add the marketplace and install the plugin inside Claude Code:

```text
/plugin marketplace add RAKUDEJI/dia-agent-plugins
/plugin install dia@rakudeji
/reload-plugins
```

Invoke `/dia:dia`, or ask Claude to create or improve a diagram with dia.

The plugin-level `.mcp.json` connects the same hosted dia MCP.

## CLI installation

The skill does not require a global CLI. New projects can be initialized with:

```sh
pnpm dlx @rakudeji/dia@latest init my-diagrams --diagnostics llm
```

Initialized projects install `@rakudeji/dia` locally and use `pnpm exec dia` or the generated package scripts.

## Repository layout

```text
.agents/plugins/marketplace.json      Codex marketplace
.claude-plugin/marketplace.json       Claude Code marketplace
plugins/dia/.codex-plugin/plugin.json Codex manifest
plugins/dia/.claude-plugin/plugin.json Claude Code manifest
plugins/dia/.mcp.json                  Hosted dia MCP connection
plugins/dia/skills/dia/SKILL.md        Shared Agent Skill
```

## License

MIT

## Development

Run the repository-level structural checks with:

```sh
node scripts/validate.mjs
```

Before a release, also validate the plugin with the current Codex and Claude Code validators.

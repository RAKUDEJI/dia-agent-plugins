# dia agent plugins

Official RAKUDEJI agent skill for authoring and refining diagrams with [`@rakudeji/dia`](https://www.npmjs.com/package/@rakudeji/dia).

The same Agent Skill is packaged for Codex and Claude Code. It guides an agent through semantic TSX authoring, reusable symmetric components, View and Style separation, LLM-oriented diagnostics, deterministic SVG rendering, and visual refinement.

## Codex

Add the marketplace and install the plugin:

```sh
codex plugin marketplace add RAKUDEJI/dia-agent-plugins
codex plugin add dia@rakudeji
```

Start a new task and invoke `$dia`, or ask Codex to create or improve a diagram with dia.

## Claude Code

Add the marketplace and install the plugin inside Claude Code:

```text
/plugin marketplace add RAKUDEJI/dia-agent-plugins
/plugin install dia@rakudeji
/reload-plugins
```

Invoke `/dia:dia`, or ask Claude to create or improve a diagram with dia.

## CLI installation

The skill does not require a global CLI. New projects can be initialized with:

```sh
pnpm dlx @rakudeji/dia@next init my-diagram --template tsx --diagnostics llm
```

Initialized projects install `@rakudeji/dia` locally and use `pnpm exec dia` or the generated package scripts.

## Repository layout

```text
.agents/plugins/marketplace.json      Codex marketplace
.claude-plugin/marketplace.json       Claude Code marketplace
plugins/dia/.codex-plugin/plugin.json Codex manifest
plugins/dia/.claude-plugin/plugin.json Claude Code manifest
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

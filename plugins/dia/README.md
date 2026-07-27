# dia plugin

This dual-manifest plugin supplies the `dia` Agent Skill to Codex and Claude Code. Version `0.1.0-next.5` covers plain-data Model authoring, JSX View projection, Style, the multi-diagram CLI, SVG/PNG rendering, Problem/Finding repair, visual lint, geometry and explanations, shared document locks, and the hosted dia MCP at `https://dia.sdweb.workers.dev/mcp`.

The MCP connection is declared in `.mcp.json`. It provides JSON tools plus isolated `validate_tsx`, `render_tsx`, and `lint_tsx` tools for stateless in-memory projects. The skill is located at `skills/dia/SKILL.md`; its CLI, local TSX, and remote MCP guidance is self-contained under `skills/dia/references/`.

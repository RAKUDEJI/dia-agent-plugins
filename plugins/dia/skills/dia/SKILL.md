---
name: dia
description: Create, edit, validate, render, inspect, and visually refine Diagram as Code projects with the dia CLI and @rakudeji/dia TSX DSL. Use for architecture diagrams, flows, topology maps, multi-diagram projects, reusable symmetric components, semantic Model/View/Style authoring, .dia.tsx or dia JSON files, SVG or PNG generation, visual lint, geometry inspection, and dia diagnostic repair.
---

# dia

Build diagrams through dia's semantic TSX workflow. Prefer semantic entities and relations plus a separate View and Style. Treat a project as a named collection of diagrams that can share components, View, and Style. Keep Direct JSON available for existing files or explicit requests.

## Work safely

- Preserve unrelated files and user-authored choices.
- Use the project's installed `dia` version when `@rakudeji/dia` is already present. Run `dia --version` when behavior may depend on the installed prerelease.
- Do not require a global installation. Use `pnpm exec dia` inside a project and `pnpm dlx @rakudeji/dia@next` only for bootstrapping.
- Treat diagnostics as the contract. Do not produce or claim a valid SVG after a failed validation or render.
- Keep model semantics independent from visual workarounds. Put presentation decisions in View or Style.
- Do not send TSX to HTTP or MCP surfaces. TSX is trusted local code evaluated by the CLI.

## Choose the workflow

1. Inspect the target directory for `package.json#dia`, `dia.default`, `dia.diagrams`, `dia.outDir`, `diagrams/*.dia.tsx`, shared components, View/Style modules, JSON documents, and existing outputs.
2. For a new project, read [CLI workflow](references/cli.md), then initialize the TSX template.
3. For TSX authoring or visual refinement, read [TSX authoring and visual quality](references/tsx-authoring.md).
4. For an existing direct JSON diagram, preserve that syntax unless the user asks to migrate it.
5. For a single quick diagram outside a project, render the `.dia.tsx` path directly instead of creating scaffolding.

## Create or edit

For a new project, run from the intended parent directory:

```sh
pnpm dlx @rakudeji/dia@next init <project-name> --diagnostics llm
cd <project-name>
pnpm install
```

Start from the generated files rather than reconstructing the API from memory. The template establishes the supported TypeScript, JSX, View, Style, component, multi-entry, and output contracts. Add a named entry with `pnpm exec dia add <kebab-name>`.

When editing:

- Model the meaning with `Entity`, `Relation`, and properties.
- Project meaning with `defineView`; define label, icon, edge role, arrows, containment, ports, and layout intent there.
- Define appearance with `defineStyle`.
- Use `defineComponent`, `idScope`, and strict `ReplicaSet` for repeated or symmetric structures.
- Reuse one component for semantically identical units. Do not copy and independently perturb their internal topology.

## Validate and render

Run the full loop after meaningful changes:

```sh
pnpm check
pnpm exec dia validate --all --diagnostics llm
pnpm exec dia render --all
pnpm exec dia lint --all --diagnostics llm
```

For one diagram, replace `--all` with its registered name or source path. If validation fails, follow JSON Pointers, related locations, and suggestions; fix the source rather than suppressing the diagnostic. Re-run validation before rendering.

When icons are used and reproducibility matters:

```sh
pnpm exec dia icons sync --all --diagnostics llm
pnpm exec dia render --icons-lock icons.lock.json --frozen-icons
```

Use the built-in inspection outputs when the geometry needs diagnosis:

```sh
pnpm exec dia render <name> --format png
pnpm exec dia render <name> --geometry geometry.json
pnpm exec dia lint <name> --diagnostics llm
pnpm exec dia up
```

## Judge the result

Inspect the rendered SVG or PNG, not only the exit code. Use visual lint for objective defects, geometry JSON for machine-readable coordinates, and human visual judgment for symmetry and semantic legibility. Iterate until the visual hierarchy and flows are clear.

Prioritize:

1. semantic symmetry and consistent internal geometry;
2. alignment, balanced group sizes, and even spacing;
3. clean node approaches and respected port sides;
4. distinguishable parallel or feedback lanes;
5. labels that stay attached to their paths without covering nodes or group titles;
6. readable wrapping and a balanced aspect ratio;
7. consistent icon and rectangle treatment.

Crossings alone are not a failure. Prefer coherent, predictable routing over irregular detours made only to reduce the crossing count.

## Finish

- Leave the editable sources and deterministic outputs in the project.
- Report the diagram names, default entry, output paths, validation commands, and any remaining aesthetic tradeoffs.
- Do not claim visual improvement without inspecting the current SVG.

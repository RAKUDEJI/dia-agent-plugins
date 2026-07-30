---
name: dia
description: Create, edit, check, render, lint, and visually refine Diagram as Code with the hosted dia MCP, the dia CLI, and the @rakudeji/dia TSX DSL. Use for quick stateless diagrams, architecture diagrams, flows, topology maps, multi-diagram projects, semantic Model/View/Style authoring, .dia.tsx or dia JSON files, SVG or PNG output, visual lint, geometry inspection, and repairing a dia diagnostic.
---

# dia

A diagram is up to three documents that know nothing of each other: a Model of facts, a View that
turns those facts into visual structure, and a Style that says what that structure looks like.

**Do not author from memory, and do not expect this file to teach the vocabulary.** dia derives its
own reference from its own schemas, so the served text is right and any copy of it is a copy that
drifts. This file says where to look and how to work; everything a diagram is written in comes from
dia itself.

## Read the vocabulary before writing one

| What you need | Where it is |
|---|---|
| Model / View / Style vocabulary, edge roles, spatial constraints, what is refused | `diagram://reference/dsl`, `diagram://reference/layout` |
| The portable remote-TSX contract and a minimal project | `diagram://reference/remote-tsx` |
| Documents that render, to start from rather than invent | `diagram://examples/{name}` |
| What a diagnostic means and how to repair it | `diagram://diagnostics/{code}` |
| The machine contract | `diagram://schema/{model,view,style,direct}/latest` |
| Everything readable, in one call | `resources/list`, or `GET https://dia.sdweb.workers.dev/api/v1/docs` |
| The CLI's actual surface | `dia --help`, `dia <command> --help` |
| The tools this deployment actually has | `tools/list` |

A diagnostic code names itself, so a refusal is repaired by reading that code — not by guessing, and
not from a table written here.

## The contract you must respect

- An **`ErrorDiagnostic`** stops a stage and arrives in `errors`. A **`WarningDiagnostic`** never
  stops one and arrives in `warnings`. Never claim a picture after an error, and never treat a
  warning as a failure: a diagram with warnings still draws.
- Each diagnostic carries a stable `code`, one `primary` location, labelled `secondary` locations,
  optional `notes`, and sometimes `fixIts` — atomic JSON Patch edits with stable ids. Repair at the
  location dia names, in the document it names.
- Meaning may be a contract; appearance may not. A spatial `ensure` holds or the diagram is refused
  with a counterfactual; a glyph, a boundary, a region or a canvas shape is a wish, granted where it
  can be and given up **by name** where it cannot. A warning naming a wish is dia working, not a
  defect to suppress.
- Keep meaning out of presentation. Facts belong in the Model; how they are drawn belongs in the
  View; what that looks like belongs in the Style. Never add an entity or a property that exists
  only to make the picture come out.

## Choose where to work

**Hosted MCP** for a self-contained diagram that needs no project, no installed dependency, no PNG
and no files on disk. The plugin connects `https://dia.sdweb.workers.dev/mcp`. Build one
`{ version: 1, entry, files }` project in memory, check it, render it only after it checks, then
lint it. Remote TSX is a closed subset — read `diagram://reference/remote-tsx` for exactly what it
allows. Never put secrets, credentials, environment values, or unrelated local files into one.

**The CLI** for a project on disk, a PNG, a lock file, or anything to be committed:

```sh
pnpm dlx @rakudeji/dia@latest init <project-name> --diagnostics llm
cd <project-name> && pnpm install
```

Start from the generated files rather than reconstructing the API. Use `pnpm exec dia` inside a
project; do not require a global install. When `@rakudeji/dia` is already present, use that version
and run `dia --version` if behaviour might depend on the prerelease.

For an existing JSON document, preserve its syntax unless asked to migrate. For a standalone
`.dia.tsx` that already exists, render the path directly instead of scaffolding around it.

## Work the loop

Check, render, then lint — and read `dia <command> --help` for the flags, which change with the
release:

1. **Check** before rendering. Repair every error using its code, its locations, its notes, and its
   `fixIts`. Fix the source; do not suppress.
2. **Render**, then **look at what you rendered**. An exit code is not a picture.
3. **Lint**. It reports what a render is deliberately quiet about: boxes that overlap, labels that
   collided or landed on the wrong route, wishes the layout could not realize, icons nothing pins,
   and arrangement that rests on nothing the document declares. These are warnings; act on them,
   without treating the diagram as broken.
4. When icons matter for reproducibility, sync the lock and render frozen so the same document draws
   the same picture tomorrow.

## Judge the result

Look at the SVG or PNG. Use lint for objective defects and the geometry report for coordinates, and
your own eyes for whether the diagram reads. Prefer, in order: semantic symmetry and consistent
internal geometry; alignment, balanced groups, even spacing; clean approaches and respected port
sides; distinguishable parallel and feedback lanes; labels attached to their own paths; readable
wrapping and a balanced shape; consistent treatment of glyphs and boxes.

Crossing count alone is not a failure. Coherent, predictable routing beats an irregular detour taken
only to reduce it.

## Finish

- Leave the editable sources and the deterministic outputs. For remote-only work, hand back the
  authored sources if reproducibility matters, and do not imply the server kept them.
- Report the diagram names, the outputs, the errors resolved, the warnings reviewed, the commands
  that verify it, and any aesthetic tradeoff left open.
- Preserve unrelated files and the author's own choices.

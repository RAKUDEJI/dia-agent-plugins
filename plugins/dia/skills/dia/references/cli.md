# CLI workflow

Use the project-local CLI when a dia project already exists:

```sh
pnpm exec dia --version
pnpm exec dia --help
```

Bootstrap without a global installation:

```sh
pnpm dlx @rakudeji/dia@next init my-diagrams --diagnostics llm
cd my-diagrams
pnpm install
```

Use `dia init .` to initialize the current directory. It refuses to overwrite generated-file collisions.

## Multi-diagram projects

New projects use these `package.json#dia` fields:

- `default`: diagram used when no target is given;
- `diagrams`: stable names mapped to `.dia.tsx` or JSON entries;
- `outDir`: generated artifact directory.

Manage and inspect the collection:

```sh
pnpm exec dia list
pnpm exec dia add request-flow
pnpm exec dia validate --all --diagnostics llm
pnpm exec dia render --all
pnpm exec dia lint --all --diagnostics llm
pnpm exec dia up
```

Pass a registered name to operate on one diagram:

```sh
pnpm exec dia validate overview --diagnostics llm
pnpm exec dia render overview
pnpm exec dia render request-flow --format png
```

## Standalone files

Do not create a project merely to render one trusted TSX file:

```sh
pnpm dlx @rakudeji/dia@next render diagram.dia.tsx -o diagram.svg
pnpm dlx @rakudeji/dia@next lint diagram.dia.tsx --diagnostics llm
```

The CLI bundles and executes TSX but does not run TypeScript type checking. In a project, run the generated `pnpm check`.

## Artifacts and inspection

```sh
# SVG and PNG.
pnpm exec dia render overview --format svg
pnpm exec dia render overview --format png

# Renderer-independent nodes, bounds, edge points, attachments, and labels.
pnpm exec dia render overview --geometry geometry.json

# Export only semantic Model facts from TSX.
pnpm exec dia export model overview -o model.json --diagnostics llm

# Inspect JSON contracts.
pnpm exec dia schema all --version 1
```

The CLI accepts `-` for stdin/stdout only where command help documents it. Do not request image output and geometry JSON on stdout simultaneously.

## Deterministic icons

```sh
pnpm exec dia icons sync overview -o icons.lock.json --diagnostics llm
pnpm exec dia render overview --icons-lock icons.lock.json --frozen-icons
```

For a multi-diagram lock workflow, use `icons sync --all` and follow the project paths emitted by the CLI.

## Diagnostics loop

Prefer `--diagnostics llm` when an agent is repairing input. Preserve these behaviors:

- success exits `0`;
- invalid input or render failure exits nonzero;
- a failed render must not be treated as a partial success;
- pointers identify the source location;
- `related` connects derived visual failures back to model or view sources;
- suggestions are guidance, not permission to change the model's meaning.

For `UNMAPPED_ENTITY` or `UNMAPPED_RELATION`, decide whether the item is meant to be visible. Add a matching View rule when it carries meaning; use omit only when exclusion is deliberate. Do not accept an omit suggestion merely to make validation pass.

If an icon cannot be resolved, distinguish a missing icon package or icon set from a bad icon name. Install only the dependency named by the diagnostic, then validate again.

Visual lint reports enforceable geometry defects such as overlapping reciprocal edges, shared attachments, detached labels, and label-obstacle collisions. Treat warnings as repair targets, then inspect the rendered image; lint is not a complete definition of beauty.

## Existing JSON inputs

Do not migrate direct JSON merely because TSX is preferred for new work. Validate and render it in place:

```sh
pnpm exec dia validate diagram.json --diagnostics llm
pnpm exec dia render diagram.json -o diagram.svg
```

Use `dia format` only for JSON sources and only when normalization is desired.

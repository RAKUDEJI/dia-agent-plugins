# CLI workflow

Use the locally installed CLI whenever a dia project already exists:

```sh
pnpm exec dia --version
pnpm exec dia --help
```

Use the public prerelease channel only to initialize a project without a global install:

```sh
pnpm dlx @rakudeji/dia@next init my-diagram --template tsx --diagnostics llm
```

`dia init` accepts a single directory name, not an absolute or nested path. Change to the intended parent directory first.

## Core commands

```sh
# Check a TSX or JSON input. With no input, package.json#dia.entry is used.
pnpm exec dia validate --diagnostics llm

# Render package.json#dia.entry to package.json#dia.output.
pnpm exec dia render

# Compile a TSX entry to the semantic model artifact for inspection.
pnpm exec dia build -o model.json --diagnostics llm

# Inspect built-in contracts.
pnpm exec dia schema all --version 1
pnpm exec dia view show basic
pnpm exec dia style show default

# Resolve and lock icons, then require the lock during render.
pnpm exec dia icons sync -o icons.lock.json --diagnostics llm
pnpm exec dia render --icons-lock icons.lock.json --frozen-icons
```

For a specific input or output:

```sh
pnpm exec dia validate path/to/diagram.dia.tsx --diagnostics llm
pnpm exec dia render path/to/diagram.dia.tsx -o path/to/diagram.svg
```

The CLI also accepts stdin/stdout where the command documents `-`. Do not mix diagnostic text into SVG stdout.

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

## Existing JSON inputs

Do not migrate direct JSON merely because TSX is preferred for new work. Validate and render it in place:

```sh
pnpm exec dia validate diagram.json --diagnostics llm
pnpm exec dia render diagram.json -o diagram.svg
```

Use `dia format` only for JSON sources and only when normalization is desired.

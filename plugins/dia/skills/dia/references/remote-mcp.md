# Remote MCP workflow

Use the hosted dia MCP for a stateless diagram when creating a local project would be unnecessary. The server accepts public diagram JSON directly and a constrained in-memory TSX project. It returns diagnostics and SVG but does not store the project or generated artifact.

## Portable TSX input

Both `validate_tsx` and `render_tsx` accept:

```json
{
  "version": 1,
  "entry": "diagram.dia.tsx",
  "files": {
    "diagram.dia.tsx": "import { defineDiagram, Entity, Model, Relation } from \"@rakudeji/dia\";\nexport default defineDiagram({ model: <Model><Entity id=\"client\" properties={{ label: \"Client\" }} /><Entity id=\"api\" properties={{ label: \"API\" }} /><Relation type=\"flow\" from=\"client\" to=\"api\" /></Model> });"
  }
}
```

The entry must default-export `defineDiagram({ model, view?, style? })`. Use multiple files when reusable components, View, or Style make the source clearer.

## Allowed imports

- `@rakudeji/dia`
- relative project `.ts` and `.tsx` modules
- `iconify:<prefix>/<name>`
- relative `.svg?dia-icon` assets supplied under `files`

Do not attempt arbitrary npm imports, Node built-ins, URL imports, Vite aliases or plugins, `require()`, dynamic import, `import.meta`, filesystem access, environment access, or outbound network. The server transpiles TypeScript syntax but does not run `tsc`.

## Validation and repair

Always call `validate_tsx` first. Treat `valid: false` as a normal diagnostic result and repair the in-memory source before rendering.

Common remote-specific diagnostics include:

- `REMOTE_IMPORT_UNSUPPORTED`: replace the import with an allowed package, relative module, Iconify import, or local SVG asset.
- `REMOTE_IMPORT_NOT_FOUND`: add the referenced file or repair the relative specifier.
- `REMOTE_SOURCE_LIMIT_EXCEEDED`: reduce project size rather than trying to split state across requests.
- `JSX_UNKNOWN_PROP`: follow the suggestion; semantic facts usually belong in Properties and visual choices belong in View or Style.
- `NONDETERMINISTIC_AUTHORING`: remove time, randomness, environment branching, or other changing values.
- `TSX_INVALID_EXPORT`: default-export the value returned by `defineDiagram`.

Read `diagram://reference/remote-tsx` when tool discovery exposes resources. Diagnostic resource links under `diagram://diagnostics/{code}` provide repair guidance.

## Rendering and inspection

After validation succeeds, call `render_tsx`. A successful result contains:

- canonical Model and optional View/Style;
- SVG;
- diagnostics;
- node, edge, group, width, and height statistics.

Inspect the SVG, not only `ok: true`. Check symmetry, hierarchy, label ownership, endpoint approaches, spacing, and aspect ratio. If visual changes are needed, edit the in-memory source and repeat validation and rendering.

Remote output is SVG only. Use the local CLI for PNG, geometry JSON, visual lint, `dia up`, frozen icon locks, project persistence, or integration with local modules and Vite.

## JSON tools

For a diagram that does not need TSX composition, use:

- `validate_diagram` for Model/Direct plus optional View/Style validation;
- `render_diagram` for one SVG;
- `render_diagrams` for a batch;
- `format_diagram` for canonical JSON;
- `apply_diagram_fixes` only for fixes currently offered by diagnostics.

Keep Direct JSON when the user explicitly wants it or supplies an existing Direct document. Prefer semantic Model/View authoring for new general-purpose diagrams.

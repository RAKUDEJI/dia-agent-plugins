# TSX authoring and visual quality

## Source boundaries

Use the generated TSX project as the current API reference. Its default structure is:

- `diagrams/*.dia.tsx`: one `defineDiagram` entrypoint per named diagram;
- `components/*.tsx`: reusable semantic components shared across entries;
- `view.tsx`: a shared `defineView` projection;
- `style.ts`: a shared `defineStyle` definition;
- `package.json#dia.diagrams`: stable names mapped to entrypoints;
- `package.json#dia.default`: entry selected when no name is given;
- `package.json#dia.outDir`: deterministic artifact directory.

Keep each concern in its layer:

| Concern | Put it in |
| --- | --- |
| What exists | Model entities and relations |
| Repeated semantic unit | ordinary TypeScript function returning Model facts |
| Visual equivalence across instances | View `replicate` slots |
| What is visible and which visual variant it selects | View rules |
| Layout intent, roles, arrows, ports | View |
| Icons, density, typography, strokes, canvas | Style |

Do not add view-only properties such as `scope: "loop"` to the semantic model just to select or route an edge. Use View matching and layout intent.

## Reuse and symmetry

For repeated systems such as workers, availability zones, pipeline stages, or mirrored services:

1. Author one ordinary function that returns `{ entities, relations }`.
2. Derive stable IDs from one instance string, for example `${instance}.root`.
3. Flatten each function result into the entry's plain Model data.
4. In the View rule that emits each repeated root, declare `replicate` with explicit corresponding slot ID lists.
5. Use `Constrain` for named alignment, order, size, and anchor relationships.
6. Keep corresponding edges in the same slots and assign consistent roles and ports.
7. Change data through function arguments; do not fork the geometry by copying the fact builder.

Strict replication should expose meaningful structural differences. If units are intentionally different, use a non-strict mode or separate View rules rather than weakening the invariant silently.

Reuse fact builders across diagrams when the same semantic unit appears in overview, detail, and flow views. Keep each `.dia.tsx` entry small: compose shared facts and select the View/Style needed for that diagram.

## Relations and routing

- Use `primary` for forward reading flow.
- Use `feedback` for return or loop flow; it is not merely a dashed style.
- Use `association` for non-flow relationships.
- Set arrows explicitly in View when direction matters.
- Use named ports when an edge must attach to a particular side. A port side is a contract, not a hint.
- Keep port-free edges away from reserved port attachment points.
- Constrain only edges whose attachment side is meaningful. Let ordinary primary flow use automatic attachment unless it needs an explicit contract.
- Use edge families for genuinely shared long-distance fan-in or fan-out, not every nearby group of edges.

When routing fails, use the Problem's obstacle and Site information. For `PORT_ROUTING_UNSATISFIABLE`, reposition the nodes or remove only optional port constraints; never silently fall back to a different side. Adjust semantic ordering, layout intent, spacing, or family membership; do not randomly enlarge nodes.

A named top-side feedback port belongs to the View rule that emits the endpoint and is selected only by the matching edge rule:

```tsx
const view = defineView(
  <View>
    <EntityRule
      id="systems"
      match={{ type: "system" }}
      emit={{
        as: "entity",
        label: { property: "label" },
        ports: { feedback: { side: "top", order: 0 } },
      }}
    />
    <RelationRule
      id="feedback"
      match={{ type: "feedback" }}
      emit={[{
        as: "edge",
        role: "feedback",
        fromPort: "feedback",
        toPort: "feedback",
      }]}
    />
  </View>,
);
```

## Labels

- Keep source labels single-line; let dia perform wrapping.
- Prefer concise entity labels and move details into properties when possible.
- Edge labels should interrupt the path naturally without a background box.
- A family-wide label should appear once rather than once per member.
- Check Japanese line breaking for isolated closing punctuation and mid-word fragments.

## Visual review

Render and inspect at the intended viewing size. Use `dia render <name> --format png` when a raster preview is easier to inspect; keep SVG as the default editable vector output. Run `dia lint <name> --diagnostics llm` before visual review, and use `--geometry geometry.json` when an agent needs exact coordinates. Check the whole canvas first, then dense regions.

### Whole canvas

- Is the primary reading direction obvious?
- Do peer groups start on the same rank?
- Are corresponding groups similar in size and spacing?
- Is the aspect ratio appropriate for its destination?
- Does empty space reveal structure rather than look accidental?

### Dense regions

- Do edges approach nodes straight, without a last-moment bend or crossing?
- Are parallel edges visibly separate?
- Are feedback lanes distinct and consistent?
- Are group boundaries used as corridors without crowding titles?
- Does each label clearly belong to one path?
- Are icon nodes and rectangular nodes visually balanced?

Do not optimize one numerical score blindly. Symmetry, consistency, and semantic legibility are higher-order judgments; use Problems and Findings for enforceable contracts and visual inspection for the final decision.

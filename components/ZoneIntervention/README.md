# ZoneIntervention

A "mission-control readout" component that displays the agency's geographic service area. It shows a labelled header row with a pulsing availability signal, followed by a grid of location stations each marked with a crosshair glyph.

## File structure

```
ZoneIntervention/
├── ZoneIntervention.tsx        # Component (rendering + reduced-motion logic)
├── CrosshairIcon.tsx           # Crosshair glyph (decorative SVG)
├── ZoneIntervention.utils.ts   # Pure helper: responsive grid border classes
├── index.ts                    # Public re-export
└── README.md
```

---

## Props

| Prop                   | Type        | Default | Description                                                                  |
| ---------------------- | ----------- | ------- | ---------------------------------------------------------------------------- |
| `label`                | `string`    | —       | Section heading text (rendered as `font-mono` eyebrow, also used for ARIA)   |
| `availability`         | `string`    | —       | Availability status text rendered next to the pulsing signal dot             |
| `stations`             | `Station[]` | —       | Array of `{ name: string; meta: string }` objects, one per location          |
| `respectReducedMotion` | `boolean`   | `true`  | When `true`, disables the `animate-ping` pulse if the user prefers no motion |
| `className`            | `string`    | —       | Additional classes merged onto the root `<section>`                          |

### `Station` shape

```ts
interface Station {
  name: string; // Display name of the location (e.g. "Annecy")
  meta: string; // Secondary descriptor shown below the name (e.g. "Base · 74")
}
```

---

## Design tokens used

| Token       | CSS variable              | Hex       | Used for                                                |
| ----------- | ------------------------- | --------- | ------------------------------------------------------- |
| `ghost`     | `--color-ghost` (#f8f8ff) | `#f8f8ff` | Section label, station names, grid border, background   |
| `jungle`    | `--color-jungle`          | `#29ab87` | Availability text and signal dot (solid + pulsing ring) |
| `aerospace` | `--color-aerospace`       | `#ff4f00` | Crosshair SVG stroke colour (`currentColor`)            |

No Tailwind `blue-*`, `gray-*`, or arbitrary hex values are used. All colours reference theme tokens only.

---

## Accessibility

- The root `<section>` is labelled via `aria-labelledby`, pointing at a `useId()`-generated id set on the label `<p>`. This keeps the label association unique even when the component is rendered more than once on the same page, so screen readers always announce the correct section name.
- Stations are rendered as a semantic `<ul>` / `<li>` list, giving screen readers list context and item count.
- The signal dot (`<span aria-hidden="true">`) and crosshair SVG (`aria-hidden="true"`) are decorative and excluded from the accessibility tree.
- No emoji are used — the crosshair is a hand-drawn inline SVG using `currentColor`.

---

## Reduced-motion behaviour

The component is self-contained: it watches `window.matchMedia('(prefers-reduced-motion: reduce)')` directly via a local `useState`/`useEffect` pair, with no dependency on an external hook. When `respectReducedMotion` is `true` (the default) and the user's OS has "reduce motion" enabled, the `animate-ping` class is removed from the signal dot, leaving only the static solid dot. No other animations are present in this component.

## Responsive grid

The stations grid is `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` — one column on mobile, two from `sm`, and all four in a single row from `lg`. Because a cell's separator can be either a left border (same row) or a top border (new row) depending on the breakpoint, the border classes for each station index are computed by `getStationBorderClass(index)` in `ZoneIntervention.utils.ts` rather than inlined in the JSX.

---

## Typography note

`font-mono` resolves to Tailwind's default monospace stack in this repository (`ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`). There is no Space Mono font mapped here; do not add one.

`font-display` resolves to `Space Grotesk` via `--font-display` defined in `app/globals.css`.

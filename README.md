This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Radix UI & Atomic Components

This project now includes a lightweight atomic component layer built on top of [Radix UI](https://www.radix-ui.com/). Components live in `components/ui/` and wrap Radix primitives with Tailwind styling.

### Philosophy

Atomic design encourages small reusable building blocks:

- Atoms: `Button`, `Input`, `Label`, `Select`, `Card`, `Tooltip`, `Dialog`
- (Future) Molecules: Compositions like forms, toolbars, panels using the atoms

Each atom is:

- Accessible (inherits Radix semantics & behaviors)
- Styleable via Tailwind utility classes
- Minimal in API surface (focus on common defaults)

### Provided Components

| Component | Purpose                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `Button`  | Action trigger with variants (`primary`, `secondary`, `ghost`) and sizes |
| `Input`   | Text input styled wrapper                                                |
| `Label`   | Associates text with form field (Radix Label)                            |
| `Select`  | Accessible select powered by `@radix-ui/react-select`                    |
| `Card`    | Layout surface with header/title/description helpers                     |
| `Dialog`  | Modal dialog using `@radix-ui/react-dialog`                              |
| `Tooltip` | Hover/focus info overlay                                                 |

### Usage Example

```tsx
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

const repos = [
  { label: "frontend", value: "frontend" },
  { label: "backend", value: "backend" },
];

export function Example() {
  return (
    <div className="space-y-4">
      <Select options={repos} placeholder="Select a repo" />
      <Dialog
        title="Hello"
        description="Radix Dialog integrated as an atom."
        trigger={<Button>Open</Button>}
      >
        <p className="text-sm">Dialog body content.</p>
      </Dialog>
    </div>
  );
}
```

### Adding New Atoms

1. Pick a Radix primitive (e.g. Popover, DropdownMenu).
2. Create a file: `components/ui/<name>.tsx`.
3. Wrap the Radix primitive with Tailwind classes and export a focused API.
4. Keep props minimal; expose escape hatches via `className` and Radix component props when needed.

### Styling Conventions

- Use Tailwind utilities directly; avoid deep abstraction.
- Dark mode styles via `dark:` variants are included where sensible.
- `cn()` helper joins conditional class names.

### Roadmap / Next Steps

Potential future enhancements:

- Variant system using a utility like `class-variance-authority` for consistent variant definitions.
- Theme tokens abstraction (map Radix states to design tokens).
- Additional primitives: `DropdownMenu`, `Popover`, `Tabs`, `Toast`.
- Form molecules and validation patterns.

### Accessibility Notes

Radix primitives handle focus management, keyboard interactions, and ARIA attributes. When extending components:

- Preserve provided `aria-*` props.
- Ensure triggers use `asChild` if swapping element types (see `Button` with `asChild`).

### Directory Structure

```
components/
	ui/
		button.tsx
		input.tsx
		label.tsx
		select.tsx
		card.tsx
		dialog.tsx
		tooltip.tsx
utils/
	cn.ts
```

---

If you add new atoms, update this README section accordingly.

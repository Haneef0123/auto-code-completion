# Component Generation Prompt

## Context
Generate React components following Next.js 16 App Router conventions with TypeScript and Tailwind CSS.

## Rules

### Server Components (Default)
- Use for data fetching, server-side logic, and static content
- Can be async
- No client-side interactivity
- Automatically tree-shaken

```typescript
interface ComponentProps {
  id: string;
  data?: Record<string, unknown>;
}

export async function ServerComponent({ id, data }: ComponentProps) {
  // Server-side data fetching
  const result = await fetchData(id);

  return (
    <div className="container mx-auto p-4">
      {/* Server-rendered content */}
    </div>
  );
}
```

### Client Components (When Needed)
- Use 'use client' directive
- Required for: hooks, event handlers, browser APIs
- Keep minimal - only interactive parts

```typescript
'use client'

import { useState } from 'react';

interface ClientComponentProps {
  initialValue: string;
  onUpdate?: (value: string) => void;
}

export function ClientComponent({ initialValue, onUpdate }: ClientComponentProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    onUpdate?.(newValue);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-md border border-gray-300 px-4 py-2"
      />
    </div>
  );
}
```

### Component Checklist
- [ ] Define TypeScript interface for props
- [ ] Use appropriate component type (server/client)
- [ ] Add 'use client' if needed
- [ ] Implement proper error handling
- [ ] Use Tailwind classes for styling
- [ ] Make accessible (ARIA attributes)
- [ ] Handle loading states
- [ ] Validate props
- [ ] Keep component focused (single responsibility)
- [ ] Export component properly

### Styling with Tailwind
- Use utility classes
- Follow mobile-first approach
- Group classes logically: layout, spacing, colors, typography
- Use semantic color names
- Implement responsive breakpoints (sm:, md:, lg:, xl:, 2xl:)

### Accessibility
- Use semantic HTML elements
- Add ARIA labels when needed
- Ensure keyboard navigation
- Maintain proper heading hierarchy
- Provide alt text for images
- Use sufficient color contrast

### Error Handling
```typescript
export function ComponentWithError() {
  try {
    // Component logic
    return <div>Content</div>;
  } catch (error) {
    console.error('Component error:', error);
    return <div>Something went wrong</div>;
  }
}
```

### Best Practices
1. Keep components small (<200 lines)
2. Extract reusable logic into hooks
3. Use composition over prop drilling
4. Implement proper TypeScript types
5. Handle edge cases
6. Optimize for performance
7. Make components testable
8. Document complex components

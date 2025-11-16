# Refactoring Prompt

## Objective
Improve code structure, readability, and maintainability while preserving functionality.

## Refactoring Principles

### 1. Preserve Functionality
- Never change external behavior
- Maintain existing tests
- Keep same inputs/outputs
- Preserve error handling

### 2. Improve Code Quality
- Enhance readability
- Reduce complexity
- Remove duplication
- Improve organization

### 3. Enhance Type Safety
- Replace `any` with specific types
- Add missing type annotations
- Use TypeScript utility types
- Implement type guards

## Common Refactoring Patterns

### Extract Component
**Before:**
```typescript
export function LargeComponent() {
  return (
    <div>
      <header>
        <h1>Title</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>
      {/* More content */}
    </div>
  );
}
```

**After:**
```typescript
function Header() {
  return (
    <header>
      <h1>Title</h1>
      <Navigation />
    </header>
  );
}

function Navigation() {
  return (
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  );
}

export function RefactoredComponent() {
  return (
    <div>
      <Header />
      {/* More content */}
    </div>
  );
}
```

### Extract Custom Hook
**Before:**
```typescript
'use client'

export function Component() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return <div>{/* Use data */}</div>;
}
```

**After:**
```typescript
// lib/hooks/useData.ts
function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/data')
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Component
'use client'

export function Component() {
  const { data, loading, error } = useData();
  return <div>{/* Use data */}</div>;
}
```

### Convert to Server Component
**Before:**
```typescript
'use client'

export function Component() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);

  return <div>{data?.title}</div>;
}
```

**After:**
```typescript
// Server Component (no 'use client')
async function getData() {
  const res = await fetch('/api/data');
  return res.json();
}

export async function Component() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

### Improve Type Safety
**Before:**
```typescript
function processData(data: any) {
  return data.map((item: any) => ({
    id: item.id,
    name: item.name
  }));
}
```

**After:**
```typescript
interface RawItem {
  id: string;
  name: string;
  // other fields
}

interface ProcessedItem {
  id: string;
  name: string;
}

function processData(data: RawItem[]): ProcessedItem[] {
  return data.map(item => ({
    id: item.id,
    name: item.name
  }));
}
```

### Reduce Complexity
**Before:**
```typescript
function complexFunction(user: User) {
  if (user) {
    if (user.isActive) {
      if (user.role === 'admin') {
        if (user.permissions.includes('write')) {
          return true;
        }
      }
    }
  }
  return false;
}
```

**After:**
```typescript
function canUserWrite(user: User | null): boolean {
  if (!user) return false;
  if (!user.isActive) return false;
  if (user.role !== 'admin') return false;
  return user.permissions.includes('write');
}
```

### Remove Duplication (DRY)
**Before:**
```typescript
function ComponentA() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
      Content A
    </div>
  );
}

function ComponentB() {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
      Content B
    </div>
  );
}
```

**After:**
```typescript
interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-md">
      {children}
    </div>
  );
}

function ComponentA() {
  return <Card>Content A</Card>;
}

function ComponentB() {
  return <Card>Content B</Card>;
}
```

## Refactoring Checklist

### Before Refactoring
- [ ] Understand the current code
- [ ] Identify the problem to solve
- [ ] Plan the refactoring approach
- [ ] Note existing tests
- [ ] Check for dependencies

### During Refactoring
- [ ] Make small, incremental changes
- [ ] Test after each change
- [ ] Maintain type safety
- [ ] Keep commits atomic
- [ ] Document complex changes

### After Refactoring
- [ ] Verify all tests pass
- [ ] Check functionality unchanged
- [ ] Review type safety
- [ ] Update documentation
- [ ] Review performance

## Refactoring Strategies

### 1. Component Refactoring
- Extract smaller components
- Separate concerns (UI vs logic)
- Use composition over inheritance
- Implement proper prop drilling prevention

### 2. Code Organization
- Group related files
- Use barrel exports
- Organize by feature
- Separate utilities

### 3. Type Refinement
- Replace `any` with specific types
- Use discriminated unions
- Implement type guards
- Leverage utility types

### 4. Performance Optimization
- Convert to Server Components
- Implement code splitting
- Add memoization
- Reduce bundle size

### 5. Simplification
- Reduce nesting
- Extract functions
- Remove dead code
- Simplify conditionals

## When to Refactor

### Good Times
- Before adding new features
- When fixing bugs in area
- During code review
- When complexity grows
- When patterns emerge

### Bad Times
- During urgent hotfixes
- Without tests
- Near deadlines
- Without understanding code
- When changing requirements

## Refactoring Red Flags

🚩 God components (>200 lines)
🚩 Deep nesting (>3 levels)
🚩 Prop drilling (>2 levels)
🚩 Code duplication
🚩 Magic numbers/strings
🚩 Complex conditionals
🚩 Long parameter lists (>3)
🚩 Mixed concerns
🚩 Poor naming
🚩 Missing types

## Best Practices
1. Refactor with tests
2. Make small changes
3. Commit frequently
4. Preserve behavior
5. Improve incrementally
6. Document why, not what
7. Review before committing
8. Measure impact

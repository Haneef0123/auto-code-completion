# Agentic Code Completion - Agent Configuration

This document outlines the agent configuration and guidelines for the auto-code-completion project.

## Overview

This project uses AI agents to assist with code development, completion, and review. The agents are configured to understand the project structure, coding standards, and best practices.

## Project Context

- **Framework**: Next.js 16.0.3
- **Language**: TypeScript 5
- **UI Framework**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Package Manager**: npm

## Agent Capabilities

### 1. Code Completion
- Context-aware code suggestions
- TypeScript type inference
- React component patterns
- Next.js App Router patterns

### 2. Code Review
- TypeScript type safety checks
- React best practices
- Performance optimization suggestions
- Security vulnerability detection

### 3. Refactoring
- Component extraction
- Code organization
- Type refinement
- Performance improvements

## Project Structure

```
auto-code-completion/
├── app/                 # Next.js App Router pages
├── lib/                 # Utility functions and shared code
├── public/              # Static assets
├── .claude/             # Claude agent configuration
├── agents.md            # This file
└── package.json         # Project dependencies
```

## Coding Standards

### TypeScript
- Always use strict type checking
- Prefer `interface` over `type` for object shapes
- Use TypeScript utility types when appropriate
- Avoid `any` type - use `unknown` if type is truly unknown

### React
- Use functional components with hooks
- Follow React 19 best practices
- Implement proper error boundaries
- Use Server Components by default in App Router
- Add 'use client' directive only when needed

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Keep components accessible (ARIA attributes)
- Maintain consistent spacing and typography

### File Organization
- One component per file
- Co-locate related files
- Use barrel exports (index.ts) for cleaner imports
- Keep components small and focused

## Agent Guidelines

### When Implementing Features
1. Analyze existing code patterns
2. Follow established conventions
3. Write type-safe code
4. Include error handling
5. Consider edge cases
6. Write clean, readable code

### When Reviewing Code
1. Check for type safety
2. Verify React best practices
3. Look for performance issues
4. Identify security concerns
5. Suggest improvements
6. Maintain consistency

### When Refactoring
1. Preserve existing functionality
2. Improve code organization
3. Enhance type safety
4. Optimize performance
5. Update related tests
6. Document changes

## Common Patterns

### Component Structure
```typescript
interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ }: ComponentNameProps) {
  // Component implementation
  return (
    // JSX
  );
}
```

### Server Actions (Next.js)
```typescript
'use server'

export async function actionName(formData: FormData) {
  // Server-side logic
}
```

### Client Components
```typescript
'use client'

import { useState } from 'react';

export function ClientComponent() {
  const [state, setState] = useState();
  // Client-side logic
}
```

## Security Considerations

- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for secrets
- Implement proper authentication
- Follow OWASP security guidelines
- Avoid XSS, SQL injection, and other vulnerabilities

## Performance Optimization

- Use React Server Components when possible
- Implement proper code splitting
- Optimize images with Next.js Image component
- Minimize client-side JavaScript
- Use proper caching strategies
- Implement lazy loading

## Testing Guidelines

- Write unit tests for utilities
- Test component rendering
- Test user interactions
- Test edge cases
- Maintain good test coverage
- Use meaningful test descriptions

## Documentation

- Document complex logic
- Add JSDoc comments for public APIs
- Keep README up to date
- Document breaking changes
- Maintain changelog

## Agent Commands

Agents can be instructed to:
- `implement <feature>` - Add new functionality
- `refactor <component>` - Improve code structure
- `review <file>` - Review code quality
- `optimize <component>` - Improve performance
- `fix <issue>` - Resolve bugs
- `test <feature>` - Add test coverage

## Configuration Files

- `.cursorrules` - Cursor AI agent rules
- `.claude/agent-config.json` - Claude agent configuration
- `.claude/prompts/` - Custom agent prompts
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - Linting rules

## Best Practices

1. **Always prioritize type safety**
2. **Follow Next.js conventions**
3. **Write self-documenting code**
4. **Keep components small and focused**
5. **Use meaningful variable names**
6. **Handle errors gracefully**
7. **Optimize for performance**
8. **Maintain accessibility**
9. **Write testable code**
10. **Document when necessary**

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Version History

- v1.0.0 - Initial agent configuration setup

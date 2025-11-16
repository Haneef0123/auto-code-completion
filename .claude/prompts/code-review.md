# Code Review Prompt

## Objective
Review code for quality, performance, security, and adherence to project standards.

## Review Checklist

### 1. Type Safety
- [ ] All variables have proper types
- [ ] No use of `any` type
- [ ] Interfaces defined for complex objects
- [ ] Return types specified for functions
- [ ] Proper null/undefined handling
- [ ] Type guards used where needed

### 2. React Best Practices
- [ ] Functional components used
- [ ] Proper hook usage (dependencies array)
- [ ] No unnecessary re-renders
- [ ] Server/Client components separated correctly
- [ ] 'use client' directive only when needed
- [ ] Props validated and typed
- [ ] Key prop on list items
- [ ] No direct state mutation

### 3. Next.js Conventions
- [ ] App Router patterns followed
- [ ] Server Components used by default
- [ ] Server Actions for mutations
- [ ] Proper metadata implementation
- [ ] Image optimization with next/image
- [ ] Route organization follows conventions
- [ ] Loading/error UI implemented

### 4. Performance
- [ ] Unnecessary client-side JS minimized
- [ ] Components memoized when needed
- [ ] Large components code-split
- [ ] Images optimized
- [ ] Expensive computations memoized
- [ ] Proper lazy loading
- [ ] No memory leaks (cleanup in useEffect)

### 5. Security
- [ ] User inputs validated
- [ ] Data sanitized before display
- [ ] No XSS vulnerabilities
- [ ] No SQL injection risks
- [ ] Secrets in environment variables
- [ ] CSRF protection implemented
- [ ] Proper authentication/authorization
- [ ] No sensitive data in client code

### 6. Code Quality
- [ ] Code is readable and self-documenting
- [ ] Functions are small and focused
- [ ] Meaningful variable names
- [ ] No code duplication
- [ ] Proper error handling
- [ ] Edge cases considered
- [ ] Comments explain "why" not "what"
- [ ] Consistent code style

### 7. Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes where needed
- [ ] Keyboard navigation supported
- [ ] Sufficient color contrast
- [ ] Alt text for images
- [ ] Proper heading hierarchy
- [ ] Focus management

### 8. Testing
- [ ] Code is testable
- [ ] Business logic separated from UI
- [ ] Dependencies can be mocked
- [ ] Edge cases covered
- [ ] Error states tested

## Review Categories

### Critical Issues 🔴
- Security vulnerabilities
- Type errors
- Breaking changes
- Data loss risks
- Performance blockers

### Important Issues 🟡
- Code quality problems
- Missing error handling
- Accessibility issues
- Performance improvements
- Best practice violations

### Suggestions 🟢
- Code organization
- Naming improvements
- Documentation additions
- Refactoring opportunities
- Optimization ideas

## Review Template

```markdown
## Code Review

### Summary
[Brief overview of the changes]

### Critical Issues 🔴
- [Issue 1 with line number and explanation]
- [Issue 2 with line number and explanation]

### Important Issues 🟡
- [Issue 1 with line number and explanation]
- [Issue 2 with line number and explanation]

### Suggestions 🟢
- [Suggestion 1 with line number and explanation]
- [Suggestion 2 with line number and explanation]

### Positive Notes ✅
- [Well-implemented feature 1]
- [Good practice 1]

### Overall Assessment
[Approve / Request Changes / Comment]
```

## Common Problems to Look For

### TypeScript
- Using `any` instead of proper types
- Missing prop interfaces
- Incorrect type assertions
- Ignoring TypeScript errors with @ts-ignore

### React
- Missing dependency arrays in useEffect
- Unnecessary use of useState
- Prop drilling more than 2 levels
- Mixing client and server code
- Large components (>200 lines)

### Performance
- Unnecessary client components
- Missing React.memo for expensive renders
- Large bundle sizes
- Not using Server Components
- Unoptimized images

### Security
- Unvalidated user inputs
- Unsanitized HTML rendering
- Hardcoded secrets
- Missing authentication checks
- XSS vulnerabilities

### Code Quality
- Magic numbers/strings
- Deeply nested code
- God functions (too many responsibilities)
- Dead code
- Inconsistent naming

## Review Process
1. Understand the purpose of the code
2. Check for critical issues first
3. Review type safety
4. Verify React/Next.js conventions
5. Look for security vulnerabilities
6. Check performance implications
7. Review code quality
8. Verify accessibility
9. Consider testability
10. Provide constructive feedback

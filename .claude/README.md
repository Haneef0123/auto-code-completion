# Claude Agent Configuration

This directory contains configuration files and prompts for Claude AI agents working on this project.

## Directory Structure

```
.claude/
├── README.md                      # This file
├── agent-config.json              # Main agent configuration
└── prompts/                       # Custom agent prompts
    ├── component-generation.md    # React component generation guidelines
    ├── code-review.md             # Code review checklist and guidelines
    ├── refactoring.md             # Refactoring patterns and strategies
    └── api-development.md         # API routes and Server Actions guidelines
```

## Configuration Files

### agent-config.json
Main configuration file defining:
- Project metadata (name, type, version)
- Framework information (Next.js, React, TypeScript)
- Agent capabilities (code generation, review, refactoring, testing)
- Coding standards and conventions
- Security and performance guidelines
- Agent behavior settings

## Custom Prompts

### component-generation.md
Guidelines for generating React components:
- Server Components (default pattern)
- Client Components (when needed)
- TypeScript interfaces and props
- Tailwind CSS styling patterns
- Accessibility requirements
- Error handling patterns

### code-review.md
Comprehensive code review checklist covering:
- Type safety verification
- React best practices
- Next.js conventions
- Performance optimization
- Security vulnerabilities
- Code quality standards
- Accessibility compliance

### refactoring.md
Refactoring patterns and strategies:
- Component extraction
- Custom hook creation
- Type safety improvements
- Complexity reduction
- Code organization
- Performance optimization

### api-development.md
API development guidelines:
- Route Handlers (API routes)
- Server Actions
- Input validation
- Error handling
- Authentication patterns
- Security best practices

## Usage

### For AI Agents
These files provide context and guidelines for AI assistants (Claude, Cursor, etc.) to:
1. Understand project structure and conventions
2. Generate code following established patterns
3. Review code against project standards
4. Suggest refactoring improvements
5. Implement features consistently

### For Developers
Use these files to:
1. Understand coding standards
2. Reference common patterns
3. Follow best practices
4. Maintain consistency
5. Onboard new team members

## Updating Configuration

When project standards or patterns change:
1. Update relevant configuration files
2. Add new prompts as needed
3. Document changes
4. Notify team members

## Related Files

- `../agents.md` - Main agent documentation
- `../.cursorrules` - Cursor AI specific rules
- `../tsconfig.json` - TypeScript configuration
- `../eslint.config.mjs` - ESLint rules

## Best Practices

1. **Keep prompts up to date** - Update when standards change
2. **Be specific** - Provide concrete examples
3. **Stay consistent** - Follow established patterns
4. **Document why** - Explain reasoning behind guidelines
5. **Review regularly** - Ensure guidelines reflect current practices

## Contributing

When adding new guidelines:
1. Follow existing prompt structure
2. Include code examples
3. Provide checklists
4. Explain reasoning
5. Update this README

## Version History

- v1.0.0 - Initial agent configuration setup
  - Created agent-config.json
  - Added component generation prompts
  - Added code review guidelines
  - Added refactoring patterns
  - Added API development guidelines

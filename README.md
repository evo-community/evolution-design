# Evolution Design

Architecture linter for TypeScript projects.

## Quick Start

```bash
npm run build

cd examples/todo
npm i
npm run lint:architect
```

## Development

- 📚 [Publishing Guide](./PUBLISHING.md) - Detailed publishing documentation  
- 🚀 [Release Guide](./RELEASE.md) - Quick release instructions (automatic publishing!)
- 🤖 **Automatic publishing** - Just create changeset and merge PR!

## Packages

- `@evod/core` - Core functionality for architecture linting
- `edlint` - CLI tool for running the linter
- `@evod/kit` - Utility functions (private)

## Terms

`vfs` - virtual file system. Used to speed up validation of files.

## Acknowledgments

Many modules of this package are inspired by [steiger](https://github.com/feature-sliced/steiger)

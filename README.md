# Templ JavaScript Development Toolkit

[![HitCount](http://hits.dwyl.com/templ-project/javascript.svg)](http://hits.dwyl.com/templ-project/javascript)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/templ-project/javascript/issues)
[![TravisCI](https://travis-ci.org/templ-project/javascript.svg?branch=master)](https://travis-ci.org/templ-project/javascript)
![JSCPD](.jscpd/jscpd-badge.svg?raw=true)

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=alert_status)](https://sonarcloud.io/dashboard?id=templ-project_javascript)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=templ-project_javascript)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=templ-project_javascript)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=templ-project_javascript)

[![Donate to this project using Patreon](https://img.shields.io/badge/patreon-donate-yellow.svg)](https://patreon.com/dragoscirjan)
[![Donate to this project using Paypal](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QBP6DEBJDEMV2&source=url)

> _Any fool can write code that a computer can understand. Good programmers write code that humans can understand._ – Martin Fowler

A comprehensive monorepo providing **portable, opinionated configurations** for JavaScript and TypeScript development. This toolkit ensures consistent code quality, formatting, and testing across all your projects through a collection of reusable configuration packages.

## 📦 Packages

This monorepo contains four core configuration packages that work together to provide a complete development experience:

### [@templ-project/eslint](./packages/eslint/)
**Comprehensive ESLint configuration for multi-language projects**
- ✅ JavaScript, TypeScript, JSON, YAML, Markdown, and text files
- ✅ Modular rule sets with intelligent defaults
- ✅ Prettier integration with conflict resolution
- ✅ TypeScript-aware linting with import management
- ✅ Vitest testing framework support

### [@templ-project/prettier](./packages/prettier/)
**Opinionated Prettier configuration with dual module support**
- ✅ Consistent formatting across all supported file types
- ✅ Import sorting with automatic organization
- ✅ File-specific parsing and formatting rules
- ✅ Both ESM and CommonJS compatibility
- ✅ Zero-config setup with extensibility

### [@templ-project/tsconfig](./packages/tsconfig/)
**TypeScript configurations for different runtime environments**
- ✅ **base.json** - Foundation configuration with strict settings
- ✅ **browser.json** - Browser/frontend applications (ES2020, bundler)
- ✅ **cjs.json** - Node.js CommonJS projects (Node16)
- ✅ **esm.json** - Modern ES modules projects (ESNext)
- ✅ **vitest.json** - Testing with Vitest framework

### [@templ-project/vitest](./packages/vitest/)
**Flexible Vitest configuration factory with intelligent defaults**
- ✅ Zero-config setup with sensible test patterns
- ✅ Comprehensive coverage reporting
- ✅ Multi-language support (JavaScript/TypeScript)
- ✅ Configurable for unit, integration, and E2E tests
- ✅ CI/CD ready with multiple reporter options

## 🚀 Quick Start

### Complete Setup (Recommended)
Get all packages for a fully configured development environment:

```bash
npm install --save-dev @templ-project/eslint @templ-project/prettier @templ-project/tsconfig @templ-project/vitest
```

**ESLint Configuration** (`eslint.config.mjs`):
```javascript
import templEslintConfig from '@templ-project/eslint';
export default templEslintConfig;
```

**Prettier Configuration** (`package.json`):
```json
{
  "prettier": "@templ-project/prettier"
}
```

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "extends": "@templ-project/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

**Vitest Configuration** (`vitest.config.js`):
```javascript
import { defineConfig } from '@templ-project/vitest';
export default defineConfig();
```

### Individual Package Usage
Each package can be used independently:

```bash
# Just ESLint configuration
npm install --save-dev @templ-project/eslint

# Just Prettier configuration  
npm install --save-dev @templ-project/prettier

# Just TypeScript configurations
npm install --save-dev @templ-project/tsconfig

# Just Vitest configuration
npm install --save-dev @templ-project/vitest
```

## 🎯 Use Cases

### New Project Setup
Perfect for starting a new JavaScript/TypeScript project with all the best practices:

```bash
# Install all configuration packages
npm install --save-dev @templ-project/eslint @templ-project/prettier @templ-project/tsconfig @templ-project/vitest

# Add package.json scripts
{
  "scripts": {
    "build": "tsc",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint --fix .",
    "format": "prettier --write ."
  }
}
```

### Existing Project Migration
Gradually adopt consistent tooling across your existing projects:

```bash
# Start with formatting
npm install --save-dev @templ-project/prettier

# Add linting
npm install --save-dev @templ-project/eslint

# Upgrade TypeScript configuration
npm install --save-dev @templ-project/tsconfig

# Modernize testing setup
npm install --save-dev @templ-project/vitest
```

### Monorepo Configuration
Consistent configuration across multiple packages:

```javascript
// Root eslint.config.mjs
import templEslintConfig from '@templ-project/eslint';

export default [
  {
    ignores: ['packages/*/dist/**', 'apps/*/build/**'],
  },
  ...templEslintConfig,
  {
    files: ['packages/shared/**'],
    rules: {
      // Stricter rules for shared packages
      'no-console': 'error',
    },
  },
];
```

### Framework Integration

#### Next.js Projects
```json
{
  "extends": "@templ-project/tsconfig/browser.json",
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "jsx": "preserve",
    "incremental": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

#### Node.js APIs
```json
{
  "extends": "@templ-project/tsconfig/esm.json",
  "compilerOptions": {
    "outDir": "./dist",
    "declaration": true
  }
}
```

#### React Applications
```javascript
// vitest.config.js
import { defineConfig } from '@templ-project/vitest';

export default defineConfig({
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
  coverage: {
    exclude: ['src/components/**/*.stories.{js,ts,tsx}']
  }
});
```

## 🔧 Configuration Details

### Module Compatibility

| Package | ESM | CommonJS | Notes |
|---------|-----|----------|-------|
| **@templ-project/eslint** | ✅ | ❌* | Use `.mjs` config file for CJS projects |
| **@templ-project/prettier** | ✅ | ✅ | Dual exports provided |
| **@templ-project/tsconfig** | ✅ | ✅ | JSON configs work in any environment |
| **@templ-project/vitest** | ✅ | ❌* | Vitest config must be ESM |

*_Can be used in CommonJS projects with appropriate file extensions_

### Integration Matrix

All packages are designed to work together seamlessly:

- **ESLint + Prettier**: Automatic conflict resolution and formatting integration
- **ESLint + TypeScript**: Type-aware linting with TSConfig integration
- **ESLint + Vitest**: Test-specific rules and globals
- **TypeScript + Vitest**: Optimized configs for testing environments
- **Prettier + All**: Consistent formatting across all file types

## 📚 Documentation

Each package includes comprehensive documentation:

- **[@templ-project/eslint](./packages/eslint/README.md)** - ESLint configuration details
- **[@templ-project/prettier](./packages/prettier/README.md)** - Prettier settings and usage
- **[@templ-project/tsconfig](./packages/tsconfig/README.md)** - TypeScript configuration options
- **[@templ-project/vitest](./packages/vitest/README.md)** - Testing configuration and patterns

## 🛠️ Development

### Prerequisites

- **Node.js** 18+ (recommended: latest LTS)
- **npm** 8+ (or yarn/pnpm equivalent)

### Working with the Monorepo

```bash
# Clone the repository
git clone https://github.com/templ-project/javascript.git
cd javascript

# Install dependencies for all packages
npm install

# Run tests across all packages
npm test

# Run linting across all packages
npm run lint

# Build all packages
npm run build
```

### Package Development

```bash
# Work on a specific package
cd packages/eslint

# Run package-specific tests
npm test

# Build the package
npm run build

# Test the package in watch mode
npm run test:watch
```

### Scripts

- `npm run build` - Build all packages
- `npm run test` - Run tests for all packages  
- `npm run lint` - Lint all files in the project
- `npm run clear` - Clean up node_modules and lock files
- `npm run prepare` - Set up git hooks with Husky

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Run tests** (`npm test`)
5. **Run linting** (`npm run lint`)
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style (enforced by our own tools!)
- Add tests for new features
- Update documentation as needed
- Ensure all packages work together
- Test across different project types

## 📋 Roadmap

Future packages and improvements planned:

- **@templ-project/babel** - Babel configuration presets
- **@templ-project/webpack** - Webpack configuration utilities
- **@templ-project/rollup** - Rollup configuration presets
- **@templ-project/jest** - Jest configuration (alternative to Vitest)
- Enhanced IDE integrations
- Additional framework-specific presets

## ❓ FAQ

**Q: Can I use these packages separately?**  
A: Yes! Each package is designed to work independently or together.

**Q: Do these replace my existing configurations?**  
A: They can! You can also extend them with your own customizations.

**Q: Are these configurations opinionated?**  
A: Yes, but they're designed to be practical and widely applicable. You can always override specific settings.

**Q: What Node.js versions are supported?**  
A: Node.js 18+ is recommended. The configurations use modern features and tooling.

**Q: Can I use these in a monorepo?**  
A: Absolutely! They're perfect for ensuring consistency across multiple packages.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dragos Cirjan** - <dragos.cirjan@gmail.com>

## 💝 Support

If you find this toolkit useful, consider supporting the project:

- ⭐ **Star the repository**
- 🐛 **Report bugs and request features** 
- 💝 **[Donate via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QBP6DEBJDEMV2&source=url)**
- 💝 **[Support via Patreon](https://patreon.com/dragoscirjan)**

## 🔗 Related Projects

- **[Templ Project](http://templ-project.github.io)** - More project templates and tools
- **[TSConfig Bases](https://github.com/tsconfig/bases)** - Community TypeScript configurations

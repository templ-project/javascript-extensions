# Project Title

<img alt="JavaScript Logo" src="https://github.com/templ-project/javascript/blob/master/javascript.svg?raw=true" width="20%" align="right" />
<img alt="TypeScript Logo" src="https://github.com/templ-project/javascript/blob/master/typescript.svg?raw=true" width="20%" align="right" />

> **javascript** is a template project, designed by [Templ Project](http://templ-project.github.io).
>
> **javascript** includes instructions for initializing a new
> **JavaScript/[TypeScript](https://www.typescriptlang.org/)** project, and configuring it for development, unit
> testing as well as code linting and analysis.
>
> **javascript** implements:
>
> - [jscpd](https://github.com/kucherenko/jscpd), [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) for code analisys
> - [prettier](https://prettier.io/) for code formatting
> - [eslint](https://eslint.org/) for linting
>
> By default, this implementation uses [npm](https://www.npmjs.com/), but you can easily change it to [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.js.org/).
>
> **To use the template**, delete the content above, and fill in the following sections of this readme.
> Also rune one of the following, to activate your desired language:

[![TravisCI](https://travis-ci.org/templ-project/javascript.svg?branch=master)](https://travis-ci.org/templ-project/javascript)
![JSCPD](.jscpd/jscpd-badge.svg?raw=true)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/templ-project/javascript/issues)

<!-- [![CircleCI](https://circleci.com/gh/templ-project/javascript.svg?style=shield)](https://circleci.com/gh/templ-project/javascript) -->

[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=alert_status)](https://sonarcloud.io/dashboard?id=templ-project_javascript)
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=templ-project_javascript)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=templ-project_javascript)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=templ-project_javascript&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=templ-project_javascript)

<!-- TOC -->

- [Project Title](#project-title)
  - [Getting Started](#getting-started)
    - [Prereqiusites / Dependencies](#prereqiusites--dependencies)
    - [Installation](#installation)
    - [Development](#development)
      - [Requirements](#requirements)
    - [Testing](#testing)
      - [Single Tests](#single-tests)
    - [Deployment](#deployment)
  - [Authors](#authors)
  - [Issues / Support](#issues--support)
  - [License](#license)

<!-- /TOC -->

## Getting Started

### Prereqiusites / Dependencies


### Installation

- Clone the package, remove `.git` folder, and re-initialize git to your own project

```
git clone https://github.com/templ-project/javascript project_name
cd project_name
rm -rf .git
git init
git remote add origin https://github.com/your-user/your-project
```

- Use `npm run change:language` to initialize your project

```powershell
npm run change:language -- javascript # to use javascript
or
npm run change:language -- typescript # to use typescript
```

- If you're targeting to write an application and not a module, use `make init MOD=app`

```bash
npm i
# or
# yarn install
# or 
# pnpm install
```

### Development

#### Requirements

- Please install [NodeJs](https://nodejs.org/en/). We support version 10.x and above.
- Please instal a JavaScript/TypeScript IDE
  - [Visual Studio Code](https://code.visualstudio.com/) with [ITMCDev Babel Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-babel-extension-pack) or [ITMCDev TypeScript Extension Pack](https://marketplace.visualstudio.com/items?itemName=itmcdev.node-typescript-extension-pack)
  - [Jetbrains WebStorm](https://www.jetbrains.com/webstorm/)
  - [Vim](https://www.vim.org/) with [neoclide/coc.nvim](https://github.com/neoclide/coc.nvim) and [HerringtonDarkholme/yats.vim](https://github.com/HerringtonDarkholme/yats.vim) extensions.
  - Any other IDE you trust.

### Testing

Run unit tests using `npm run test`.

Testing is currently set to use unittest.

#### Single Tests

Run single unit tests file, by calling `make test:single -- test/path/to/file.test.js`

```bash
make test:single -- test/path/to/index.test.js
```

### Deployment

Please check [release-it](https://www.npmjs.com/package/release-it) for making releases to [npmjs.com](https://www.npmjs.com/) or any other repository tool, then run:

```bash
npm run release
```

## Authors

- [Dragos Cirjan](mailto:dragos.cirjan@gmail.com) - Initial work - [Go Template](/templ-project/javascript)

See also the list of contributors who participated in this project.

## Issues / Support

Add a set of links to the [issues](/templ-project/javascript/issues) page/website, so people can know where to add issues/bugs or ask for support.

## License

(If the package is public, add licence)
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

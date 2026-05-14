# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities by opening a private GitHub Security
Advisory or by contacting the maintainer directly. Do not open a public issue.

---

## `enableScripts: true` in `.yarnrc.yml`

### Decision

`enableScripts` is set to `true` and must remain so because several direct and
transitive dependencies require postinstall / install scripts to compile or
download their native binary modules.

### Audited packages that require install scripts

| Package           | Reason                                               |
| ----------------- | ---------------------------------------------------- |
| `esbuild`         | Downloads platform-specific binary via `postinstall` |
| `sharp`           | Compiles / downloads `libvips` native bindings       |
| `lightningcss`    | Downloads platform-specific native binary            |
| `rollup`          | Loads optional native parser via `postinstall`       |
| `@swc/core`       | Downloads platform-specific native binary            |
| `@parcel/watcher` | Compiles native file-system watcher                  |

### Mitigation

- All dependencies are locked via `yarn.lock`; hashes are verified on install.
- The dependency tree is reviewed on every `yarn upgrade` or PR that touches
  `package.json`.
- Run `yarn audit` regularly and address high/critical advisories promptly.

### Re-evaluating this setting

If all packages in the table above are replaced by pure-JS alternatives in the
future, set `enableScripts: false` in `.yarnrc.yml` and remove this section.

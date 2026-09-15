# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Sanitized Mermaid-rendered SVG output with DOMPurify before injecting it via `dangerouslySetInnerHTML`.
- Rewrote the code-block syntax-highlighting regex to avoid an ambiguous nested-quantifier pattern.
- Added `.catch()` handlers to previously unhandled cache-write and background-sync promises in the service worker and `App.tsx`.
- Removed non-essential `console.log` debug statements from the service worker and app shell.
- Added `.gitignore` entries for common secret/credential file patterns.
- Fixed `package.json` listing `vite` as both a dependency and a dev dependency, and pinned a minimum Node version via `engines.node`.

## [1.0.0] - 2026-09-15

### Added

- Initial public release of PyCSharp: an 18-module interactive Rosetta Stone guide for C#/.NET engineers learning Python.

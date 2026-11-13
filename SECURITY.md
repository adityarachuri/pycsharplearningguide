# Security Policy

## Reporting a Vulnerability

This project has no server-side backend and no user accounts or data storage beyond
the visitor's own browser (see `AGENTS.md` and `docs/ARCHITECTURE.md` for the full
architecture and security model). The most sensitive surface is the Interactive
Python Sandbox, which runs entirely client-side inside an isolated Pyodide Web
Worker with no filesystem, network, or host-process access.

If you believe you've found a security issue anyway (e.g. a sandbox escape, a CSP
bypass, or an XSS vector), please report it privately using
[GitHub's private vulnerability reporting](https://github.com/adityarachuri/pycsharplearningguide/security/advisories/new)
rather than opening a public issue. See also `public/.well-known/security.txt`.

## Supported Versions

This is a single-version, continuously-deployed learning platform — there are no
maintained release branches. Fixes land on `main`.

## Dependency Vulnerabilities

Dependency vulnerabilities are tracked via GitHub Dependabot alerts and
`.github/dependabot.yml`-driven update pull requests, reviewed and merged through
the same pull-request process as all other changes to this repository.

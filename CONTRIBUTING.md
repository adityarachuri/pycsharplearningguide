# Contributing to PyCSharp

This is primarily a personal learning-content project, but fixes and clarifications
are welcome.

## Workflow

`main` is protected: all changes, including the maintainer's own, land through a
pull request and must pass the CI quality gate (`validate-and-build`) before
merging. There is no direct-push path.

1. Fork the repository and create a feature branch.
2. Run `npm run lint` (TypeScript strict check) and `npm test` locally before
   opening a PR — this mirrors exactly what CI will run.
3. Keep new content consistent with the existing C#-vs-Python comparison format
   used across chapters (see `src/data/*.ts` for examples).
4. Open a pull request describing the change and the reasoning behind it, using
   the PR template's checklist.

## Reporting bugs or content issues

Open a GitHub issue. For security vulnerabilities, see [SECURITY.md](SECURITY.md)
instead — please don't file those as public issues.

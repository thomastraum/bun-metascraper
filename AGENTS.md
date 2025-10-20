# Repository Guidelines

## Project Structure & Module Organization
- `index.ts` runs a basic metascraper pipeline that fetches HTML via `fetch` and logs metadata.
- `metascrape-with-headless.ts` expands the scraper with Playwright for pages requiring client-side rendering; use it as the canonical reference for new features.
- Sample HTML fixtures (`*.html`) live at the repository root and are useful for local regression checks without hitting remote sites.
- Runtime configuration sits in `package.json`, and TypeScript settings stay in `tsconfig.json`. Keep additional scripts or configs alongside these files.

## Build, Test, and Development Commands
- `bun install` installs dependencies declared in `package.json`.
- `bun run index.ts` scrapes the target defined at the bottom of `index.ts`; tweak the `url` constant before running.
- `bun run metascrape-with-headless.ts` executes the Playwright-enabled workflow; ensure Playwright browsers are installed via `bunx playwright install` when first setting it up.
- Prefer Bun scripts over `node` to stay aligned with the existing tooling.

## Coding Style & Naming Conventions
- Stick with TypeScript modules using `import`/`export`. Use 2-space indentation and trailing commas in multi-line arrays to match existing files.
- Group metascraper plugins by category (core, vendor, community) and comment out unused ones rather than deleting them.
- Name helper functions with verbs (`scrapeWithPlaywright`, `sleep`) and keep top-level constants in `SCREAMING_SNAKE_CASE` only when they are truly global flags.

## Testing Guidelines
- There is no automated test harness yet; validate changes by running both Bun entrypoints against at least one static fixture and one live URL.
- When adding features, consider storing representative HTML snapshots and asserting key metadata fields with lightweight scripts under a future `tests/` directory.
- Document manual test steps in PR descriptions until a formal suite exists.

## Commit & Pull Request Guidelines
- Use imperative, descriptive commit messages (`Add Playwright throttling`, `Refactor scraper plugins`). Squash noisy WIP commits before opening a PR.
- PRs should outline the motivation, highlight affected URLs or fixtures, and include sample metadata output. Attach screenshots or JSON excerpts when UI tools are involved.
- Link to related issues or discussions and call out follow-up work if the change is only a partial implementation.

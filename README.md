# bun-metascraper Test Run

This project exercises the Playwright-backed entrypoint `metascrape-with-headless.ts` to validate [metascraper](https://github.com/microlinkhq/metascraper) across a mix of e‑commerce, media, and long-form content sources. The recorded outputs from the latest run live in [`metascrape-with-headless.md`](metascrape-with-headless.md).

## Quick Start

1. Install dependencies: `bun install`
2. Install Playwright browsers if the cache is empty: `bunx playwright install`
3. Run the headless scraper: `bun run metascrape-with-headless.ts`
4. Inspect the console output or open the markdown log for structured metadata.

## Sample Results

| Source | Title (truncated) | Publisher | Highlights |
| --- | --- | --- | --- |
| [Amazon product](https://www.amazon.co.uk/R%C3%98DE-Studio-quality-Microphone-Podcasting-Production/dp/B084P1CXFD) | RØDE NT-USB Mini Versatile Studio-quality Condenser USB Microphone... | Amazon | Extracted author, description, canonical URL |
| [SoundCloud track](https://soundcloud.com/lithe9/pessimist-1) | Pessimist | SoundCloud | Captured embed iframe and hero artwork |
| [YouTube video](https://www.youtube.com/watch?v=5az_4IwTwAE) | S-Tier MCP Servers for Developers | YouTube | Thumbnail, embed iframe, publish timestamp |
| [Spotify album](https://open.spotify.com/album/5pIGU5FZ74YPdUrBdk9lcC) | Die On This Hill - Single | Spotify | Preview audio URL and cover art |
| [Blog post](https://simonwillison.net/2025/Oct/16/claude-skills/) | Claude Skills are awesome, maybe a bigger deal than MCP | Simon Willison | Author attribution and hero image |

> Full JSON-like dumps for every URL are stored in [`metascrape-with-headless.md`](metascrape-with-headless.md).

## Implementation Notes

- `metascrape-with-headless.ts` reuses a single Playwright browser instance per run to avoid dangling Chromium processes.
- Vendor plugins that issue network requests (Amazon, Spotify, SoundCloud) can slow down if rate-limited. Increase the `sleep` delay in the script when testing large batches.
- Modify the `urls` array in the script to target additional pages; results append to the markdown log for manual review.

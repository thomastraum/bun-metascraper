import { chromium, type Browser, type Page } from "playwright";

function createBrowserManager() {
  let sharedBrowser: Browser | null = null;
  let cleanupRegistered = false;

  async function getBrowser(): Promise<Browser> {
    if (sharedBrowser) return sharedBrowser;
    sharedBrowser = await chromium.launch({ headless: true });
    registerBrowserCleanup();
    return sharedBrowser;
  }

  function registerBrowserCleanup() {
    if (cleanupRegistered) return;
    cleanupRegistered = true;
    const clean = () => {
      if (!sharedBrowser) return;
      void sharedBrowser.close();
      sharedBrowser = null;
    };
    process.on("exit", clean);
    process.on("SIGINT", () => {
      clean();
      process.exit(130);
    });
    process.on("SIGTERM", () => {
      clean();
      process.exit(143);
    });
  }

  async function closeBrowser(): Promise<void> {
    if (!sharedBrowser) return;
    await sharedBrowser.close();
    sharedBrowser = null;
  }

  return { getBrowser, closeBrowser };
}

const browserManager = createBrowserManager();

async function waitForPageReady(page: Page): Promise<void> {
  // Wait for network to be idle (no requests for at least 500ms)
  try {
    await page.waitForLoadState("networkidle", { timeout: 10000 });
  } catch {
    // If networkidle times out, continue anyway
  }

  // Wait for common loading indicators to disappear
  // These are generic selectors that many sites use for loading states
  const loadingSelectors = [
    '[class*="loading"]',
    '[class*="spinner"]',
    '[class*="loader"]',
    '[id*="loading"]',
    '[id*="spinner"]',
    '[aria-busy="true"]',
  ];

  for (const selector of loadingSelectors) {
    try {
      // Wait for any loading indicators to disappear (with short timeout)
      await page.waitForSelector(selector, { state: "hidden", timeout: 2000 }).catch(() => {});
    } catch {
      // Ignore errors - selector might not exist
    }
  }

  // Wait for body to have meaningful content (not just a blank page)
  // Using string-based function to avoid TypeScript DOM type issues
  await page.waitForFunction(
    `() => {
      const body = document.body;
      if (!body) return false;
      const textContent = body.textContent?.trim() || "";
      const hasContent = textContent.length > 100 || body.children.length > 0;
      return hasContent && (document.readyState === "complete" || document.readyState === "interactive");
    }`,
    { timeout: 5000 }
  ).catch(() => {
    // If this times out, continue anyway - page might be valid but minimal
  });
}

export async function getHtml(
  url: string,
  options?: { waitUntil?: "load" | "domcontentloaded" | "networkidle" | "commit" }
): Promise<string> {
  console.log("Scraping with Playwright");
  const startTime = Date.now();
  const browser = await browserManager.getBrowser();
  const page = await browser.newPage();
  try {
    await page.goto(url, { waitUntil: options?.waitUntil || "domcontentloaded" });

    // Wait for page to be fully ready using smart waiting strategy
    await waitForPageReady(page);

    const html = await page.content();
    const seconds = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Time taken: ${seconds} seconds`);
    return html;
  } catch (error) {
    console.error("Error scraping URL:", error);
    throw error;
  } finally {
    await page.close();
  }
}

export async function takeScreenshot(
  url: string,
  options?: { path?: string; fullPage?: boolean; width?: number; height?: number }
): Promise<Buffer> {
  console.log("Taking screenshot with Playwright");
  const startTime = Date.now();
  const browser = await browserManager.getBrowser();
  const page = await browser.newPage();
  try {
    if (options?.width !== undefined || options?.height !== undefined) {
      const width = options?.width ?? 1200;
      const height = options?.height ?? 1200;
      await page.setViewportSize({ width, height });
    }

    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Wait for page to be fully ready using smart waiting strategy
    await waitForPageReady(page);

    const screenshot = await page.screenshot({
      path: options?.path,
      fullPage: (options?.width !== undefined || options?.height !== undefined) ? false : (options?.fullPage ?? true),
    }) as Buffer;

    const seconds = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`Screenshot taken: ${seconds} seconds`);
    return screenshot;
  } catch (error) {
    console.error("Error taking screenshot:", error);
    throw error;
  } finally {
    await page.close();
  }
}

export async function closeBrowser(): Promise<void> {
  await browserManager.closeBrowser();
}


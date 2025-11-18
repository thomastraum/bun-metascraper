import { takeScreenshot } from "./playwright-scraper";
import { WEB_SEARCH_URLS } from "./webSearchLinks";
import { mkdir } from "node:fs/promises";

function sanitizeFilename(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/^www\./, "");
    const pathname = urlObj.pathname
      .replace(/^\//, "")
      .replace(/\/$/, "")
      .replace(/\//g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "_");
    
    const search = urlObj.search
      .replace(/^\?/, "")
      .replace(/[^a-zA-Z0-9-=&]/g, "_")
      .substring(0, 50); // Limit length
    
    let filename = hostname;
    if (pathname) filename += `-${pathname}`;
    if (search) filename += `-${search}`;
    
    // Ensure filename isn't too long
    if (filename.length > 200) {
      filename = filename.substring(0, 200);
    }
    
    return filename || "screenshot";
  } catch {
    // Fallback if URL parsing fails
    return url.replace(/[^a-zA-Z0-9-]/g, "_").substring(0, 200) || "screenshot";
  }
}

async function main() {
  const screenshotsDir = `${process.cwd()}/screenshots`;
  
  // Create screenshots directory if it doesn't exist
  try {
    await mkdir(screenshotsDir, { recursive: true });
    console.log(`Screenshots will be saved to: ${screenshotsDir}\n`);
  } catch (error) {
    console.error("Error creating screenshots directory:", error);
    process.exit(1);
  }

  const activeUrls = (WEB_SEARCH_URLS.filter(
    (url) => typeof url === "string" && !url.startsWith("//")
  ) as unknown) as string[];
  
  console.log(`Taking screenshots of ${activeUrls.length} URL(s)...\n`);

  for (let i = 0; i < activeUrls.length; i++) {
    const url = activeUrls[i]!;
    const filename = sanitizeFilename(url);
    const filepath = `${screenshotsDir}/${filename}.png`;
    
    console.log(`[${i + 1}/${activeUrls.length}] ${url}`);
    
    try {
      const screenshotBuffer = await takeScreenshot(url, {
        // fullPage: true,
        width: 1200,
        height: 1200,
      });
      
      // Use Bun.write() to save the screenshot (Bun-native API)
      await Bun.write(filepath, screenshotBuffer);
      console.log(`✓ Saved: ${filepath}\n`);
    } catch (error) {
      console.error(`✗ Failed: ${error}\n`);
    }
  }

  console.log(`\nAll screenshots completed! Check ${screenshotsDir} to review them.`);
  process.exit(0);
}

main();


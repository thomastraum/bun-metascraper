import metascraper from "metascraper";
// Core essential
import metascraperAudio from "metascraper-audio";
import metascraperAuthor from "metascraper-author";
import metascraperDate from "metascraper-date";
import metascraperDescription from "metascraper-description";
import metascraperFeed from "metascraper-feed";
import metascraperImage from "metascraper-image";
import metascraperIframe from "metascraper-iframe";
import metascraperLang from "metascraper-lang";
import metascraperLogo from "metascraper-logo";
import metascraperLogoFavicon from "metascraper-logo-favicon";
import metascraperMediaProvider from "metascraper-media-provider";
import metascraperPublisher from "metascraper-publisher";
import metascraperReadability from "metascraper-readability";
import metascraperTitle from "metascraper-title";
import metascraperUrl from "metascraper-url";
import metascraperVideo from "metascraper-video";
// Vendor specific
import metascraperAmazon from "metascraper-amazon";
import metascraperClearbit from "metascraper-clearbit";
import metascraperInstagram from "metascraper-instagram";
import metascraperManifest from "metascraper-manifest";
import metascraperSoundcloud from "metascraper-soundcloud";
import metascraperTelegram from "metascraper-telegram";
import metascraperUol from "metascraper-uol";
import metascraperSpotify from "metascraper-spotify";
import metascraperX from "metascraper-x";
import metascraperYoutube from "metascraper-youtube";
// Community
// import metascraperAddress from "metascraper-address";
// import metascraperShopping from "samirrayani/metascraper-shopping";
//
//
import { getHtml } from "./playwright-scraper";

const scraper = metascraper([
  // require('metascraper-author')
  // require('metascraper-date')(),
  // require('metascraper-description')(),
  // require('metascraper-image')(),
  // require('metascraper-logo')(),
  // require('metascraper-clearbit')(),
  // require('metascraper-publisher')(),
  // require('metascraper-title')(),
  // require('metascraper-url')()

  // Core essential

  metascraperAuthor(),
  metascraperDate(),
  metascraperDescription(),
  metascraperImage(),
  metascraperLogo(),
  metascraperClearbit(),
  metascraperPublisher(),
  metascraperTitle(),
  metascraperUrl(),

  // metascraperAudio(),
  // metascraperFeed(),
  metascraperIframe(),
  // metascraperLang(),
  // metascraperLogoFavicon(),
  // metascraperMediaProvider(),
  // metascraperReadability(),
  // metascraperVideo(),
  // Vendor specific
  metascraperAmazon(),
  metascraperInstagram(),
  metascraperManifest(),
  metascraperSoundcloud(),
  metascraperTelegram(),
  metascraperUol(),
  metascraperSpotify(),
  metascraperX(),
  metascraperYoutube(),
  // Community
  // metascraperAddress(),
  // metascraperShopping(),
]);

async function scrapeWithFetch(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    // console.log(html);
  } catch (error) {
    console.error("Error scraping URL:", error);
    process.exit(1);
  }
}

async function scrape(url: string) {
  const html = await getHtml(url);
  // const html = scrapeWithFetch(url);
  return await scraper({ html, url });
}

const urls: Array<string> = [
  // "https://www.amazon.co.uk/R%C3%98DE-Studio-quality-Microphone-Podcasting-Production/dp/B084P1CXFD?ref_=ast_sto_dp&th=1",
  // "https://www.amazon.co.uk/LG-43UA73006LA-Concierge-Processor-Optimiser/dp/B0F3XNWZKJ?pd_rd_w=s5NxQ&content-id=amzn1.sym.874ad601-1d84-4bb3-909a-1fbefdb4a319&pf_rd_p=874ad601-1d84-4bb3-909a-1fbefdb4a319&pf_rd_r=YRZCF1N6PV501Q4S99PZ&pd_rd_wg=GSGYM&pd_rd_r=08f020e6-8158-4804-90b5-8d40dcf225e0&pd_rd_i=B0F3XNWZKJ&ref_=gsps5bestsellers_B0F3XNWZKJ&th=1",
  // "https://www.amazon.co.uk/Professional-Grade-Microphone-Recording-Exceptional-Directly/dp/B00MMKQOEM?ref_=ast_sto_dp&th=1",
  // "https://soundcloud.com/lithe9/pessimist-1",
  // "https://www.youtube.com/watch?v=5az_4IwTwAE",
  // "https://anything.io",
  // "https://x.com/thdxr/status/1980306364254838830",
  // "https://open.spotify.com/album/5pIGU5FZ74YPdUrBdk9lcC?highlight=spotify:track:0l72HGRQkAR0imHxvpLi8a",
  // "https://migbytilak.com/en-global",
  // "https://maps.app.goo.gl/dB2r2gikPR6qRA187",
  // "https://www.islingtonboxingclub.org/",
  // "https://www.brasshands.com/",
  // "https://simonwillison.net/2025/Oct/16/claude-skills/",
  // "https://github.com/repomirrorhq/repomirror/blob/main/repomirror.md",
  // "https://www.instagram.com/traum.inc/", //profile
  // "https://www.instagram.com/p/DP89AxmDO4x/?img_index=1", // post
  // "https://blog.abdellatif.io/production-rag-processing-5m-documents",
  "https://replicate.com/wan-video/wan-2.2-animate-replace",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  for (const url of urls) {
    console.log("scraping url:", url);
    const metadata = await scrape(url);
    await sleep(1000);
    console.log(metadata);
    console.log("scraping completed:", url);
  }
}

main();

// Regenerates the README preview screenshots (light + dark) for the homepage.
//
//   node scripts/generate-previews.mjs
//
// Boots the Next.js dev server on a scratch port, screenshots the homepage in
// both color schemes at retina (2x) resolution, and writes the results to
// public/preview.png and public/preview-dark.png. Also runs from the pre-commit
// hook — see .githooks/pre-commit.

import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PORT = Number(process.env.PREVIEW_PORT ?? 3999);
const BASE = `http://127.0.0.1:${PORT}`;
const VIEWPORT = { width: 1280, height: 900 };
const SCALE = 2;

const shots = [
  { scheme: "light", file: "public/preview.png" },
  { scheme: "dark", file: "public/preview-dark.png" },
];

async function waitForServer(url, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status < 500) return;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Dev server did not become ready at ${url} within ${timeoutMs}ms`);
}

async function main() {
  console.log(`[previews] starting Next.js dev server on :${PORT}`);
  const server = spawn(
    "npx",
    ["next", "dev", "-p", String(PORT), "-H", "127.0.0.1"],
    {
      cwd: root,
      stdio: ["ignore", "inherit", "inherit"],
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", BROWSER: "none" },
    }
  );

  let browser;
  try {
    await waitForServer(BASE);
    // Warm the route so the first real screenshot isn't mid-compile.
    await fetch(BASE).catch(() => {});

    browser = await chromium.launch();
    for (const { scheme, file } of shots) {
      const context = await browser.newContext({
        viewport: VIEWPORT,
        deviceScaleFactor: SCALE,
        colorScheme: scheme,
      });
      const page = await context.newPage();
      await page.goto(BASE, { waitUntil: "networkidle" });
      await page.waitForSelector("h1");
      // Let fonts settle before capturing.
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const out = path.join(root, file);
      await page.screenshot({ path: out, fullPage: true });
      console.log(`[previews] wrote ${file} (${scheme})`);
      await context.close();
    }
  } finally {
    if (browser) await browser.close();
    server.kill("SIGTERM");
    // Give Next a moment to exit; force-kill if it lingers.
    const timer = setTimeout(() => server.kill("SIGKILL"), 3000);
    await once(server, "exit").catch(() => {});
    clearTimeout(timer);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

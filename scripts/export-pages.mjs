import { cp, mkdir, rm, writeFile } from "node:fs/promises";

const out = new URL("../pages-dist/", import.meta.url);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(new URL("../dist/client/", import.meta.url), out, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages", `${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed: ${response.status}`);
const html = await response.text();
if (!html.includes("/_dev_SeniorSoftwareEngineer_PythonAWSGraphDB/assets/")) {
  throw new Error("GitHub Pages base path is missing from the rendered HTML.");
}
if (!html.includes("Find the signal")) {
  throw new Error("Static export does not contain portfolio content.");
}

await writeFile(new URL("index.html", out), html);
await writeFile(new URL("404.html", out), html);
await writeFile(new URL(".nojekyll", out), "");

import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const app = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const experienceBlock = app.slice(
  app.indexOf("const experiences:"),
  app.indexOf("const projects:"),
);
const projectBlock = app.slice(
  app.indexOf("const projects:"),
  app.indexOf("const capabilityRows"),
);

test("renders the finished portfolio shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<title>Dev Kumar — Connected Systems<\/title>/);
  assert.match(html, /Find the signal/);
  assert.match(html, /Animated graph traversal/i);
  assert.doesNotMatch(html, /codex-preview|taking shape|react-loading-skeleton/i);
});

test("contains all 15 résumé experience bullets", () => {
  assert.equal(experienceBlock.match(/^      "/gm)?.length, 15);
});

test("contains 16 project sources and only four supplied demos", () => {
  assert.equal(projectBlock.match(/^\s+source:/gm)?.length, 16);
  assert.equal(projectBlock.match(/^\s+demo:/gm)?.length, 4);
  assert.match(app, /project\.demo &&/);
});

test("omits LinkedIn and a footer", () => {
  assert.doesNotMatch(app, /linkedin/i);
  assert.doesNotMatch(app, /<footer/i);
});

test("ships the generated visual and downloadable résumé", async () => {
  assert.ok((await stat(new URL("../dist/client/og.png", import.meta.url))).size > 100_000);
  assert.ok(
    (await stat(new URL("../dist/client/Dev_Kumar_Python_AWS_GraphDB_Resume.docx", import.meta.url))).size >
      10_000,
  );
});

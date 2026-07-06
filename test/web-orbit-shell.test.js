import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../", import.meta.url);
const jversRoot = new URL("file:///Users/robster/Downloads/j-vers-clone/");
const blueyardRoot = new URL("file:///Users/robster/Downloads/blueyard-clone/");
// The reference clones live only on the machine that captured them; skip the
// comparison tests elsewhere instead of failing on a hardcoded path.
const hasReferenceClones = existsSync(jversRoot) && existsSync(blueyardRoot);

function read(path, base = root) {
  return readFileSync(new URL(path, base), "utf8");
}

function sha256(path, base = root) {
  return createHash("sha256").update(readFileSync(new URL(path, base))).digest("hex");
}

function stripHeroOverride(html) {
  return html
    .replace('<link rel="stylesheet" href="/assets/local-clone.css"/>', "")
    .replace('<link rel="stylesheet" href="/assets/superloopy-shell.css"/>', "")
    .replace('<script src="/assets/local-clone.js"></script>', "")
    .replace('<script src="/assets/superloopy-shell.js"></script>', "");
}

function assertNonEmpty(path) {
  assert.ok(existsSync(new URL(path, root)), `${path} should exist`);
  assert.ok(statSync(new URL(path, root)).size > 0, `${path} should be non-empty`);
}

test("landing page keeps the local shell with Superloopy copy and the hero-only orbit override", { skip: !hasReferenceClones && "reference clones not present on this machine" }, () => {
  const html = read("web/index.html");
  const jversHtml = read("index.html", jversRoot);
  const css = read("web/assets/superloopy-shell.css");
  const js = read("web/assets/superloopy-shell.js");
  const contentJs = read("web/assets/superloopy-content-enhancements.js");
  const pageChunk = read("web/_next/static/chunks/app/[locale]/page-45e168c1c44a7876.js");
  const layoutChunk = read("web/_next/static/chunks/app/[locale]/layout-426b209e9c19b7e9.js");

  assert.notEqual(stripHeroOverride(html), jversHtml, "copy is intentionally rewritten for Superloopy");
  assert.match(html, /Take control of agent work/);
  assert.match(html, /Superloopy runs agent work in a loop until proof exists: plan, act, evidence, gate\./);
  assert.match(html, /Evidence-first loops for Codex and Claude Code/);
  assert.match(html, /Running \\\\nagent \\\\nwork/);
  assert.match(html, /Install once\. Then type loopy\./);
  assert.match(html, /Choose your agent lane/);
  assert.match(html, /What makes Superloopy different from a prompt\?/);
  assert.match(html, /Does it work with Codex and Claude Code\?/);
  assert.match(html, /Codex and Claude Code workflows/);
  assert.doesNotMatch(html, /Take control of hiring|Programmatic Job Advertising|Why rely on human guesswork|Become a Valued Partner Today|Running \\\\nlarge ad \\\\ncampaigns/u);
  assert.doesNotMatch(html, /labelCodex|labelClaude Code/u);

  assert.match(css, /main > section:first-child video/u);
  assert.match(css, /\.bg-gradient-preloader-purple/u);
  assert.match(css, /main > section:first-child > \.bg-gradient-purple-radial/u);
  assert.match(css, /background: transparent !important/u);
  assert.match(css, /superloopy-hero-badge\.png/u);
  assert.match(css, /\.superloopy-orbit-loader/u);
  assert.doesNotMatch(js, /Loading orbit/u);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/u);
  assert.match(css, /\.superloopy-install-commands/u);
  assert.match(css, /\.superloopy-start-loop-button/u);
  assert.match(css, /\.superloopy-github-text-link/u);
  assert.match(css, /\.superloopy-eye-model/u);
  assert.match(css, /\.superloopy-dead-proof-link/u);
  assert.match(css, /\.superloopy-crew-asset/u);
  assert.match(css, /--superloopy-media-radius: 0\.8rem/u);
  assert.match(css, /img\.parallax-block__image\.superloopy-swapped-asset[\s\S]*?clip-path: inset\(0 round var\(--superloopy-media-radius\)\)/u);
  assert.doesNotMatch(css, /proof-glyph/u);
  assert.match(js, /main > section:first-child/u);
  assert.match(js, /startAfterHydration/u);
  assert.match(js, /window\.addEventListener\("load"/u);
  assert.match(js, /blueyard-orbit\.html\?devmode=webgl&scene=landing-orb/u);
  assert.match(js, /heroOnly: true/u);
  assert.match(js, /mountLoadingScreen/u);
  assert.match(js, /hideLoadingScreen\("iframe-load"\)/u);
  assert.match(js, /role="progressbar"/u);
  assert.match(js, /superloopy-content-enhancements\.js/u);
  assert.match(contentJs, /\/webgl\/models\/eye\.glb/u);
  assert.match(contentJs, /blueyard-orbit\.html\?devmode=webgl&scene=biology-orb&interactive=1/u);
  assert.match(contentJs, /eye-glb-preview\.png/u);
  assert.match(contentJs, /superloopy-eye-motion/u);
  assert.match(contentJs, /PROOF_COPY_REPLACEMENTS/u);
  assert.match(contentJs, /LOCALE_TEXT_REPLACEMENTS/u);
  assert.match(contentJs, /PROOF_CASE_COPY/u);
  assert.match(contentJs, /decorateSwappedAsset/u);
  assert.doesNotMatch(contentJs, /parentElement\?\.classList\.add\("superloopy-media-frame"/u);
  assert.match(contentJs, /GITHUB_ICON/u);
  assert.match(contentJs, /renderGithubTextLink/u);
  assert.match(contentJs, /renderCustomLinkText/u);
  assert.match(contentJs, /superloopy-footer-github-link/u);
  assert.doesNotMatch(contentJs, /stargazers_count|GITHUB_REPO_API_URL|superloopy-github-star/u);
  assert.match(contentJs, /if \(node\.childElementCount > 0\) return/u);
  assert.match(contentJs, /data-superloopy-locale/u);
  assert.match(contentJs, /label: "KR"/u);
  assert.match(contentJs, /label: "ES"/u);
  assert.match(js, /codex plugin marketplace add https:\/\/github\.com\/beefiker\/superloopy/u);
  assert.match(js, /\/plugin install superloopy@beefiker/u);
  assert.match(js, /navigator\.clipboard\?\.writeText/u);
  assert.match(js, /data-copy-command/u);
  assert.match(js, /COPY_REPLACEMENTS/u);
  assert.match(contentJs, /ASSET_REPLACEMENTS/u);
  assert.match(contentJs, /proof-evidence\.png/u);
  assert.match(contentJs, /skill-lanes\.png/u);
  assert.match(contentJs, /visible-progress\.png/u);
  assert.match(contentJs, /final-gate\.png/u);
  assert.match(contentJs, /\/crew\/nami\.png/u);
  assert.match(contentJs, /\/crew\/robin\.png/u);
  assert.doesNotMatch(contentJs, /src: "\/crew\/luffy\.svg"/u);
  assert.doesNotMatch(css, /superloopy-github-star|superloopy-proof-panel/u);
  assert.match(css, /\.superloopy-github-text-link:focus-visible/u);
  assert.match(css, /footer a\.superloopy-footer-github-link/u);
  assert.match(css, /white-space: nowrap !important/u);
  assert.match(css, /\.superloopy-start-loop-button__arrow/u);
  assert.match(css, /\.superloopy-start-loop-button__arrow svg/u);
  assert.match(css, /\.superloopy-start-loop-button \.btn__ic/u);
  assert.doesNotMatch(contentJs, /guardReadProofButtons|openProofPanel|superloopy-proof-panel/u);
  assert.match(css, /parallax-block__image\.w-\\\[15\\%\\\]/u);
  assert.doesNotMatch(contentJs, /superloopy-case-expanded/u);
  assert.doesNotMatch(css, /\.superloopy-case-expanded/u);
  assert.match(css, /\.superloopy-footer-two-line span/u);
  assert.match(css, /white-space: nowrap/u);
  assert.match(css, /max-width: 1199px/u);
  assert.match(css, /\.superloopy-eye-model\.is-webgl-ready img[\s\S]*?opacity: 0/u);
  assert.match(css, /aspect-ratio: 10 \/ 7/u);
  assert.match(js, /Open proof/u);
  assert.match(js, /Install loop/u);
  assert.match(js, /Done means proven/u);
  assert.match(pageChunk, /Open proof/u);
  assert.match(pageChunk, /Install loop/u);
  assert.match(layoutChunk, /Evidence/u);
  assert.match(layoutChunk, /GitHub/u);
  assert.doesNotMatch(pageChunk, /Go to Cases|Request a demo/u);
  assert.doesNotMatch(layoutChunk, /Case Studies|Careers|Contacts|Website by|Obys/u);
});

test("copied static assets match the local reference clones", { skip: !hasReferenceClones && "reference clones not present on this machine" }, () => {
  assert.equal(sha256("web/uploads/1_32940aec00.mp4"), sha256("uploads/1_32940aec00.mp4", jversRoot));
  assert.equal(sha256("web/uploads/2_9bfdf882a8.mp4"), sha256("uploads/2_9bfdf882a8.mp4", jversRoot));
  assert.equal(sha256("web/models/circles.gltf"), sha256("models/circles.gltf", jversRoot));
  assert.equal(sha256("web/models/logo.gltf"), sha256("models/logo.gltf", jversRoot));
  assert.equal(sha256("web/models/saw_small.gltf"), sha256("models/saw_small.gltf", jversRoot));
  assert.equal(sha256("web/models/star.gltf"), sha256("models/star.gltf", jversRoot));

  assertNonEmpty("web/orbit.html");
  assertNonEmpty("web/assets/superloopy-hero-badge.png");
  assertNonEmpty("web/assets/superloopy-content-enhancements.js");
  assertNonEmpty("web/assets/generated/proof-evidence.png");
  assertNonEmpty("web/assets/generated/skill-lanes.png");
  assertNonEmpty("web/assets/generated/visible-progress.png");
  assertNonEmpty("web/assets/generated/final-gate.png");
  assertNonEmpty("web/assets/generated/eye-glb-preview.png");
  assertNonEmpty("web/crew/franky.png");
  assertNonEmpty("web/crew/jinbe.png");
  assertNonEmpty("web/crew/luffy.svg");
  assertNonEmpty("web/crew/nami.png");
  assertNonEmpty("web/crew/robin.png");
  assertNonEmpty("web/crew/usopp.png");
  assertNonEmpty("web/crew/zoro.png");
  assertNonEmpty("web/_nuxt/ty4JC5yh.js");
  assertNonEmpty("web/webgl/models/engineering-orb.glb");
  assertNonEmpty("web/webgl/models/engineering-orb-gaps.glb");
  assertNonEmpty("web/webgl/models/eye.glb");
  assertNonEmpty("web/webgl/textures/chrome-ring.ktx2");
  assertNonEmpty("web/basis/basis_transcoder.wasm");
  assertNonEmpty("web/draco/draco_decoder.wasm");

  assert.equal(sha256("web/_nuxt/ty4JC5yh.js"), sha256("_nuxt/ty4JC5yh.js", blueyardRoot));
  assert.equal(sha256("web/webgl/models/engineering-orb.glb"), sha256("webgl/models/engineering-orb.glb", blueyardRoot));
  assert.equal(sha256("web/webgl/models/engineering-orb-gaps.glb"), sha256("webgl/models/engineering-orb-gaps.glb", blueyardRoot));
  assert.equal(sha256("web/webgl/models/eye.glb"), sha256("webgl/models/eye.glb", blueyardRoot));
});

(() => {
  const EYE_MODEL_SRC = "/webgl/models/eye.glb";
  const EYE_PREVIEW_SRC = "/assets/generated/eye-glb-preview.png";
  const EYE_RENDERER_SRC = "/assets/superloopy-eye-renderer.js";
  const GITHUB_REPO_URL = "https://github.com/beefiker/superloopy";
  // Copy data (asset swaps, proof rewrites, locale dictionary) lives in
  // superloopy-locale-copy.js, loaded before this script by the shell bootstrap.
  const SUPERLOOPY_COPY = window.SUPERLOOPY_COPY || {};
  const ASSET_REPLACEMENTS = SUPERLOOPY_COPY.assetReplacements || [];
  const PROOF_COPY_REPLACEMENTS = SUPERLOOPY_COPY.proofCopyReplacements || [];
  const PROOF_CASE_COPY = SUPERLOOPY_COPY.proofCaseCopy || [];
  const LOCALE_TEXT_REPLACEMENTS = SUPERLOOPY_COPY.localeTexts || {};
  const FOOTER_TITLE_BY_LOCALE = SUPERLOOPY_COPY.footerTitles || { en: ["Get", "Superloopy"] };
  // Locale rendering lives in superloopy-locale-copy.js alongside its dictionary.
  const { activeLocale, applyLocale, applyLocalizedCopy, renderLocaleOptions, renderFooterTitle } = window.SuperloopyLocale || {};
  const CTA_TEXT = /(start\s*loop|install\s*(loop|superloopy))/i;
  const DEAD_PROOF_TEXT = /^(open proof|open proof flow)(\s+(open proof|open proof flow))*$/i;
  const GITHUB_ICON = `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.6 7.6 0 0 1 8 3.86c.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;
  let assetRaf = 0;
  let chromeRaf = 0;
  let eyeRaf = 0;
  let eyeMotionStarted = false;
  let eyeRendererScriptPromise = null;
  function normalizedText(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }
  function textSignature(node) {
    // textContent, never innerText: innerText forces synchronous layout per node, which
    // turned every enhancement pass into layout thrashing while the page scrolls.
    const raw = normalizedText(node);
    const href = node instanceof HTMLAnchorElement ? node.getAttribute("href") || "" : "";
    return `${raw} ${href}`.toLowerCase();
  }
  function decoded(value) {
    if (!value) return "";
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  function imageSignature(img) {
    return [img.currentSrc, img.getAttribute("src"), img.getAttribute("srcset"), img.alt].map(decoded).join(" ");
  }
  function shouldFrameAsset(img) {
    const parent = img.parentElement;
    if (!parent) return false;
    const parentClass = String(parent.className || "");
    const imgClass = String(img.className || "");
    if (/parallax-images__container|absolute|fixed|sticky/i.test(parentClass) || /parallax-block__image/i.test(imgClass)) return false;
    return /header-menu-item__thumb|overflow-hidden|pointer-events-none|bg-purple-100|case/i.test(parentClass);
  }
  function decorateSwappedAsset(img, replacement) {
    const parent = img.parentElement;
    img.classList.add("superloopy-swapped-asset");
    img.classList.toggle("superloopy-crew-asset", replacement.kind === "crew");
    img.classList.toggle("superloopy-proof-asset", replacement.kind === "proof");
    parent?.classList.remove("superloopy-media-frame", "superloopy-crew-frame", "superloopy-proof-frame");
    if (shouldFrameAsset(img)) {
      parent?.classList.add("superloopy-media-frame", `superloopy-${replacement.kind}-frame`);
    }
  }
  function replaceContentAssets() {
    document.querySelectorAll("img").forEach((img) => {
      const replacement = ASSET_REPLACEMENTS.find((item) => item.pattern.test(imageSignature(img)));
      if (!replacement || img.dataset.superloopyAssetSrc === replacement.src) return;
      img.dataset.superloopyAssetSrc = replacement.src;
      img.dataset.superloopyAssetKind = replacement.kind;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.src = replacement.src;
      img.alt = replacement.alt;
      img.loading = "lazy";
      img.decoding = "async";
      decorateSwappedAsset(img, replacement);
    });
  }
  function removeDeadProofLinks() {
    document.querySelectorAll("a, button").forEach((control) => {
      // Strip arrows/glyphs so "OPEN PROOF FLOW →" still matches the dead-text set.
      const text = normalizedText(control).toLowerCase().replace(/[^a-z ]+/g, "").trim();
      const href = control instanceof HTMLAnchorElement ? control.getAttribute("href") || "" : "";
      if (href === "#proof") return;
      // Any path-routed page (/proof, /cases/…) does not exist in this single-page
      // export — hide every control that would navigate to one.
      const deadRoute = /^\/(proof|cases|case|career|contacts|terms|privacy)(\/|$)/i.test(href);
      if (!DEAD_PROOF_TEXT.test(text) && !deadRoute) return;
      control.classList.add("superloopy-dead-proof-link");
      control.setAttribute("aria-hidden", "true");
      control.tabIndex = -1;
    });
  }
  function enhanceStartLoopButtons() {
    document.querySelectorAll("a, button").forEach((control) => {
      if (!CTA_TEXT.test(textSignature(control)) && control.getAttribute("href") !== "#form") return;
      control.classList.add("superloopy-start-loop-button");
      control.setAttribute("data-superloopy-cta", "start-loop");
      if (control instanceof HTMLAnchorElement && !control.getAttribute("href")) {
        control.setAttribute("href", "#form");
      }
      if (!control.querySelector(".superloopy-start-loop-button__arrow")) {
        const arrow = document.createElement("span");
        arrow.className = "superloopy-start-loop-button__arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.innerHTML = `<svg viewBox="0 0 24 24" focusable="false"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        control.append(arrow);
      }
    });
  }
  function renderGithubTextLink() {
    const headerActions = document.querySelector(".fixed.right-0.top-0");
    if (!headerActions || headerActions.querySelector(".superloopy-github-text-link")) return;
    const link = document.createElement("a");
    link.className = "superloopy-github-text-link";
    link.href = GITHUB_REPO_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.dataset.superloopyGithubIcon = "true";
    link.setAttribute("aria-label", "Star Superloopy on GitHub");
    link.innerHTML = `${GITHUB_ICON}<span class="superloopy-github-label">GitHub</span><span class="superloopy-github-sep" aria-hidden="true"></span><svg class="superloopy-github-star" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 3.1l2.75 5.57 6.15.9-4.45 4.33 1.05 6.13L12 17.14l-5.5 2.89 1.05-6.13L3.1 9.57l6.15-.9z"/></svg>`;
    headerActions.prepend(link);
  }
  function renderGithubSocialIcons() {
    document.querySelectorAll('a[href*="github.com/beefiker/superloopy"]').forEach((anchor) => {
      // Presence-based guards: React re-renders can strip our injected nodes while
      // dataset flags survive, which would leave the anchor permanently empty.
      if (anchor.querySelector(".superloopy-github-mark") || anchor.classList.contains("superloopy-github-text-link")) return;
      const text = normalizedText(anchor);
      if (anchor.closest("footer")) {
        // Plain text links, like the reference site's footer — no boxed buttons. Guarded
        // so the pass is idempotent: an unconditional textContent write here re-fired the
        // observers on every pass, forever.
        const isPrimary = String(anchor.className).includes("footer-email");
        if (!isPrimary) {
          // Only two GitHub touchpoints belong in the footer: the big primary link
          // and the copyright line. Everything else (old Terms/Privacy slots, the
          // boxed icon button) rendered as stacked duplicate "GITHUB" texts — hide.
          if (!String(anchor.className).includes("link--underline")) anchor.classList.add("superloopy-dead-proof-link");
          return;
        }
        if (anchor.querySelector(".superloopy-footer-github-text")) return;
        anchor.classList.remove("btn-circle");
        Object.assign(anchor, { href: GITHUB_REPO_URL, target: "_blank", rel: "noreferrer" });
        const label = document.createElement("span");
        label.className = "superloopy-footer-github-text";
        label.textContent = "github.com/beefiker/superloopy";
        anchor.append(label);
        anchor.classList.add("superloopy-footer-github-link", "superloopy-footer-github-primary");
        return;
      }
      const svg = anchor.querySelector("svg");
      if (!svg) return;
      if (text && !/^in$/i.test(text)) return;
      anchor.dataset.superloopyGithubIcon = "true";
      anchor.classList.add("superloopy-github-icon-link");
      anchor.setAttribute("aria-label", "Open Superloopy on GitHub");
      anchor.insertAdjacentHTML("beforeend", GITHUB_ICON.replace("<svg ", '<svg class="superloopy-github-mark" '));
    });
  }
  function rewriteProofCopy() {
    document.querySelectorAll("p, div, span").forEach((node) => {
      if (node.childElementCount > 0) return;
      const text = normalizedText(node);
      if (!text || text.length > 420) return;
      const replacement = [...PROOF_COPY_REPLACEMENTS, ...PROOF_CASE_COPY].find(([pattern]) => pattern.test(text));
      if (!replacement || text === replacement[1]) return;
      if (!replacement[1]) {
        node.classList.add("superloopy-dead-proof-link");
        node.setAttribute("aria-hidden", "true");
        return;
      }
      node.textContent = replacement[1];
    });
  }
  // The pre-footer CTA banner was the clone's filler slot: a mostly empty half, a CTA
  // that duplicates the install section directly below it, and a repeated headline.
  // Remove the whole section instead of restyling it.
  function removePrefooterBanner() {
    document.querySelectorAll("h3").forEach((node) => {
      if (node.closest("#form") || node.closest("footer")) return;
      const key = node.dataset.superloopyCopyKey;
      const text = normalizedText(node);
      if (key !== "Install once. Then type loopy." && key !== "Done means proven." && text !== "Install once. Then type loopy.") return;
      node.closest("section")?.classList.add("superloopy-removed-banner");
    });
  }
  // The base site splits the giant FAQ headline into animated chars; our copy swap
  // orphans that animation and the title ends up invisible (a huge empty band above
  // the FAQ rows). Own it instead: plain "FAQ" like the reference site, with CSS in
  // superloopy-shell.css forcing it visible over any leftover split state.
  function renderFaqTitle() {
    document.querySelectorAll(".faqs-title").forEach((title) => {
      if (title.dataset.superloopyFaqTitle === "FAQ") return;
      title.dataset.superloopyFaqTitle = "FAQ";
      title.textContent = "FAQ";
    });
  }
  function scheduleAssetReplacement() {
    if (assetRaf) return;
    assetRaf = window.requestAnimationFrame(() => {
      assetRaf = 0;
      replaceContentAssets();
      removeDeadProofLinks();
      enhanceStartLoopButtons();
      rewriteProofCopy();
      applyLocalizedCopy(activeLocale());
    });
  }
  function scheduleChromeEnhancements() {
    if (chromeRaf) return;
    chromeRaf = window.requestAnimationFrame(() => {
      chromeRaf = 0;
      renderLocaleOptions();
      renderGithubTextLink();
      renderGithubSocialIcons();
      removePrefooterBanner();
      applyLocalizedCopy(activeLocale());
      renderFaqTitle();
      renderFooterTitle(activeLocale());
    });
  }
  function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
  }
  let eyeMotionRaf = 0;
  let cachedEyeSection = null;
  let cachedEyeModel = null;
  function updateEyeMotion() {
    if (!cachedEyeSection?.isConnected || !cachedEyeModel?.isConnected) {
      cachedEyeSection = document.querySelector("[data-superloopy-eye-section]");
      cachedEyeModel = cachedEyeSection?.querySelector(".superloopy-eye-model") || null;
    }
    const section = cachedEyeSection;
    const model = cachedEyeModel;
    if (!section || !model) return;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const scrollable = Math.max(1, rect.height - viewportHeight);
    const progress = clamp(-rect.top / scrollable);
    const pointerX = Number(model.dataset.pointerX || 0);
    const pointerY = Number(model.dataset.pointerY || 0);
    model.style.setProperty("--eye-progress", progress.toFixed(4));
    model.style.setProperty("--eye-pointer-x", pointerX.toFixed(4));
    model.style.setProperty("--eye-pointer-y", pointerY.toFixed(4));
    model.style.setProperty("--eye-rotate", `${(-18 + progress * 36 + pointerX * 6).toFixed(2)}deg`);
    model.style.setProperty("--eye-tilt", `${(8 - progress * 14 - pointerY * 5).toFixed(2)}deg`);
    model.style.setProperty("--eye-lift", `${(-4 + progress * 8).toFixed(2)}%`);
    model.style.setProperty("--eye-scale", (0.94 + progress * 0.08).toFixed(4));
    model.__superloopyEyeRenderer?.setMotion?.({ progress, pointerX, pointerY });
    window.__superloopyEyeScene = {
      mounted: true,
      model: EYE_MODEL_SRC,
      renderer: EYE_RENDERER_SRC,
      progress
    };
  }
  function scheduleEyeMotion() {
    // Coalesce: scroll + pointermove used to queue several rAF callbacks per frame,
    // each doing a getBoundingClientRect between style writes.
    if (eyeMotionRaf) return;
    eyeMotionRaf = window.requestAnimationFrame((now) => {
      eyeMotionRaf = 0;
      updateEyeMotion(now);
    });
  }
  function startEyeMotion() {
    if (eyeMotionStarted) return;
    eyeMotionStarted = true;
    window.addEventListener("scroll", scheduleEyeMotion, { passive: true });
    window.addEventListener("resize", scheduleEyeMotion);
    scheduleEyeMotion();
  }
  function loadEyeRenderer() {
    if (window.SuperloopyEyeRenderer) return Promise.resolve(window.SuperloopyEyeRenderer);
    if (eyeRendererScriptPromise) return eyeRendererScriptPromise;
    eyeRendererScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${EYE_RENDERER_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(window.SuperloopyEyeRenderer), { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      // async=false keeps execution order: the lib must define window.SuperloopyEyeLib
      // before the renderer destructures it at eval.
      for (const src of ["/assets/superloopy-eye-lib.js", EYE_RENDERER_SRC]) {
        const script = document.createElement("script");
        script.src = src;
        script.async = false;
        if (src === EYE_RENDERER_SRC) {
          script.onload = () => resolve(window.SuperloopyEyeRenderer);
          script.onerror = () => reject(new Error("Superloopy eye renderer failed to load"));
        }
        document.body.append(script);
      }
    });
    return eyeRendererScriptPromise;
  }
  function bootEyeRenderer(layer) {
    const canvas = layer.querySelector(".superloopy-eye-canvas");
    if (!canvas || layer.__superloopyEyeRenderer) return;
    layer.classList.add("is-webgl-booting");
    loadEyeRenderer()
      .then((renderer) => {
        if (!renderer?.mount) throw new Error("Superloopy eye renderer unavailable");
        layer.__superloopyEyeRenderer = renderer.mount(canvas, {
          modelUrl: EYE_MODEL_SRC,
          reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
        });
        return layer.__superloopyEyeRenderer.ready;
      })
      .then(() => {
        layer.classList.remove("is-webgl-booting");
        layer.classList.add("is-webgl-ready");
        scheduleEyeMotion();
      })
      .catch((error) => {
        layer.classList.remove("is-webgl-booting");
        layer.classList.add("is-webgl-error");
        window.__superloopyEyeScene = {
          mounted: true,
          model: EYE_MODEL_SRC,
          renderer: EYE_RENDERER_SRC,
          error: String(error?.message || error)
        };
      });
  }
  function findEyeSection() {
    // The localization pass may have already swapped "Set the goal" for its
    // translation before this runs, so an English-only text match strands the
    // base site's canvas in non-English locales. Prefer the copy-key marker the
    // localizer stamps; fall back to matching any locale's heading text.
    const marker = document.querySelector('[data-superloopy-copy-key="Set the goal"]');
    const marked = marker?.closest("section");
    if (marked) return marked;
    const headings = ["Set the goal", ...Object.values(LOCALE_TEXT_REPLACEMENTS["Set the goal"] || {})];
    return Array.from(document.querySelectorAll("section")).find((item) => {
      const text = normalizedText(item);
      return /Step\s*01/i.test(text) && headings.some((heading) => text.includes(heading));
    });
  }
  function mountEyeScene() {
    const section = findEyeSection();
    if (!section || section.querySelector(".superloopy-eye-model")) return;
    section.classList.add("superloopy-eye-section");
    section.setAttribute("data-superloopy-eye-section", "");
    const grid = Array.from(section.children).find((child) => child.querySelector?.("canvas"));
    const visualColumn = grid?.firstElementChild instanceof HTMLElement ? grid.firstElementChild : section;
    const layer = document.createElement("div");
    layer.className = "superloopy-eye-model";
    layer.setAttribute("aria-label", "Interactive Superloopy eye model showing Superloopy loop progress");
    layer.dataset.superloopyEyeModel = EYE_MODEL_SRC;
    layer.innerHTML = `
      <div class="superloopy-eye-orbital">
        <img class="superloopy-eye-fallback" src="${EYE_PREVIEW_SRC}" alt="" loading="eager" decoding="async">
        <canvas class="superloopy-eye-canvas" aria-hidden="true"></canvas>
      </div>
      <div class="superloopy-eye-progress" aria-hidden="true"><span></span></div>
    `;
    layer.addEventListener("pointermove", (event) => {
      const rect = layer.getBoundingClientRect();
      layer.dataset.pointerX = String(clamp((event.clientX - rect.left) / rect.width, 0, 1) * 2 - 1);
      layer.dataset.pointerY = String(clamp((event.clientY - rect.top) / rect.height, 0, 1) * 2 - 1);
      scheduleEyeMotion();
    });
    layer.addEventListener("pointerleave", () => {
      layer.dataset.pointerX = "0";
      layer.dataset.pointerY = "0";
      scheduleEyeMotion();
    });
    // Append and CSS-hide the original children instead of removing them: this DOM
    // belongs to React, and removing its nodes crashes reconciliation on resize
    // (removeChild NotFoundError) which tears the whole app down.
    if (visualColumn === section) {
      section.append(layer);
    } else {
      visualColumn.classList.add("superloopy-eye-column");
      visualColumn.append(layer);
    }
    bootEyeRenderer(layer);
    startEyeMotion();
    window.__superloopyEyeScene = { mounted: true, model: EYE_MODEL_SRC, renderer: EYE_RENDERER_SRC };
  }
  function mountGlassLayer(holder, src = "/glass-hero/") {
    if (!holder || holder.querySelector(".superloopy-glass-layer")) return;
    holder.classList.add("superloopy-glass-holder");
    const layer = document.createElement("div");
    layer.className = "superloopy-glass-layer";
    layer.setAttribute("aria-label", "Superloopy crew roles rendered as six glass panes");
    const frame = document.createElement("iframe");
    frame.src = src;
    frame.loading = "lazy";
    frame.title = "Superloopy crew glass panes";
    frame.setAttribute("allowtransparency", "true");
    layer.append(frame);
    holder.append(layer);
    window.__superloopyGlassMounts = (window.__superloopyGlassMounts || 0) + 1;
  }
  function mountCrewGlassScene() {
    // One crew glass embed: the intro collage block. The footer keeps the base
    // site's saw model (recolored hot pink via the patched palette).
    const collage = document.querySelector('svg[viewBox="0 0 430 315"]')?.closest(".relative");
    if (collage && !collage.classList.contains("superloopy-glass-holder")) {
      collage.parentElement?.classList.add("superloopy-glass-frame");
    }
    // ?crew=intro swaps the texture order: the center Voronoi cell resolves to a
    // different pane index at this block's aspect ratio, and Luffy stays centered.
    mountGlassLayer(collage, "/glass-hero/?crew=intro");
  }
  function scheduleEyeScene() {
    if (eyeRaf) return;
    eyeRaf = window.requestAnimationFrame(() => {
      eyeRaf = 0;
      mountEyeScene();
      mountCrewGlassScene();
    });
  }
  function debounced(schedule, delay = 250) {
    let timer = 0;
    return () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        schedule();
      }, delay);
    };
  }
  // Forward pointer position into the orbit iframe (rAF-throttled, coords only).
  // The iframe keeps pointer-events:none, so clicks and page scroll stay on the page;
  // the scene's own pointer store receives the motion via orbit.html's bridge.
  let orbitPointerLast = -32;
  function startOrbitPointerBridge() {
    if (window.__superloopyOrbitPointerBridge) return;
    window.__superloopyOrbitPointerBridge = true;
    window.addEventListener("pointermove", (event) => {
      if (event.timeStamp - orbitPointerLast < 16) return;
      orbitPointerLast = event.timeStamp;
      window.__superloopyOrbitPointerSent = (window.__superloopyOrbitPointerSent || 0) + 1;
      const frame = document.querySelector(".superloopy-orbit-layer iframe");
      if (!frame || frame.style.display === "none") return;
      frame.contentWindow?.postMessage({
        type: "superloopy-orbit-pointer",
        pointer: {
          x: (event.clientX / Math.max(1, window.innerWidth)) * 2 - 1,
          y: (event.clientY / Math.max(1, window.innerHeight)) * 2 - 1
        }
      }, window.location.origin);
      const glass = document.querySelector(".superloopy-glass-layer iframe");
      const rect = glass?.getBoundingClientRect();
      if (!rect || !rect.width || rect.bottom < -240 || rect.top > window.innerHeight + 240) return;
      glass.contentWindow?.postMessage({
        type: "superloopy-glass-pointer",
        pointer: { x: event.clientX - rect.left, y: event.clientY - rect.top }
      }, window.location.origin);
    }, { passive: true });
  }
  function startEnhancements() {
    startOrbitPointerBridge();
    scheduleAssetReplacement();
    scheduleChromeEnhancements();
    scheduleEyeScene();
    // Observers are debounced, and the asset filter no longer watches "class": the base
    // site's scroll animations toggle classes every frame, which used to re-run these
    // full-DOM enhancement passes continuously while scrolling.
    new MutationObserver(debounced(scheduleAssetReplacement)).observe(document.documentElement, {
      attributeFilter: ["src", "srcset", "alt", "href"],
      attributes: true,
      childList: true,
      subtree: true
    });
    new MutationObserver(debounced(scheduleChromeEnhancements)).observe(document.documentElement, { childList: true, characterData: true, subtree: true });
    new MutationObserver(debounced(scheduleEyeScene)).observe(document.documentElement, {
      characterData: true,
      childList: true,
      subtree: true
    });
    [100, 500, 1500, 3000].forEach((delay) => {
      window.setTimeout(() => {
        scheduleAssetReplacement();
        scheduleChromeEnhancements();
        scheduleEyeScene();
      }, delay);
    });
  }
  if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", startEnhancements, { once: true });
  else startEnhancements();
})();

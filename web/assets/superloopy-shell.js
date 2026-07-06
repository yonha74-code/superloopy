(() => {
  const HERO_SELECTOR = "main > section:first-child";
  const ORBIT_SRC = "/orbit.html?devmode=webgl&scene=landing-orb";
  const LOADER_MIN_MS = 650;
  const LOADER_MAX_MS = 5200;
  const LOADER_READY_DELAY_MS = 280;
  const LOADER_EXIT_MS = 420;
  const INSTALL_COMMANDS = [
    {
      id: "codex",
      label: "Codex",
      detail: "Run in a terminal, then restart Codex and approve the hooks.",
      commands: [
        "codex plugin marketplace add https://github.com/beefiker/superloopy",
        "codex plugin add superloopy@beefiker"
      ]
    },
    {
      id: "claude",
      label: "Claude Code",
      detail: "Run inside Claude Code, then approve the plugin hooks.",
      commands: [
        "/plugin marketplace add beefiker/superloopy",
        "/plugin install superloopy@beefiker",
        "/reload-plugins"
      ]
    }
  ];
  const COPY_REPLACEMENTS = [
    [/^(case\s*studies){1,2}$/i, "Evidence"],
    [/^(careers){1,2}$/i, "Install"],
    [/^(contacts){1,2}$/i, "GitHub"],
    [/^(terms){1,2}$/i, "Docs"],
    [/^(privacy){1,2}$/i, "License"],
    [/^cases$/i, "Proof"],
    [/^(go\s*to\s*cases){1,2}$/i, "Open proof"],
    [/^(get\s*started){1,2}$/i, "Start loop"],
    [/^(request\s*a\s*demo){1,2}$/i, "Install loop"],
    [/^j-vers®?$/i, "Superloopy®"],
    [/^customization$/i, "Skill lanes"],
    [/^54%$/i, "1 loop"],
    [/^400$/i, "4 gates"],
    [/^12%$/i, "0 guess"],
    [/^website\s+by\s+obys$/i, "Done means proven."],
    [/^i\s+have\s+read\s+and\s+agree\s+to\s+the\s+terms\s*&\s*conditions\s+and\s+privacy\s+policy\.$/i, "I understand Superloopy writes evidence and a final report in the project."],
    [/^the\s+case\s+in\s+the\s+tech\s+sector$/i, "Proof flow for agent work"],
    [/^case\s+in\s+the\s+logistics\s+sector$/i, "Proof flow for research loops"],
    [/^case\s+in\s+the\s+healthcare\s+sector$/i, "Proof flow for frontend loops"]
  ];
  const COPY_TARGETS = [
    ".custom-link__text",
    ".styles_splitText__pzy_L",
    ".styles_fallback__a_QZN",
    "a",
    "button",
    "span",
    "h1",
    "h2",
    "h3",
    "h4",
    "p",
    "div"
  ].join(",");

  function stopHeroVideos(hero) {
    hero.querySelectorAll("video").forEach((video) => {
      video.pause?.();
      video.removeAttribute("autoplay");
      video.style.opacity = "0";
      video.style.visibility = "hidden";
      video.style.pointerEvents = "none";
    });
  }

  let raf = 0;
  let copyRaf = 0;
  let installRaf = 0;
  let headerRaf = 0;
  let loaderMountedAt = 0;
  let loaderHideTimer = 0;
  let loaderFallbackTimer = 0;
  let loaderObserverStarted = false;
  let contentEnhancementsLoaded = false;

  function markHeroBusy(isBusy) {
    const hero = document.querySelector(HERO_SELECTOR);
    if (!hero) return;

    if (isBusy) {
      hero.setAttribute("aria-busy", "true");
    } else {
      hero.removeAttribute("aria-busy");
    }
  }

  function mountLoadingScreen() {
    if (window.__superloopyOrbitLoader?.hidden) return;
    if (document.querySelector(".superloopy-orbit-loader")) {
      document.documentElement.classList.remove("superloopy-boot");
      return;
    }
    if (!document.body) {
      window.addEventListener("DOMContentLoaded", mountLoadingScreen, { once: true });
      return;
    }

    loaderMountedAt = window.performance?.now?.() || Date.now();
    document.documentElement.classList.add("superloopy-loader-active");
    markHeroBusy(true);

    const loader = document.createElement("div");
    loader.className = "superloopy-orbit-loader";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.innerHTML = `
      <div class="superloopy-orbit-loader__inner">
        <div class="superloopy-orbit-loader__rail" role="progressbar" aria-label="Loading hero orbit"></div>
      </div>
    `;

    document.body.append(loader);
    // Boot guard lifts once the opaque loader covers the viewport.
    document.documentElement.classList.remove("superloopy-boot");
    watchLoadingScreen();
    window.clearTimeout(loaderFallbackTimer);
    loaderFallbackTimer = window.setTimeout(() => {
      hideLoadingScreen("timeout");
    }, LOADER_MAX_MS);
    window.__superloopyOrbitLoader = { mounted: true, hidden: false, reason: null };
  }

  function watchLoadingScreen() {
    if (loaderObserverStarted) return;
    loaderObserverStarted = true;
    new MutationObserver(() => {
      const state = window.__superloopyOrbitLoader;
      if (state?.mounted && !state.hidden && !document.querySelector(".superloopy-orbit-loader")) {
        window.requestAnimationFrame(mountLoadingScreen);
      }
    }).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function hideLoadingScreen(reason = "ready") {
    const loader = document.querySelector(".superloopy-orbit-loader");
    if (!loader || loader.classList.contains("is-leaving")) return;

    const now = window.performance?.now?.() || Date.now();
    const remaining = Math.max(0, LOADER_MIN_MS - (now - loaderMountedAt));
    window.clearTimeout(loaderHideTimer);
    loaderHideTimer = window.setTimeout(() => {
      window.clearTimeout(loaderFallbackTimer);
      loader.classList.add("is-leaving");
      document.querySelector(".superloopy-orbit-layer")?.classList.add("is-risen");
      markHeroBusy(false);
      document.documentElement.classList.remove("superloopy-loader-active", "superloopy-boot");
      window.__superloopyOrbitLoader = { mounted: true, hidden: true, reason };
      window.setTimeout(() => {
        loader.remove();
      }, LOADER_EXIT_MS);
    }, remaining);
  }

  function mountOrbit() {
    const hero = document.querySelector(HERO_SELECTOR);
    if (!hero) return;

    stopHeroVideos(hero);
    if (hero.querySelector(".superloopy-orbit-layer")) {
      const existingFrame = hero.querySelector(".superloopy-orbit-layer iframe");
      if (existingFrame?.dataset.orbitReady === "true") {
        window.setTimeout(() => hideLoadingScreen("orbit-existing"), LOADER_READY_DELAY_MS);
      }
      return;
    }

    const layer = document.createElement("div");
    layer.className = "superloopy-orbit-layer";
    layer.setAttribute("aria-hidden", "true");

    const frame = document.createElement("iframe");
    frame.src = ORBIT_SRC;
    frame.loading = "eager";
    frame.tabIndex = -1;
    frame.title = "Superloopy orbit";
    frame.addEventListener("load", () => {
      const loadedUrl = frame.contentWindow?.location?.href || frame.src;
      if (!loadedUrl.includes("orbit.html")) return;
      frame.dataset.orbitReady = "true";
      window.setTimeout(() => hideLoadingScreen("iframe-load"), LOADER_READY_DELAY_MS);
    });
    layer.append(frame);

    hero.prepend(layer);
    if (window.__superloopyOrbitLoader?.hidden) {
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => layer.classList.add("is-risen")));
    }
    pauseOrbitWhenOffscreen(layer, frame);
    window.__superloopyShell = {
      mounted: true,
      src: ORBIT_SRC,
      heroOnly: true
    };
  }

  // display:none suspends the iframe's rAF loop offscreen without losing WebGL state.
  function pauseOrbitWhenOffscreen(layer, frame) {
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver((entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      frame.style.display = visible ? "" : "none";
      window.__superloopyShell = {
        ...window.__superloopyShell,
        orbitPaused: !visible
      };
    }, { rootMargin: "160px 0px" }).observe(layer);
  }

  function scheduleMount() {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      mountOrbit();
    });
  }

  function normalizedText(node) {
    return (node.textContent || "").replace(/\s+/g, " ").trim();
  }

  function rewriteCopy() {
    document.querySelectorAll(COPY_TARGETS).forEach((node) => {
      const text = normalizedText(node);
      if (!text || text.length > 80) return;
      const replacement = COPY_REPLACEMENTS.find(([pattern]) => pattern.test(text));
      if (!replacement || text === replacement[1]) return;
      node.textContent = replacement[1];
      if (node instanceof HTMLAnchorElement && /^#cases$/i.test(node.getAttribute("href") || "")) {
        node.setAttribute("href", "#proof");
      }
    });
  }

  function scheduleCopyRewrite() {
    if (copyRaf) return;
    copyRaf = window.requestAnimationFrame(() => {
      copyRaf = 0;
      rewriteCopy();
    });
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function commandCardTemplate(commandSet) {
    const commands = commandSet.commands.join("\n");
    const commandLines = commandSet.commands.map((command) => `
          <span class="superloopy-command-line">
            <span class="superloopy-command-prompt" aria-hidden="true">${commandSet.id === "claude" ? "›" : "$"}</span>
            <span class="superloopy-command-text">${escapeHtml(command)}</span>
          </span>
        `).join("");
    return `
      <article class="superloopy-command-card" data-command-card="${escapeHtml(commandSet.id)}">
        <div class="superloopy-command-card__header">
          <span class="superloopy-command-card__mark" aria-hidden="true"></span>
          <h3>${escapeHtml(commandSet.label)}</h3>
        </div>
        <div class="superloopy-command-copy">
          <pre><code>${commandLines}</code></pre>
          <button class="superloopy-copy-button" type="button" data-copy-command="${escapeHtml(commandSet.id)}" aria-label="Copy ${escapeHtml(commandSet.label)} install commands">
            <span>Copy</span>
          </button>
        </div>
        <p>${escapeHtml(commandSet.detail)}</p>
      </article>
    `;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fall through to the textarea copy path for browsers that gate clipboard permission.
      }
    }

    let copiedViaEvent = false;
    const onCopy = (event) => {
      event.clipboardData?.setData("text/plain", text);
      event.preventDefault();
      copiedViaEvent = true;
    };
    document.addEventListener("copy", onCopy, { once: true });
    const eventCopied = document.execCommand("copy");
    document.removeEventListener("copy", onCopy);
    if (eventCopied && copiedViaEvent) return true;

    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    field.style.top = "0";
    document.body.append(field);
    field.focus({ preventScroll: true });
    field.select();
    field.setSelectionRange(0, field.value.length);
    const copied = document.execCommand("copy");
    field.remove();
    return copied;
  }

  function selectCommandText(button) {
    const code = button.closest(".superloopy-command-copy")?.querySelector("code");
    if (!code) return false;
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    return true;
  }

  function bindCommandCopyButtons(root) {
    root.querySelectorAll("[data-copy-command]").forEach((button) => {
      if (button.dataset.copyBound === "true") return;
      button.dataset.copyBound = "true";
      button.addEventListener("click", async () => {
        const commandSet = INSTALL_COMMANDS.find((item) => item.id === button.dataset.copyCommand);
        if (!commandSet) return;

        const label = button.querySelector("span");
        try {
          const copied = await copyText(commandSet.commands.join("\n"));
          if (!copied) throw new Error("Clipboard copy failed");
          if (label) label.textContent = "Copied";
          button.dataset.copied = "true";
          window.setTimeout(() => {
            if (label) label.textContent = "Copy";
            delete button.dataset.copied;
          }, 1800);
        } catch {
          const selected = selectCommandText(button);
          const selectedCopy = selected && document.execCommand("copy");
          if (selectedCopy) {
            if (label) label.textContent = "Copied";
            button.dataset.copied = "true";
          } else if (selected) {
            if (label) label.textContent = "Selected";
            button.dataset.copied = "manual";
          } else {
            if (label) label.textContent = "Select";
            button.dataset.copied = "false";
          }
        }
      });
    });
  }

  function renderInstallCommands() {
    const section = document.querySelector("#form");
    const shell = section?.querySelector(".container");
    if (!section || !shell) return;

    section.setAttribute("data-header-theme", "light");
    // Append + CSS-hide the React children; gutting them crashes reconciliation on resize.
    if (!shell.querySelector(".superloopy-install-body")) {
      shell.classList.add("superloopy-install-section");
      const body = document.createElement("div");
      body.className = "superloopy-install-body";
      body.innerHTML = `
        <p class="superloopy-install-kicker">Install</p>
        <div class="superloopy-install-heading">
          <h2>Install once. Then type loopy.</h2>
        </div>
        <div class="superloopy-install-commands" aria-label="Superloopy install commands">
          ${INSTALL_COMMANDS.map(commandCardTemplate).join("")}
        </div>
      `;
      shell.append(body);
    }

    bindCommandCopyButtons(shell);
    window.__superloopyInstallCommands = {
      mounted: true,
      commandSets: INSTALL_COMMANDS.map((item) => item.id)
    };
  }

  function scheduleInstallCommands() {
    if (installRaf) return;
    installRaf = window.requestAnimationFrame(() => {
      installRaf = 0;
      renderInstallCommands();
    });
  }

  let cachedInstallSection = null;
  function updateInstallHeaderTheme() {
    if (!cachedInstallSection?.isConnected) cachedInstallSection = document.querySelector("#form");
    const section = cachedInstallSection;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const sampleY = 72;
    document.body.classList.toggle(
      "superloopy-install-header-active",
      rect.top <= sampleY && rect.bottom >= sampleY
    );
  }

  function scheduleInstallHeaderTheme() {
    if (headerRaf) return;
    headerRaf = window.requestAnimationFrame(() => {
      headerRaf = 0;
      updateInstallHeaderTheme();
    });
  }

  function loadContentEnhancements() {
    if (contentEnhancementsLoaded || document.querySelector('script[src="/assets/superloopy-content-enhancements.js"]')) return;
    contentEnhancementsLoaded = true;
    // async=false: the copy/locale module must define its globals before the enhancer evals.
    for (const src of ["/assets/superloopy-locale-copy.js", "/assets/superloopy-content-enhancements.js"]) {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      document.body.append(script);
    }
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

  function startAfterHydration() {
    mountLoadingScreen();
    loadContentEnhancements();
    scheduleMount();
    scheduleCopyRewrite();
    scheduleInstallCommands();
    scheduleInstallHeaderTheme();
    // Debounced: full-document scans must not re-run per mutation batch while scrolling.
    new MutationObserver(debounced(scheduleMount)).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    new MutationObserver(debounced(scheduleCopyRewrite)).observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
    });
    new MutationObserver(debounced(scheduleInstallCommands)).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    window.addEventListener("scroll", scheduleInstallHeaderTheme, { passive: true });
    window.addEventListener("resize", scheduleInstallHeaderTheme);
    [100, 500, 1500, 3000].forEach((delay) => {
      window.setTimeout(() => {
        scheduleMount();
        scheduleCopyRewrite();
        scheduleInstallCommands();
        scheduleInstallHeaderTheme();
      }, delay);
    });
  }

  if (document.readyState === "complete") {
    mountLoadingScreen();
    window.setTimeout(startAfterHydration, 800);
  } else {
    mountLoadingScreen();
    window.addEventListener("load", () => {
      window.setTimeout(startAfterHydration, 800);
    }, { once: true });
  }
})();

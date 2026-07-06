(() => {
  function cleanupLegacyOverlays() {
    document.querySelectorAll(".agent-pane-overlay").forEach((element) => {
      element.remove();
    });

    Array.from(document.querySelectorAll("div"))
      .filter((element) => {
        const className =
          typeof element.className === "string" ? element.className : "";
        return (
          className.includes("max-w-sm") &&
          className.includes("bg-black/60") &&
          element.textContent?.includes("Live HTML on the glass is disabled")
        );
      })
      .forEach((element) => {
        element.remove();
      });
  }

  cleanupLegacyOverlays();

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    cleanupLegacyOverlays();
    if (attempts >= 40) {
      window.clearInterval(timer);
    }
  }, 100);
})();

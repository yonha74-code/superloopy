(() => {
  const ready = () => {
    document.documentElement.classList.remove("is-loading");

    const preloader = document.querySelector(".bg-gradient-preloader-purple");
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 450ms ease";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }

    const videos = [...document.querySelectorAll("video")];
    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.play?.().catch(() => {});
    });
    if (videos.length >= 2) {
      videos[0].addEventListener("ended", () => {
        videos[0].style.visibility = "hidden";
        videos[1].style.visibility = "visible";
        videos[1].loop = true;
        videos[1].play?.().catch(() => {});
      }, { once: true });
    }

    const opener = document.querySelector(".styles_opener__9NuEq");
    const menu = document.querySelector(".styles_menu__Hm8IV");
    if (opener && menu && !opener.dataset.localBound) {
      opener.dataset.localBound = "true";
      opener.addEventListener("click", () => {
        const next = menu.getAttribute("aria-expanded") !== "true";
        menu.setAttribute("aria-expanded", String(next));
        document.body.classList.toggle("local-menu-open", next);
      });
    }

    document.querySelectorAll('a[href="#form"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const form = document.querySelector("#form");
        if (!form) return;
        event.preventDefault();
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
  } else {
    ready();
  }
})();

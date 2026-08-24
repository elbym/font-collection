/**
 * Mobile off-canvas navigation: hamburger toggle + focus management +
 * body scroll lock, and a click-accordion for the font-group submenus
 * inside the mobile panel (desktop uses CSS-only group-hover/focus-within).
 */
(function () {
  const toggleBtn = document.getElementById("nav-toggle");
  const panel = document.getElementById("mobile-nav-panel");
  if (!toggleBtn || !panel) return;

  const sheet = panel.querySelector(".mobile-nav__sheet");
  const closeEls = panel.querySelectorAll("[data-nav-close]");
  const firstLink = panel.querySelector("a, button");

  function openMenu() {
    panel.dataset.state = "open";
    panel.classList.remove("hidden");
    // Force a layout flush so the slide-in transition runs on the next frame.
    requestAnimationFrame(() => {
      sheet.classList.remove("translate-x-full");
    });
    document.documentElement.classList.add("overflow-hidden");
    toggleBtn.setAttribute("aria-expanded", "true");
    toggleBtn.setAttribute("aria-label", "Menü schließen");
    if (firstLink) firstLink.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeMenu() {
    panel.dataset.state = "closed";
    sheet.classList.add("translate-x-full");
    document.documentElement.classList.remove("overflow-hidden");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-label", "Menü öffnen");
    document.removeEventListener("keydown", onKeydown);
    toggleBtn.focus();
    // Wait for the slide-out transition before hiding for real.
    window.setTimeout(() => {
      if (panel.dataset.state === "closed") panel.classList.add("hidden");
    }, 200);
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeMenu();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = panel.querySelectorAll(
      'a[href], button:not([disabled])'
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggleBtn.addEventListener("click", () => {
    if (panel.dataset.state === "open") closeMenu();
    else openMenu();
  });

  closeEls.forEach((el) => el.addEventListener("click", closeMenu));

  panel.querySelectorAll("[data-nav-accordion-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      const target = document.getElementById(btn.getAttribute("aria-controls"));
      if (target) target.classList.toggle("hidden", expanded);
    });
  });
})();

/* Shared behavior: nav toggle, reveal-on-scroll, config hydration, town checker, demo form.
   Works without JS too: .rv elements are visible when JS is absent (no-js class on <html>). */
(function () {
  document.documentElement.classList.remove("no-js");

  // --- config hydration: the ONE swappable constant ---
  if (typeof SITE !== "undefined") {
    document.querySelectorAll('[data-site="name"]').forEach(el => { el.textContent = SITE.name; });
    document.querySelectorAll('[data-site="short"]').forEach(el => { el.textContent = SITE.short; });
    document.querySelectorAll('[data-site="phone"]').forEach(el => { el.textContent = SITE.phone; });
    document.querySelectorAll('[data-site="email"]').forEach(el => { el.textContent = SITE.email; });
    document.querySelectorAll('[data-site="address"]').forEach(el => { el.textContent = SITE.address; });
    document.querySelectorAll('[data-site="location"]').forEach(el => { el.textContent = SITE.location; });
    document.querySelectorAll('[data-site="region"]').forEach(el => { el.textContent = SITE.region; });
    document.querySelectorAll("a[data-site-phone]").forEach(el => { el.setAttribute("href", SITE.phoneHref); });
    document.querySelectorAll("a[data-site-email]").forEach(el => { el.setAttribute("href", "mailto:" + SITE.email); });
    document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
    document.querySelectorAll(".plate-nums").forEach(el => {
      el.innerHTML = "";
      SITE.licenses.forEach(l => { const s = document.createElement("span"); s.textContent = l; el.appendChild(s); });
    });
  }

  // --- mobile nav ---
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("navmenu");
  if (burger && menu) {
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
  }

  // --- reveal on scroll (entrance order handled by transition-delay set inline) ---
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".rv").forEach(el => io.observe(el));

  // --- service-area town checker (one live element) ---
  const sel = document.getElementById("town-select");
  const res = document.getElementById("town-result");
  if (sel && res) {
    sel.addEventListener("change", () => {
      const t = sel.value;
      if (!t) { res.classList.remove("show"); return; }
      res.classList.add("show");
      res.innerHTML = "<strong>" + t + " — covered.</strong><br>We serve " + t + " and all of White Pine County. " +
        'Call <a data-site-phone href="' + SITE.phoneHref + '">' + SITE.phone + "</a> and tell us what you need.";
    });
  }

  // --- contact form: honest demo, no backend ---
  const form = document.getElementById("service-form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      const need = ["f-name", "f-phone", "f-need"];
      need.forEach(id => {
        const input = document.getElementById(id);
        const wrap = input.closest(".field");
        const empty = !input.value.trim();
        wrap.classList.toggle("invalid", empty);
        input.setAttribute("aria-invalid", empty ? "true" : "false");
        if (empty) ok = false;
      });
      const note = document.getElementById("form-note-live");
      if (!ok) {
        note.textContent = "Please fill in your name, phone, and what you need — those three are required.";
        note.focus();
        return;
      }
      form.reset();
      note.innerHTML = "Thanks — this is a <strong>demo form</strong>, so nothing was sent. " +
        "For real service, call <a data-site-phone href=\"" + SITE.phoneHref + "\">" + SITE.phone + "</a>.";
    });
  }
})();

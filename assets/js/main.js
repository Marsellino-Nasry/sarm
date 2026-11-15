/* SARM Security | Marsellino Nasry Mounir
   Progressive enhancement only: the page is fully readable without JavaScript. */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const EMAIL = "marsellino.nasry@gmail.com";

  /* ---------- Header state ---------- */
  const header = $(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  const toggle = $(".nav-toggle");
  const menu = $("#site-menu");
  const toggleLabel = toggle ? $(".visually-hidden", toggle) : null;
  const toggleIcon = toggle ? $("use", toggle) : null;

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("is-locked", open);
    if (toggleLabel) toggleLabel.textContent = open ? "Close menu" : "Open menu";
    if (toggleIcon) toggleIcon.setAttribute("href", open ? "#i-close" : "#i-menu");
    if (open) {
      const first = $("a", menu);
      if (first) first.focus();
    }
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", (mq) => { if (mq.matches) setMenu(false); });
  }

  /* ---------- Active section in navigation ---------- */
  const navLinks = $$('.site-nav__list a[href^="#"]:not(.btn)');
  const sections = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = "#" + entry.target.id;
          navLinks.forEach((a) => {
            if (a.getAttribute("href") === id) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Reveal on scroll (skipped when reduced motion is preferred) ---------- */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealables = $$("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window && revealables.length) {
    document.documentElement.classList.add("js-reveal");
    const rio = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          // stagger siblings slightly
          const siblings = $$("[data-reveal]", el.parentElement);
          const i = Math.max(0, siblings.indexOf(el));
          el.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
          el.classList.add("is-in");
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach((el) => rio.observe(el));
  }

  /* ---------- "Discuss this service" links pre-select the form ---------- */
  const serviceSelect = $("#service");
  if (serviceSelect) {
    $$("[data-service]").forEach((link) => {
      link.addEventListener("click", () => {
        const wanted = link.dataset.service;
        const option = Array.from(serviceSelect.options).find((o) => o.value === wanted);
        if (option) serviceSelect.value = wanted;
      });
    });
  }

  /* ---------- Contact form (Formspree, endpoint unchanged) ---------- */
  const form = $("#contact-form");
  if (form) {
    const submitBtn = $("#submit-btn");
    const statusEl = $("#form-status");
    const fields = {
      name: { input: $("#name"), error: $("#name-error"), test: (v) => v.length > 0 },
      email: { input: $("#email"), error: $("#email-error"), test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      message: { input: $("#message"), error: $("#message-error"), test: (v) => v.length > 0 },
    };

    const setStatus = (text, kind) => {
      statusEl.textContent = text;
      statusEl.className = "form__status" + (kind ? " is-" + kind : "");
    };

    function validate() {
      let firstInvalid = null;
      Object.values(fields).forEach(({ input, error, test }) => {
        if (!input) return;
        const ok = test(input.value.trim());
        input.setAttribute("aria-invalid", String(!ok));
        error.hidden = ok;
        if (!ok && !firstInvalid) firstInvalid = input;
      });
      return firstInvalid;
    }

    Object.values(fields).forEach(({ input, error, test }) => {
      if (!input) return;
      input.addEventListener("input", () => {
        if (input.getAttribute("aria-invalid") === "true" && test(input.value.trim())) {
          input.setAttribute("aria-invalid", "false");
          error.hidden = true;
        }
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const invalid = validate();
      if (invalid) {
        setStatus("Check the highlighted fields and try again.", "error");
        invalid.focus();
        return;
      }

      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
      setStatus("", "");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const email = fields.email.input.value.trim();
          form.reset();
          setStatus("Thank you. Your request is in, and I'll reply to " + email + " to arrange a call.", "success");
        } else {
          let detail = "";
          try {
            const data = await response.json();
            if (data && Array.isArray(data.errors)) detail = data.errors.map((e) => e.message).join(", ");
          } catch (_) { /* response was not JSON */ }
          setStatus(
            (detail ? detail + ". " : "Your message wasn't sent. ") + "Try again, or email me directly at " + EMAIL + ".",
            "error"
          );
        }
      } catch (_) {
        setStatus("Your message wasn't sent because the connection failed. Check your connection and try again, or email " + EMAIL + ".", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = original;
      }
    });
  }

  /* ---------- Footer year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

/* ==========================================================================
   js/main.js
   Core site behaviour: navigation, theme toggle, mobile menu, dynamic
   skill/project rendering, scroll-spy, and the contact form.
   Loaded last, after data/projects.js, three-scene.js and animations.js.
   ========================================================================== */

(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

  /* ------------------------------ Skill data ------------------------------ */
  const SKILLS = [
    { code: "SQL", name: "SQL", desc: "Writing queries to extract, join and aggregate relational data." },
    { code: "PY", name: "Python", desc: "Scripting data workflows and automating repetitive analysis." },
    { code: "PD", name: "Pandas", desc: "Cleaning, reshaping and exploring tabular data efficiently." },
    { code: "NP", name: "NumPy", desc: "Numerical operations and array-based computation." },
    { code: "XL", name: "Excel", desc: "Building formulas, pivot tables and quick data summaries." },
    { code: "BI", name: "Power BI", desc: "Designing interactive dashboards for business reporting." },
    { code: "PG", name: "PostgreSQL", desc: "Managing and querying relational databases at scale." },
    { code: "ST", name: "Statistics", desc: "Applying statistical thinking to validate insights." },
    { code: "DV", name: "Data Visualization", desc: "Turning numbers into clear, honest visual stories." },
    { code: "DC", name: "Data Cleaning", desc: "Fixing missing values, duplicates and formatting issues." },
    { code: "EDA", name: "Exploratory Data Analysis", desc: "Investigating patterns before drawing conclusions." },
    { code: "GIT", name: "Git", desc: "Tracking changes and versioning analysis code." },
    { code: "GH", name: "GitHub", desc: "Hosting and sharing projects and analysis repositories." },
  ];

  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    grid.innerHTML = SKILLS.map(
      (s) => `
      <div class="skill-card glass">
        <div class="skill-icon">${s.code}</div>
        <h3 class="skill-name">${s.name}</h3>
        <p class="skill-desc">${s.desc}</p>
      </div>`
    ).join("");
  }

  /* ------------------------------ Project rendering ------------------------------ */
  function renderProjects() {
    const grid = document.getElementById("projects-grid");
    if (!grid || !window.PROJECTS) return;

    grid.innerHTML = window.PROJECTS.map((p) => {
      const tools = p.tools.map((t) => `<span class="tool-tag">${t}</span>`).join("");
      const features = p.features.map((f) => `<li>${f}</li>`).join("");
      const formula = p.formula ? `<div class="project-formula">${p.formula}</div>` : "";
      return `
      <article class="project-card glass">
        <div class="project-top">
          <span class="project-number">${p.number}</span>
        </div>
        <h3 class="project-title">${p.title}</h3>
        <div class="project-tools">${tools}</div>
        <p class="project-desc">${p.description}</p>
        <ul class="project-features">${features}</ul>
        ${formula}
        <div class="project-actions">
          <a class="btn btn-primary" href="${p.links.view}" data-project-view="${p.id}">View Project</a>
          <a class="btn btn-outline" href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </article>`;
    }).join("");
  }

  /* ------------------------------ Navbar scroll state ------------------------------ */
  function initNavbarScroll() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;
    function update() {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ------------------------------ Mobile menu ------------------------------ */
  function initMobileMenu() {
    const hamburger = document.getElementById("hamburger");
    const menu = document.getElementById("mobile-menu");
    const backdrop = document.getElementById("menu-backdrop");
    if (!hamburger || !menu || !backdrop) return;

    function closeMenu() {
      hamburger.classList.remove("open");
      menu.classList.remove("open");
      backdrop.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function openMenu() {
      hamburger.classList.add("open");
      menu.classList.add("open");
      backdrop.classList.add("open");
      hamburger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }
    hamburger.addEventListener("click", () => {
      const isOpen = menu.classList.contains("open");
      isOpen ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ------------------------------ Theme toggle ------------------------------ */
  function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const stored = null; // in-memory only, no localStorage per environment constraints
    let theme = "dark";

    function apply(t) {
      theme = t;
      if (t === "light") {
        root.setAttribute("data-theme", "light");
      } else {
        root.removeAttribute("data-theme");
      }
    }
    apply(theme);

    if (!toggle) return;
    toggle.addEventListener("click", () => {
      apply(theme === "dark" ? "light" : "dark");
    });
  }

  /* ------------------------------ Scroll-spy active nav link ------------------------------ */
  function initScrollSpy() {
    const sections = Array.from(document.querySelectorAll("main section[id], section#contact"));
    const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
    if (!sections.length || !navLinks.length) return;

    const byId = {};
    navLinks.forEach((a) => {
      const id = a.getAttribute("href").replace("#", "");
      byId[id] = byId[id] || [];
      byId[id].push(a);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((a) => a.classList.remove("active"));
            const id = entry.target.id;
            (byId[id] || []).forEach((a) => a.classList.add("active"));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ------------------------------ Smooth anchor scrolling ------------------------------ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const id = link.getAttribute("href");
        if (id.length < 2) return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  /* ------------------------------ Contact form ------------------------------ */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in every field before sending.";
        status.style.color = "#f87171";
        return;
      }

      // No backend is wired up yet — this opens the visitor's email client
      // pre-filled with the message. Replace this with a real API/Formspree
      // endpoint if you want messages delivered without opening email.
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
      window.location.href = `mailto:your-email@example.com?subject=${subject}&body=${body}`;

      status.textContent = "Opening your email client to send this message...";
      status.style.color = "";
      form.reset();
    });
  }

  /* ------------------------------ Boot ------------------------------ */
  function boot() {
    renderSkills();
    renderProjects();
    initNavbarScroll();
    initMobileMenu();
    initThemeToggle();
    initScrollSpy();
    initSmoothAnchors();
    initContactForm();

    // Kick off GSAP animations only after skill/project cards exist in the DOM
    if (typeof window.initAnimations === "function") {
      window.initAnimations();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

/* ==========================================================================
   js/animations.js
   GSAP + ScrollTrigger driven motion.
   Runs after main.js has injected the skill/project cards into the DOM,
   so it is initialised from window.initAnimations(), called at the end
   of main.js once all content exists.
   ========================================================================== */

window.initAnimations = function initAnimations() {
  if (typeof gsap === "undefined") return;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  if (prefersReducedMotion) {
    // Just make everything visible, skip motion.
    gsap.set(".reveal-up", { opacity: 1, y: 0 });
    return;
  }

  /* --------------------------- Hero entrance --------------------------- */
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero-badge", { opacity: 0, y: -16, duration: 0.6 })
    .from(".hero-name", { opacity: 0, y: 40, duration: 0.9 }, "-=0.35")
    .from(".hero-role", { opacity: 0, y: 20, duration: 0.7 }, "-=0.55")
    .from(".hero-tagline", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
    .from(".hero-desc", { opacity: 0, y: 16, duration: 0.6 }, "-=0.4")
    .from(".hero-actions .btn", { opacity: 0, y: 16, stagger: 0.1, duration: 0.5 }, "-=0.35")
    .from(".hero-stack .stack-pill", { opacity: 0, y: 10, stagger: 0.06, duration: 0.4 }, "-=0.3")
    .from("#profile-frame", { opacity: 0, scale: 0.85, duration: 1 }, "-=0.9")
    .from(".hud-card", { opacity: 0, scale: 0.8, stagger: 0.1, duration: 0.6 }, "-=0.6")
    .from(".scroll-indicator", { opacity: 0, duration: 0.6 }, "-=0.2");

  /* ------------------------- Hero floating loop -------------------------- */
  gsap.to("#profile-frame", {
    y: -14,
    duration: 3.4,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
  gsap.utils.toArray(".hud-card").forEach((card, i) => {
    gsap.to(card, {
      y: i % 2 === 0 ? -10 : 10,
      duration: 3 + i * 0.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: i * 0.2,
    });
  });

  /* ------------------------ Mouse parallax on hero ------------------------ */
  const heroVisual = document.getElementById("hero-visual");
  const profileFrame = document.getElementById("profile-frame");
  if (heroVisual && profileFrame) {
    let rafId = null;
    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        gsap.to(profileFrame, {
          rotationY: px * 10,
          rotationX: -py * 10,
          duration: 0.6,
          ease: "power2.out",
          transformPerspective: 800,
        });
        gsap.to(".hud-card", {
          x: (i) => px * (8 + i * 3),
          y: (i) => py * (8 + i * 3),
          duration: 0.7,
          ease: "power2.out",
          stagger: 0,
        });
      });
    }, { passive: true });
    heroVisual.addEventListener("mouseleave", () => {
      gsap.to(profileFrame, { rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out" });
    }, { passive: true });
  }

  /* ------------------------------ Nav shrink ------------------------------ */
  ScrollTrigger.create({
    start: "top -60",
    end: 99999,
    toggleClass: { className: "scrolled", targets: "#navbar" },
  });

  /* --------------------------- Generic scroll reveal --------------------------- */
  gsap.utils.toArray(".reveal-up").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
      },
    });
  });

  /* -------------------------- Section heading reveal -------------------------- */
  gsap.utils.toArray("section").forEach((section) => {
    const tag = section.querySelector(".section-tag");
    const heading = section.querySelector(".section-heading");
    const sub = section.querySelector(".section-sub");
    const targets = [tag, heading, sub].filter(Boolean);
    if (!targets.length) return;
    gsap.from(targets, {
      opacity: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ------------------------------ Skill cards ------------------------------ */
  gsap.utils.toArray(".skill-card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: (i % 4) * 0.06,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 92%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ----------------------------- Project cards ----------------------------- */
  gsap.utils.toArray(".project-card").forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 40,
      duration: 0.7,
      delay: (i % 2) * 0.08,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ------------------------------ Timeline ------------------------------ */
  gsap.utils.toArray(".timeline-item").forEach((item, i) => {
    gsap.from(item, {
      opacity: 0,
      x: -30,
      duration: 0.6,
      delay: i * 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  });

  /* ------------------------------ Metric count-up ------------------------------ */
  gsap.utils.toArray(".metric-num").forEach((el) => {
    const raw = el.textContent.trim();
    const numMatch = raw.match(/\d+/);
    if (!numMatch) return;
    const target = parseInt(numMatch[0], 10);
    const suffix = raw.replace(numMatch[0], "");
    const counter = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(counter.val) + suffix; },
        });
      },
    });
  });

  /* ------------------------------ 3D tilt: skills + projects ------------------------------ */
  function apply3DTilt(selector, intensity) {
    gsap.utils.toArray(selector).forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotationY: px * intensity,
          rotationX: -py * intensity,
          transformPerspective: 700,
          duration: 0.4,
          ease: "power2.out",
        });
      }, { passive: true });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
      }, { passive: true });
    });
  }
  apply3DTilt(".skill-card", 8);
  apply3DTilt(".project-card", 6);
  apply3DTilt(".about-card", 5);
  apply3DTilt(".edu-card", 5);

  /* ------------------------------ Background parallax on scroll ------------------------------ */
  gsap.to("#bg-canvas", {
    yPercent: 8,
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });
};

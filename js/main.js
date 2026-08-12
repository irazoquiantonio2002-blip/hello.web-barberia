(function () {
  const body = document.body;
  body.classList.add("loading");

  const loadingScreen = document.getElementById("loading-screen");
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loadingScreen?.classList.add("is-hidden");
      body.classList.remove("loading");
    }, 1450);
  });

  const header = document.getElementById("site-header");
  const nav = document.getElementById("main-nav");
  const toggle = document.getElementById("nav-toggle");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));

  const syncHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  toggle?.addEventListener("click", () => {
    const isOpen = nav?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-40% 0px -55% 0px" });

  sections.forEach((section) => activeObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll("[data-reveal]").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    revealObserver.observe(item);
  });

  const typewriter = document.getElementById("typewriter");
  const words = ["tu rutina diaria", "eventos importantes", "verte bien sin traslado", "mantener tu estilo"];
  let wordIndex = 0;
  let charIndex = 0;
  let removing = false;

  const type = () => {
    if (!typewriter) return;
    const word = words[wordIndex];
    typewriter.textContent = word.slice(0, charIndex);

    if (!removing && charIndex < word.length) {
      charIndex += 1;
      window.setTimeout(type, 74);
      return;
    }

    if (!removing && charIndex === word.length) {
      removing = true;
      window.setTimeout(type, 1300);
      return;
    }

    if (removing && charIndex > 0) {
      charIndex -= 1;
      window.setTimeout(type, 38);
      return;
    }

    removing = false;
    wordIndex = (wordIndex + 1) % words.length;
    window.setTimeout(type, 280);
  };
  type();

  const countNumbers = (container) => {
    container.querySelectorAll("[data-count]").forEach((number) => {
      const target = Number(number.dataset.count || 0);
      const duration = target === 0 ? 450 : 1500;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = String(Math.round(target * eased));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    });
  };

  const stats = document.querySelector(".stats");
  if (stats) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        countNumbers(stats);
        statsObserver.disconnect();
      }
    }, { threshold: 0.35 });
    statsObserver.observe(stats);
  }

  const form = document.getElementById("booking-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name") || "";
    const zone = data.get("zone") || "";
    const service = data.get("service") || "";
    const message = data.get("message") || "";
    const whatsappText = [
      "Hola, quiero agendar un corte a domicilio.",
      `Nombre: ${name}`,
      `Zona: ${zone}`,
      `Servicio: ${service}`,
      message ? `Mensaje: ${message}` : ""
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, "_blank", "noopener");
  });

  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas?.getContext("2d");
  let particles = [];
  let animationFrame;

  const setCanvasSize = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(canvas.offsetWidth * ratio);
    canvas.height = Math.floor(canvas.offsetHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const createParticles = () => {
    if (!canvas) return;
    const count = window.innerWidth < 720 ? 42 : 78;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      r: Math.random() * 2.4 + .6,
      dx: (Math.random() - .5) * .28,
      dy: (Math.random() - .5) * .28,
      alpha: Math.random() * .42 + .12
    }));
  };

  const drawParticles = () => {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    particles.forEach((particle, index) => {
      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.dx *= -1;
      if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.dy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(53, 214, 255, ${particle.alpha})`;
      ctx.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 116) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(53, 214, 255, ${.12 * (1 - distance / 116)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(drawParticles);
  };

  if (canvas && ctx && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    setCanvasSize();
    createParticles();
    drawParticles();
    window.addEventListener("resize", () => {
      cancelAnimationFrame(animationFrame);
      setCanvasSize();
      createParticles();
      drawParticles();
    });
  }

  document.getElementById("year").textContent = new Date().getFullYear();

  if (window.lucide) {
    window.lucide.createIcons();
  }
})();

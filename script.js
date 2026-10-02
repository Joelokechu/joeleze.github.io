(() => {
  "use strict";

  const EMAILJS_PUBLIC_KEY = "rgJiaabQfCfMpGz3t";
  const EMAILJS_SERVICE_ID = "service_71fb2en";
  const EMAILJS_TEMPLATE_ID = "template_56f6p8n";

  const safeStorage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* Storage may be blocked. */
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* Storage may be blocked. */
      }
    }
  };

  const qs = (selector, parent = document) =>
    parent.querySelector(selector);

  const qsa = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  function initialiseEmailJS() {
    if (!window.emailjs) return false;

    try {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
      return true;
    } catch {
      return false;
    }
  }

  function initialiseSmoothScroll() {
    qsa('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;

        const target = qs(href);
        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    });
  }

  function initialiseNavbar() {
    const navbar = qs(".navbar");
    if (!navbar) return;

    const update = () =>
      navbar.classList.toggle("scrolled", window.scrollY > 24);

    update();
    window.addEventListener("scroll", update, { passive: true });

    const desktopButton = qs("#desktop-menu-button");
    const adminDropdown = qs("#admin-dropdown");
    const mobileButton = qs("#mobile-menu-button");
    const mobileMenu = qs("#mobile-menu");

    const closeAdmin = () => {
      if (!desktopButton || !adminDropdown) return;

      desktopButton.classList.remove("active");
      desktopButton.setAttribute("aria-expanded", "false");
      adminDropdown.classList.add("hidden");
    };

    const closeMobile = () => {
      if (!mobileButton || !mobileMenu) return;

      mobileButton.classList.remove("active");
      mobileButton.setAttribute("aria-expanded", "false");
      mobileMenu.classList.add("hidden");
    };

    desktopButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      closeMobile();

      const willOpen = adminDropdown.classList.contains("hidden");

      adminDropdown.classList.toggle("hidden", !willOpen);
      desktopButton.classList.toggle("active", willOpen);
      desktopButton.setAttribute("aria-expanded", String(willOpen));
    });

    mobileButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      closeAdmin();

      const willOpen = mobileMenu.classList.contains("hidden");

      mobileMenu.classList.toggle("hidden", !willOpen);
      mobileButton.classList.toggle("active", willOpen);
      mobileButton.setAttribute("aria-expanded", String(willOpen));
    });

    qsa("a", mobileMenu || document.createElement("div")).forEach(
      (link) => link.addEventListener("click", closeMobile)
    );

    document.addEventListener("click", (event) => {
      if (
        adminDropdown &&
        desktopButton &&
        !adminDropdown.contains(event.target) &&
        !desktopButton.contains(event.target)
      ) {
        closeAdmin();
      }

      if (
        mobileMenu &&
        mobileButton &&
        !mobileMenu.contains(event.target) &&
        !mobileButton.contains(event.target)
      ) {
        closeMobile();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeAdmin();
        closeMobile();
      }
    });
  }

  function initialiseTheme() {
    const toggle = qs("#dark-toggle");
    const fade = qs(".page-fade");
    const ripple = qs(".theme-ripple");

    if (!toggle) return;

    const currentTheme =
      document.documentElement.dataset.theme === "light"
        ? "light"
        : "dark";

    toggle.checked = currentTheme === "dark";

    toggle.addEventListener("change", () => {
      const theme = toggle.checked ? "dark" : "light";
      const label = toggle.nextElementSibling;
      const rect = label?.getBoundingClientRect();

      if (fade) {
        fade.style.opacity = "0.5";

        window.setTimeout(() => {
          fade.style.opacity = "0";
        }, 160);
      }

      if (ripple && rect) {
        ripple.style.left = `${rect.left + rect.width / 2}px`;
        ripple.style.top = `${rect.top + rect.height / 2}px`;

        ripple.classList.remove("active");
        void ripple.offsetWidth;
        ripple.classList.add("active");
      }

      document.documentElement.dataset.theme = theme;
      safeStorage.set("theme", theme);

      const themeColour = qs('meta[name="theme-color"]');

      themeColour?.setAttribute(
        "content",
        theme === "dark" ? "#0b0e13" : "#f4f7fa"
      );
    });
  }

  function initialiseRevealAnimations() {
    const sections = qsa(".fade-section");

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("appear"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("appear");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px"
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  async function sendEmail(parameters) {
    if (!window.emailjs) {
      throw new Error("EmailJS unavailable");
    }

    return window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      parameters
    );
  }

  function initialiseConsultationForm() {
    window.IBJTickets.attachForm(qs("#consult-form"), sendEmail);

    qsa("[data-service]").forEach((link) => {
      link.addEventListener("click", () => {
        qs("#consult-service").value = link.dataset.service;
      });
    });

    qsa('a[href="#consultation"]')
      .filter(
        (link) =>
          !link.dataset.service &&
          /consultation/i.test(link.textContent)
      )
      .forEach((link) => {
        link.addEventListener("click", () => {
          qs("#consult-service").value = "free_consultation";
        });
      });
  }

  function initialiseChat() {
    const bubble = qs("#chat-bubble");
    const launcher = qs("#chat-launcher");
    const panel = qs("#chat-panel");
    const closeButton = qs("#chat-close");
    const windowElement = qs("#chat-window");
    const form = qs("#chat-form");
    const nameInput = qs("#user-name");
    const emailInput = qs("#user-email");
    const messageInput = qs("#user-input");
    const changeInfo = qs("#change-info");

    if (
      !bubble ||
      !launcher ||
      !panel ||
      !windowElement ||
      !form ||
      !nameInput ||
      !emailInput ||
      !messageInput
    ) {
      return;
    }

    let lastSubmittedAt = 0;

    const addMessage = (text, sender) => {
      const message = document.createElement("div");

      message.className = `message ${sender}`;
      message.textContent = text;

      windowElement.appendChild(message);
      windowElement.scrollTop = windowElement.scrollHeight;

      return message;
    };

    const addTyping = () => {
      const typing = document.createElement("div");

      typing.className = "message bot typing";
      typing.setAttribute("aria-label", "Typing");

      typing.innerHTML =
        '<span class="typing-dot"></span>' +
        '<span class="typing-dot"></span>' +
        '<span class="typing-dot"></span>';

      windowElement.appendChild(typing);
      windowElement.scrollTop = windowElement.scrollHeight;

      return typing;
    };

    const openChat = () => {
      bubble.classList.replace("collapsed", "expanded");
      launcher.classList.add("hidden");
      panel.classList.remove("hidden");
      launcher.setAttribute("aria-expanded", "true");

      if (!windowElement.children.length) {
        addMessage(
          "Hi! Tell me what you need, then choose your service in the request form.",
          "bot"
        );
      }

      window.setTimeout(() => messageInput.focus(), 0);
    };

    const closeChat = () => {
      bubble.classList.replace("expanded", "collapsed");
      panel.classList.add("hidden");
      launcher.classList.remove("hidden");
      launcher.setAttribute("aria-expanded", "false");
      launcher.focus();
    };

    launcher.addEventListener("click", openChat);
    closeButton?.addEventListener("click", closeChat);

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        !panel.classList.contains("hidden")
      ) {
        closeChat();
      }
    });

    const savedName = safeStorage.get("chatUserName");
    const savedEmail = safeStorage.get("chatUserEmail");

    if (savedName && savedEmail) {
      nameInput.value = savedName;
      emailInput.value = savedEmail;

      nameInput.closest("label")?.classList.add("hidden");
      emailInput.closest("label")?.classList.add("hidden");
      changeInfo?.classList.remove("hidden");
    }

    changeInfo?.addEventListener("click", () => {
      safeStorage.remove("chatUserName");
      safeStorage.remove("chatUserEmail");

      nameInput.closest("label")?.classList.remove("hidden");
      emailInput.closest("label")?.classList.remove("hidden");

      changeInfo.classList.add("hidden");
      nameInput.focus();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;
      if (qs("#chat-website")?.value) return;

      const now = Date.now();

      if (now - lastSubmittedAt < 10000) {
        addMessage(
          "Please wait a few seconds before sending another message.",
          "bot"
        );
        return;
      }

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const text = messageInput.value.trim();
      const submit = qs('button[type="submit"]', form);

      safeStorage.set("chatUserName", name);
      safeStorage.set("chatUserEmail", email);

      nameInput.closest("label")?.classList.add("hidden");
      emailInput.closest("label")?.classList.add("hidden");
      changeInfo?.classList.remove("hidden");

      addMessage(text, "user");
      messageInput.value = "";
      submit.disabled = true;

      const typing = addTyping();

      try {
        qs("#consult-name").value = name;
        qs("#consult-email").value = email;
        qs("#consult-message").value = text;

        closeChat();

        qs("#consultation").scrollIntoView({
          behavior: "smooth"
        });

        qs("#consult-service").focus();

        typing.remove();

        addMessage(
          "Your message is ready in the request form. Choose a service and submit it to create your ticket.",
          "bot"
        );
      } catch {
        typing.remove();

        addMessage(
          "Please use the request form or email Joel.okechu@gmail.com.",
          "bot"
        );
      } finally {
        submit.disabled = false;
      }
    });
  }

  function initialiseCarousel() {
    const carousel = qs(".project-carousel");

    const viewport = qs(
      ".carousel-viewport",
      carousel || document
    );

    const track = qs(".carousel-track", carousel || document);

    const previous = qs(
      ".carousel-arrow.left",
      carousel || document
    );

    const next = qs(
      ".carousel-arrow.right",
      carousel || document
    );

    const dotsContainer = qs(
      ".carousel-dots",
      carousel || document
    );

    if (
      !carousel ||
      !viewport ||
      !track ||
      !previous ||
      !next ||
      !dotsContainer
    ) {
      return;
    }

    const cards = qsa(".project-card", track);
    if (!cards.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let page = 0;
    let autoplayId = null;
    let resizeId = null;

    const perPage = () => window.innerWidth <= 980 ? 1 : 2;

    const pageCount = () =>
      Math.ceil(cards.length / perPage());

    const gap = () =>
      parseFloat(
        getComputedStyle(track).columnGap ||
        getComputedStyle(track).gap
      ) || 0;

    const stopAutoplay = () => {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    };

    const startAutoplay = () => {
      stopAutoplay();

      if (
        reducedMotion.matches ||
        document.hidden ||
        pageCount() < 2
      ) {
        return;
      }

      autoplayId = window.setInterval(() => {
        page = (page + 1) % pageCount();
        render();
      }, 7000);
    };

    const renderDots = () => {
      dotsContainer.replaceChildren();

      for (let index = 0; index < pageCount(); index += 1) {
        const dot = document.createElement("button");

        dot.type = "button";
        dot.className =
          `carousel-dot${index === page ? " active" : ""}`;

        dot.setAttribute(
          "aria-label",
          `Show project page ${index + 1}`
        );

        dot.setAttribute(
          "aria-current",
          index === page ? "true" : "false"
        );

        dot.addEventListener("click", () => {
          page = index;
          render();
          startAutoplay();
        });

        dotsContainer.appendChild(dot);
      }
    };

    const render = () => {
      page = Math.min(
        page,
        Math.max(pageCount() - 1, 0)
      );

      const step =
        cards[0].getBoundingClientRect().width + gap();

      track.style.transform =
        `translate3d(-${page * perPage() * step}px, 0, 0)`;

      previous.disabled = page === 0;
      next.disabled = page >= pageCount() - 1;

      renderDots();
    };

    previous.addEventListener("click", () => {
      page = Math.max(page - 1, 0);
      render();
      startAutoplay();
    });

    next.addEventListener("click", () => {
      page = Math.min(page + 1, pageCount() - 1);
      render();
      startAutoplay();
    });

    viewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") previous.click();
      if (event.key === "ArrowRight") next.click();
    });

    let pointerStart = null;

    viewport.addEventListener("pointerdown", (event) => {
      if (
        event.pointerType === "mouse" &&
        event.button !== 0
      ) {
        return;
      }

      pointerStart = event.clientX;
      stopAutoplay();
    });

    viewport.addEventListener("pointerup", (event) => {
      if (pointerStart === null) return;

      const distance = event.clientX - pointerStart;
      pointerStart = null;

      if (Math.abs(distance) > 55) {
        if (distance < 0) next.click();
        else previous.click();
      } else {
        startAutoplay();
      }
    });

    viewport.addEventListener("pointercancel", () => {
      pointerStart = null;
      startAutoplay();
    });

    carousel.addEventListener("mouseenter", stopAutoplay);
    carousel.addEventListener("mouseleave", startAutoplay);
    carousel.addEventListener("focusin", stopAutoplay);

    carousel.addEventListener("focusout", (event) => {
      if (!carousel.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    window.addEventListener("resize", () => {
      window.clearTimeout(resizeId);

      resizeId = window.setTimeout(() => {
        page = Math.min(page, pageCount() - 1);
        render();
        startAutoplay();
      }, 140);
    });

    reducedMotion.addEventListener?.(
      "change",
      startAutoplay
    );

    render();
    startAutoplay();
  }

  function initialiseFooter() {
    const year = qs("#current-year");

    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initialiseEmailJS();
    initialiseSmoothScroll();
    initialiseNavbar();
    initialiseTheme();
    initialiseRevealAnimations();
    initialiseConsultationForm();
    initialiseChat();
    initialiseCarousel();
    initialiseFooter();
  });
})();

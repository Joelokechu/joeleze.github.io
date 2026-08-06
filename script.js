/* ============================
   Smooth Scroll for Navigation
============================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#') || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================
   Navbar Background on Scroll
   (respects current light/dark theme)
============================= */
const navbar = document.querySelector('.navbar');
function updateNavbarBackground() {
  const isLight = document.body.classList.contains('light');
  const scrolled = window.scrollY > 80;

  if (isLight) {
    navbar.style.background = scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.85)';
  } else {
    navbar.style.background = scrolled ? 'rgba(11, 12, 16, 0.95)' : 'rgba(0,0,0,0.7)';
  }
  navbar.style.boxShadow = scrolled ? '0 2px 10px rgba(0,0,0,0.35)' : 'none';
}
window.addEventListener('scroll', updateNavbarBackground);

/* ============================
   Fade-in Section Animation
============================= */
const fadeSections = document.querySelectorAll('.fade-section');
const appearObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      appearObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeSections.forEach(section => appearObserver.observe(section));

/* ============================
   EmailJS Initialization
============================= */
if (window.emailjs) {
  emailjs.init("rgJiaabQfCfMpGz3t");
}

/* ============================
   Hamburger Menu Logic
============================= */
const desktopHamburger = document.querySelector(".desktop-hamburger");
const adminDropdown = document.querySelector(".admin-dropdown");
const mobileHamburger = document.querySelector(".mobile-hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

function toggleAdminDropdown() {
  desktopHamburger.classList.toggle("active");
  adminDropdown.classList.toggle("hidden");
}

desktopHamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  toggleAdminDropdown();
});
desktopHamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleAdminDropdown();
  }
});

document.addEventListener("click", (e) => {
  if (!adminDropdown.contains(e.target) && !desktopHamburger.contains(e.target)) {
    adminDropdown.classList.add("hidden");
    desktopHamburger.classList.remove("active");
  }
});

function toggleMobileMenu() {
  mobileHamburger.classList.toggle("active");
  mobileMenu.classList.toggle("hidden");
}

mobileHamburger.addEventListener("click", toggleMobileMenu);
mobileHamburger.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    toggleMobileMenu();
  }
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileHamburger.classList.remove("active");
  });
});

/* ============================
   Chat Widget Logic
============================= */
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector(".collapsed-content");
const changeInfo = document.getElementById("change-info");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot", "typing");
  typing.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

chatBubble.addEventListener("click", (e) => {
  const interactive = e.target.closest("#chat-form") ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "BUTTON";

  if (interactive) return;

  const expanded = chatBubble.classList.contains("expanded");

  if (expanded) {
    chatBubble.classList.remove("expanded");
    chatBubble.classList.add("collapsed");
    chatHeader.classList.add("hidden");
    chatWindow.classList.add("hidden");
    chatForm.classList.add("hidden");
    collapsedContent.classList.remove("hidden");
  } else {
    chatBubble.classList.remove("collapsed");
    chatBubble.classList.add("expanded");
    chatHeader.classList.remove("hidden");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    collapsedContent.classList.add("hidden");
    userInput.focus();

    if (chatWindow.children.length === 0) {
      addMessage("👋 Hi there! I’m Joel’s assistant bot. You can leave your name, email, and message, and Joel will get back to you shortly.", "bot");
    }
  }
});

if (chatForm) {
  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");

  const savedName = localStorage.getItem("chatUserName");
  const savedEmail = localStorage.getItem("chatUserEmail");

  if (savedName && savedEmail) {
    nameInput.value = savedName;
    emailInput.value = savedEmail;
    nameInput.style.display = "none";
    emailInput.style.display = "none";
    changeInfo.classList.remove("hidden");
  }

  changeInfo.addEventListener("click", () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");

    nameInput.style.display = "block";
    emailInput.style.display = "block";
    changeInfo.classList.add("hidden");

    addMessage("✏️ You can now update your name and email.", "bot");
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg = userInput.value.trim();

    if (!name || !email || !msg) {
      addMessage("⚠️ Please fill in your name, email, and message before sending.", "bot");
      return;
    }

    localStorage.setItem("chatUserName", name);
    localStorage.setItem("chatUserEmail", email);

    nameInput.style.display = "none";
    emailInput.style.display = "none";
    changeInfo.classList.remove("hidden");

    addMessage(msg, "user");
    userInput.value = "";

    const typing = showTypingIndicator();
    const submitBtn = chatForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    if (!window.emailjs) {
      typing.remove();
      submitBtn.disabled = false;
      addMessage("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
      return;
    }

    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: name,
      from_email: email,
      message: msg,
    })
      .then(() => {
        setTimeout(() => {
          typing.remove();
          submitBtn.disabled = false;
          addMessage(`✅ Thanks ${name}! Your message has been sent. I’ll get back to you at ${email}.`, "bot");
        }, 900);
      })
      .catch(() => {
        typing.remove();
        submitBtn.disabled = false;
        addMessage("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
      });
  });
}

/* ============================
   FREE CONSULTATION FORM
   Reuses the same EmailJS service/template as the chat
   widget (from_name / from_email / message) so it works
   without extra setup — phone & service type are folded
   into the message body. Swap in a dedicated template
   later if you'd like separate, structured fields.
============================= */
const consultForm = document.getElementById("consult-form");

if (consultForm) {
  const statusBox = document.getElementById("consult-status");

  function showConsultStatus(text, type) {
    statusBox.textContent = text;
    statusBox.className = type; // "success" or "error"
    statusBox.classList.remove("hidden");
  }

  consultForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("consult-name").value.trim();
    const email = document.getElementById("consult-email").value.trim();
    const phone = document.getElementById("consult-phone").value.trim();
    const service = document.getElementById("consult-service").value;
    const details = document.getElementById("consult-message").value.trim();

    if (!name || !email || !service || !details) {
      showConsultStatus("⚠️ Please fill in your name, email, service and a few details.", "error");
      return;
    }

    const composedMessage =
      `Free consultation request\n` +
      `Service: ${service}\n` +
      (phone ? `Phone: ${phone}\n` : "") +
      `Details: ${details}`;

    const submitBtn = consultForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    showConsultStatus("Sending your request…", "success");

    if (!window.emailjs) {
      submitBtn.disabled = false;
      showConsultStatus("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com", "error");
      return;
    }

    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: name,
      from_email: email,
      message: composedMessage,
    })
      .then(() => {
        submitBtn.disabled = false;
        showConsultStatus(`✅ Thanks ${name}! I've received your request and will reply at ${email} within one business day.`, "success");
        consultForm.reset();
      })
      .catch(() => {
        submitBtn.disabled = false;
        showConsultStatus("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com", "error");
      });
  });
}

/* ============================
   DARK / LIGHT MODE TOGGLE
   Defaults to the visitor's system preference
   the first time they land on the site.
============================= */
const toggleTheme = document.getElementById("dark-toggle");
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const startDark = savedTheme ? savedTheme === "dark" : prefersDark;

document.body.classList.add(startDark ? "dark" : "light");
toggleTheme.checked = startDark;

toggleTheme.addEventListener("change", () => {
  if (toggleTheme.checked) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
  }
  updateNavbarBackground();
});

/* ============================
   FADE & RIPPLE EFFECTS ON TOGGLE
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const fade = document.createElement("div");
  fade.className = "page-fade";
  document.body.appendChild(fade);

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);

  toggleTheme.addEventListener("change", (e) => {
    fade.style.opacity = "1";
    setTimeout(() => (fade.style.opacity = "0"), 300);

    const rect = e.target.nextElementSibling.getBoundingClientRect();
    ripple.style.left = rect.left + rect.width / 2 + "px";
    ripple.style.top = rect.top + rect.height / 2 + "px";

    ripple.classList.add("active");
    setTimeout(() => ripple.classList.remove("active"), 600);
  });

  updateNavbarBackground();
});

/* ============================================================
   PROJECT CAROUSEL
   - Desktop/tablet (>900px): JS-driven, 2 cards per slide,
     arrows disable at the ends, gentle autoplay that pauses
     on hover/focus and respects reduced-motion.
   - Mobile (<=900px): native horizontal scroll-snap (CSS),
     JS just keeps the dot indicators in sync.
=============================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".project-carousel");
  const track = document.querySelector(".carousel-track");
  if (!carousel || !track) return;

  const cards = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-arrow.right");
  const prevButton = document.querySelector(".carousel-arrow.left");
  const dotsContainer = document.querySelector(".carousel-dots");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let autoplayId = null;

  const isMobile = () => window.innerWidth <= 900;
  const cardsPerSlide = () => (window.innerWidth <= 768 ? 1 : 2);

  // ---- Dots (mobile only) ----
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dotsContainer.appendChild(dot);
  });
  const dots = Array.from(dotsContainer.children);

  function setActiveDot(i) {
    dots.forEach((d, di) => d.classList.toggle("active", di === i));
  }

  let scrollTimeout;
  track.addEventListener("scroll", () => {
    if (!isMobile()) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cardWidth = cards[0].getBoundingClientRect().width + 12; // + gap
      const nearest = Math.round(track.scrollLeft / cardWidth);
      setActiveDot(Math.min(nearest, dots.length - 1));
    }, 100);
  });

  // ---- Desktop/tablet transform-based paging ----
  function maxIndex() {
    return Math.max(cards.length - cardsPerSlide(), 0);
  }

  function updateArrowState() {
    if (!prevButton || !nextButton) return;
    prevButton.disabled = index <= 0;
    nextButton.disabled = index >= maxIndex();
  }

  function updateSlider() {
    if (isMobile()) return; // native scroll handles it
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 19.2; // matches 1.2rem gap
    track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
    updateArrowState();
  }

  function goNext() {
    index = Math.min(index + cardsPerSlide(), maxIndex());
    updateSlider();
  }

  function goPrev() {
    index = Math.max(index - cardsPerSlide(), 0);
    updateSlider();
  }

  nextButton.addEventListener("click", () => { goNext(); restartAutoplay(); });
  prevButton.addEventListener("click", () => { goPrev(); restartAutoplay(); });

  function startAutoplay() {
    if (prefersReducedMotion || isMobile()) return;
    autoplayId = setInterval(() => {
      if (index >= maxIndex()) {
        index = 0;
      } else {
        index += cardsPerSlide();
      }
      updateSlider();
    }, 7000);
  }

  function stopAutoplay() {
    clearInterval(autoplayId);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      index = Math.min(index, maxIndex());
      if (isMobile()) {
        track.style.transform = "none";
        stopAutoplay();
      } else {
        updateSlider();
        startAutoplay();
      }
    }, 150);
  });

  if (!isMobile()) {
    updateSlider();
    startAutoplay();
  }
});

~~~{"variant":"standard","title":"Updated JS with Mobile Carousel","id":"49202"}
/* ============================
   Smooth Scroll for Navigation
============================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================
   Navbar Background on Scroll
============================= */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.background = 'rgba(11, 12, 16, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(20,20,20,0.95)';
    navbar.style.boxShadow = 'none';
  }
});

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
emailjs.init("rgJiaabQfCfMpGz3t");

/* ============================
   Hamburger Menu Logic
============================= */
const desktopHamburger = document.querySelector(".desktop-hamburger");
const adminDropdown = document.querySelector(".admin-dropdown");
const mobileHamburger = document.querySelector(".mobile-hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

desktopHamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  desktopHamburger.classList.toggle("active");
  adminDropdown.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!adminDropdown.contains(e.target) && !desktopHamburger.contains(e.target)) {
    adminDropdown.classList.add("hidden");
    desktopHamburger.classList.remove("active");
  }
});

mobileHamburger.addEventListener("click", () => {
  mobileHamburger.classList.toggle("active");
  mobileMenu.classList.toggle("hidden");
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

/* ============================
   DARK / LIGHT MODE TOGGLE
============================= */
const toggleTheme = document.getElementById("dark-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggleTheme.checked = true;
} else {
  document.body.classList.add("light");
}

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
});

/* ============================
   FADE & RIPPLE EFFECTS
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dark-toggle");

  const fade = document.createElement("div");
  fade.className = "page-fade";
  document.body.appendChild(fade);

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);

  toggle.addEventListener("change", (e) => {
    fade.style.opacity = "1";
    setTimeout(() => (fade.style.opacity = "0"), 300);

    const rect = e.target.getBoundingClientRect();
    ripple.style.left = rect.left + rect.width / 2 + "px";
    ripple.style.top = rect.top + rect.height / 2 + "px";

    ripple.classList.add("active");
    setTimeout(() => ripple.classList.remove("active"), 600);
  });
});

/* ============================
   PROJECT CAROUSEL (Desktop + Mobile)
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-arrow.right");
  const prevButton = document.querySelector(".carousel-arrow.left");

  const isMobile = window.innerWidth < 900;

  if (isMobile) {
    // Stop all JS-based sliding
    track.style.transform = "none";
    track.style.transition = "none";

    // Remove arrow buttons
    nextButton?.remove();
    prevButton?.remove();

    // Allow native scroll behavior
    return;
  }

  let index = 0;
  const slidesToShow = 2;

  function updateSlider() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  nextButton.addEventListener("click", () => {
    if (index < slides.length - slidesToShow) {
      index += slidesToShow;
      updateSlider();
    }
  });

  prevButton.addEventListener("click", () => {
    if (index > 0) {
      index -= slidesToShow;
      updateSlider();
    }
  });
});
~~~

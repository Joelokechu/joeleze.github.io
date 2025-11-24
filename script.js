document.addEventListener("DOMContentLoaded", () => {
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
typing.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;
chatWindow.appendChild(typing);
chatWindow.scrollTop = chatWindow.scrollHeight;
return typing;
}

chatBubble.addEventListener("click", (e) => {
const interactive = e.target.closest("#chat-form") || e.target.tagName === "INPUT" || e.target.tagName === "BUTTON";
if (interactive) return;

```
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
```

});

if (chatForm) {
const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const savedName = localStorage.getItem("chatUserName");
const savedEmail = localStorage.getItem("chatUserEmail");

```
if (savedName && savedEmail) {
  nameInput.value = savedName;
  emailInput.value = savedEmail;
  nameInput.style.display = "none";
  emailInput.style.display = "none";
  changeInfo.classList.remove("hidden");
  setTimeout(() => changeInfo.classList.add("visible"), 40);
}

changeInfo.addEventListener("click", () => {
  localStorage.removeItem("chatUserName");
  localStorage.removeItem("chatUserEmail");
  nameInput.style.display = "block";
  emailInput.style.display = "block";
  changeInfo.classList.remove("visible");
  setTimeout(() => changeInfo.classList.add("hidden"), 250);
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
  setTimeout(() => changeInfo.classList.add("visible"), 40);
  addMessage(msg, "user");
  userInput.value = "";
  const typing = showTypingIndicator();
  emailjs.send("service_71fb2en", "template_56f6p8n", { from_name: name, from_email: email, message: msg })
    .then(() => setTimeout(() => { typing.remove(); addMessage(`✅ Thanks ${name}! Your message has been sent. I’ll get back to you at ${email}.`, "bot"); }, 900))
    .catch(() => { typing.remove(); addMessage("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot"); });
});
```

}

/* ============================
DARK / LIGHT MODE TOGGLE
============================= */
const toggleTheme = document.getElementById("dark-toggle");
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") { document.body.classList.add("dark"); toggleTheme.checked = true; }
else { document.body.classList.add("light"); }
toggleTheme.addEventListener("change", () => {
if (toggleTheme.checked) { document.body.classList.remove("light"); document.body.classList.add("dark"); localStorage.setItem("theme", "dark"); }
else { document.body.classList.remove("dark"); document.body.classList.add("light"); localStorage.setItem("theme", "light"); }
});

/* ============================
FADE & RIPPLE EFFECTS
============================= */
const fade = document.createElement("div"); fade.className = "page-fade"; document.body.appendChild(fade);
const ripple = document.createElement("div"); ripple.className = "ripple"; document.body.appendChild(ripple);
toggleTheme.addEventListener("change", (e) => {
fade.style.opacity = "1"; setTimeout(() => (fade.style.opacity = "0"), 300);
const rect = e.target.getBoundingClientRect();
ripple.style.left = rect.left + rect.width / 2 + "px";
ripple.style.top = rect.top + rect.height / 2 + "px";
ripple.classList.add("active"); setTimeout(() => ripple.classList.remove("active"), 600);
});

/* ============================
ENHANCED CAROUSEL (Infinite + Fade + Drag)
============================= */
const carouselTrack = document.querySelector(".carousel-track");
if (carouselTrack) {
let slides = Array.from(carouselTrack.children);
const nextButton = document.querySelector(".carousel-arrow.right");
const prevButton = document.querySelector(".carousel-arrow.left");
let currentIndex = 0;
carouselTrack.style.transition = "transform 0.5s ease, opacity 0.5s ease";

```
const slidesPerView = () => window.innerWidth <= 768 ? 1 : 2;
const slideWidth = () => slides[0].getBoundingClientRect().width;

const updateCarousel = () => {
  carouselTrack.style.opacity = "0";
  requestAnimationFrame(() => {
    carouselTrack.style.transform = `translateX(-${slideWidth() * currentIndex}px)`;
    carouselTrack.style.opacity = "1";
  });
};

const nextSlide = () => { const max = slides.length - slidesPerView(); currentIndex += slidesPerView(); if (currentIndex > max) currentIndex = 0; updateCarousel(); };
const prevSlide = () => { const max = slides.length - slidesPerView(); currentIndex -= slidesPerView(); if (currentIndex < 0) currentIndex = max; updateCarousel(); };

nextButton?.addEventListener("click", nextSlide);
prevButton?.addEventListener("click", prevSlide);

window.addEventListener("resize", () => { const max = slides.length - slidesPerView(); if (currentIndex > max) currentIndex = max; updateCarousel(); });
updateCarousel();

// Drag support (touch + mouse)
let startX = 0, isDragging = false, currentTranslate = 0, prevTranslate = 0;
const setTrackTransform = (translate) => { carouselTrack.style.transition = "none"; carouselTrack.style.transform = `translateX(${translate}px)`; };
const dragStart = (x) => { startX = x; isDragging = true; prevTranslate = -slideWidth() * currentIndex; };
const dragMove = (x) => { if (!isDragging) return; currentTranslate = prevTranslate + (x - startX); setTrackTransform(currentTranslate); };
const dragEnd = (x) => { if (!isDragging) return; isDragging = false; carouselTrack.style.transition = "transform 0.5s ease, opacity 0.5s ease"; const deltaX = x - startX; if (deltaX > 50) prevSlide(); else if (deltaX < -50) nextSlide(); else updateCarousel(); };

carouselTrack.addEventListener("touchstart", (e) => dragStart(e.touches[0].clientX));
carouselTrack.addEventListener("touchmove", (e) => dragMove(e.touches[0].clientX));
carouselTrack.addEventListener("touchend", (e) => dragEnd(e.changedTouches[0].clientX));
carouselTrack.addEventListener("mousedown", (e) => { e.preventDefault(); dragStart(e.clientX); });
carouselTrack.addEventListener("mousemove", (e) => dragMove(e.clientX));
carouselTrack.addEventListener("mouseup", (e) => dragEnd(e.clientX));
carouselTrack.addEventListener("mouseleave", (e) => { if (isDragging) dragEnd(e.clientX); });
```

}
});

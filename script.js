// === Smooth Scroll ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// === Navbar Scroll Effect ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 80
    ? 'rgba(11, 12, 16, 0.95)'
    : 'rgba(20, 20, 20, 0.95)';
});

// === Hamburger Menu Toggle ===
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// === Fade-in on Scroll ===
const fadeSections = document.querySelectorAll('.fade-section');
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    obs.unobserve(entry.target);
  });
}, { threshold: 0.2 });
fadeSections.forEach(s => observer.observe(s));

// === EmailJS Init ===
emailjs.init("rgJiaabQfCfMpGz3t");

// === Chat Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const closeChat = document.getElementById("close-chat");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// === Toggle Chat ===
chatHeader.addEventListener("click", () => {
  if (chatBubble.classList.contains("collapsed")) {
    chatBubble.classList.remove("collapsed");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    closeChat.classList.remove("hidden");
  }
});

closeChat.addEventListener("click", (e) => {
  e.stopPropagation();
  chatBubble.classList.add("collapsed");
  chatWindow.classList.add("hidden");
  chatForm.classList.add("hidden");
  closeChat.classList.add("hidden");
});

// === Send Message ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  addMessage("⏳ Sending...", "bot");

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: "Website Visitor",
    message: message
  })
  .then(() => {
    addMessage("✅ Thanks! Your message has been sent. I’ll get back to you soon.", "bot");
  })
  .catch(() => {
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

// === Navbar Background Change on Scroll ===
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.background = 'rgba(11, 12, 16, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.5)';
  } else {
    navbar.style.background = 'rgba(20, 20, 20, 0.95)';
    navbar.style.boxShadow = 'none';
  }
});

// === Fade-in Animation ===
const fadeSections = document.querySelectorAll('.fade-section');
const appearOptions = { threshold: 0.18, rootMargin: "0px 0px -40px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);
fadeSections.forEach(section => appearOnScroll.observe(section));

// === Initialize EmailJS ===
emailjs.init("rgJiaabQfCfMpGz3t");

// === Chat Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector(".collapsed-content");
const chatHeader = chatBubble.querySelector(".chat-header");

// === Prevent Event Bubbling Inside Chat ===
if (chatForm) {
  chatForm.addEventListener("click", e => e.stopPropagation());
  userInput.addEventListener("click", e => e.stopPropagation());
}

// === Toggle Chat Open/Close ===
chatBubble.addEventListener("click", (e) => {
  const clickedInsideForm = e.target.closest("#chat-form");
  if (clickedInsideForm) return; // Don’t toggle when clicking inside form

  const isExpanded = chatBubble.classList.contains("expanded");

  if (isExpanded) {
    chatBubble.classList.remove("expanded");
    chatBubble.classList.add("collapsed");
    chatWindow.classList.add("hidden");
    chatForm.classList.add("hidden");
    chatHeader.classList.add("hidden");
    collapsedContent.classList.remove("hidden");
  } else {
    chatBubble.classList.remove("collapsed");
    chatBubble.classList.add("expanded");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    chatHeader.classList.remove("hidden");
    collapsedContent.classList.add("hidden");
    userInput.focus();
  }
});

// === Add Message Helper ===
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msg;
}

// === Typing Indicator ===
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.classList.add("message", "bot", "typing");
  typingDiv.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typingDiv;
}

// === Remove Element Smoothly ===
function fadeOutAndRemove(el, duration = 400) {
  el.style.transition = `opacity ${duration}ms ease`;
  el.style.opacity = 0;
  setTimeout(() => el.remove(), duration);
}

// === EmailJS Submission ===
if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent closing

    const message = userInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, "user");
    userInput.value = "";

    // Typing indicator
    const typingIndicator = showTypingIndicator();

    // Send message via EmailJS
    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: "Website Visitor",
      from_email: "visitor@insightsbyjoel.com",
      message: message
    }).then(() => {
      setTimeout(() => {
        fadeOutAndRemove(typingIndicator);
        addMessage("✅ Thanks! Your message has been sent. I’ll get back to you soon.", "bot");
      }, 1000);
    }).catch(err => {
      console.error("EmailJS error:", err);
      fadeOutAndRemove(typingIndicator);
      addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
    });
  });
}

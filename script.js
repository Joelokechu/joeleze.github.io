// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(anchor.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 80 ? 'rgba(11, 12, 16, 0.95)' : 'rgba(20, 20, 20, 0.95)';
});

// Fade-in on scroll
const faders = document.querySelectorAll('.about, .projects, .contact, .project-card');
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.2 });
faders.forEach(fader => appearOnScroll.observe(fader));

// Initialize EmailJS
emailjs.init("rgJiaabQfCfMpGz3t");

// Chat bubble toggle
const chatBubble = document.getElementById("chat-bubble");
chatBubble.addEventListener("click", () => {
  chatBubble.classList.toggle("collapsed");
});

// Chat functionality
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  addMessage("⏳ Sending...", "bot");

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: "Website Visitor",
    from_email: "visitor@insightsbyjoel.com",
    message
  })
  .then(() => {
    chatWindow.lastChild.remove();
    addMessage("✅ Thanks! Your message has been sent. I’ll get back to you soon.", "bot");
  })
  .catch(() => {
    chatWindow.lastChild.remove();
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

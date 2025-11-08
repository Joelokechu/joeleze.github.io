// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Navbar on Scroll
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

// Initialize EmailJS
(function(){
  emailjs.init("rgJiaabQfCfMpGz3t");
})();

// Chat toggle
const chatHeader = document.getElementById("chat-header");
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");

chatHeader.addEventListener("click", () => {
  const hidden = chatWindow.classList.contains("hidden");
  chatWindow.classList.toggle("hidden", !hidden);
  chatForm.classList.toggle("hidden", !hidden);
});

// Form submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name-input").value.trim();
  const email = document.getElementById("email-input").value.trim();
  const message = document.getElementById("user-input").value.trim();

  if (!name || !email || !message) return;

  addMessage(message, "user");
  chatForm.reset();

  // Typing animation
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.innerHTML = "<span></span><span></span><span></span>";
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: name,
    from_email: email,
    message: message
  })
  .then(() => {
    setTimeout(() => {
      typingIndicator.remove();
      addMessage("Thanks for your message! I’ll reply soon via email 📬", "bot");
    }, 1500);
  })
  .catch(() => {
    typingIndicator.remove();
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// Message display
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// Navbar on Scroll
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

// Initialize EmailJS
(function(){
  emailjs.init("rgJiaabQfCfMpGz3t");
})();

// Chat toggle
const chatHeader = document.getElementById("chat-header");
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");

chatHeader.addEventListener("click", () => {
  const hidden = chatWindow.classList.contains("hidden");
  chatWindow.classList.toggle("hidden", !hidden);
  chatForm.classList.toggle("hidden", !hidden);
});

// Form submission
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name-input").value.trim();
  const email = document.getElementById("email-input").value.trim();
  const message = document.getElementById("user-input").value.trim();

  if (!name || !email || !message) return;

  addMessage(message, "user");
  chatForm.reset();

  // Typing animation
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("typing-indicator");
  typingIndicator.innerHTML = "<span></span><span></span><span></span>";
  chatWindow.appendChild(typingIndicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: name,
    from_email: email,
    message: message
  })
  .then(() => {
    setTimeout(() => {
      typingIndicator.remove();
      addMessage("Thanks for your message! I’ll reply soon via email 📬", "bot");
    }, 1500);
  })
  .catch(() => {
    typingIndicator.remove();
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// Message display
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

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

// === Chat Bubble Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector('.collapsed-content');

// === Chat Toggle Behavior ===
chatBubble.addEventListener('click', (e) => {
  const isExpanded = chatBubble.classList.contains('expanded');
  const clickedInsideForm = e.target.closest('#chat-form') !== null;
  if (clickedInsideForm) return;

  if (isExpanded) {
    chatBubble.classList.remove('expanded');
    chatBubble.classList.add('collapsed');
    if (chatHeader) chatHeader.classList.add('hidden');
    if (chatWindow) chatWindow.classList.add('hidden');
    if (chatForm) chatForm.classList.add('hidden');
    if (collapsedContent) collapsedContent.classList.remove('hidden');
  } else {
    chatBubble.classList.remove('collapsed');
    chatBubble.classList.add('expanded');
    if (chatHeader) chatHeader.classList.remove('hidden');
    if (chatWindow) chatWindow.classList.remove('hidden');
    if (chatForm) chatForm.classList.remove('hidden');
    if (collapsedContent) collapsedContent.classList.add('hidden');
    if (userInput) userInput.focus();
  }
});

// === Helper: Add Message ===
function addMessage(text, sender, options = {}) {
  if (!chatWindow) return null;
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  if (options.loading) msgDiv.dataset.loading = 'true';
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}

// === Helper: Bot Typing Animation ===
function showTypingIndicator() {
  const typingDiv = document.createElement('div');
  typingDiv.classList.add('message', 'bot', 'typing');
  typingDiv.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  chatWindow.appendChild(typingDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typingDiv;
}

// === Fade-out helper ===
function fadeOutAndRemove(element, duration = 400) {
  element.style.transition = `opacity ${duration}ms ease`;
  element.style.opacity = 0;
  setTimeout(() => {
    if (element.parentNode) element.remove();
  }, duration);
}

// === EmailJS Chat Form Submission ===
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Add user's message
    addMessage(message, 'user');
    userInput.value = '';

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    // Send via EmailJS
    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: "Website Visitor",
      from_email: "visitor@insightsbyjoel.com",
      message: message
    }).then(() => {
      setTimeout(() => {
        fadeOutAndRemove(typingIndicator, 400);
        addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.', 'bot');
      }, 1000);
    }).catch((err) => {
      console.error('EmailJS error:', err);
      fadeOutAndRemove(typingIndicator, 400);
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com', 'bot');
    });
  });
}

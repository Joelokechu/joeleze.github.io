// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    // allow external or mailto links to behave normally
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

// === Fade-in using IntersectionObserver (CSS handles animation) ===
const fadeSections = document.querySelectorAll('.fade-section');
const appearOptions = { threshold: 0.18, rootMargin: "0px 0px -40px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);
fadeSections.forEach(s => appearOnScroll.observe(s));

// === Initialize EmailJS (public key included as requested) ===
emailjs.init("rgJiaabQfCfMpGz3t");

// === Chat Bubble Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header") || document.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Start collapsed. Toggle expanded/collapsed on click.
// When collapsed: clicking anywhere on the bubble expands it.
// When expanded: clicking on the header does nothing special (no 'X'); clicking the collapsed bar again will collapse.
chatBubble.addEventListener('click', (e) => {
  // If already expanded and click target is input or button inside form, don't toggle here.
  const isExpanded = chatBubble.classList.contains('expanded');
  const clickedInsideForm = e.target.closest('#chat-form') !== null;
  if (clickedInsideForm) return;

  if (isExpanded) {
    // Collapse
    chatBubble.classList.remove('expanded');
    chatBubble.classList.add('collapsed');
    if (chatWindow) chatWindow.classList.add('hidden');
    if (chatForm) chatForm.classList.add('hidden');
  } else {
    // Expand
    chatBubble.classList.remove('collapsed');
    chatBubble.classList.add('expanded');
    if (chatWindow) chatWindow.classList.remove('hidden');
    if (chatForm) chatForm.classList.remove('hidden');
    // focus input for convenience
    if (userInput) userInput.focus();
  }
});

// === Helper to add chat messages and keep a reference to any loading message ===
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

// === Chat Form Submission with EmailJS (keys included as requested) ===
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // display user's message
    addMessage(message, 'user');
    userInput.value = '';

    // display a single loading message and keep ref so we can remove/replace it
    const loadingMsg = addMessage('⏳ Sending...', 'bot', { loading: true });

    // send via EmailJS (service and template IDs included)
    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: "Website Visitor",
      from_email: "visitor@insightsbyjoel.com",
      message: message
    }).then((response) => {
      // remove loading message
      if (loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.', 'bot');
    }).catch((err) => {
      if (loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      console.error('EmailJS error:', err);
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com', 'bot');
    });
  });
}

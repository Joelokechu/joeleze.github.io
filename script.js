// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return; // allow external or mailto links
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

// === Fade-in Animation for Sections ===
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
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// === Chat Toggle Behavior with Click Outside Form ===
chatBubble.addEventListener('click', (e) => {
  const isExpanded = chatBubble.classList.contains('expanded');
  const clickedInsideForm = e.target.closest('#chat-form') !== null;
  if (clickedInsideForm) return;

  if (isExpanded) {
    // Collapse
    chatBubble.classList.remove('expanded');
    chatBubble.classList.add('collapsed');
    chatHeader.classList.add('hidden');
    chatWindow.classList.add('hidden');
    chatForm.classList.add('hidden');
  } else {
    // Expand
    chatBubble.classList.remove('collapsed');
    chatBubble.classList.add('expanded');
    chatHeader.classList.remove('hidden');
    chatWindow.classList.remove('hidden');
    chatForm.classList.remove('hidden');
    if (userInput) userInput.focus();
  }
});

// === Helper to Add Messages with Optional Typing Animation ===
function addMessage(text, sender, options = {}) {
  if (!chatWindow) return null;
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);

  if (options.loading) {
    msgDiv.dataset.loading = 'true';
    msgDiv.textContent = '⏳ Sending...';
  } else {
    msgDiv.textContent = text;
  }

  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return msgDiv;
}

// === EmailJS Chat Form Submission with Feedback ===
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Show user's message
    addMessage(message, 'user');
    userInput.value = '';

    // Show loading
    const loadingMsg = addMessage('', 'bot', { loading: true });

    // Send via EmailJS
    emailjs.send(
      "service_71fb2en",
      "template_56f6p8n",
      {
        from_name: "Website Visitor",
        from_email: "visitor@insightsbyjoel.com",
        message: message
      }
    ).then(() => {
      if (loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.', 'bot');
    }).catch((err) => {
      if (loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      console.error('EmailJS error:', err);
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com', 'bot');
    });
  });
}

// === Optional: Small subtle animation on chat bubble hover ===
chatBubble.addEventListener('mouseenter', () => {
  if (!chatBubble.classList.contains('expanded')) {
    chatBubble.style.transform = 'scale(1.05)';
  }
});
chatBubble.addEventListener('mouseleave', () => {
  chatBubble.style.transform = 'scale(1)';
});

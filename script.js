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
const collapsedContent = chatBubble.querySelector(".collapsed-content");
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// === Expand / Collapse Chat ===
chatBubble.addEventListener('click', (e) => {
  const clickedInsideForm = e.target.closest('#chat-form') !== null;
  if (clickedInsideForm) return;

  const isExpanded = chatBubble.classList.contains('expanded');

  if (isExpanded) {
    chatBubble.classList.remove('expanded');
    chatBubble.classList.add('collapsed');
    chatHeader.classList.add('hidden');
    chatWindow.classList.add('hidden');
    chatForm.classList.add('hidden');
    collapsedContent.classList.remove('hidden');

  } else {
    chatBubble.classList.remove('collapsed');
    chatBubble.classList.add('expanded');
    chatHeader.classList.remove('hidden');
    chatWindow.classList.remove('hidden');
    chatForm.classList.remove('hidden');
    collapsedContent.classList.add('hidden');

    if (userInput) userInput.focus();
  }
});

// === Helper to Add Messages ===
function addMessage(text, sender, options = {}) {
  if (!chatWindow) return null;

  // Remove existing bot typing placeholders
  if (sender === 'bot') {
    const existingTyping = chatWindow.querySelector('.message.bot[data-typing="true"]');
    if (existingTyping) existingTyping.remove();
  }

  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);

  if (options.typing) {
    msgDiv.textContent = '💬 Typing...';
    msgDiv.dataset.typing = 'true';
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    setTimeout(() => {
      msgDiv.textContent = text;
      msgDiv.removeAttribute('data-typing');
      chatWindow.scrollTop = chatWindow.scrollHeight;
    }, options.delay || 1200);

  } else {
    msgDiv.textContent = text;
    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  return msgDiv;
}

// === EmailJS Chat Form Submission ===
if (chatForm) {
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    // Show user's message
    addMessage(message, 'user');
    userInput.value = '';

    // Show typing animation for bot
    addMessage('', 'bot', { typing: true });

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
      addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.', 'bot', { delay: 600 });
    }).catch((err) => {
      console.error('EmailJS error:', err);
      addMessage('⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com', 'bot', { delay: 600 });
    });

    // Bubble stays open — does NOT collapse automatically
  });
}

// === Hover Animation for Chat Bubble ===
chatBubble.addEventListener('mouseenter', () => {
  if (!chatBubble.classList.contains('expanded')) {
    chatBubble.style.transform = 'scale(1.05)';
  }
});
chatBubble.addEventListener('mouseleave', () => {
  chatBubble.style.transform = 'scale(1)';
});

// === Accessibility: Toggle Chat with Enter Key ===
chatBubble.setAttribute('tabindex', '0'); // allow focus
chatBubble.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    chatBubble.click();
  }
});

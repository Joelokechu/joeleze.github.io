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
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector('.collapsed-content');
const changeInfo = document.getElementById("change-info");

// === Chat Toggle Behavior ===
let greeted = false;
chatBubble.addEventListener('click', (e) => {
  const isExpanded = chatBubble.classList.contains('expanded');
  const clickedInside = e.target.closest('#chat-form, #chat-window') !== null;
  if (clickedInside) return;

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
    userInput.focus();

    if (!greeted) {
      addMessage("👋 Hi there! I’m Joel’s assistant bot. Type your message below and I’ll make sure Joel sees it.", "bot");
      greeted = true;
    }
  }
});

// === Helper: Add Message ===
function addMessage(text, sender, options = {}) {
  if (!chatWindow) return null;
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
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

// === EmailJS Chat Form Submission ===
if (chatForm) {
  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");

  // Load saved info if available
  const savedName = localStorage.getItem("chatUserName");
  const savedEmail = localStorage.getItem("chatUserEmail");

  if (savedName && savedEmail) {
    nameInput.value = savedName;
    emailInput.value = savedEmail;
    nameInput.style.display = "none";
    emailInput.style.display = "none";
    changeInfo.classList.remove("hidden");
  }

  // === Reset info when clicking "Change Info" ===
  changeInfo.addEventListener('click', () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");
    nameInput.value = "";
    emailInput.value = "";
    nameInput.style.display = "block";
    emailInput.style.display = "block";
    changeInfo.classList.add("hidden");
    addMessage("✏️ You can now update your name and email.", "bot");
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = userInput.value.trim();

    if (!name || !email || !message) {
      addMessage('⚠️ Please fill in your name, email, and message before sending.', 'bot');
      return;
    }

    // Save user details after first submission
    if (!savedName || !savedEmail) {
      localStorage.setItem("chatUserName", name);
      localStorage.setItem("chatUserEmail", email);
      nameInput.style.display = "none";
      emailInput.style.display = "none";
      changeInfo.classList.remove("hidden");
    }

    addMessage(message, 'user');
    userInput.value = '';

    const typingIndicator = showTypingIndicator();

    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: name,
      from_email: email,
      message: message
    }).then(() => {
      setTimeout(() => {
        typingIndicator.remove();
        addMessage(`✅ Thanks ${name}! Your message has been sent. I’ll get back to you at ${email}.`, 'bot');
      }, 1000);
    }).catch((err) => {
      console.error('EmailJS error:', err);
      typingIndicator.remove();
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com', 'bot');
    });
  });
}

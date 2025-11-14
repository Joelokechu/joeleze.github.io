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

// === FADE-IN ANIMATION ===
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

// ======================================================
// === HAMBURGER MENU (show only “Admin Login”) =========
// ======================================================

const hamburger = document.getElementById("hamburger-menu");
const mobileMenu = document.getElementById("mobile-admin-menu");

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("show-admin-menu");
});

// Close menu if clicked outside
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove("show-admin-menu");
  }
});

// ======================================================
// === CHAT WIDGET ======================================
// ======================================================

const chatBubble = document.getElementById("chat-bubble");
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector('.collapsed-content');
const changeInfo = document.getElementById("change-info");

// Add message helper
function addMessage(text, sender) {
  if (!chatWindow) return;
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Typing indicator
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

// Toggle Chat
chatBubble.addEventListener("click", (e) => {
  const isFormClick =
    e.target.closest('#chat-form') ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "BUTTON";

  if (isFormClick) return;

  const isExpanded = chatBubble.classList.contains("expanded");

  if (isExpanded) {
    chatBubble.classList.remove("expanded");
    chatBubble.classList.add("collapsed");
    chatHeader.classList.add("hidden");
    chatWindow.classList.add("hidden");
    chatForm.classList.add("hidden");
    collapsedContent.classList.remove("hidden");
  } else {
    chatBubble.classList.add("expanded");
    chatBubble.classList.remove("collapsed");
    chatHeader.classList.remove("hidden");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    collapsedContent.classList.add("hidden");

    if (chatWindow.children.length === 0) {
      addMessage("👋 Hi! Leave your name, email & message. Joel will reply shortly.", "bot");
    }
  }
});

// EmailJS form logic
if (chatForm) {
  const nameInput = document.getElementById("user-name");
  const emailInput = document.getElementById("user-email");

  const savedName = localStorage.getItem("chatUserName");
  const savedEmail = localStorage.getItem("chatUserEmail");

  if (savedName && savedEmail) {
    nameInput.value = savedName;
    emailInput.value = savedEmail;
    nameInput.style.display = "none";
    emailInput.style.display = "none";
    changeInfo.classList.remove("hidden");
    setTimeout(() => changeInfo.classList.add("visible"), 50);
  }

  changeInfo.addEventListener("click", () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");
    nameInput.style.display = "block";
    emailInput.style.display = "block";
    changeInfo.classList.add("hidden");
    addMessage("✏️ Update your name and email.", "bot");
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = userInput.value.trim();

    if (!name || !email || !message) {
      addMessage("⚠️ Please fill all fields.", "bot");
      return;
    }

    if (!savedName || !savedEmail) {
      localStorage.setItem("chatUserName", name);
      localStorage.setItem("chatUserEmail", email);
      nameInput.style.display = "none";
      emailInput.style.display = "none";
      changeInfo.classList.remove("hidden");
      setTimeout(() => changeInfo.classList.add("visible"), 50);
    }

    addMessage(message, "user");
    userInput.value = "";

    const typing = showTypingIndicator();

    emailjs
      .send("service_71fb2en", "template_56f6p8n", {
        from_name: name,
        from_email: email,
        message: message,
      })
      .then(() => {
        setTimeout(() => {
          typing.remove();
          addMessage(`✅ Thanks ${name}! I’ll reply to ${email}.`, "bot");
        }, 1000);
      })
      .catch(() => {
        typing.remove();
        addMessage(
          "⚠️ Error! Please email me directly at Joel.okechu@gmail.com",
          "bot"
        );
      });
  });
}

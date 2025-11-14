/***********************
 * SMOOTH SCROLL
 ***********************/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith("#")) return;

    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  });
});


/***********************
 * NAVBAR SCROLL EFFECT
 ***********************/
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});


/***********************
 * MOBILE MENU TOGGLE
 ***********************/
const hamburger = document.getElementById("hamburger-menu");
const mobileMenu = document.getElementById("mobile-menu");

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open");
  });

  document.querySelectorAll(".mobile-link").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });
}


/***********************
 * FADE-IN SECTIONS
 ***********************/
const fadeSections = document.querySelectorAll(".fade-section");

const appearOptions = {
  threshold: 0.18,
  rootMargin: "0px 0px -40px 0px"
};

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

fadeSections.forEach(section => appearOnScroll.observe(section));


/***********************
 * INIT EMAILJS
 ***********************/
emailjs.init("rgJiaabQfCfMpGz3t");


/***********************
 * CHAT BUBBLE LOGIC
 ***********************/
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = chatBubble?.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble?.querySelector(".collapsed-content");
const changeInfo = document.getElementById("change-info");

/*** Add message helper */
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/*** Typing indicator helper */
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

/*** Toggle chat bubble */
chatBubble?.addEventListener("click", (e) => {
  const interactiveClick =
    e.target.closest("#chat-form") ||
    e.target.tagName === "INPUT" ||
    e.target.tagName === "BUTTON";

  if (interactiveClick) return;

  const expanded = chatBubble.classList.contains("expanded");

  if (expanded) {
    chatBubble.classList.remove("expanded");
    chatBubble.classList.add("collapsed");
    chatHeader?.classList.add("hidden");
    chatWindow?.classList.add("hidden");
    chatForm?.classList.add("hidden");
    collapsedContent?.classList.remove("hidden");
  } else {
    chatBubble.classList.remove("collapsed");
    chatBubble.classList.add("expanded");
    chatHeader?.classList.remove("hidden");
    chatWindow?.classList.remove("hidden");
    chatForm?.classList.remove("hidden");
    collapsedContent?.classList.add("hidden");
    userInput?.focus();

    if (chatWindow.children.length === 0) {
      addMessage(
        "👋 Hi there! I’m Joel’s assistant bot. Feel free to leave your name, email, and message — Joel will respond shortly.",
        "bot"
      );
    }
  }
});


/***********************
 * EMAILJS CHAT FORM
 ***********************/
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
    nameInput.value = "";
    emailInput.value = "";
    nameInput.style.display = "block";
    emailInput.style.display = "block";
    changeInfo.classList.remove("visible");
    setTimeout(() => changeInfo.classList.add("hidden"), 300);
    addMessage("✏️ You can now update your name and email.", "bot");
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = userInput.value.trim();

    if (!name || !email || !message) {
      addMessage("⚠️ Please fill in your name, email, and message.", "bot");
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

    const typingIndicator = showTypingIndicator();

    emailjs
      .send("service_71fb2en", "template_56f6p8n", {
        from_name: name,
        from_email: email,
        message: message
      })
      .then(() => {
        setTimeout(() => {
          typingIndicator.remove();
          addMessage(
            `✅ Thanks ${name}! Your message has been sent. I’ll reply to ${email}.`,
            "bot"
          );
        }, 1000);
      })
      .catch(() => {
        typingIndicator.remove();
        addMessage(
          "⚠️ Something went wrong. You can email me directly at Joel.okechu@gmail.com",
          "bot"
        );
      });
  });
}

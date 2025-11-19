/* ============================
   Smooth Scroll for Navigation
============================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ============================
   Navbar Background on Scroll
============================= */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.style.background = 'rgba(11,12,16,0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
  } else {
    navbar.style.background = 'rgba(20,20,20,0.95)';
    navbar.style.boxShadow = 'none';
  }
});

/* ============================
   Fade-in Section Animation
============================= */
const fadeSections = document.querySelectorAll('.fade-section');
const appearObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('appear');
      appearObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeSections.forEach(section => appearObserver.observe(section));

/* ============================
   EmailJS Initialization
============================= */
emailjs.init("rgJiaabQfCfMpGz3t");

/* ============================
   Hamburger Menu Logic
============================= */
const desktopHamburger = document.querySelector(".desktop-hamburger");
const adminDropdown = document.querySelector(".admin-dropdown");
const mobileHamburger = document.querySelector(".mobile-hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

desktopHamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  desktopHamburger.classList.toggle("active");
  adminDropdown.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
  if (!adminDropdown.contains(e.target) && !desktopHamburger.contains(e.target)) {
    adminDropdown.classList.add("hidden");
    desktopHamburger.classList.remove("active");
  }
});

mobileHamburger.addEventListener("click", () => {
  mobileHamburger.classList.toggle("active");
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileHamburger.classList.remove("active");
  });
});

/* ============================
   Chat Widget Logic
============================= */
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const collapsedContent = chatBubble.querySelector(".collapsed-content");
const changeInfo = document.getElementById("change-info");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showTypingIndicator() {
  const typing = document.createElement("div");
  typing.classList.add("message", "bot", "typing");
  typing.innerHTML = `
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  `;
  chatWindow.appendChild(typing);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return typing;
}

chatBubble.addEventListener("click", (e) => {
  const interactive = e.target.closest("#chat-form") ||
                      e.target.tagName === "INPUT" ||
                      e.target.tagName === "BUTTON";

  if (interactive) return;

  const expanded = chatBubble.classList.contains("expanded");

  if (expanded) {
    chatBubble.classList.remove("expanded");
    chatBubble.classList.add("collapsed");
    chatHeader.classList.add("hidden");
    chatWindow.classList.add("hidden");
    chatForm.classList.add("hidden");
    collapsedContent.classList.remove("hidden");
  } else {
    chatBubble.classList.remove("collapsed");
    chatBubble.classList.add("expanded");
    chatHeader.classList.remove("hidden");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    collapsedContent.classList.add("hidden");
    userInput.focus();

    if (chatWindow.children.length === 0) {
      addMessage("👋 Hi there! Leave your name, email, and message and Joel will get back to you.", "bot");
    }
  }
});

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
    setTimeout(() => changeInfo.classList.add("visible"), 40);
  }

  changeInfo.addEventListener("click", () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");

    nameInput.style.display = "block";
    emailInput.style.display = "block";

    changeInfo.classList.remove("visible");
    setTimeout(() => changeInfo.classList.add("hidden"), 250);

    addMessage("✏️ You can now update your name and email.", "bot");
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const msg = userInput.value.trim();

    if (!name || !email || !msg) {
      addMessage("⚠️ Please fill in your name, email, and message.", "bot");
      return;
    }

    localStorage.setItem("chatUserName", name);
    localStorage.setItem("chatUserEmail", email);

    nameInput.style.display = "none";
    emailInput.style.display = "none";
    changeInfo.classList.remove("hidden");
    setTimeout(() => changeInfo.classList.add("visible"), 40);

    addMessage(msg, "user");
    userInput.value = "";

    const typing = showTypingIndicator();

    emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: name,
      from_email: email,
      message: msg,
    })
      .then(() => {
        setTimeout(() => {
          typing.remove();
          addMessage(`✅ Thanks ${name}! Your message has been sent.`, "bot");
        }, 900);
      })
      .catch(() => {
        typing.remove();
        addMessage("⚠️ Something went wrong. Email me at Joel.okechu@gmail.com", "bot");
      });
  });
}

/* ============================
   DARK / LIGHT MODE MAIN LOGIC
============================= */
const toggleInput = document.getElementById("dark-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  body.classList.add("dark");
  toggleInput.checked = true;
} else {
  body.classList.add("light");
}

toggleInput.addEventListener("change", () => {
  if (toggleInput.checked) {
    body.classList.remove("light");
    body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    body.classList.remove("dark");
    body.classList.add("light");
    localStorage.setItem("theme", "light");
  }
});

/* ============================
   FADE & RIPPLE EFFECTS
============================= */
document.addEventListener("DOMContentLoaded", () => {
  const fade = document.createElement("div");
  fade.className = "page-fade";
  document.body.appendChild(fade);

  const ripple = document.createElement("div");
  ripple.className = "ripple";
  document.body.appendChild(ripple);

  toggleInput.addEventListener("change", (e) => {
    fade.style.opacity = "1";
    setTimeout(() => (fade.style.opacity = "0"), 300);

    const rect = e.target.getBoundingClientRect();
    ripple.style.left = rect.left + rect.width / 2 + "px";
    ripple.style.top = rect.top + rect.height / 2 + "px";

    ripple.classList.add("active");
    setTimeout(() => ripple.classList.remove("active"), 600);
  });
});

/* ============================
   PREMIUM TOGGLE INTERACTIONS
============================= */
const label = document.querySelector(".toggle-label");
const ball = document.querySelector(".toggle-ball");

/* ---- Magnetic Hover ---- */
label.addEventListener("mousemove", (e) => {
  const rect = label.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.min(Math.max(x / rect.width, 0), 1);

  const pull = (percent - 0.5) * 10; 
  ball.style.transform = `translateX(${toggleInput.checked ? 30 + pull : pull}px)`;
});

label.addEventListener("mouseleave", () => {
  ball.style.transform = `translateX(${toggleInput.checked ? 30 : 0}px)`;
});

/* ---- Glow Follows Ball ---- */
function updateGlow() {
  const ballRect = ball.getBoundingClientRect();
  const labelRect = label.getBoundingClientRect();
  const ballX = ballRect.left - labelRect.left;
  ball.style.setProperty("--glow-x", `${ballX}px`);
}

updateGlow();

toggleInput.addEventListener("change", () => {
  setTimeout(updateGlow, 160);
});

label.addEventListener("mousemove", updateGlow);
label.addEventListener("mouseleave", updateGlow);

/* ---- 3D Tilt Tracking ---- */
const track3D = (e) => {
  const rect = label.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = Math.min(Math.max(x / rect.width, 0), 1);

  ball.style.setProperty("--tilt", pct);
};

label.addEventListener("mousemove", track3D);
label.addEventListener("mouseleave", () => {
  ball.style.setProperty("--tilt", 0.5);
});

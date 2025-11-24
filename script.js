document.addEventListener("DOMContentLoaded", () => {
/* ============================
Smooth Scroll
============================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', e => {
const href = anchor.getAttribute('href');
if (!href.startsWith('#')) return;
e.preventDefault();
document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
});
});

/* ============================
Navbar Background
============================= */
const navbar = document.querySelector('.navbar');
if (navbar) {
window.addEventListener('scroll', () => {
const scrolled = window.scrollY > 80;
navbar.style.background = scrolled ? 'rgba(11,12,16,0.95)' : 'rgba(20,20,20,0.95)';
navbar.style.boxShadow = scrolled ? '0 2px 10px rgba(0,0,0,0.5)' : 'none';
});
}

/* ============================
Fade-in Sections
============================= */
const fadeSections = document.querySelectorAll('.fade-section');
if (fadeSections.length) {
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('appear');
observer.unobserve(entry.target);
}
});
}, { threshold: 0.2 });
fadeSections.forEach(sec => observer.observe(sec));
}

/* ============================
Dark/Light Toggle + Flash/Ripple
============================= */
const toggleTheme = document.getElementById("dark-toggle");
if (toggleTheme) {
const fade = document.createElement("div");
fade.className = "page-fade";
document.body.appendChild(fade);
const ripple = document.createElement("div");
ripple.className = "ripple";
document.body.appendChild(ripple);

```
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark");
  toggleTheme.checked = true;
} else {
  document.body.classList.add("light");
}

toggleTheme.addEventListener("change", (e) => {
  document.body.classList.toggle("dark", toggleTheme.checked);
  document.body.classList.toggle("light", !toggleTheme.checked);
  localStorage.setItem("theme", toggleTheme.checked ? "dark" : "light");

  fade.style.opacity = "1";
  setTimeout(() => fade.style.opacity = "0", 300);

  const rect = e.target.getBoundingClientRect();
  ripple.style.left = rect.left + rect.width / 2 + "px";
  ripple.style.top = rect.top + rect.height / 2 + "px";
  ripple.classList.add("active");
  setTimeout(() => ripple.classList.remove("active"), 600);
});
```

}

/* ============================
Hamburger Menu
============================= */
const desktopHamburger = document.querySelector(".desktop-hamburger");
const adminDropdown = document.querySelector(".admin-dropdown");
const mobileHamburger = document.querySelector(".mobile-hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

if (desktopHamburger && adminDropdown) {
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
}

if (mobileHamburger && mobileMenu) {
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
}

/* ============================
Carousel
============================= */
const track = document.querySelector(".carousel-track");
const prevButton = document.querySelector(".carousel-arrow.left");
const nextButton = document.querySelector(".carousel-arrow.right");

if (track && prevButton && nextButton) {
const slides = Array.from(track.children);
let currentIndex = 0;
const slidesPerView = () => window.innerWidth <= 768 ? 1 : 2;
const slideWidth = () => slides[0].getBoundingClientRect().width;

```
const updateCarousel = () => {
  track.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  track.style.opacity = "0";
  requestAnimationFrame(() => {
    track.style.transform = `translateX(-${slideWidth() * currentIndex}px)`;
    track.style.opacity = "1";
  });
};

const nextSlide = () => {
  const maxIndex = slides.length - slidesPerView();
  currentIndex += slidesPerView();
  if (currentIndex > maxIndex) currentIndex = 0;
  updateCarousel();
};
const prevSlide = () => {
  const maxIndex = slides.length - slidesPerView();
  currentIndex -= slidesPerView();
  if (currentIndex < 0) currentIndex = maxIndex;
  updateCarousel();
};

nextButton.addEventListener("click", nextSlide);
prevButton.addEventListener("click", prevSlide);

window.addEventListener("resize", () => {
  const maxIndex = slides.length - slidesPerView();
  if (currentIndex > maxIndex) currentIndex = maxIndex;
  updateCarousel();
});

updateCarousel();

// Drag support
let startX = 0, isDragging = false, currentTranslate = 0, prevTranslate = 0;
const setTransform = (translate) => {
  track.style.transition = "none";
  track.style.transform = `translateX(${translate}px)`;
};
const dragStart = (x) => { startX = x; isDragging = true; prevTranslate = -slideWidth() * currentIndex; };
const dragMove = (x) => { if (!isDragging) return; currentTranslate = prevTranslate + (x - startX); setTransform(currentTranslate); };
const dragEnd = (x) => {
  if (!isDragging) return;
  isDragging = false;
  track.style.transition = "transform 0.5s ease, opacity 0.5s ease";
  const deltaX = x - startX;
  if (deltaX > 50) prevSlide();
  else if (deltaX < -50) nextSlide();
  else updateCarousel();
};
track.addEventListener("touchstart", (e) => dragStart(e.touches[0].clientX));
track.addEventListener("touchmove", (e) => dragMove(e.touches[0].clientX));
track.addEventListener("touchend", (e) => dragEnd(e.changedTouches[0].clientX));
track.addEventListener("mousedown", (e) => { e.preventDefault(); dragStart(e.clientX); });
track.addEventListener("mousemove", (e) => dragMove(e.clientX));
track.addEventListener("mouseup", (e) => dragEnd(e.clientX));
track.addEventListener("mouseleave", (e) => { if (isDragging) dragEnd(e.clientX); });
```

}

/* ============================
Chat Widget
============================= */
const chatBubble = document.getElementById("chat-bubble");
if (chatBubble) {
const chatHeader = chatBubble.querySelector(".chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const nameInput = document.getElementById("user-name");
const emailInput = document.getElementById("user-email");
const changeInfo = document.getElementById("change-info");

```
const addMessage = (text, sender) => {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
};

chatBubble.addEventListener("click", (e) => {
  if (e.target.closest("#chat-form") || ["INPUT","BUTTON"].includes(e.target.tagName)) return;
  const expanded = chatBubble.classList.contains("expanded");
  if (expanded) {
    chatBubble.classList.replace("expanded","collapsed");
    chatHeader.classList.add("hidden");
    chatWindow.classList.add("hidden");
    chatForm.classList.add("hidden");
  } else {
    chatBubble.classList.replace("collapsed","expanded");
    chatHeader.classList.remove("hidden");
    chatWindow.classList.remove("hidden");
    chatForm.classList.remove("hidden");
    userInput.focus();
    if (chatWindow.children.length === 0) {
      addMessage("👋 Hi there! I’m Joel’s assistant bot. You can leave your name, email, and message, and Joel will get back to you shortly.","bot");
    }
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg = userInput.value.trim();
  if (!name || !email || !msg) { addMessage("⚠️ Please fill all fields before sending.","bot"); return; }

  localStorage.setItem("chatUserName", name);
  localStorage.setItem("chatUserEmail", email);

  addMessage(msg,"user");
  userInput.value="";

  // Send via EmailJS
  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: name,
    from_email: email,
    message: msg,
  }).then(() => {
    addMessage(`✅ Thanks ${name}! Your message has been sent. I’ll get back to you at ${email}.`,"bot");
  }).catch(() => {
    addMessage("⚠️ Something went wrong. Please email me directly at Joel.okechu@gmail.com","bot");
  });
});

// Load saved user info
const savedName = localStorage.getItem("chatUserName");
const savedEmail = localStorage.getItem("chatUserEmail");
if (savedName && savedEmail) {
  nameInput.value = savedName;
  emailInput.value = savedEmail;
  nameInput.style.display = "none";
  emailInput.style.display = "none";
  changeInfo.classList.remove("hidden");
  changeInfo.addEventListener("click", () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");
    nameInput.style.display = "block";
    emailInput.style.display = "block";
    changeInfo.classList.add("hidden");
    addMessage("✏️ You can now update your name and email.","bot");
  });
}
```

}

});

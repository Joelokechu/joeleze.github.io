// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// === Navbar background change on scroll ===
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

// === Fade-in animations ===
const faders = document.querySelectorAll('.about, .projects, .contact, .project-card');
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

const style = document.createElement('style');
style.innerHTML = `
  .about, .projects, .contact, .project-card {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease-out;
  }
  .appear { opacity:1; transform: translateY(0); }
`;
document.head.appendChild(style);

// === Initialize EmailJS ===
emailjs.init("rgJiaabQfCfMpGz3t");

// === Chat Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// === Toggle Chat visibility ===
chatHeader.addEventListener("click", () => {
  chatBubble.classList.toggle("collapsed");
  chatWindow.classList.toggle("hidden");
  chatForm.classList.toggle("hidden");
});

// === Chat form submission ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: "Website Visitor",
    from_email: "visitor@insightsbyjoel.com",
    message: message
  })
  .then(() => addMessage("✅ Thanks! Your message has been sent. I’ll get back to you soon.", "bot"))
  .catch(err => {
    console.error(err);
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// === Add message to chat window ===
function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

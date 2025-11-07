// === Smooth Scroll for Navigation Links ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// === Change Navbar Background on Scroll ===
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

// === Fade-in Animation on Scroll ===
const faders = document.querySelectorAll('.about, .projects, .contact, .project-card');

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// === Add Fade-in CSS Dynamically ===
const style = document.createElement('style');
style.innerHTML = `
  .about, .projects, .contact, .project-card {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s ease-out;
  }

  .appear {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

// === EmailJS Chat Integration ===
(function(){
  emailjs.init("rgJiaabQfCfMpGz3t"); // ✅ Your public key
})();

// Grab chat elements
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const userEmail = document.getElementById("user-email"); // if added for capturing visitor email

// === Toggle Chat Bubble Visibility ===
chatHeader.addEventListener("click", () => {
  chatWindow.classList.toggle("hidden");
  chatForm.classList.toggle("hidden");
});

// === Handle Chat Form Submission ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  const email = userEmail ? userEmail.value.trim() : "visitor@insightsbyjoel.com";

  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  if (userEmail) userEmail.value = "";

  // === Send message via EmailJS ===
  emailjs.send("service_rgJiaabQfCfMpGz3t", "template_56f6p8n", {
    user_message: message,
    user_email: joel.okechu@gmail.com
  })
  .then(() => {
    addMessage("✅ Thanks! Your message has been sent. I’ll get back to you soon.", "bot");
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// === Helper: Display Messages in Chat ===
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

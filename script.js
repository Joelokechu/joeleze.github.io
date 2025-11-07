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
const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => appearOnScroll.observe(fader));

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

// === EmailJS Setup ===
(function() {
  emailjs.init("rgJiaabQfCfMpGz3t"); // ✅ Your EmailJS public key
})();

// === Chat Elements ===
const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
chatBubble.classList.add("collapsed");


// === Add Name & Email Fields ===
chatForm.innerHTML = `
  <input type="text" id="from_name" placeholder="Your name..." required>
  <input type="email" id="from_email" placeholder="Your email..." required>
  <input type="text" id="user_message" placeholder="Type your message..." required>
  <button type="submit">Send</button>
`;

// === Toggle Chat Visibility ===
chatHeader.addEventListener("click", () => {
  chatWindow.classList.toggle("hidden");
  chatForm.classList.toggle("hidden");
});

// === Handle Chat Form Submission ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const fromName = document.getElementById("from_name").value.trim();
  const fromEmail = document.getElementById("from_email").value.trim();
  const message = document.getElementById("user_message").value.trim();

  if (!fromName || !fromEmail || !message) return;

  addMessage(`${fromName}: ${message}`, "user");

  // === Send to EmailJS ===
  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: fromName,
    from_email: fromEmail,
    message: message
  })
  .then(() => {
    addMessage("✅ Thanks, " + fromName + "! Your message has been sent. I’ll get back to you soon.", "bot");
    chatForm.reset();
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// === Helper: Add Chat Message ===
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

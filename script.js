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
const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);
faders.forEach(fader => { appearOnScroll.observe(fader); });

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

// === Initialize EmailJS ===
(function(){
  emailjs.init("rgJiaabQfCfMpGz3t"); // Your public key
})();

// === Chat Functionality ===
const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");
const chatHeader = document.getElementById("chat-header");
const chatBubble = document.getElementById("chat-bubble");

// Expand/collapse chat
chatHeader.addEventListener("click", () => {
  chatBubble.classList.toggle("collapsed");
  chatWindow.classList.toggle("hidden");
  chatForm.classList.toggle("hidden");
});

// === Add input fields for Name and Email dynamically ===
const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.id = "user-name";
nameInput.placeholder = "Your name";
nameInput.required = true;

const emailInput = document.createElement("input");
emailInput.type = "email";
emailInput.id = "user-email";
emailInput.placeholder = "Your email";
emailInput.required = true;

// Insert them at the top of the chat form
chatForm.insertBefore(emailInput, chatForm.firstChild);
chatForm.insertBefore(nameInput, chatForm.firstChild);

// === Handle message submission ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = document.getElementById("user-input").value.trim();

  if (!name || !email || !message) {
    addMessage("Please fill in all fields before sending.", "bot");
    return;
  }

  // Display user message
  addMessage(`💬 ${message}`, "user");
  document.getElementById("user-input").value = "";

  // Send via EmailJS
  emailjs.send("service_71fb2en", "template_56f6p8n", {
      from_name: name,
      from_email: email,
      message: message
  })
  .then(() => {
      addMessage(`✅ Thanks ${name}! Your message has been sent.`, "bot");
  })
  .catch((error) => {
      console.error(error);
      addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// === Helper to display messages ===
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatWindow.appendChild(msg);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

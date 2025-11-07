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
// Initialize EmailJS with your public key
(function(){
  emailjs.init("rgJiaabQfCfMpGz3t"); // Your public key
})();

// Grab form elements
const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // Show user message in chat window
  addMessage(message, "user");
  userInput.value = "";

  // Send message via EmailJS using your template
  emailjs.send("YOUR_SERVICE_ID_HERE", "template_56f6p8n", {
      from_name: "Website Visitor",
      from_email: "visitor@insightsbyjoel.com", // optional
      message: message
  })
  .then(() => {
      addMessage("Thanks! Your message has been sent ✅", "bot");
  }, (error) => {
      console.error(error);
      addMessage("Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

// Function to display messages
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


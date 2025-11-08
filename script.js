(function(){
  emailjs.init("rgJiaabQfCfMpGz3t"); // Your EmailJS public key
})();

const chatBubble = document.getElementById("chat-bubble");
const chatHeader = document.getElementById("chat-header");
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");

// === Save/Load Chat State ===
function setChatState(state) {
  localStorage.setItem("chatState", state);
}

function getChatState() {
  return localStorage.getItem("chatState");
}

window.addEventListener("DOMContentLoaded", () => {
  const savedState = getChatState();
  if (savedState === "expanded") {
    chatBubble.classList.remove("collapsed");
  }
});

// === Toggle Chat ===
chatBubble.addEventListener("click", () => {
  if (chatBubble.classList.contains("collapsed")) {
    chatBubble.classList.remove("collapsed");
    setChatState("expanded");
  }
});

chatHeader.addEventListener("click", (e) => {
  e.stopPropagation();
  chatBubble.classList.add("collapsed");
  setChatState("collapsed");
});

// === Add Message to Chat ===
function addMessage(text, sender) {
  const message = document.createElement("div");
  message.classList.add("message", sender);
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// === Handle Form Submission ===
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  
  const fromName = document.getElementById("from_name").value.trim();
  const fromEmail = document.getElementById("from_email").value.trim();
  const message = document.getElementById("user_message").value.trim();

  if (!fromName || !fromEmail || !message) return;

  addMessage(`${fromName}: ${message}`, "user");

  emailjs.send("service_71fb2en", "template_56f6p8n", {
    from_name: fromName,
    from_email: fromEmail,
    message: message,
  })
  .then(() => {
    addMessage(`✅ Thanks ${fromName}! Your message has been sent.`, "bot");
    chatForm.reset();
  })
  .catch((error) => {
    console.error("EmailJS Error:", error);
    addMessage("⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com", "bot");
  });
});

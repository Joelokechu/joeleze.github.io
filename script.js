// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if(el) el.scrollIntoView({ behavior:'smooth' });
  });
});

// Navbar background change
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll',()=>{
  if(window.scrollY>80){
    navbar.style.background='rgba(11,12,16,0.95)';
    navbar.style.boxShadow='0 2px 10px rgba(0,0,0,0.5)';
  }else{
    navbar.style.background='rgba(20,20,20,0.95)';
    navbar.style.boxShadow='none';
  }
});

// Fade-in sections
const fadeSections=document.querySelectorAll('.fade-section');
const observerOptions={threshold:0.18,rootMargin:"0px 0px -40px 0px"};
const observer=new IntersectionObserver((entries,obs)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('appear');
    obs.unobserve(entry.target);
  });
},observerOptions);
fadeSections.forEach(s=>observer.observe(s));

// Initialize EmailJS
emailjs.init("rgJiaabQfCfMpGz3t");

// Chat bubble toggle
const chatBubble=document.getElementById("chat-bubble");
const chatWindow=document.getElementById("chat-window");
const chatForm=document.getElementById("chat-form");
const userInput=document.getElementById("user-input");

chatBubble.addEventListener('click',(e)=>{
  const isExpanded=chatBubble.classList.contains('expanded');
  const clickedInsideForm=e.target.closest('#chat-form')!==null;
  if(clickedInsideForm) return;
  if(isExpanded){
    chatBubble.classList.remove('expanded'); chatBubble.classList.add('collapsed');
    chatWindow.classList.add('hidden'); chatForm.classList.add('hidden');
  }else{
    chatBubble.classList.remove('collapsed'); chatBubble.classList.add('expanded');
    chatWindow.classList.remove('hidden'); chatForm.classList.remove('hidden');
    if(userInput) userInput.focus();
  }
});

// Add chat messages
function addMessage(text,sender){
  if(!chatWindow) return;
  const msgDiv=document.createElement('div');
  msgDiv.classList.add('message',sender);
  msgDiv.textContent=text;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop=chatWindow.scrollHeight;
  return msgDiv;
}

// Chat form submission
if(chatForm){
  chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=userInput.value.trim();
    if(!message) return;
    addMessage(message,'user');
    userInput.value='';
    const loadingMsg=addMessage('⏳ Sending...','bot');
    emailjs.send("service_71fb2en","template_56f6p8n",{
      from_name:"Website Visitor",
      from_email:"visitor@insightsbyjoel.com",
      message:message
    }).then(()=>{
      if(loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.','bot');
    }).catch(err=>{
      if(loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      console.error('EmailJS error:',err);
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com','bot');
    });
  });
}

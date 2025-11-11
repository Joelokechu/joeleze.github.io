// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const href = this.getAttribute('href');
    if(!href.startsWith('#')) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll',()=>{
  if(window.scrollY>80){
    navbar.style.background='rgba(11,12,16,0.95)';
    navbar.style.boxShadow='0 2px 10px rgba(0,0,0,0.5)';
  } else{
    navbar.style.background='rgba(20,20,20,0.95)';
    navbar.style.boxShadow='none';
  }
});

// Fade-in sections
const fadeSections = document.querySelectorAll('.fade-section');
const appearOptions={threshold:0.18, rootMargin:"0px 0px -40px 0px"};
const appearOnScroll = new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.classList.add('appear');
    observer.unobserve(entry.target);
  });
}, appearOptions);
fadeSections.forEach(s=>appearOnScroll.observe(s));

// EmailJS
emailjs.init("rgJiaabQfCfMpGz3t");

// Chat bubble
const chatBubble=document.getElementById("chat-bubble");
const chatWindow=document.getElementById("chat-window");
const chatForm=document.getElementById("chat-form");
const userInput=document.getElementById("user-input");

// Toggle expanded/collapsed
chatBubble.addEventListener('click',(e)=>{
  const isExpanded=chatBubble.classList.contains('expanded');
  const clickedInsideForm = e.target.closest('#chat-form') !== null;
  if(clickedInsideForm) return;

  if(isExpanded){
    chatBubble.classList.remove('expanded');
    chatBubble.classList.add('collapsed');
    if(chatWindow) chatWindow.classList.add('hidden');
    if(chatForm) chatForm.classList.add('hidden');
  } else{
    chatBubble.classList.remove('collapsed');
    chatBubble.classList.add('expanded');
    if(chatWindow) chatWindow.classList.remove('hidden');
    if(chatForm) chatForm.classList.remove('hidden');
    if(userInput) userInput.focus();
  }
});

// Add messages
function addMessage(text,sender,options={}){
  if(!chatWindow) return null;
  const msgDiv=document.createElement('div');
  msgDiv.classList.add('message',sender);
  msgDiv.textContent=text;
  if(options.loading) msgDiv.dataset.loading='true';
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop=chatWindow.scrollHeight;
  return msgDiv;
}

// Chat form submit
if(chatForm){
  chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message=userInput.value.trim();
    if(!message) return;
    addMessage(message,'user');
    userInput.value='';
    const loadingMsg=addMessage('⏳ Sending...','bot',{loading:true});
    emailjs.send("service_71fb2en","template_56f6p8n",{
      from_name:"Website Visitor",
      from_email:"visitor@insightsbyjoel.com",
      message:message
    }).then((response)=>{
      if(loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      addMessage('✅ Thanks! Your message has been sent. I’ll get back to you soon.','bot');
    }).catch((err)=>{
      if(loadingMsg && loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
      console.error('EmailJS error:',err);
      addMessage('⚠️ Oops! Something went wrong. Please email me directly at Joel.okechu@gmail.com','bot');
    });
  });
}


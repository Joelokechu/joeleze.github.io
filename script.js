document.addEventListener("DOMContentLoaded", () => {

/* ============================
Smooth Scroll for Navigation
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
Navbar Scroll Background
============================= */
const navbar = document.querySelector('nav, .navbar');
if (navbar) {
window.addEventListener('scroll', () => {
navbar.style.background = window.scrollY > 80 ? 'rgba(11,12,16,0.95)' : 'rgba(20,20,20,0.95)';
navbar.style.boxShadow = window.scrollY > 80 ? '0 2px 10px rgba(0,0,0,0.5)' : 'none';
});
}

/* ============================
Fade-in Sections
============================= */
const fadeSections = document.querySelectorAll('.fade-section');
if (fadeSections.length) {
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if(entry.isIntersecting){ entry.target.classList.add('appear'); observer.unobserve(entry.target); }
});
}, { threshold: 0.2 });
fadeSections.forEach(sec => observer.observe(sec));
}

/* ============================
Dark/Light Toggle + Flash/Ripple
============================= */
const toggleTheme = document.querySelector('input[type="checkbox"]');
if (toggleTheme) {
const fade = document.createElement("div"); fade.className="page-fade"; document.body.appendChild(fade);
const ripple = document.createElement("div"); ripple.className="ripple"; document.body.appendChild(ripple);
const savedTheme = localStorage.getItem("theme");
if(savedTheme==="dark"){ document.body.classList.add("dark"); toggleTheme.checked=true; }
else document.body.classList.add("light");

```
toggleTheme.addEventListener("change", e => {
  document.body.classList.toggle("dark", toggleTheme.checked);
  document.body.classList.toggle("light", !toggleTheme.checked);
  localStorage.setItem("theme", toggleTheme.checked ? "dark" : "light");
  fade.style.opacity="1"; setTimeout(()=>fade.style.opacity="0",300);
  const rect=e.target.getBoundingClientRect();
  ripple.style.left=rect.left+rect.width/2+"px";
  ripple.style.top=rect.top+rect.height/2+"px";
  ripple.classList.add("active"); setTimeout(()=>ripple.classList.remove("active"),600);
});
```

}

/* ============================
Carousel (Infinite + Fade + Drag)
============================= */
const carouselTrack = document.querySelector(".carousel-track");
const prevBtn = document.querySelector('button[aria-label="Previous Project"]');
const nextBtn = document.querySelector('button[aria-label="Next Project"]');
if(carouselTrack && prevBtn && nextBtn){
const slides = Array.from(carouselTrack.children);
let currentIndex=0;
const slidesPerView=()=> window.innerWidth<=768?1:2;
const slideWidth=()=> slides[0].getBoundingClientRect().width;

```
const updateCarousel=()=>{
  carouselTrack.style.transition="transform 0.5s ease, opacity 0.5s ease";
  carouselTrack.style.opacity="0";
  requestAnimationFrame(()=>{carouselTrack.style.transform=`translateX(-${slideWidth()*currentIndex}px)`; carouselTrack.style.opacity="1";});
};

const nextSlide=()=>{ const max=slides.length-slidesPerView(); currentIndex+=slidesPerView(); if(currentIndex>max)currentIndex=0; updateCarousel(); };
const prevSlide=()=>{ const max=slides.length-slidesPerView(); currentIndex-=slidesPerView(); if(currentIndex<0)currentIndex=max; updateCarousel(); };

nextBtn.addEventListener("click",nextSlide);
prevBtn.addEventListener("click",prevSlide);
window.addEventListener("resize",()=>{ const max=slides.length-slidesPerView(); if(currentIndex>max)currentIndex=max; updateCarousel(); });
updateCarousel();

// Drag support
let startX=0,isDragging=false,currentTranslate=0,prevTranslate=0;
const setTransform=(translate)=>{ carouselTrack.style.transition="none"; carouselTrack.style.transform=`translateX(${translate}px)`; };
const dragStart=x=>{ startX=x; isDragging=true; prevTranslate=-slideWidth()*currentIndex; };
const dragMove=x=>{ if(!isDragging)return; currentTranslate=prevTranslate+(x-startX); setTransform(currentTranslate); };
const dragEnd=x=>{ if(!isDragging)return; isDragging=false; carouselTrack.style.transition="transform 0.5s ease, opacity 0.5s ease"; const deltaX=x-startX; if(deltaX>50) prevSlide(); else if(deltaX<-50) nextSlide(); else updateCarousel(); };

carouselTrack.addEventListener("touchstart",e=>dragStart(e.touches[0].clientX));
carouselTrack.addEventListener("touchmove",e=>dragMove(e.touches[0].clientX));
carouselTrack.addEventListener("touchend",e=>dragEnd(e.changedTouches[0].clientX));
carouselTrack.addEventListener("mousedown",e=>{ e.preventDefault(); dragStart(e.clientX); });
carouselTrack.addEventListener("mousemove",e=>dragMove(e.clientX));
carouselTrack.addEventListener("mouseup",e=>dragEnd(e.clientX));
carouselTrack.addEventListener("mouseleave",e=>{ if(isDragging) dragEnd(e.clientX); });
```

}

/* ============================
Chat Widget with Form
============================= */
const chatBtn = document.querySelector('button:contains("💬 Chat")') || document.querySelector('button');
const chatInputs = document.querySelectorAll('input[type="text"], input[type="email"]');
const chatSendBtn = document.querySelector('button:contains("Send")');

if(chatBtn && chatSendBtn && chatInputs.length >=3){
const chatWindow = document.createElement("div"); chatWindow.className="chat-window"; chatBtn.insertAdjacentElement("afterend",chatWindow);
chatBtn.addEventListener("click", ()=> chatWindow.classList.toggle("open"));

```
chatSendBtn.addEventListener("click", ()=>{
  const [nameInput,emailInput,msgInput]=chatInputs;
  const name=nameInput.value.trim();
  const email=emailInput.value.trim();
  const msg=msgInput.value.trim();
  if(!name||!email||!msg){ alert("Please fill in name, email, and message."); return; }

  chatWindow.innerHTML += `<div class="message user">${msg}</div>`;
  nameInput.value=""; emailInput.value=""; msgInput.value="";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
```

}

/* ============================
Hamburger Menu
============================= */
const hamburgerInput = document.querySelector('input[type="checkbox"]');
if(hamburgerInput){
hamburgerInput.addEventListener("change",()=>{
document.body.classList.toggle("menu-open", hamburgerInput.checked);
});
}

});

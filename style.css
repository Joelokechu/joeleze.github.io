/* === Global Reset === */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #0b0c10;
  color: #c5c6c7;
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
}

/* === Parallax Background === */
.parallax-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 120vh;
  background: radial-gradient(circle at 30% 20%, rgba(102, 252, 241, 0.06), transparent),
              radial-gradient(circle at 70% 80%, rgba(69, 162, 158, 0.06), transparent);
  z-index: -1;
  animation: parallaxMove 18s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes parallaxMove {
  from { transform: translateY(-18px); }
  to   { transform: translateY(18px); }
}

/* === Navbar === */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 6%;
  background: rgba(20, 20, 20, 0.95);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid #1f2833;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.logo {
  font-size: 1.4rem;
  color: #66fcf1;
  font-weight: 700;
}
.logo span {
  color: #45a29e;
}

/* === Nav Links === */
.nav-links {
  list-style: none;
  display: flex;
  gap: 1.4rem;
}
.nav-links a {
  text-decoration: none;
  color: #c5c6c7;
  font-weight: 600;
  transition: 0.25s;
}
.nav-links a:hover {
  color: #66fcf1;
}

/* ===========================================================
   HAMBURGER BUTTON (Right of CONTACT)
   =========================================================== */
.hamburger {
  background: none;
  border: none;
  color: #c5c6c7;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: 0.25s;
}

.hamburger:hover {
  color: #66fcf1;
}

/* ===========================================================
   HAMBURGER DROPDOWN MENU
   =========================================================== */
.hamburger-menu {
  position: absolute;
  top: 70px;
  right: 6%;
  background: #1f2833;
  border: 1px solid rgba(255,255,255,0.08);
  padding: 0.6rem 0;
  border-radius: 8px;
  min-width: 150px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  opacity: 0;
  transform: translateY(-10px);
  transition: 0.25s ease;
  pointer-events: none;
  z-index: 999;
}

.hamburger-menu.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.hamburger-menu a {
  display: block;
  padding: 0.7rem 1rem;
  color: #66fcf1;
  text-decoration: none;
  font-weight: 500;
  transition: 0.25s;
}

.hamburger-menu a:hover {
  background: rgba(102,252,241,0.1);
}

/* === Hero Section === */
.hero {
  min-height: 80vh;
  padding: 6rem 6%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-with-photo {
  display: flex;
  justify-content: space-between;
  gap: 4rem;
}

.hero-content h1 {
  font-size: 2.8rem;
  color: #fff;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.hero-photo img {
  width: 350px;
  height: 350px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #66fcf1;
  box-shadow: 0 0 25px rgba(102, 252, 241, 0.35);
  transition: 0.4s ease;
}

.hero-photo img:hover {
  box-shadow: 0 0 40px rgba(102, 252, 241, 0.55);
  transform: scale(1.02);
}

/* === Sections === */
section h2 {
  text-align: center;
  color: #66fcf1;
  margin-bottom: 1rem;
}

/* === Contact Card === */
.contact-card {
  background: #1f2833;
  padding: 2.2rem 3rem;
  border-radius: 12px;
  text-align: center;
}

/* === Footer === */
footer {
  text-align: center;
  padding: 2rem;
  color: #c5c6c7;
}

/* === Chat Bubble === */
#chat-bubble {
  position: fixed;
  bottom: 18px;
  right: 18px;
  z-index: 999;
}

.hidden {
  display: none !important;
}

/* =========== MOBILE RESPONSIVE =========== */
@media (max-width: 900px) {
  .hero-with-photo {
    flex-direction: column-reverse;
    text-align: center;
  }

  .hero-photo img {
    width: 260px;
    height: 260px;
  }
}

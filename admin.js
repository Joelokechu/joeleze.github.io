/* ---------- Firebase Config ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyDpUQZOHf5aUNu8FEd2dEaAoft0BWR3cHM",
  authDomain: "insightsbyjoel.firebaseapp.com",
  projectId: "insightsbyjoel",
  storageBucket: "insightsbyjoel.firebasestorage.app",
  messagingSenderId: "852390433890",
  appId: "1:852390433890:web:af1e2f56f6e8ec99fcad3b",
  measurementId: "G-XWK3J4S54V"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const storage = firebase.storage();

/* ---------- Elements ---------- */
const loginScreen = document.getElementById("login-screen");
const adminPanel = document.getElementById("admin-panel");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const fileList = document.getElementById("file-list");

const ADMIN_EMAIL = "joel.okechu@gmail.com";

/* ---------- Login ---------- */
loginBtn.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

/* ---------- Auth State ---------- */
auth.onAuthStateChanged(user => {
  if (!user) return;

  if (user.email !== ADMIN_EMAIL) {
    alert("Access denied. Admin only.");
    auth.signOut();
    return;
  }

  loginScreen.classList.add("hidden");
  adminPanel.classList.remove("hidden");

  loadFiles();
});

/* ---------- Logout ---------- */
logoutBtn.addEventListener("click", () => auth.signOut());

/* ---------- Load Files ---------- */
function loadFiles() {
  fileList.innerHTML = `<p class="loading">Loading files...</p>`;

  const listRef = storage.ref();

  listRef.listAll().then(result => {
    fileList.innerHTML = "";

    result.items.forEach(fileRef => {
      fileRef.getDownloadURL().then(url => {
        const row = document.createElement("div");
        row.classList.add("file-item");

        row.innerHTML = `
          <span>${fileRef.name}</span>
          <div class="actions">
            <button onclick="copyURL('${url}')">Copy URL</button>
            <button onclick="window.open('${url}', '_blank')">Download</button>
            <button class="del" onclick="deleteFile('${fileRef.fullPath}')">Delete</button>
          </div>
        `;

        fileList.appendChild(row);
      });
    });
  });
}

/* ---------- Copy URL ---------- */
function copyURL(url) {
  navigator.clipboard.writeText(url);
  alert("URL copied!");
}

/* ---------- Delete ---------- */
function deleteFile(path) {
  if (!confirm("Delete this file?")) return;

  storage.ref(path).delete().then(() => {
    alert("File deleted.");
    loadFiles();
  });
}

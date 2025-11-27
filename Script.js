/* =============================================
   COLLEGE RESOURCE PORTAL — PRO+ EDITION
   Pure HTML + CSS + JavaScript
   ============================================= */

/* ---------- LocalStorage Keys ---------- */
const LS_USERS = "cr_users";
const LS_CURRENT = "cr_current";
const LS_RESOURCES = "cr_resources";
const LS_FILES = "cr_files";
const LS_HELP = "cr_help";

/* ---------- State ---------- */
let users = JSON.parse(localStorage.getItem(LS_USERS) || "[]");
let currentUser = JSON.parse(localStorage.getItem(LS_CURRENT) || "null");
let resources = JSON.parse(localStorage.getItem(LS_RESOURCES) || "[]");
let files = JSON.parse(localStorage.getItem(LS_FILES) || "[]");
let helpList = JSON.parse(localStorage.getItem(LS_HELP) || "[]");

/* ---------- Shortcuts ---------- */
const qs = s => document.querySelector(s);
const qsa = s => document.querySelectorAll(s);

/* ---------- Toast Notifications ---------- */
const showToast = (msg, type = "success") => {
  const container = qs("#toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

/* ---------- Email Validator ---------- */
const validGmail = email => email.endsWith("@gmail.com");

/* ---------- Save to LocalStorage ---------- */
const saveAll = () => {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_RESOURCES, JSON.stringify(resources));
  localStorage.setItem(LS_FILES, JSON.stringify(files));
  localStorage.setItem(LS_HELP, JSON.stringify(helpList));
};

/* =========================================================
   LOGIN / REGISTER
========================================================= */
qs("#showRegister").onclick = () => qs("#flipCard").classList.add("flipped");
qs("#showLogin").onclick = () => qs("#flipCard").classList.remove("flipped");

qs("#toggleLoginEye").onclick = () => {
  const pass = qs("#loginPassword");
  pass.type = pass.type === "password" ? "text" : "password";
};
qs("#toggleRegEye").onclick = () => {
  const pass = qs("#regPassword");
  pass.type = pass.type === "password" ? "text" : "password";
};

/* ---------- Password Strength ---------- */
qs("#regPassword").oninput = e => {
  const val = e.target.value;
  const bar = qs("#strengthBar");
  const txt = qs("#strengthText");
  let strength = 0;
  if (val.length > 5) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^a-zA-Z0-9]/.test(val)) strength++;
  const colors = ["red", "orange", "#9acd32", "green"];
  const labels = ["Weak 🔴", "Medium 🟡", "Good 🟢", "Strong 🟢"];
  bar.style.width = `${(strength / 4) * 100}%`;
  bar.style.background = colors[strength - 1] || "red";
  txt.textContent = labels[strength - 1] || "";
};

/* ---------- Register ---------- */
qs("#registerBtn").onclick = () => {
  const name = qs("#regName").value.trim();
  const email = qs("#regEmail").value.trim().toLowerCase();
  const pass = qs("#regPassword").value;
  if (!name || !email || !pass) return showToast("Fill all fields", "error");
  if (!validGmail(email)) return showToast("Email must end with @gmail.com", "error");
  if (users.some(u => u.email === email)) return showToast("Email already registered", "error");
  const join = new Date().toLocaleDateString();
  users.push({ name, email, pass, join, photo: "default-avatar.png" });
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  showToast("Registered successfully! Login now");
  qs("#flipCard").classList.remove("flipped");
};

/* ---------- Forgot Password ---------- */
qs("#forgotBtn").onclick = () => {
  const email = qs("#loginEmail").value.trim();
  if (!email) return showToast("Enter your Gmail first", "error");
  if (!validGmail(email)) return showToast("Only Gmail allowed", "error");
  const exists = users.some(u => u.email === email);
  if (!exists) return showToast("Email not found", "error");
  showToast("Password reset link sent to your Gmail (simulated)");
};

/* ---------- Login ---------- */
qs("#loginBtn").onclick = () => {
  const email = qs("#loginEmail").value.trim().toLowerCase();
  const pass = qs("#loginPassword").value;
  const remember = qs("#rememberMe").checked;
  if (!email || !pass) return showToast("Enter all fields", "error");
  if (!validGmail(email)) return showToast("Only Gmail allowed", "error");
  const user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return showToast("Invalid credentials", "error");
  currentUser = user;
  remember ? localStorage.setItem(LS_CURRENT, JSON.stringify(user)) : localStorage.removeItem(LS_CURRENT);
  openDashboard();
};

/* ---------- Auto Login ---------- */
if (currentUser) document.addEventListener("DOMContentLoaded", openDashboard);

/* =========================================================
   DASHBOARD + NAVIGATION
========================================================= */
function openDashboard() {
  qs("#authSection").style.display = "none";
  qs("#dashboard").classList.remove("hidden");
  renderAll();
  updateHeader();
}

/* ---------- Update Header Info ---------- */
function updateHeader() {
  qs("#welcomeUser").textContent = `Welcome ${currentUser.name} 👋`;
  qs("#profileThumb").src = currentUser.photo || "default-avatar.png";
}

/* ---------- Menu ---------- */
qs("#menuBtn").onclick = () => qs("#sideMenu").classList.toggle("open");
qsa(".menu-item").forEach(btn => {
  btn.onclick = () => {
    const id = btn.dataset.section;
    if (id) showSection(id);
    qs("#sideMenu").classList.remove("open");
  };
});

/* ---------- Show Section ---------- */
function showSection(id) {
  qsa("main .panel").forEach(p => p.classList.add("hidden"));
  qs(`#${id}`).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------- Logout ---------- */
qs("#logoutBtn").onclick = logout;
qs("#logoutProfileBtn").onclick = logout;
function logout() {
  localStorage.removeItem(LS_CURRENT);
  currentUser = null;
  qs("#dashboard").classList.add("hidden");
  qs("#authSection").style.display = "flex";
  showToast("Logged out successfully");
}

/* =========================================================
   HOME SECTION
========================================================= */
function setQuote() {
  const quotes = [
    "Believe in yourself!",
    "Work hard, stay humble.",
    "Every day counts.",
    "Keep pushing forward.",
    "Learn. Build. Grow."
  ];
  qs("#dailyQuote").textContent = quotes[Math.floor(Math.random() * quotes.length)];
}

/* =========================================================
   RESOURCES
========================================================= */
qs("#addResBtn").onclick = () => {
  const title = qs("#resTitle").value.trim();
  const type = qs("#resType").value.trim();
  const desc = qs("#resDesc").value.trim();
  if (!title || !type || !desc) return showToast("Fill all fields", "error");
  resources.push({ id: Date.now(), title, type, desc, owner: currentUser.email });
  saveAll();
  renderResources();
  renderNotes();
  updateStats();
  qs("#resTitle").value = qs("#resType").value = qs("#resDesc").value = "";
  showToast("Resource added");
};

function renderResources() {
  const list = qs("#allResources");
  const myRes = resources.filter(r => r.owner === currentUser.email);
  list.innerHTML = myRes.length
    ? myRes.map(r => `<li><div><b>${r.title}</b> (${r.type})<br>${r.desc}</div>
      <button onclick="deleteRes(${r.id})">Delete</button></li>`).join("")
    : "<li>No resources found</li>";
}
function deleteRes(id) {
  resources = resources.filter(r => r.id !== id);
  saveAll();
  renderResources();
  renderNotes();
  updateStats();
  showToast("Deleted");
}

/* ---------- Notes Preview ---------- */
function renderNotes() {
  const box = qs("#homeNotes");
  const notes = resources.filter(r => r.owner === currentUser.email && r.type.toLowerCase() === "notes").slice(-3);
  box.innerHTML = notes.length
    ? notes.map(n => `<div class="card small"><b>${n.title}</b><p>${n.desc}</p></div>`).join("")
    : "<div>No notes yet</div>";
}

/* =========================================================
   COMMUNITY
========================================================= */
function renderCommunity() {
  const links = [
    { name: "YouTube", url: "https://youtube.com" },
    { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org" },
    { name: "NPTEL", url: "https://nptel.ac.in" },
    { name: "FreeCodeCamp", url: "https://www.freecodecamp.org" }
  ];
  qs("#communityLinks").innerHTML = links
    .map(l => `<a href="${l.url}" target="_blank">${l.name}</a>`)
    .join("");
}

/* =========================================================
   DIGILOCKER
========================================================= */
qs("#uploadBtn").onclick = () => qs("#fileUpload").click();
qs("#fileUpload").onchange = e => {
  const uploaded = [...e.target.files];
  uploaded.forEach(f => files.push({ id: Date.now() + Math.random(), name: f.name, owner: currentUser.email }));
  saveAll();
  renderFiles();
  updateStats();
  showToast("Files uploaded (demo)");
};
qs("#refreshFilesBtn").onclick = renderFiles;

function renderFiles() {
  const list = qs("#fileList");
  const myFiles = files.filter(f => f.owner === currentUser.email);
  list.innerHTML = myFiles.length
    ? myFiles.map(f => `<li><div><b>${f.name}</b></div>
      <button onclick="renameFile(${f.id})">Rename</button>
      <button onclick="deleteFile(${f.id})">Delete</button></li>`).join("")
    : "<li>No files uploaded</li>";
}
function renameFile(id) {
  const file = files.find(f => f.id === id);
  const newName = prompt("Rename file", file.name);
  if (newName) {
    file.name = newName;
    saveAll();
    renderFiles();
    showToast("Renamed");
  }
}
function deleteFile(id) {
  files = files.filter(f => f.id !== id);
  saveAll();
  renderFiles();
  updateStats();
  showToast("Deleted");
}

/* =========================================================
   HELP DESK
========================================================= */
qs("#submitHelpBtn").onclick = () => {
  const text = qs("#helpText").value.trim();
  if (!text) return showToast("Ask something", "error");
  helpList.push({ id: Date.now(), text, owner: currentUser.email });
  saveAll();
  renderHelp();
  updateStats();
  qs("#helpText").value = "";
  showToast("Submitted");
};

function renderHelp() {
  const list = qs("#helpList");
  const myHelp = helpList.filter(h => h.owner === currentUser.email);
  list.innerHTML = myHelp.length
    ? myHelp.map(h => `<li><div>${h.text}</div></li>`).join("")
    : "<li>No queries yet</li>";
}

/* =========================================================
   PROFILE PAGE
========================================================= */
qs("#uploadProfileBtn").onclick = () => qs("#profileUpload").click();
qs("#profileUpload").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    currentUser.photo = reader.result;
    users = users.map(u => (u.email === currentUser.email ? currentUser : u));
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    localStorage.setItem(LS_CURRENT, JSON.stringify(currentUser));
    qs("#profilePic").src = reader.result;
    qs("#profileThumb").src = reader.result;
    showToast("Profile photo updated");
  };
  reader.readAsDataURL(file);
};

qs("#saveProfileBtn").onclick = () => {
  const newName = qs("#newName").value.trim();
  const newPass = qs("#newPassword").value.trim();
  if (!newName && !newPass) return showToast("Nothing to update", "error");
  if (newName) currentUser.name = newName;
  if (newPass && newPass.length >= 6) currentUser.pass = newPass;
  users = users.map(u => (u.email === currentUser.email ? currentUser : u));
  localStorage.setItem(LS_USERS, JSON.stringify(users));
  localStorage.setItem(LS_CURRENT, JSON.stringify(currentUser));
  updateHeader();
  renderProfile();
  showToast("Profile updated");
};

/* ---------- Export / Import / PDF ---------- */
qs("#exportBtn").onclick = () => {
  const data = { users, resources, files, helpList };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portal_backup.json";
  a.click();
  showToast("Backup downloaded");
};
qs("#importBtn").onclick = () => qs("#importFile").click();
qs("#importFile").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      users = data.users || users;
      resources = data.resources || resources;
      files = data.files || files;
      helpList = data.helpList || helpList;
      saveAll();
      renderAll();
      showToast("Data imported");
    } catch {
      showToast("Invalid file", "error");
    }
  };
  reader.readAsText(file);
};

qs("#pdfBtn").onclick = () => {
  let summary = `College Resource Summary\nUser: ${currentUser.name}\nEmail: ${currentUser.email}\n\nResources:\n`;
  resources.filter(r => r.owner === currentUser.email).forEach(r => summary += `• ${r.title} (${r.type}) - ${r.desc}\n`);
  summary += `\nFiles:\n`;
  files.filter(f => f.owner === currentUser.email).forEach(f => summary += `• ${f.name}\n`);
  summary += `\nHelp Desk:\n`;
  helpList.filter(h => h.owner === currentUser.email).forEach(h => summary += `• ${h.text}\n`);
  const blob = new Blob([summary], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "college_summary.txt";
  a.click();
  showToast("Summary downloaded");
};

/* ---------- Render Profile ---------- */
function renderProfile() {
  qs("#profilePic").src = currentUser.photo || "default-avatar.png";
  qs("#profileName").textContent = currentUser.name;
  qs("#profileEmail").textContent = currentUser.email;
  qs("#profileDate").textContent = currentUser.join || "N/A";
}

/* =========================================================
   STATS + RENDER ALL
========================================================= */
function updateStats() {
  const res = resources.filter(r => r.owner === currentUser.email).length;
  const f = files.filter(r => r.owner === currentUser.email).length;
  const h = helpList.filter(r => r.owner === currentUser.email).length;
  qs("#stats").textContent = `Notes: ${res} • Files: ${f} • Queries: ${h}`;
}

function renderAll() {
  renderResources();
  renderNotes();
  renderCommunity();
  renderFiles();
  renderHelp();
  renderProfile();
  setQuote();
  updateStats();
}

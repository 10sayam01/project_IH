/* ===== SHOW / HIDE PAGES ===== */
function showPage(id) {
  // Hide all pages
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('register-page').classList.add('hidden');
  document.getElementById('main-page').classList.add('hidden');
  document.getElementById('profile-page').classList.add('hidden');

  // Show the requested page
  document.getElementById(id).classList.remove('hidden');

  // If going to main, update the nav user info
  if (id === 'main-page') updateNav();

  // If going to profile, fill in the details
  if (id === 'profile-page') fillProfile();
}


/* ===== TOAST MESSAGE ===== */
function toast(msg, color) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + color;
  setTimeout(() => { t.className = ''; }, 3000);
}


/* ===== LOGIN ===== */
function login() {
  const email = document.getElementById('l-email').value.trim();
  const pass = document.getElementById('l-pass').value;

  if (!email || !pass) {
    toast('Please fill in all fields.', 'red');
    return;
  }

  // Get saved users from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.email === email && u.pass === pass);

  if (!user) {
    toast('Wrong email or password.', 'red');
    return;
  }

  // Save session and go to main site
  localStorage.setItem('session', JSON.stringify(user));
  toast('Welcome back, ' + user.name.split(' ')[0] + '!', 'green');
  setTimeout(() => showPage('main-page'), 700);
}


/* ===== REGISTER ===== */
function register() {
  const name = document.getElementById('r-name').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const pass = document.getElementById('r-pass').value;

  if (!name || !email || !pass) {
    toast('Please fill in all fields.', 'red');
    return;
  }

  if (pass.length < 6) {
    toast('Password must be at least 6 characters.', 'red');
    return;
  }

  // Check if email already exists
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.find(u => u.email === email)) {
    toast('This email is already registered.', 'red');
    return;
  }

  // Save new user
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const newUser = { name, email, pass, since: today };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // Auto login
  localStorage.setItem('session', JSON.stringify(newUser));
  toast('Account created! Welcome, ' + name.split(' ')[0] + '!', 'green');
  setTimeout(() => showPage('main-page'), 700);
}


/* ===== LOGOUT ===== */
function logout() {
  localStorage.removeItem('session');
  toast('Logged out.', 'green');
  setTimeout(() => showPage('login-page'), 600);
}


/* ===== UPDATE NAVBAR ===== */
function updateNav() {
  const user = JSON.parse(localStorage.getItem('session'));
  if (!user) return;
  document.getElementById('nav-avatar').textContent = user.name[0].toUpperCase();
  document.getElementById('nav-name').textContent = user.name.split(' ')[0];
}


/* ===== FILL PROFILE PAGE ===== */
function fillProfile() {
  const user = JSON.parse(localStorage.getItem('session'));
  if (!user) return;
  document.getElementById('p-avatar').textContent = user.name[0].toUpperCase();
  document.getElementById('p-name').textContent = user.name;
  document.getElementById('p-email').textContent = user.email;
  document.getElementById('pt-name').textContent = user.name;
  document.getElementById('pt-email').textContent = user.email;
  document.getElementById('pt-since').textContent = user.since;
}


/* ===== ENTER KEY SUPPORT ===== */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  if (!document.getElementById('login-page').classList.contains('hidden')) login();
  if (!document.getElementById('register-page').classList.contains('hidden')) register();
});


/* ===== ON PAGE LOAD — check if already logged in ===== */
const savedSession = localStorage.getItem('session');
if (savedSession) {
  showPage('main-page');
} else {
  showPage('login-page');
}

// ===== Theme toggle (remembers choice) =====
const root = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('theme', theme); } catch (e) {}
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
setTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () =>
  setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// ===== Mobile menu =====
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuToggle');
menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// ===== Highlight current section in the menu =====
const links = [...nav.querySelectorAll('a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => s && spy.observe(s));

// ===== Skill bars fill when scrolled into view =====
const bars = document.querySelectorAll('.bar i');
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.level + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
bars.forEach(b => barObs.observe(b));

// ===== Project filter =====
const filterBtns = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  projects.forEach(p => p.classList.toggle('hide', f !== 'all' && p.dataset.category !== f));
}));

// ===== Contact form: validate, then open the visitor's email app =====
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const MY_EMAIL = 'your.email@example.com'; // <-- change to your real email

form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [form.name, form.email, form.message];
  let valid = true;
  fields.forEach(f => {
    const ok = f.value.trim() !== '' && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
    f.classList.toggle('invalid', !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = 'Please fill in every field with a valid email address.';
    status.className = 'error';
    return;
  }
  const subject = encodeURIComponent('Portfolio message from ' + form.name.value.trim());
  const body = encodeURIComponent(form.message.value.trim() + '\n\nFrom: ' + form.email.value.trim());
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  status.textContent = 'Opening your email app to send the message…';
  status.className = 'ok';
  form.reset();
});

// ===== Footer: year + back to top =====
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('toTop').addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Typing effect on the headline =====
const typedEl = document.getElementById('typed');
const phrases = [
  'Computer System and Networking student',
  'Aspiring network engineer',
  'Web development learner'
];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (typedEl && !reduceMotion) {
  let p = 0, i = 0, deleting = false;

  function type() {
    const current = phrases[p];
    typedEl.textContent = current.slice(0, i);

    let delay = deleting ? 40 : 80;
    if (!deleting && i === current.length) {
      delay = 1800;            // pause when the phrase is complete
      deleting = true;
    } else if (deleting && i === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
      delay = 400;
    }
    i += deleting ? -1 : 1;
    setTimeout(type, delay);
  }
  type();
}
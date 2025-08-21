// Año dinámico
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Utilidades de modales
function setupModal(openBtnId, modalId, closeBtnId, firstFieldId) {
  const openBtn = document.getElementById(openBtnId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeBtnId);

  function openModal() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => document.getElementById(firstFieldId)?.focus(), 50);
  }
  function closeModal() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    openBtn?.focus();
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || (e.target.classList && e.target.classList.contains('bg-black/50'))) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  return { openModal, closeModal };
}

const login = setupModal('openLogin', 'loginModal', 'closeLogin', 'loginEmail');
const signup = setupModal('openSignup', 'signupModal', 'closeSignup', 'name');

// Desde Log In -> ir a Sign Up
const gotoSignup = document.getElementById('gotoSignup');
gotoSignup?.addEventListener('click', () => {
  login.closeModal();
  setTimeout(() => signup.openModal(), 150);
});

// Helpers validación
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
function showFieldError(el, errEl, show) {
  if (show) { el.classList.add('border-red-500'); errEl.classList.remove('hidden'); }
  else { el.classList.remove('border-red-500'); errEl.classList.add('hidden'); }
}
function setFormAlert(container, type, msg) {
  container.className = 'mx-5 mt-4 rounded border px-3 py-2 text-sm';
  const map = {
    error: 'border-red-300 bg-red-50 text-red-700',
    success: 'border-green-300 bg-green-50 text-green-700',
    info: 'border-blue-300 bg-blue-50 text-blue-700'
  };
  container.classList.add(...map[type].split(' '));
  container.textContent = msg;
  container.classList.remove('hidden');
}
function clearFormAlert(container) {
  container.classList.add('hidden'); container.textContent = '';
}
function toast(type, msg) {
  const t = document.getElementById('toast');
  const inner = document.getElementById('toastInner');
  inner.className = 'rounded-lg border px-4 py-3 shadow';
  inner.classList.add(...(type === 'success'
    ? 'bg-green-50 text-green-900 border-green-200'
    : type === 'error'
    ? 'bg-red-50 text-red-900 border-red-200'
    : 'bg-blue-50 text-blue-900 border-blue-200').split(' '));
  inner.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

// Submit helper
async function handleSubmit(formEl, submitBtn, alertEl, validateFn, url) {
  clearFormAlert(alertEl);
  if (!validateFn()) return;

  const prevText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
  submitBtn.textContent = 'Enviando...';

  try {
    const body = new FormData(formEl);
    const res = await fetch(url, { method: 'POST', body });
    const isJSON = res.headers.get('content-type')?.includes('application/json');
    const data = isJSON ? await res.json() : { ok: res.ok, message: await res.text() };

    if (!res.ok || data.ok === false) {
      const msg = data.message || 'Ha ocurrido un error. Revisa tus datos.';
      setFormAlert(alertEl, 'error', msg);
      toast('error', msg);
    } else {
      const msg = data.message || 'Operación realizada con éxito.';
      setFormAlert(alertEl, 'success', msg);
      toast('success', msg);
      if (formEl.id === 'loginForm') setTimeout(() => login.closeModal(), 600);
      if (formEl.id === 'signupForm') setTimeout(() => signup.closeModal(), 600);
      formEl.reset();
      // Ejemplo: redirección opcional
      // window.location.href = '/dashboard';
    }
  } catch (e) {
    setFormAlert(alertEl, 'error', 'No se pudo conectar con el servidor.');
    toast('error', 'No se pudo conectar con el servidor.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    submitBtn.textContent = prevText;
  }
}

// Login
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPass = document.getElementById('loginPassword');
const loginEmailErr = document.getElementById('loginEmailErr');
const loginPasswordErr = document.getElementById('loginPasswordErr');
const loginAlert = document.getElementById('loginAlert');
const loginSubmit = document.getElementById('loginSubmit');

function validateLogin() {
  let ok = true;
  const emailOk = emailRegex.test(loginEmail.value.trim());
  const passOk = (loginPass.value || '').length >= 6;
  showFieldError(loginEmail, loginEmailErr, !emailOk);
  showFieldError(loginPass, loginPasswordErr, !passOk);
  if (!emailOk) { setFormAlert(loginAlert, 'error', 'Introduce un email válido.'); ok = false; }
  else if (!passOk) { setFormAlert(loginAlert, 'error', 'La contraseña debe tener al menos 6 caracteres.'); ok = false; }
  else { clearFormAlert(loginAlert); }
  return ok;
}
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(loginForm, loginSubmit, loginAlert, validateLogin, loginForm.action);
});

// Signup
const signupForm = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passInput = document.getElementById('password');
const nameErr = document.getElementById('nameErr');
const emailErr = document.getElementById('emailErr');
const passwordErr = document.getElementById('passwordErr');
const signupAlert = document.getElementById('signupAlert');
const signupSubmit = document.getElementById('signupSubmit');

function validateSignup() {
  let ok = true;
  const nameOk = !!nameInput.value.trim();
  const emailOk = emailRegex.test(emailInput.value.trim());
  const passOk = (passInput.value || '').length >= 6;
  showFieldError(nameInput, nameErr, !nameOk);
  showFieldError(emailInput, emailErr, !emailOk);
  showFieldError(passInput, passwordErr, !passOk);
  if (!nameOk) { setFormAlert(signupAlert, 'error', 'El nombre es obligatorio.'); ok = false; }
  else if (!emailOk) { setFormAlert(signupAlert, 'error', 'Introduce un email válido.'); ok = false; }
  else if (!passOk) { setFormAlert(signupAlert, 'error', 'La contraseña debe tener al menos 6 caracteres.'); ok = false; }
  else { clearFormAlert(signupAlert); }
  return ok;
}
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSubmit(signupForm, signupSubmit, signupAlert, validateSignup, signupForm.action);
});

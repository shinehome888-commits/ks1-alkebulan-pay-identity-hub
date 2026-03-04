const API_BASE = 'https://ks1-alkebulan-pay-backend.onrender.com';

function toggleForm(section) {
  const login = document.getElementById('loginSection');
  const register = document.getElementById('registerSection');
  if (section === 'login') {
    login.classList.remove('hidden');
    register.classList.add('hidden');
  } else {
    login.classList.add('hidden');
    register.classList.remove('hidden');
  }
}

document.querySelectorAll('input[name="method"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const input = document.getElementById('walletOrPhone');
    if (radio.value === 'wallet') {
      input.placeholder = 'Enter Wallet Address';
    } else {
      input.placeholder = 'Enter Phone Number (e.g. +233555123456)';
    }
  });
});

async function register() {
  const method = document.querySelector('input[name="method"]:checked').value;
  const identifier = document.getElementById('walletOrPhone').value.trim();
  const data = {
    walletAddress: method === 'wallet' ? identifier : null,
    phoneNumber: method === 'phone' ? identifier : null,
    businessOwner: document.getElementById('businessOwner').value.trim(),
    ownerBirthday: document.getElementById('ownerBirthday').value,
    businessName: document.getElementById('businessName').value.trim(),
    businessBirthday: document.getElementById('businessBirthday').value,
    businessType: document.getElementById('businessType').value,
    password: document.getElementById('regPassword').value,
    confirmPassword: document.getElementById('confirmPassword').value
  };

  if (!data.walletAddress && !data.phoneNumber) {
    alert('Please enter a wallet address or phone number.');
    return;
  }

  if (data.password !== data.confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      alert(`Registration successful!\nYour Trade ID: ${result.tradeId}`);
      toggleForm('login');
    } else {
      alert(result.message || 'Registration failed.');
    }
  } catch (err) {
    alert('Network error. Please check your connection.');
  }
}

async function login() {
  const id = document.getElementById('loginId').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id, password })
    });

    const result = await res.json();
    if (res.ok && result.token) {
      localStorage.setItem('ks1_token', result.token);
      localStorage.setItem('ks1_tradeId', result.tradeId);
      window.location.href = 'dashboard.html';
    } else {
      alert(result.message || 'Login failed.');
    }
  } catch (err) {
    alert('Login failed. Check your internet connection.');
  }
}

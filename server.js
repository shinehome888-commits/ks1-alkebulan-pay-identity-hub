const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token.' });
  try {
    const response = await fetch('https://ks1-central-auth.onrender.com/auth/verify', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) return res.status(401).json({ error: 'Invalid token' });
    const user = await response.json();
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Auth service unavailable' });
  }
}

app.use('/api', authenticateToken);

app.get('/api/identity/profile', (req, res) => {
  res.json({
    user_id: req.user.user_id,
    trade_id: req.user.trade_id,
    full_name: "User Name",
    kyc_status: "APPROVED"
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Identity Hub' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Identity Hub running on port ${PORT}`);
});

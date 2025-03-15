const express = require('express');
const User = require('../models/user');
const router = express.Router();

// Combined auth page (default to login tab)
router.get('/auth', (req, res) => {
  res.render('auth', { 
    title: 'Login or Sign Up - ScrapGenius',
    message: req.session.message,
    session: req.session,
    activeTab: req.query.tab || 'login' // Default to login, switch with ?tab=signup
  });
  req.session.message = null;
});

// Login POST
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user || !(await user.comparePassword(password))) {
      req.session.message = 'Invalid credentials';
      return res.redirect('/auth?tab=login');
    }
    req.session.userId = user._id;
    res.redirect(req.query.redirect || '/');
  } catch (error) {
    req.session.message = 'Server error';
    res.redirect('/auth?tab=login');
  }
});

// Signup POST
router.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.session.message = 'Passwords do not match';
    return res.redirect('/auth?tab=signup');
  }
  try {
    const user = new User({ username, email, password });
    await user.save();
    req.session.message = 'Registration successful! Please log in.';
    res.redirect('/auth?tab=login');
  } catch (error) {
    req.session.message = error.code === 11000 ? 'Username or email exists' : 'Server error';
    res.redirect('/auth?tab=signup');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth?tab=login'));
});

module.exports = router;
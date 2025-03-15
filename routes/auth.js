const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Existing auth page
router.get('/auth', (req, res) => {
  res.render('auth', { 
    title: 'Login or Sign Up - ScrapGenius',
    message: req.session.message,
    session: req.session,
    activeTab: req.query.tab || 'login'
  });
  req.session.message = null;
});

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

// Register GET
router.get('/register', (req, res) => {
  res.render('register', { 
    title: 'Create Account - ScrapGenius',
    message: req.session.message
  });
  req.session.message = null;
});

// Register POST
router.post('/register', async (req, res) => {
  const { 
    prefix, firstName, lastName, jobTitle, phoneCountryCode, phone, email, confirmEmail, 
    password, confirmPassword, companyName, companyType, companyInterest, materials, referral, terms 
  } = req.body;

  // Basic validation
  if (!terms) {
    req.session.message = 'You must accept the Terms & Conditions';
    return res.redirect('/register');
  }
  if (password !== confirmPassword) {
    req.session.message = 'Passwords do not match';
    return res.redirect('/register');
  }
  if (email !== confirmEmail) {
    req.session.message = 'Emails do not match';
    return res.redirect('/register');
  }
  if (!materials || materials.length === 0) {
    req.session.message = 'Please select at least one material of interest';
    return res.redirect('/register');
  }

  try {
    const user = new User({
      prefix,
      firstName,
      lastName,
      jobTitle,
      phone: `${phoneCountryCode}${phone}`,
      email,
      password,
      companyName,
      companyType,
      companyInterest,
      materials: Array.isArray(materials) ? materials : [materials], // Ensure array
      referral
    });
    await user.save();
    req.session.message = 'Registration successful! Please log in.';
    res.redirect('/auth?tab=login');
  } catch (error) {
    req.session.message = error.code === 11000 ? 'Email or username already exists' : 'Server error';
    res.redirect('/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/auth?tab=login'));
});

module.exports = router;
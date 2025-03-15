const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  prefix: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  jobTitle: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  companyType: { type: String, required: true, enum: ['wasteProducer', 'recycler', 'trader', 'broker', 'other'] },
  companyInterest: { type: String, required: true, enum: ['buying', 'selling', 'both'] },
  materials: [{ type: String, required: true }],
  referral: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
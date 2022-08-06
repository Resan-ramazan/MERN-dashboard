// mongoose schema for User

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/test')
  .then(() => console.log('Connected to MongoDB...'))

const userSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  blocked: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword, callback) {
  const user = this;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
}

const User = mongoose.model('User', userSchema);

module.exports = User;

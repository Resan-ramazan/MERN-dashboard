const express = require('express');
const router = express.Router();
const User = require('../database');

router.post('/register', async (req, res) => {
  const { name, password, email } = req.body;
  const user = new User({ name, password, email });
  user.save()
    .then((user => {
      res.status(201).json({
        message: 'User created successfully',
        user: user
      });
    }))
    .catch(err => {
      console.log(err);
    })
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(async user => {
      if (!user) res.status(404).send()
      const isMatch = await user?.comparePassword(password)
      if (!isMatch) res.status(401).send()
      if (isMatch) {
        const userData = { ...user._doc }
        delete userData.password;
        delete userData.__v;
        res.status(200).json({
          message: 'User logged in successfully',
          user: userData
        })
      }
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/users', async (req, res) => {
  const _id = req.headers.authorization;


  const user = await User.findById(_id)

  if (!user) return res.status(404).send()
  else if (user.blocked) return res.status(403).send()

  User.find()
    .select('-password -__v')
    .then(users => {
      res.status(200).json({
        message: 'Users fetched successfully',
        users: users
      })
    })
})

router.delete('/users', async (req, res) => {
  const _id = req.headers.authorization;
  const user = await User.findById(_id)
  if (!user) return res.status(404).send();
  if (user.blocked) return res.status(403).send();

  const { checkedUsers } = req.body;
  User.deleteMany({ _id: { $in: checkedUsers } })
    .then(() => {
      res.status(200).json({
        message: 'Users deleted successfully'
      })
    })
})

router.patch('/users', async (req, res) => {
  const { checkedUsers, blocked } = req.body;
  const _id = req.headers.authorization;
  const user = await User.findById(_id)
  if (!user) return res.status(404).send();
  if (user.blocked) return res.status(403).send();
  
  User.updateMany({ _id: { $in: checkedUsers } }, { $set: { blocked: blocked } })
    .then(() => {
      res.status(200).json({
        message: 'Users updated successfully'
      })
    })
})

module.exports = router;
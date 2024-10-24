const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const multer = require('multer');
const path = require('path');
const { generateToken } = require('../services/authentication');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment');


router.get('/sign-in', (req, res)=>{
  res.render('SignIn', {error: null});
})

router.post('/sign-in', async (req, res)=>{
  const {email, password} = req.body;
  try{
  const token = await User.matchPasswordAndGenerateToken(email, password);
  // console.log(token);
  res.cookie("token", token).redirect('/');
  }
  catch(error){
    res.render('SignIn', {
      error: 'Wrong email or password!'
    })
  }

})

router.get('/sign-up', (req, res)=>{
  res.render('./SignUp');
})

router.post('/sign-up' , async (req, res)=>{
  const {fullName, password, email, profileImage} = req.body;
  const newUser = await User.create({
    fullName,
    password,
    email,
    profileImage: profileImage || undefined
  });
  const token = generateToken(newUser);
  res.cookie('token', token).redirect('/');

})

router.get('/logout', (req, res)=>{
  res.clearCookie('token').redirect('/');
})

router.get('/profile', async(req, res)=>{
  const blogs = await Blog.find({createdBy: req.user._id});
  const comments =await Comment.find({createdBy:req.user._id});
  res.render('UserProfile', {
    user: req.user,
    blogs:blogs,
    comments: comments

  });
})

router.post('/update/profile-image', async (req, res)=>{
  try{
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.profileImage = req.body.profileImage;
    console.log(user);

    await user.save();
    console.log(user);

    return res.redirect('/user/profile');
  }
  catch(error){
    console.log(error);
   return res.status(500).send('Something went wrong');
  }

})

module.exports = router;

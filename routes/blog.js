const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const Comment = require('../models/Comment')
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, path.resolve('./public/uploads/'));
  },
  filename: function(req, file, cb){
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const uploads = multer({storage: storage});


router.get('/add-blog', (req, res)=>{
  return res.render('AddBlog', {
    user: req.user
  });
});

router.post('/add-blog', uploads.single('coverImage'), async(req, res)=>{
  const {title, body} = req.body;
  const coverImage = req.file.filename;
  const blog = await Blog.create({
    title,
    body,
    createdBy : req.user._id,
    coverImage: `uploads/${coverImage}`
  })
  console.log(blog);
  return res.redirect('/');

})

router.get('/:id', async (req, res)=>{
  const blog =await Blog.findById(req.params.id).populate('createdBy');
  const comments  = await Comment.find({blogId: req.params.id}).populate('createdBy');
  console.log("comment", await Comment.find({blogId:req.params.id}));
  // console.log("Blog------",blog);
  console.log(req.user);

  res.render('BlogPage', {
    blog: blog,
    user: req.user,
    comments:comments
  })
})

router.post('/:id/comment', async(req, res)=>{
 const comment =  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.id
  });
  return res.redirect(`/`);

})

module.exports = router;

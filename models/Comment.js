const {Schema, model} = require('mongoose');

const commentSchema = Schema({
  content: {
    type:String,
    required:true
  },
  createdBy:{
    type: Schema.Types.ObjectId,
    ref:'User'

  },
  blogPost:{
    type:Schema.Types.ObjectId,
    ref:'Blog'
  }
}, {timestamps:true})

const Comment = model('comment', commentSchema);
module.exports = Comment;
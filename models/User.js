const {Schema, model} = require('mongoose');
const {createHmac, randomBytes} = require("crypto");

const userSchema = Schema({
  fullname: {
    type:String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
    type:String,
    required:true,
  },
  profileImage:{
    type: String,
    default: './public/default.jpg'
  },
  role:{
    type:String,
    enum:["USER", "ADMIN"],
    default: "USER"
  },
  salt:{
    type:String,
    
  }

}, {timestamps:true});


userSchema.pre("save", function(next){
  const user = this;

  if(!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt).update(user.password).digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
})





const User = model("User", userSchema);
module.exports = User;

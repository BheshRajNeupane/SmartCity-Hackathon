const mongoose  = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs') 
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
  name:{
   
      type:String,
      required:[true,'Please provide your name!']
    },
    email:{
        type:String,
        required: [true , 'Please provide your email'],
        unique:true,
        lowercase:true,
        //coustom validator
        validate:[validator.isEmail,'Please provid valid email'] 
    },
    phone:{
        type:String,
        required:[true,'Please provide your phone number!']
    },
    address:{
        type:String,
        required:[true,'Please provide your  current address!']
    },
    citizen_id:{
        type:String,
        required:[true,'Please provide your  citizendhip number!']
    },
    age:{
        type:String,
        required:[true,'Please provide your  age!']
    },
    gender:{
        type:String,
        required:[true,'Please provide your  gender!'],
        enum:
        ['male','Male','Female','female']
    },
   
    photo:String, 
    
    password:{
         type:String,
         required:[true , 'Please provide a password'],
         minlength:8,
         select: false 
    },
    passwordConfirm:{
        type:String,
        required:[true,'Please confirm your password'],
        validate:{
            //imp:This only works on CREATE and SAVE !
            validator:function(el){ // 
                return el=== this.password;

            },
            message:'Password are not same!'
        }
    }, 

    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires: Date,
  active:{
    type:Boolean,
    default:true,
    select:false
  }

});//end of Schema



 const User  = mongoose.model('User',userSchema);


 module.exports = User;
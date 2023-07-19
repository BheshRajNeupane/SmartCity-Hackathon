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


userSchema.pre('save',  async function(next){
   
    if(!this.isModified('password')){return next();}  
  
   //this -->current document 
   this.password =  await bcrypt.hash(this.password , 12);
   
     this.passwordConfirm = undefined;
     next();
  
  })
  //---137 restPassword--------
  //if password was not modified or this is new   , do not manipulate passwordChangedAt ,  leave same as before
  userSchema.pre('save', function(next){
    if(!this.isModified('password')||this.isNew) return next();
   this.passwordChangedAt = Date.now() - 1000;
    next();
  })
  //-------------------------------------------------
  
  
  //--140 Deleting User-------------
  userSchema.pre('/^find/' , function(next){ 
  //this.find({active:true})
  this.find({ active:{ $ne:false } })
  next();
  })
  
  // checking passwrod
  userSchema.methods.correctPassword =  async function(candidatePassword , userPassword){
  
  return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  
  //passWord Change or not after token issued
  userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    
      if(this.passwordChangedAt){ // if exists
    
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000 , 10); ;
  
    return   JWTTimestamp < changedTimestamp  // if changed retutn true
      }
      return false;
  };
  
  userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  //console.log({ resetToken}, this.passwordResetToken);
  
   //reset garna time forget gareko 10 min samma
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  return resetToken;//return unencrypted token for further use ( sending in email to reset password)
  }

 //const User  = mongoose.model('User',userSchema);


 module.exports = mongoose.models.User || mongoose.model('User' , userSchema);
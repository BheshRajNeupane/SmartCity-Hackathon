const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const Doctor = require('./../models/doctorModel');
const signToken = require('./../utils/signToken');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Email = require('./../utils/email');




 
  const createSendToken = async (user, statusCode, res) => {
    const token = signToken(user._id);
    
      const user1 = await User.findByIdAndUpdate(user._id,{ token:token
      } ,
        {
          new:true,
          runValidator:true
       }
      )

      const cookieOptions = {
        expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
    
      if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
      }
      res.cookie('jwt', token, cookieOptions);
    
    //HIDING PASSWORD IN RESPONSE OUTPUT
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user1,
      },
    });
  };



  exports.signup = catchAsync(async (req, res, next) => {
      const { name, email, password ,passwordConfirm,age,phone,address,} = req.body;
      
   
    const user = await User.findOne({ email});

   if(user){
      // res.render().
   }

    const newUser = await User.create(req.body);
    const url = `${req.protocol}://${req.get('host')}/me`;
    
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
})


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
  
    // 1) Check if  email && password exist
    if (!email || !password) {
      
      return next(new AppError('Please provide email and password!', 400)); //
    }
  
    // 2 ) Check if user exist && password is  correct
    const user = await User.findOne({ email }).select('+password');
  
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password!', 401));
    }
  
    //3) If evertything ok, send token to client
    createSendToken(user, 200, res);
  });



  
exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting token and check of it's there (exist)
  
    let token;
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
  
    if (!token) {
      console.log('not loged in');
      return next(
        new AppError('You are not logedIn ! Please login to get access', 401)
      );
    }
    // console.log(token);
  
    // 2) Verification Token
  
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //calling
  
    // 3) Check if user still exists (expires time)
    //decoded.id  =  give id of user
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token  does no longer exist'),
        401
      );
    }
  
    // 4) Check if user changed password after the token was released
  
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      // if return true from userModel
      return next(
        new AppError('User recently changed password!Please login again.', 401)
      );
    }
  
    //GRANT ACCESS TO PROETECTED ROUTE
    req.user = currentUser; //
  
    next();
  });
  
  

  exports.forgotPassword = catchAsync(async (req, res, next) => {
      
      console.log(req.body.email);
    //1. Get User based on POSTED email
    const user = await User.findOne(  {email:req.body.email} );

     console.log(user);
    if (!user) {
      return next(new AppError('There is no user with email address.', 404));
    }
  
    // 2.Generate the random reset token

    const resetToken = user.createPasswordResetToken();

   
  
    await user.save({ validateBeforeSave: false });
  
    // ------3. Send it(token) to user's email-----
    try {
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
  
      await new Email(user, resetURL).sendPasswordReset();
  
      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
        token: resetToken
      });
    } catch (err) {
      //TRY CLOSED
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
  
      return next(
        new AppError(
          'There was an error sending reset url in forget password .Try again leter!',
          500
        )
      );
    }
  });

  exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  
    // 2) If token has not expired , and there is a user , set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired ', 400));
    }
  
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
  
    // 3) Update changePasswordAt property for the user
    await user.save();
  
    // 4) Log the user in , send JWT
    createSendToken(user, 200, res);
  });
  
  //----- Updating the Current User: Password-----------
  // only logedin user can update password
  exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    // req  id from log in user data  from protect middleware
    const user = await User.findById(req.user.id).select('+password');
  
    // 2) Check if POSTED current password is correct
  
    //if not equal/pswd wrong
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
      return next(new AppError('Your current password is wrong', 401));
    }
  
    // 3) if correct , update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
  
    // 4) Log user in , send JWT
    createSendToken(user, 200, res);
  });
  

  //Doctor 

  exports.isDoctor= async(req, res,next)=>{
      const doctor = await Doctor.findOne({email:req.body.email});


      if(doctor.code===!'78dr0098'||doctor.code===!'p0897010'||doctor.code===!'2307ycx0'){
       
        return next(new AppError('Only Doctor get access to pataint details'), 400);
      }
      
      next();

  }
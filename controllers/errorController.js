// Global Error Handaling

const AppError = require('../controllers/errorController');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value} .`;
  return new AppError(message, 400);
};

const handleDublicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; 
  
  const message = `Dublicate field value : ${value} Please use another value`;
  
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data.${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  const message = 'Invalid token.Please logeIn Again';
  return new AppError(message, 401);
};

const handleJWTExpiredError = (err) =>
  new AppError('YOur token has expired please login again', 401);

const sendErrorDev = (err, res) => {
  // err = req

  res.status(err.statusCode).json({
    //name: err.name,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) =>
 {   
     //send to client
    if (err.isOperational) {
        

        res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        });
    }

    else {
        //Programming error or other erorr we don't want to leak error detalis
        //1.Log error
        console.error('**ERROR**', err.message);

        //2.Send Generic Message
        res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
        });
    }
};



module.exports = (err, req, res, next) => {
  console.log(' from out dev/prod error');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    console.log("dev err");
    sendErrorDev(err, res);
  } 
  else if (process.env.NODE_ENV === 'production') 
  {
    console.log("dev err");
    let error = { ...err };
    console.log(err);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDublicateFieldsDB(error);
    }
    if (error.name === 'ValidatonError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebToken') {
      //if(error.name === 'Error'){
      error = handleJWTError(error);
    }
    if (error.name === 'TokenexpiredError') {
      //if(error.name === 'Error'){
      error = handleJWTExpiredError(error);
    }

    sendErrorProd(err, res);
  }
};

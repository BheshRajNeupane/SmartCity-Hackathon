
const express = require('express');
const app = express(); 
const expressSanitizer = require('express-sanitizer') 
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const AppError = require('./utlis/appError');
const globalErrorHandler = require('./controllers/errorController');
 const healthRouter = require('./routes/healthRoutes');
 const userRouter = require('./routes/userRoutes');

const multer = require('multer');
const path = require('path'); 
const cors = require('cors')


app.use(cors()); //

app.set('view engine','ejs' );

app.set('views',path.join(__dirname , 'views'))



//Serving static file
app.use(express.static(path.join( __dirname, 'public')));



//Development Logging
if(process.env.NODE_ENV ==='development'){
app.use(morgan('dev'))
}




     app.use(express.json({limit:'10kb'}));
     app.use(cookieParser())





//Serving static file
//app.use(express.static(`${__dirname}/public/`));
app.use(express.static(path.join( __dirname, 'public')));

app.use(expressSanitizer())





 app.use('/api/v1/users',userRouter);
app.use('/api/v1/health',healthRouter);


//Error Handaling
app.all( ' * ' , (req,res,next)=>{
     next( new AppError(`Can't find ${req.originalUrl} on this server!`,404));
    });

    //plugIn GlobalError HAndler

   // app.use(globalErrorHandler);// 

module.exports = app; 






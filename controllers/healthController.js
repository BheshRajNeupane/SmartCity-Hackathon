//const multer = require('multer');

const Appoinment = require('../Models/appointmentModel');//
const User = require('../Models/userModel');//

const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')


exports.bookAppointment= catchAsync(async(req,res,next)=>{
      
    const user = await User.findOne({email:req.body.email})
        if(!user){
            return next(new AppError('please signup with this mai'),400);
        }
    const patientDetails = await Appoinment.create({
        name:user.name,
        email:user.email,
        phone:user.phone,
        address:user.address,
        age:user.age,
        gender:user.gender,
        serviceTitle:req.body.serviceTitle,
        appointmentDate:req.body.appointmentDate,
        message:req.body.message,
        doctor_code:req.body.doctor_code

    });

         res.status(200).json({
             status:"success",
             number:patientDetails.length,
             data:{
                 patientDetails
                 
             }
         })
     
        })




exports.getAppointments= async(req, res)=>{
    
    const allAppointments = await Appoinment.find()
    
     } 
     



     exports.updateAppointment= async(req, res)=>{
    

        const appoinment =  await Appoinment.findById(req.params.id)
  
  
          
        } 
  
      
      
       
  
  
  exports.updateAppointment= (async(req, res)=>{    
      
   
      
             
  })
  
      
 
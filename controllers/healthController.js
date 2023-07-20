//const multer = require('multer');

const Appoinment = require('../Models/appointmentModel');//
const Doctor = require('../Models/doctorModel');
const User = require('../Models/userModel');//

const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')
const Email = require('./../utils/email');



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
 if(patientDetails){
    await new Email(patientDetails , user).sendaAppoinmentMail();
 }
         res.status(200).json({
             status:"success",
             number:patientDetails.length,
             data:{
                 patientDetails
                 
             }
         })
     
        })



// exports.updateAppointment= async(req, res)=>{

        
//            const appoinment =  await Appoinment.findById(req.params.id)  ;


//                 } 

exports.getallAppointments= catchAsync(async(req, res)=>{
let newPatients=[] ,j=0;
let patientDetails =  await Appoinment.find();

    for(let i =0 ; i<patientDetails.length;i++){
            if(patientDetails[i].doctor_code===req.body.code){
            newPatients[j] = patientDetails[i];
            j++
            }
     }

    res.status(200).json({
        data:{
             newPatients
        }
    })


})

  
      
      
       
  
  
  exports.updateAppointment= (async(req, res)=>{    
      
   
      
             
  })
  
      
 
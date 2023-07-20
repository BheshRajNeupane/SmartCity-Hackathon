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

  
      
      
       
  
  
  exports.gethospitalWithin= catchAsync(async(req, res)=>{    
    const {distance, latlng , unit}   = req.params;
    const [lat,lng]= latlng.split(',');
   
 
    
    const radius =  unit === 'mi'? distance/3963.2:distance/6378.1;
  
    if(!lat || !lng){
        next( new AppError('Please provide latitute and longitude in the format lat,log',400))
    }
// console.log("distance:",distance,"lat:",lat,"lng:",lng , "unit:",unit);


const hospital = await Hospitals.find({
   Location:{$geoWithin: {$centerSphere:[[lng,lat],radius]}}
})

// tourSchema.index({startLocation:'2dsphere'})


    res.status(200).json({
       status:'success',
       result:tours.length,
       data:{
         tours
       }
   })    
   
      
             
  })
  
      
 
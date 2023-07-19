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
            // number:patientDetails.length,
             data:{
                 //patientDetails
                 user
             }
         })
     
        })




exports.getAppointments= async(req, res)=>{
    
    const allAppointments = await Appoinment.find()
    
        if(!allAppointments){
             res.json({messgae:"No appointments found"})
        } 
        else{
         res.render("../views/Routine/routine.ejs",{
             
             AppoinmentData:allAppointments,
              title:"Appoinments"
         })
     } 
     }



     exports.updateAppointment= async(req, res)=>{
    

        const appoinment =  await Appoinment.findById(req.params.id)
  
  
           if( appoinment== null){
                res.redirect('http://127.0.0.1:3007/api/v1/routine');
           } 
           else{
            res.render("../views/Routine/edit_period.ejs",{
                 
              period:period,
              title:"Edit Period"
            })
        } 
  
      
      
       }
  
  
  exports.updatePeriod= (async(req, res)=>{    
      
   //console.log(req.files);
      //if image is not changed,old img jo save garna paryo
      if(req.files){
          
          req.body.image= req.files.image.name;
      }
   
      try{
          const updatedPeriod = await Routine.findByIdAndUpdate(req.params.id , req.body,{
                  new:true,
                  runValidator:true
              
          })
         
  
          if(updatedPeriod)
          {
                  req.session.message={
                      type:'success',
                      message:'Period update successfully'
              }
              } 
  }
  catch(err){
      
        
              res.json({message:err.message , type:'danger'})
          
          }
  
    res.redirect('http://127.0.0.1:3007/api/v1/routine')
     
      })  
  
      
 
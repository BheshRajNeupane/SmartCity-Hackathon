const mongoose =require('mongoose')
const appointMentSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    }, 
    phone:{
        type: String,
    },
    email:{
        type: String,
        required:true,
    }, 
    gender:{
        type: String,
    },
    age:{
        type: String
    },
   
    serviceTitle:{
        type: String
    },
    appointmentDate:{
        type: String,
        required:true
    },
    message:{
        type: String,
        required:true
    },
    doctor_code:{
        type: String,
        required:true
    }
})

 const Appointments= mongoose.model('Appointments', appointMentSchema)

 module.exports=Appointments;
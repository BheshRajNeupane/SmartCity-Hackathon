const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    }, 
    email:{
        type: String,
        required:true,
        unique: true,
    }, 
    image:{
        type:String,
        default: null,
    },
    code:{
        type: String,
        required:true
        //enum:['78dr0098','p0897010' ,'2307ycx0'];
    }
   
   
    
})

// const Doctors = mongoose.model('doctors', doctorsSchema)

module.exports = mongoose.models.Doctor || mongoose.model('Doctor' , doctorSchema);
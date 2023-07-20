const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    }, 
    email:{
        type: String,
        required:true,
        unique: true,
    }, 
    contact:{
        type: String,
        required:true,
        unique: true
    }, 
    
    descriptions:{
        type: String,
        required:true
    },
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
             },
             coordinates:[Number],
             address:String,
            }
            ]
   
    
})


module.exports = mongoose.models.Hospital || mongoose.model('Hospital' , hospitalSchema);
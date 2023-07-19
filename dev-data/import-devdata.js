

const fs = require('fs')
const mongoose = require('mongoose');//
 const Doctor = require('../Models/doctorModel')

 const User = require('../Models/userModel')
const dotenv = require('dotenv')// i 
dotenv.config({path:'../config.env'});

console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);

mongoose
.connect(DB,{

    useNewUrlParser : true,
    useUnifiedTopology: true

}).then( ()=>{
    
    console.log("DB connection successful!");
});
//READ JSON FILE
const doctors =  JSON.parse(fs.readFileSync(`${__dirname}/dr.json`,'utf-8'));

//IMPORT DATA INTO DB
const importData = async ()=>{

    try{
          await Doctor.create(doctors);
         
          console.log("Data successfull loaded");
      }
   catch(err){
        console.log(err);
    }
    process.exit();
}

//Delete all data from database
const deleteData = async ()=>{
     try{ 
         await Doctor.deleteMany();
         console.log("Data successfull deleted!");
        }catch(err){
            console.log(err);
        }
        process.exit();
}

//console.log(process.argv);

 
 if(process.argv[2]==='--import'){
     importData();
    }else if(process.argv[2] === '--delete'){
        deleteData();
    }

    // C:\Users\HP\Desktop\SmartCity\dev-data> node import-devdata.js --import
    

 
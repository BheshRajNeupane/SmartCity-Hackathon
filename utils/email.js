



// Building a Complex Email Handler
const nodemailer = require('nodemailer') 
const ejs = require('ejs');
const expressSanitizer = require('express-sanitizer');
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_PASSWORD);

module.exports = class Email{
  constructor(user , url){//userDetalis , resteUrl
     this.to = user.email;
     this.firstName = user.name.split(' ')[0];
     this.url=url;
     this.from = `Bhesh Raj Neupane <${process.env.EMAIL_FROM}>`;
    // console.log(htmlToText)
  }

  newTransport(){
    

      //development mode ;test on mailptrap using nodemailer
    return nodemailer.createTransport({
         // service:'Gmail',
         host:process.env.EMAIL_HOST,
         port:process.env.EMAIL_PORT,
         auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD   
          }
         });
       
     }


  //Send the actual email 
   send(template , subject) {
  
      //1) Render HTML based templates
         
       
       ejs.renderFile(__dirname+`../views/email/${template}.ejs `, 
         {
         firstName :this.firstName,
         url : this.url,
         subject
         } ,  async (err,data)=>{
            console.log(data);
            const mailOptions = { 
               from: this.from,
               to : this.to ,
               subject:subject,
               html:data,
               //text: 
               
               }
               await this.newTransport().sendMail(mailOptions)
         })

      //2) Define email options
      // const mailOptions = { 
      //    from: this.from,
      //    to : this.to ,
      //    subject:subject,
      //    html:html,
      //    //text: 
         
      //    }

      //3) Create a transport and send email
      // await this.newTransport().sendMail(mailOptions)
     //Note:sendMail was built in fxn to send email , which takes one arg as option for mail
      } //sendClosed


      async sendWelcome(){
         //send(template , subject)
         //welcome-->tempalte which created
         await  this.send('welcome' , 'WELCOME TO SMART CITY ..THANK YOU FOR JOINING WITH US!')
       }
      async sendaAppoinmentMail(){
         
         await  this.send('appoinment' , 'Your appoinment is booked!')
       }
      async sendPasswordReset(){
      await this.send('passwordReset','Your password reset token(valid for only 10 minutes)')
   }

}// class Closed












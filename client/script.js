const registerBtn = document.getElementById("register-btn");

// console.log("hello")

const register =   () =>{
    
const fullName = document.querySelector('#full-name').value;
const citizenId = document.querySelector('#citizenship-id').value;
const gender = document.querySelector('#gender').value;
const age = document.querySelector('#age').value;
const permanentAddress = document.querySelector('#address').value;
const contactNbr = document.querySelector('#contact').value;
const emailAdress = document.querySelector('#email').value;
const userPassword = document.querySelector('#password').value;
const confirmPassword = document.querySelector('#confirm-password').value;

const data = {
    name:fullName,
    email:emailAdress,
    citizen_id:citizenId,
    address:permanentAddress,
    age:age,
    gender:gender,
    phone:contactNbr,
    password:userPassword,
    passwordConfirm:confirmPassword
    
}
    const res =  fetch("http://127.0.0.1:4500/api/v1/users/signup", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
           
          },
       body:JSON.stringify(data)

    })
    console.log(response.json());
    //return response.json();
}

registerBtn.addEventListener("click",  register);


// for sign in form

// const signinBtn = document.querySelector('#login-btn');


async function signIN(){
    const signin_Email = document.querySelector('#email').value;
    const signin_Password = document.querySelector('#password').value;

    const data = {
        
        email:signin_Email,
        password:signin_Password
        
    }
        const res = await fetch("http://127.0.0.1:4500/api/v1/users/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                
              },
           body:JSON.stringify(data)
    
        })
        if(await res.status===200){
            window.location.href = "./appoinment.html";
        }
        
    }


// signinBtn.addEventListener('click', signIN);
    




// For Appoinment form select the input value

function appoinment(){
    
const fullName = document.querySelector('#Full-Name').value;
const phoneNumber = document.querySelector('#Phone-Number').value;
const emailAddress = document.querySelector('#Email-Address').value;
const serviceTitle = document.querySelector('#Services-Title').value;
const doctorCode = document.querySelector('#Doctor-Code').value; 

console.log(fullName);

// const data = {
        
//     email:signin_Email,
//     password:signin_Password
    
// }
//     const res = await fetch("http://127.0.0.1:4500/api/v1/users/login", {
//         method: 'POST',
//         headers: {
//             "Content-Type": "application/json",
           
//           },
//        body:JSON.stringify(data)

//     })
//     if(await res.status===200){
//         window.location.href = "./appoinment.html";
//     }
    
}















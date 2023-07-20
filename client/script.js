const registerBtn = document.getElementById("register-btn");

console.log("hello")

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
    //return response.json();
}

registerBtn.addEventListener("click",  register);


// for sign in form

// const signinBtn = document.querySelector('#login-btn');


function signIN(){
    const signin_Email = document.querySelector('#email').value;
    const signin_Password = document.querySelector('#password').value;

    console.log(signin_Email);
}

// signinBtn.addEventListener('click', signIN);
    














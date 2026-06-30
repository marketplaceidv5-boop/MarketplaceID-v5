async function login(){

const login=document.getElementById("login").value;

const password=document.getElementById("password").value;

const message=document.getElementById("message");

message.innerHTML="";

const result=await POST("/login",{

login,

password

});

if(result.success){

location.href="home.html";

}else{

message.innerHTML=result.message;

}

}

async function register(){

const username=
document.getElementById("username").value;

const email=
document.getElementById("email").value;

const password=
document.getElementById("password").value;

const confirmPassword=
document.getElementById("confirmPassword").value;

const message=
document.getElementById("message");

message.innerHTML="";

if(password!==confirmPassword){

message.innerHTML="Konfirmasi password tidak sama";

return;

}

const result=
await POST(

"/register",

{

username,

email,

password

}

);

if(result.success){

alert("Registrasi berhasil");

location.href="login.html";

}else{

message.innerHTML=result.message;

}

}

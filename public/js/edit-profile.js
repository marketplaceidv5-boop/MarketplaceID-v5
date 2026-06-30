async function loadProfile(){

const result=
await GET("/me");

if(!result.success){

location.href="login.html";

return;

}

const user=result.user;

document.getElementById("avatarPreview").src=user.avatar;

document.getElementById("username").value=user.username;

document.getElementById("email").value=user.email;

document.getElementById("location").value=user.location||"";

}

document
.getElementById("avatar")
.onchange=function(){

if(this.files[0]){

document
.getElementById("avatarPreview")
.src=
URL.createObjectURL(
this.files[0]
);

}

};

async function saveProfile(){

const avatar=

document.getElementById("avatar").files[0];

if(avatar){

const form=new FormData();

form.append("avatar",avatar);

await fetch(

"/api/profile/avatar",

{

method:"POST",

credentials:"include",

body:form

}

);

}

await PUT(

"/profile",

{

username:

document.getElementById("username").value,

email:

document.getElementById("email").value,

location:

document.getElementById("location").value,

oldPassword:

document.getElementById("oldPassword").value,

newPassword:

document.getElementById("newPassword").value

}

);

alert("Profil berhasil diperbarui");

location.href="profile.html";

}

loadProfile();

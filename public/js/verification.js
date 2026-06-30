async function loadVerification(){

const result=

await GET(

"/verifications/me"

);

if(!result.success){

return;

}

const box=

document.getElementById(

"verificationStatus"

);

if(!result.verification){

box.innerHTML="";

return;

}

box.innerHTML=`

<div class="card">

<h3>

Status

</h3>

<p>

${result.verification.status.toUpperCase()}

</p>

</div>

`;

}

async function submitVerification(){

const form=new FormData();

form.append(

"fullname",

document.getElementById("fullname").value

);

form.append(

"nik",

document.getElementById("nik").value

);

form.append(

"photo",

document.getElementById("photo").files[0]

);

form.append(

"ktp",

document.getElementById("ktp").files[0]

);

form.append(

"selfie",

document.getElementById("selfie").files[0]

);

const res=

await fetch(

"/api/verifications",

{

method:"POST",

credentials:"include",

body:form

}

);

const result=

await res.json();

if(result.success){

alert("Verifikasi berhasil dikirim");

loadVerification();

}else{

alert(result.message);

}

}

loadVerification();

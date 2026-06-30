const params=new URLSearchParams(location.search);

const userId=params.get("user");

async function loadChat(){

const result=

await GET(

"/chat/"+

userId

);

if(!result.success){

return;

}

const box=

document.getElementById("chatBox");

box.innerHTML="";

result.messages.forEach(msg=>{

const me=

msg.from_user_id==result.me;

box.innerHTML+=`

<div class="${
me?"me":"other"
}">

${
msg.message||""
}

${
msg.image

?

`<br>

<img
class="chat-image"
src="${msg.image}">`

:

""

}

</div>

`;

});

box.scrollTop=

box.scrollHeight;

}

async function sendMessage(){

const form=new FormData();

form.append(

"toUserId",

userId

);

form.append(

"message",

document.getElementById("message").value

);

const file=

document.getElementById("image").files[0];

if(file){

form.append(

"image",

file

);

}

await fetch(

"/api/chat/send",

{

method:"POST",

credentials:"include",

body:form

}

);

document.getElementById("message").value="";

document.getElementById("image").value="";

loadChat();

}

setInterval(loadChat,2000);

loadChat();

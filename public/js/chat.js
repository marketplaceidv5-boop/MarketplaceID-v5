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

const userIdSaya = result.me;

if(result.messages.length){

    const first = result.messages[0];

    const nama =
        String(first.from_user_id) === String(userIdSaya)
        ? first.to_username
        : first.from_username;

    document.getElementById("chatUser").textContent = nama;

}else{

    document.getElementById("chatUser").textContent = "Chat";

}

const box=

document.getElementById("chatBox");

box.innerHTML="";

result.messages.forEach(msg=>{

const me = String(msg.from_user_id) === String(userIdSaya);

box.innerHTML += `
<div class="chat-message ${me ? "me" : "other"}">

    ${msg.image ? `
        <img class="chat-image" src="${msg.image}">
    ` : ""}

    ${msg.message ? `
        <div class="bubble">
            ${msg.message}
        </div>
    ` : ""}

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

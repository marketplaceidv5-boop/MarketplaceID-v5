async function loadInbox(){

const result=
await GET("/inbox");

if(!result.success){

return;

}

const box=
document.getElementById("inboxList");

box.innerHTML="";

if(result.inbox.length===0){

box.innerHTML=`

<div class="card">

<h3>

Belum ada percakapan

</h3>

<p>

Chat dengan penjual atau pembeli akan muncul di sini.

</p>

</div>

`;

return;

}

result.inbox.forEach(chat=>{

box.innerHTML+=`

<div

class="chat-item"

onclick="openChat(${chat.other_user})"

>

<img src="${chat.avatar}">

<div class="chat-info">

<h4>

${chat.username}

${chat.verified?"✔️":""}

</h4>

<div class="chat-last">

${chat.message||"Mengirim gambar"}

</div>

<div class="chat-time">

${new Date(chat.created_at).toLocaleString("id-ID")}

</div>

</div>

${
chat.unread>0

?

`<div class="unread">

${chat.unread}

</div>`

:

""

}

</div>

`;

});

}

function openChat(id){

location.href=

"chat.html?user="

+

id;

}

loadInbox();

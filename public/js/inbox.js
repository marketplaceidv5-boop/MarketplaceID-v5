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

function showChat(){

document.getElementById("chatContent").style.display="block";
document.getElementById("notifContent").style.display="none";

document.getElementById("tabChat").classList.add("active");
document.getElementById("tabNotif").classList.remove("active");

}

async function showNotif(){

document.getElementById("chatContent").style.display="none";
document.getElementById("notifContent").style.display="block";

document.getElementById("tabChat").classList.remove("active");
document.getElementById("tabNotif").classList.add("active");

await loadNotifications();

}

async function loadNotifications(){

const result =
await GET("/notifications");

if(!result.success){

return;

}

const box =
document.getElementById("notificationList");

box.innerHTML = "";

if(result.notifications.length===0){

box.innerHTML=`
<div class="card">
<h3>Belum ada notifikasi</h3>
<p>Notifikasi akan muncul di sini.</p>
</div>
`;

return;

}

result.notifications.forEach(notif=>{

box.innerHTML += `

<div class="card">

<h3>${notif.title}</h3>

<p>${notif.message}</p>

<small>

${new Date(notif.created_at).toLocaleString("id-ID")}

</small>

</div>

`;

});

}

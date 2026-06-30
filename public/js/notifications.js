async function loadNotifications(){

const result=

await GET("/notifications");

if(!result.success){

return;

}

const box=

document.getElementById(

"notificationList"

);

box.innerHTML="";

if(result.notifications.length===0){

box.innerHTML=`

<div class="card">

<h3>

Belum ada notifikasi

</h3>

</div>

`;

return;

}

result.notifications.forEach(item=>{

box.innerHTML+=`

<div class="notification ${

item.read

?

""

:

"unread"

}">

<img src="${

item.avatar||

'../assets/default/avatar.png'

}">

<div class="notification-body">

<div class="notification-title">

${item.title}

</div>

<div class="notification-message">

${item.message}

</div>

<div class="notification-time">

${new Date(

item.created_at

).toLocaleString("id-ID")}

</div>

<div class="notification-action">

<button
onclick="readNotification(${item.id})">

✔ Baca

</button>

<button
onclick="deleteNotification(${item.id})">

🗑 Hapus

</button>

</div>

</div>

</div>

`;

});

}

async function readNotification(id){

await PUT(

"/notifications/"+id+"/read",

{}

);

loadNotifications();

}

async function deleteNotification(id){

await DELETE_API(

"/notifications/"+id

);

loadNotifications();

}

async function readAll(){

await PUT(

"/notifications/read-all",

{}

);

loadNotifications();

}

setInterval(

loadNotifications,

10000

);

loadNotifications();

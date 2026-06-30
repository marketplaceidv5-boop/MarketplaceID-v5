async function loadOrders(){

const result=

await GET("/my-orders");

if(!result.success){

return;

}

const box=

document.getElementById("orderList");

box.innerHTML="";

if(result.orders.length===0){

box.innerHTML=`

<div class="card">

<h3>

Belum ada pesanan.

</h3>

</div>

`;

return;

}

result.orders.forEach(order=>{

let statusClass=

order.status;

box.innerHTML+=`

<div class="order">

<img src="${order.images[0]}">

<div class="order-title">

${order.title}

</div>

<div class="order-price">

Rp ${Number(order.price).toLocaleString("id-ID")}

</div>

<div class="order-info">

📍 ${order.meeting_point}

</div>

<div class="order-info">

📅 ${order.meeting_date}

</div>

<div class="order-info">

🕒 ${order.meeting_time}

</div>

<div class="order-status ${statusClass}">

${order.status.toUpperCase()}

</div>

<div class="order-actions">

<button

onclick="openChat(${order.seller_id})">

💬 Chat

</button>

${
order.status==="accepted"

?

`<button

onclick="completeOrder(${order.id})">

✔ Selesai

</button>`

:

""

}

</div>

</div>

`;

});

}

function openChat(id){

location.href=

"chat.html?user="+id;

}

async function completeOrder(id){

await PUT(

"/orders/"+id+"/status",

{

status:"completed"

}

);

loadOrders();

}

loadOrders();

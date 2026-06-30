async function loadOffers(){

const result=
await GET("/seller-offers");

if(!result.success){

return;

}

const box=
document.getElementById("offerList");

box.innerHTML="";

if(result.offers.length===0){

box.innerHTML=`

<div class="card">

<h3>

Belum ada penawaran.

</h3>

</div>

`;

return;

}

result.offers.forEach(offer=>{

box.innerHTML+=`

<div class="order">

<img src="${offer.images[0]}">

<div class="order-title">

${offer.title}

</div>

<div class="order-info">

Harga Produk

</div>

<div class="order-price">

Rp ${Number(offer.price).toLocaleString("id-ID")}

</div>

<div class="order-info">

Harga Ditawar

</div>

<div
class="order-price"
style="color:#2563eb">

Rp ${Number(offer.offer_price||offer.price).toLocaleString("id-ID")}

</div>

<div class="order-info">

👤 ${offer.buyer_name}

</div>

<div class="order-status ${offer.status}">

${offer.status.toUpperCase()}

</div>

<div class="order-actions">

<button
onclick="acceptOffer(${offer.id})">

✅ Terima

</button>

<button
style="background:#dc2626"

onclick="rejectOffer(${offer.id})">

❌ Tolak

</button>

<button
style="background:#2563eb"

onclick="chatBuyer(${offer.buyer_id})">

💬 Chat

</button>

</div>

</div>

`;

});

}

async function acceptOffer(id){

await PUT(

"/offers/"+id+"/status",

{

status:"accepted"

}

);

alert("Penawaran diterima");

loadOffers();

}

async function rejectOffer(id){

await PUT(

"/offers/"+id+"/status",

{

status:"rejected"

}

);

loadOffers();

}

function chatBuyer(id){

location.href=

"chat.html?user="+id;

}

loadOffers();

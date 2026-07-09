const params=new URLSearchParams(location.search);

let sellerId = null;

let currentImage = 0;

function openSeller(){
    location.href = "seller.html?id=" + sellerId;
}

const productId=params.get("id");

async function loadProduct(){

const result=
await GET("/products/"+productId);

if(!result.success){

return;

}

const p=result.product;

const images = p.images || [];

sellerId = p.seller_id;

document.getElementById("product").innerHTML=`

<div class="gallery">

<img
id="mainImage"
class="product-image"
src="${p.images[0]}">

<div
id="imageCounter"
class="image-counter">

1/${p.images.length}

</div>

</div>

<div
id="imageThumbs"
class="image-thumbs">

</div>

<div class="product-title">

${p.title}

</div>

<div class="product-price">

Rp ${Number(p.price).toLocaleString("id-ID")}

</div>

<div class="product-location">

📍 ${p.location}

</div>

<div
class="seller-card"
onclick="openSeller()">

<img src="${p.avatar}">

<div>

<h3>

${p.username}

${p.verified?"✔️":""}

</h3>

<p>Penjual</p>

</div>

</div>

<div class="product-description">

${p.description}

</div>

<div class="action-buttons">

<button
class="btn"

onclick="favorite()">

❤️ Favorit

</button>

<button
class="btn-secondary"

onclick="chatSeller()">

💬 Chat

</button>

<button
class="btn-offer"
onclick="openOfferModal()">

💰 Tawar Harga

</button>

</div>

`;

document.body.insertAdjacentHTML("beforeend",`

<div id="offerModal" class="offer-modal" style="display:none;">

<div class="offer-box">

<h3>💰 Tawar Harga</h3>

<input
id="offerPrice"
type="number"
placeholder="Masukkan harga">

<textarea
id="offerMessage"
placeholder="Pesan (opsional)"></textarea>

<div class="offer-buttons">

<button onclick="sendOffer()">

Kirim

</button>

<button onclick="closeOfferModal()">

Batal

</button>

</div>

</div>

</div>

`);

// Membuat thumbnail
const thumbs = document.getElementById("imageThumbs");

thumbs.innerHTML = "";

images.forEach((img,index)=>{

const item = document.createElement("img");

item.src = img;

item.className = "image-thumb";

if(index===0){

item.classList.add("active");

}

item.onclick = function(){

currentImage = index;

document.getElementById("mainImage").src = img;

document.getElementById("imageCounter").innerText =
(index+1)+"/"+images.length;

document
.querySelectorAll(".image-thumb")
.forEach(t=>t.classList.remove("active"));

item.classList.add("active");

};

thumbs.appendChild(item);

});

loadRelated();

}

async function loadRelated(){

const result=

await GET(

"/products/"

+

productId

+

"/related"

);

if(!result.success){

return;

}

const box=

document.getElementById(

"relatedProducts"

);

box.innerHTML="";

result.products.forEach(p=>{

box.innerHTML+=`

<div class="product">

<a href="product.html?id=${p.id}">

<img src="${p.images[0]}">

<div class="product-info">

<h4>

${p.title}

</h4>

<div class="price">

Rp ${Number(p.price).toLocaleString("id-ID")}

</div>

</div>

</a>

</div>

`;

});

}

async function favorite(){

await POST(

"/favorites/"+

productId,

{}

);

alert("Produk ditambahkan ke favorit");

}

function chatSeller(){

if(!sellerId){
    alert("Penjual tidak ditemukan");
    return;
}

location.href =
"chat.html?user=" + sellerId +
"&product=" + productId;

}

loadProduct();

function openOfferModal(){

document.getElementById("offerModal").style.display="flex";

}

function closeOfferModal(){

document.getElementById("offerModal").style.display="none";

}

async function sendOffer(){

const price=document.getElementById("offerPrice").value;

const message=document.getElementById("offerMessage").value;

if(!price){

alert("Masukkan harga tawaran");

return;

}

const result=await POST("/offers",{

productId,

sellerId,

price,

message

});

if(result.success){

alert("Penawaran berhasil dikirim");

closeOfferModal();

}else{

alert(result.message||"Gagal mengirim penawaran");

}

}

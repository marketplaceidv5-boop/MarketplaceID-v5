const params=new URLSearchParams(location.search);

let sellerId = null;

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

sellerId = p.seller_id;

document.getElementById("product").innerHTML=`

<img
class="product-image"
src="${p.images[0]}">

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

</div>

`;

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

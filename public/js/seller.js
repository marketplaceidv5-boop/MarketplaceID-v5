const params=new URLSearchParams(location.search);

const sellerId=params.get("id");

async function loadSeller(){

const result=
await GET("/seller/"+sellerId);

if(!result.success){

return;

}

console.log(result);

const seller = result.seller;
const products = result.products || [];

document.getElementById("sellerAvatar").src=seller.avatar;

document.getElementById("sellerName").innerHTML=seller.username;

document.getElementById("sellerLocation").innerHTML=

"📍 "+(seller.location||"-");

document.getElementById("sellerJoinDate").innerHTML=

"Bergabung "+new Date(
seller.created_at
).toLocaleDateString("id-ID");

document.getElementById("sellerVerified").innerHTML=

seller.verified

?

'<span class="badge">✔ Verified</span>'

:

"";

document.getElementById("sellerProducts").innerHTML =
products.length;

document.getElementById("sellerSold").innerHTML =
0;

document.getElementById("sellerRating").innerHTML =
"0⭐";

const box=

document.getElementById(

"sellerProductsList"

);

box.innerHTML="";

products.forEach(product=>{

box.innerHTML+=`

<div class="product">

<a href="product.html?id=${product.id}">

<img src="${product.images[0]}">

<div class="product-info">

<h4>

${product.title}

</h4>

<div class="price">

Rp ${Number(product.price).toLocaleString("id-ID")}

</div>

</div>

</a>

</div>

`;

});

}

async function followSeller(){

await POST(

"/follow/"+sellerId,

{}

);

alert("Berhasil mengikuti penjual");

}

function chatSeller(){

location.href=

"chat.html?user="+sellerId;

}

loadSeller();

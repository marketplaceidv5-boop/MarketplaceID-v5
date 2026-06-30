async function loadFavorites(){

const result=
await GET("/favorites");

if(!result.success){

return;

}

const box=
document.getElementById(
"favoriteList"
);

box.innerHTML="";

if(result.products.length===0){

box.innerHTML=

"<h3>Belum ada produk favorit.</h3>";

return;

}

result.products.forEach(product=>{

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

<div class="location">

📍 ${product.location}

</div>

</div>

</a>

</div>

`;

});

}

loadFavorites();

async function loadHome(){

const result=
await GET("/home");

if(!result.success){

return;

}

renderProducts(

"recommendProducts",

result.recommend

);

renderProducts(

"latestProducts",

result.latest

);

}

function renderProducts(

id,

products

){

const box=
document.getElementById(id);

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

<div class="location">

📍 ${product.location}

</div>

</div>

</a>

</div>

`;

});

}

async function searchProduct(){

const keyword=

document.getElementById(

"search"

).value;

if(keyword.length<2){

loadHome();

return;

}

const result=

await GET(

"/search?q="+

encodeURIComponent(keyword)

);

renderProducts(

"latestProducts",

result.products

);

}

async function loadCategory(category){

const result=

await GET(

"/category/"+

encodeURIComponent(category)

);

renderProducts(

"latestProducts",

result.products

);

}

loadHome();

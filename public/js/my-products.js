async function loadProducts(){

const result = await GET("/my-products");

const box = document.getElementById("products");

if(!result.success){

// Jika belum login
location.href="/public/pages/login.html";

// atau jika ingin menampilkan pesan:
// alert("Silakan login terlebih dahulu.");

return;

}

if(result.products.length===0){

box.innerHTML="<center>Belum ada produk</center>";

return;

}

box.innerHTML="";

result.products.forEach(product=>{

box.innerHTML += `

<div class="card">

<img src="${product.images?.[0] || '../assets/default/product.png'}">

<h3>${product.title}</h3>

<p>Rp ${Number(product.price).toLocaleString("id-ID")}</p>

<p>Status : ${product.status}</p>

<button onclick="location.href='product.html?id=${product.id}'">

Lihat

</button>

<button onclick="editProduct(${product.id})">

Edit

</button>

<button onclick="deleteProduct(${product.id})">

Hapus

</button>

</div>

`;

});

}

function editProduct(id){

location.href =
"/public/pages/edit-product.html?id="+id;

}

async function deleteProduct(id){

if(!confirm("Hapus produk ini?")) return;

const result = await DELETE_API("/products/"+id);

if(result.success){

loadProducts();

}else{

alert(result.message||"Gagal menghapus");

}

}

loadProducts();

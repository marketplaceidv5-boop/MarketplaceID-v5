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

const totalFoto = product.images?.length || 1;

box.innerHTML += `

<div class="my-card">

<div class="my-image">

<img
id="img${product.id}"
src="${product.images?.[0] || '../assets/default/product.png'}">

<div class="status-badge">

${product.status==="sold" ? "✅ Terjual" : "🟢 Active"}

</div>

<div
id="count${product.id}"
class="photo-count">

1/${totalFoto}

</div>

</div>

<div class="my-thumbs">

${(product.images || []).map((img,index)=>`

<img
class="thumb ${index===0?"active":""}"
src="${img}"
onclick="changeMyPhoto(this,'img${product.id}','count${product.id}','${product.images.join("|")}',${index})">

`).join("")}

</div>

<div class="my-info">

<div class="my-title">

${product.title}

</div>

<div class="my-price">

Rp ${Number(product.price).toLocaleString("id-ID")}

</div>

<div class="info-grid">

<div class="info-box">

<b>📂 Kategori</b><br>

${product.category || "-"}

</div>

<div class="info-box">

<b>📍 Lokasi</b><br>

${product.location || "-"}

</div>

<div class="info-box">

<b>👁 Dilihat</b><br>

${product.views || 0} kali

</div>

<div class="info-box">

<b>📅 Diposting</b><br>

${new Date(product.created_at).toLocaleDateString("id-ID")}

</div>

</div>

<div class="action-grid">

<button

class="btn-view"

onclick="location.href='product.html?id=${product.id}'">

👁 Lihat

</button>

class="btn-edit"

onclick="editProduct(${product.id})">

✏️ Edit

</button>

<button

${product.status==="active" ? `
<button
class="btn-sold"
onclick="markSold(${product.id})">

✅ Terjual

</button>
` : `
<button
class="btn-sold"
disabled>

✔ Sudah Terjual

</button>

`}

<button

class="btn-delete"

onclick="deleteProduct(${product.id})">

🗑 Hapus

</button>

</div>

</div>

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

async function markSold(id){

if(!confirm("Tandai produk ini sebagai TERJUAL?")) return;

const result = await PUT("/products/"+id+"/sold",{});

if(result.success){

alert("Produk berhasil ditandai sebagai terjual");

loadProducts();

}else{

alert(result.message || "Gagal");

}

}

function changeMyPhoto(el,imgId,countId,images,index){

const list = images.split("|");

document.getElementById(imgId).src = list[index];

document.getElementById(countId).innerText =
(index+1)+"/"+list.length;

el.parentNode
.querySelectorAll(".thumb")
.forEach(t=>t.classList.remove("active"));

el.classList.add("active");

}

loadProducts();

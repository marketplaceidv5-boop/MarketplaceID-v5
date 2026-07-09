const id = new URLSearchParams(location.search).get("id");

const imageInput = document.getElementById("images");
const photoMain = document.getElementById("photoMain");
const photoThumbs = document.getElementById("photoThumbs");

const title = document.getElementById("title");
const description = document.getElementById("description");
const category = document.getElementById("category");
const price = document.getElementById("price");
const oldPrice = document.getElementById("oldPrice");
const locationInput = document.getElementById("location");

let productImages = [];
let selectedIndex = 0;

imageInput.onchange = function(){

const files = [...imageInput.files];

files.forEach(file=>{

productImages.push(URL.createObjectURL(file));

});

renderPhotos();

};

async function loadProduct(){

const result = await GET("/products/"+id);

if(!result.success){

alert("Produk tidak ditemukan");

history.back();

return;

}

const p = result.product;

productImages = [...(p.images || [])];

renderPhotos();

title.value = p.title || "";
description.value = p.description || "";
category.value = p.category || "Lainnya";
price.value = p.price || "";
oldPrice.value = p.old_price || "";
locationInput.value = p.location || "";

}

async function saveProduct(){

console.log("Location Input =", locationInput.value);

const data = {

title: title.value,
description: description.value,
category: category.value,
price: price.value,
oldPrice: oldPrice.value,
location: locationInput.value

};

console.log(data);

const result = await PUT("/products/"+id,data);

console.log(result);

if(result.success){

const files = document.getElementById("images").files;

if(files.length > 0){

const form = new FormData();

for(const file of files){

form.append("images", file);

}

const upload = await fetch(

"/api/products/" + id + "/images",

{

method:"PUT",

credentials:"include",

body:form

}

);

const uploadResult = await upload.json();

if(!uploadResult.success){

alert("Data berhasil disimpan, tetapi upload foto gagal");
return;

}

}

alert("Produk berhasil diupdate");

location.href="my-products.html";

}else{

alert(result.message || "Gagal");

}

}

loadProduct();

function renderPhotos(){

if(productImages.length===0){

photoMain.innerHTML=`

<div class="photo-placeholder"
onclick="imageInput.click()">

<div class="plus-circle">+</div>

<p>Tambah Foto</p>

</div>

`;

photoThumbs.innerHTML="";

return;

}

photoMain.innerHTML=`

<img
class="main-image"
src="${productImages[selectedIndex]}">

<div class="main-overlay">

<div class="main-badge">

⭐ Foto Utama

</div>

<div class="main-counter">

${selectedIndex+1}/${productImages.length}

</div>

</div>

`;

photoThumbs.innerHTML="";

productImages.forEach((img,index)=>{

const thumb=document.createElement("div");

thumb.className=
index===selectedIndex
?
"thumb-item active"
:
"thumb-item";

thumb.innerHTML=`

<img src="${img}">

<div class="thumb-remove">

✕

</div>

`;

thumb.querySelector(".thumb-remove").onclick=function(e){

e.stopPropagation();

productImages.splice(index,1);

if(selectedIndex>=productImages.length){

selectedIndex=Math.max(0,productImages.length-1);

}

renderPhotos();

};

thumb.onclick=function(){

selectedIndex=index;

renderPhotos();

};

photoThumbs.appendChild(thumb);

});

for(let i=productImages.length;i<5;i++){

const add=document.createElement("div");

add.className="thumb-add";

add.innerHTML="+";

add.onclick=function(){

imageInput.click();

};

photoThumbs.appendChild(add);

}

}

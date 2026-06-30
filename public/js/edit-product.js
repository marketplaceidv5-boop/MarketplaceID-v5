const id = new URLSearchParams(location.search).get("id");

async function loadProduct(){

const result = await GET("/products/"+id);

if(!result.success){

alert("Produk tidak ditemukan");

history.back();

return;

}

const p = result.product;

title.value = p.title;
description.value = p.description;
category.value = p.category;
price.value = p.price;
oldPrice.value = p.old_price;
location.value = p.location;

}

async function saveProduct(){

const data = {
title: title.value,
description: description.value,
price: price.value,
oldPrice: oldPrice.value,
location: location.value
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

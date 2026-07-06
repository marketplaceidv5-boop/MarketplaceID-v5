const imageInput = document.getElementById("images");

const photoMain = document.getElementById("photoMain");
const photoThumbs = document.getElementById("photoThumbs");

let selectedIndex = 0;

let productImages = [];

imageInput.onchange=function(){

const newFiles=[...this.files];

productImages.push(...newFiles);

if(productImages.length>10){

productImages=productImages.slice(0,10);

}

renderPhotos();

this.value="";

};

if(navigator.geolocation){

navigator.geolocation.getCurrentPosition(pos=>{

document.getElementById("latitude").value=

pos.coords.latitude;

document.getElementById("longitude").value=

pos.coords.longitude;

});

}

async function uploadProduct(){

  console.log("1. uploadProduct dipanggil");

  const form = new FormData();

  form.append("title", document.getElementById("title").value);
  form.append("description", document.getElementById("description").value);
  form.append("category", document.getElementById("category").value);
  form.append("price", document.getElementById("price").value);
  form.append("oldPrice", document.getElementById("oldPrice").value);
  form.append("location", document.getElementById("location").value);
  form.append("latitude", document.getElementById("latitude").value);
  form.append("longitude", document.getElementById("longitude").value);

  const files = productImages;

  for(let i=0;i<files.length;i++){
    form.append("images", files[i]);
  }

  console.log("2. FormData selesai");

  try{

    console.log("3. Mengirim request");

    const res = await fetch("/api/products",{
      method:"POST",
      credentials:"include",
      body:form
    });

    console.log("4. Status:",res.status);

    const result = await res.json();

    console.log(result);

    if(result.success){

      alert("Produk berhasil diupload");

      location.href="home.html";

    }else{

      alert(result.message || "Upload gagal");

    }

  }catch(err){

    console.error(err);

    alert(err.message);

  }

}

function renderPhotos(){

const files=productImages;

if(files.length===0){

photoMain.innerHTML = `
<div class="photo-placeholder"
onclick="document.getElementById('images').click()">

<div class="plus-circle">+</div>

<p>Tambah Foto</p>

</div>
`;

photoThumbs.innerHTML="";

return;

}

const main=files[selectedIndex];

photoMain.innerHTML = `
<img
src="${URL.createObjectURL(main)}">

<div class="photo-overlay">

<div class="photo-badge">

⭐ Foto Utama

</div>

<div class="photo-count">

${selectedIndex+1}/${files.length}

</div>

</div>
`;

photoThumbs.innerHTML = "";

// tampilkan semua foto
files.forEach((file,index)=>{

const thumb=document.createElement("div");

thumb.className="thumb-item";

if(index===selectedIndex){

thumb.classList.add("active");

}

thumb.innerHTML=`
<img src="${URL.createObjectURL(file)}">
<div class="thumb-remove">×</div>
`;

thumb.querySelector(".thumb-remove").onclick=function(e){

e.stopPropagation();

productImages.splice(index,1);

if(productImages.length===0){

selectedIndex=0;

}else if(selectedIndex>=productImages.length){

selectedIndex=productImages.length-1;

}

renderPhotos();

};

thumb.onclick=function(){

selectedIndex=index;

renderPhotos();

};

photoThumbs.appendChild(thumb);

});

// isi slot kosong sampai 10
for(let i=files.length;i<10;i++){

const add=document.createElement("div");

add.className="thumb-add";

add.innerHTML="+";

add.onclick=function(){

imageInput.click();

};

photoThumbs.appendChild(add);

}

}

const imageInput = document.getElementById("images");

const mainPhoto = document.getElementById("mainPhoto");
const thumbList = document.getElementById("thumbList");

const preview = document.getElementById("previewImages");

let selectedIndex = 0;

imageInput.addEventListener("change",()=>{

selectedIndex = 0;

renderPreview();

});

function renderPreview(){

const files = [...imageInput.files];

if(files.length===0){

mainPhoto.innerHTML=`
<div class="empty-photo">
<div class="camera-icon">📷</div>
<h3>Tekan untuk memilih foto</h3>
<p>PNG • JPG • Maksimal 10 Foto</p>
<div id="photoCounter">0/10</div>
</div>
`;

thumbList.innerHTML="";

return;

}

const main = files[selectedIndex];

mainPhoto.innerHTML=`

<img
class="main-photo-image"
src="${URL.createObjectURL(main)}">

<div class="main-photo-info">

<span class="main-badge">

🟢 Foto Utama

</span>

<span class="photo-total">

${selectedIndex+1}/${files.length}

</span>

</div>

`;

thumbList.innerHTML="";

files.forEach((file,index)=>{

const item=document.createElement("div");

item.className="thumb-item";

item.innerHTML=`
<img src="${URL.createObjectURL(file)}">
`;

item.onclick=function(){

selectedIndex=index;

renderPreview();

};

thumbList.appendChild(item);

});

if(files.length<10){

const add=document.createElement("div");

add.className="thumb-add";

add.innerHTML="+";

add.onclick=function(){

imageInput.click();

};

thumbList.appendChild(add);

}

}

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

  const files = imageInput.files;

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

async function loadOffers(){

  const result = await GET("/seller-offers");

  if(!result.success){
    return;
  }

  const list = document.getElementById("offerList");

  list.innerHTML="";

  result.offers.forEach(offer=>{

    list.innerHTML += `
    <div class="offer-card">

      <img
      src="${offer.images?.[0] || '/public/img/no-image.png'}"
      class="offer-image">

      <div class="offer-info">

        <h3>${offer.title}</h3>

        <p>Harga Awal</p>

        <b>Rp${Number(offer.original_price).toLocaleString("id-ID")}</b>

        <hr>

        <p>Tawaran Pembeli</p>

        <b style="color:#16a34a">
        Rp${Number(offer.price).toLocaleString("id-ID")}
        </b>

        <p>${offer.message || "Tidak ada pesan"}</p>

        <div class="offer-actions">

          <button onclick="acceptOffer(${offer.id})">
          ✅ Terima
          </button>

          <button onclick="counterOffer(${offer.id})">
          🔄 Tawar Balik
          </button>

          <button onclick="rejectOffer(${offer.id})">
          ❌ Tolak
          </button>

        </div>

      </div>

    </div>
    `;

  });

}

loadOffers();

async function acceptOffer(id){

  await PUT("/offers/"+id+"/accept",{});

  loadOffers();

}

async function rejectOffer(id){

  await PUT("/offers/"+id+"/reject",{});

  loadOffers();

}

async function counterOffer(id){

  const price = prompt("Masukkan harga baru");

  if(!price) return;

  const message = prompt("Pesan");

  await PUT("/offers/"+id+"/counter",{

    price,

    message

  });

  loadOffers();

}

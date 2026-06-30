async function openMenu(menu){

const box=
document.getElementById(
"adminContent"
);

box.innerHTML=
"<div class='card'>Loading...</div>";

switch(menu){

case "dashboard":

loadDashboard();

break;

case "users":

loadUsers();

break;

case "products":

loadProducts();

break;

case "reports":

loadReports();

break;

case "verification":

loadVerification();

break;

case "appeals":

loadAppeals();

break;

case "statistics":

loadStatistics();

break;

case "settings":

loadSettings();

break;

}

}

async function loadDashboard(){

const data=
await GET("/admin/dashboard");

document.getElementById(
"adminContent"
).innerHTML=`

<div class="admin-card">

<h2>

Dashboard

</h2>

<p>

👥 User :
${data.dashboard.totalUsers}

</p>

<p>

📦 Produk :
${data.dashboard.totalProducts}

</p>

<p>

💬 Chat :
${data.dashboard.totalChats}

</p>

<p>

💰 Order :
${data.dashboard.totalOrders}

</p>

</div>

`;

}

/* =========================
   USERS
========================= */

async function loadUsers(){

const result=
await GET("/admin/users");

const box=
document.getElementById("adminContent");

box.innerHTML="<h2>Kelola User</h2>";

result.users.forEach(user=>{

box.innerHTML+=`

<div class="admin-card">

<h3>

${user.username}

${user.verified?" ✔":""}

</h3>

<p>

${user.email}

</p>

<p>

Role :
${user.role}

</p>

<p>

Status :
${user.blocked?"Diblokir":"Aktif"}

</p>

<div class="order-actions">

<button
onclick="changeRole(${user.id})">

👑 Role

</button>

<button
style="background:#dc2626"

onclick="blockUser(${user.id})">

🚫 Block

</button>

</div>

</div>

`;

});

}

/* =========================
   PRODUCTS
========================= */

async function loadProducts(){

const result=
await GET("/admin/products");

const box=
document.getElementById("adminContent");

box.innerHTML="<h2>Kelola Produk</h2>";

result.products.forEach(product=>{

box.innerHTML+=`

<div class="admin-card">

<img
style="width:100%;height:180px;object-fit:cover;border-radius:12px"

src="${product.images[0]}">

<h3>

${product.title}

</h3>

<p>

Rp ${Number(product.price).toLocaleString("id-ID")}

</p>

<p>

Status :
${product.status}

</p>

<div class="order-actions">

<button

onclick="disableProduct(${product.id})">

🚫 Nonaktifkan

</button>

<button

onclick="enableProduct(${product.id})">

✅ Aktifkan

</button>

</div>

</div>

`;

});

}

/* =========================
   REPORTS
========================= */

async function loadReports(){

const result=
await GET("/admin/reports");

const box=
document.getElementById("adminContent");

box.innerHTML="<h2>Laporan</h2>";

result.reports.forEach(report=>{

box.innerHTML+=`

<div class="admin-card">

<h3>

Produk #${report.product_id}

</h3>

<p>

Pelapor :

${report.reporter_name}

</p>

<p>

${report.reason}

</p>

</div>

`;

});

}

/* =========================
   VERIFICATION
========================= */

async function loadVerification(){

const result=
await GET("/admin/verifications");

const box=
document.getElementById("adminContent");

box.innerHTML="<h2>Verifikasi</h2>";

result.verifications.forEach(v=>{

box.innerHTML+=`

<div class="admin-card">

<h3>

${v.username}

</h3>

<p>

${v.fullname}

</p>

<div class="order-actions">

<button

onclick="approveVerification(${v.id})">

✔ Approve

</button>

<button

style="background:#dc2626"

onclick="rejectVerification(${v.id})">

✖ Tolak

</button>

</div>

</div>

`;

});

}

/* =========================
   APPEALS
========================= */

async function loadAppeals(){

const result=
await GET("/admin/appeals");

const box=
document.getElementById("adminContent");

box.innerHTML="<h2>Banding</h2>";

result.appeals.forEach(item=>{

box.innerHTML+=`

<div class="admin-card">

<h3>

Produk #${item.product_id}

</h3>

<p>

${item.reason}

</p>

<div class="order-actions">

<button

onclick="approveAppeal(${item.id})">

✔ Setujui

</button>

<button

style="background:#dc2626"

onclick="rejectAppeal(${item.id})">

✖ Tolak

</button>

</div>

</div>

`;

});

}

/* =========================
   STATISTICS
========================= */

async function loadStatistics(){

const result=
await GET("/admin/dashboard");

document.getElementById("adminContent").innerHTML=`

<div class="admin-card">

<h2>

Statistik Marketplace

</h2>

<p>

👥 User :

${result.dashboard.totalUsers}

</p>

<p>

📦 Produk :

${result.dashboard.totalProducts}

</p>

<p>

💬 Chat :

${result.dashboard.totalChats}

</p>

<p>

🛒 Order :

${result.dashboard.totalOrders}

</p>

<p>

💰 Offer :

${result.dashboard.totalOffers}

</p>

</div>

`;

}

/* =========================
   SETTINGS
========================= */

function loadSettings(){

document.getElementById("adminContent").innerHTML=`

<div class="admin-card">

<h2>

Pengaturan Admin

</h2>

<p>

MarketplaceID Admin Panel

Version 4.0

</p>

</div>

`;

}

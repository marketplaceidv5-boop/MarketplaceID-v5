async function loadProfile(){

const result=
await GET("/me");

if(!result.success){

location.href="login.html";

return;

}

const user=result.user;

document.getElementById("avatar").src=user.avatar;

document.getElementById("username").innerHTML=user.username;

document.getElementById("email").innerHTML=user.email;

document.getElementById("verifiedBadge").innerHTML=

user.verified

?

'<span class="badge">✔ Verified</span>'

:

'<span class="badge" style="background:#999">Belum Verifikasi</span>';

const myProducts=
await GET("/my-products");

if(myProducts.success){

document.getElementById("productCount").innerHTML=

myProducts.products.length;

}

const sellerOrders=
await GET("/seller-orders");

if(sellerOrders.success){

document.getElementById("soldCount").innerHTML=

sellerOrders.orders.filter(

o=>o.status==="completed"

).length;

}

const reviews=
await GET(

"/reviews/"+

user.id

);

if(reviews.success){

document.getElementById("rating").innerHTML=

reviews.rating+"⭐";

}

}

async function logout(){

await POST("/logout",{});

location.href="login.html";

}

loadProfile();


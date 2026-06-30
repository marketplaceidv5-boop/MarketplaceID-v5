async function logout(){

if(!confirm("Keluar dari akun?")){

return;

}

await POST(

"/logout",

{}

);

location.href="login.html";

}

function clearCache(){

localStorage.clear();

sessionStorage.clear();

alert("Cache berhasil dihapus");

}

const params=new URLSearchParams(location.search);

const userId=params.get("user");

async function loadChat(){

const result=

await GET(

"/chat/"+

userId

);

if(!result.success){

return;

}

const userIdSaya = result.me;

if(result.messages.length){

    const first = result.messages[0];

    const nama =
        String(first.from_user_id) === String(userIdSaya)
        ? first.to_username
        : first.from_username;

    document.getElementById("chatUser").textContent = nama;

}else{

    document.getElementById("chatUser").textContent = "Chat";

}

const box=

document.getElementById("chatBox");

box.innerHTML="";

result.messages.forEach(msg=>{

const me = String(msg.from_user_id) === String(userIdSaya);

const waktu = new Date(msg.created_at).toLocaleTimeString(
    "id-ID",
    {
        hour:"2-digit",
        minute:"2-digit"
    }
);

const status =
me
? (msg.read ? "✓✓" : "✓")
: "";

box.innerHTML += `
<div class="chat-message ${me ? "me" : "other"}">
    <div class="bubble">
        ${msg.image ? `<img class="chat-image" src="${msg.image}"><br>` : ""}
        ${
msg.message &&
msg.message.includes("https://maps.google.com")

?

`<a
href="${msg.message.replace("📍 ","")}"
target="_blank">

📍 Bagikan Lokasi

</a>`

:

msg.message || ""

}

   <div class="chat-time">
        ${waktu} ${status}
    </div>
</div>
`;

});

box.scrollTo({
    top: box.scrollHeight,
    behavior: "smooth"
});
}

async function sendMessage(){

const form=new FormData();

form.append(

"toUserId",

userId

);

form.append(

"message",

document.getElementById("message").value

);

const file=

document.getElementById("image").files[0];

if(file){

form.append(

"image",

file

);

}

await fetch(

"/api/chat/send",

{

method:"POST",

credentials:"include",

body:form

}

);

document.getElementById("message").value="";

document.getElementById("image").value="";

loadChat();

}

async function sendLocation(){

if(!navigator.geolocation){
    alert("Browser tidak mendukung lokasi");
    return;
}

navigator.geolocation.getCurrentPosition(async(pos)=>{

    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    const form = new FormData();

    form.append("toUserId", userId);

    form.append(
        "message",
        `📍 https://maps.google.com/?q=${lat},${lng}`
    );

    await fetch("/api/chat/send",{

        method:"POST",

        credentials:"include",

        body:form

    });

    loadChat();

},()=>{

    alert("Lokasi gagal diambil");

});

}

setInterval(loadChat,2000);

loadChat();

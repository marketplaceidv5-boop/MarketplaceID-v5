const API="/api";

async function GET(url){

const res=
await fetch(

API+url,

{

credentials:"include"

}

);

return res.json();

}

async function POST(

url,

data

){

const res=
await fetch(

API+url,

{

method:"POST",

credentials:"include",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(data)

}

);

return res.json();

}

async function PUT(

url,

data

){

const res=
await fetch(

API+url,

{

method:"PUT",

credentials:"include",

headers:{

"Content-Type":

"application/json"

},

body:

JSON.stringify(data)

}

);

return res.json();

}

async function DELETE_API(

url

){

const res=
await fetch(

API+url,

{

method:"DELETE",

credentials:"include"

}

);

return res.json();

}

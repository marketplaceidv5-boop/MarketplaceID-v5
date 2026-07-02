const cloudinary = require("cloudinary").v2;

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "KOSONG");
console.log("API Key:", process.env.CLOUDINARY_API_KEY || "KOSONG");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "ADA" : "KOSONG");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;

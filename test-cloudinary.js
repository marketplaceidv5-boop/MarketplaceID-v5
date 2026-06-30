require("dotenv").config();

const cloudinary = require("./config/cloudinary");

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected");
    console.log(result);
  } catch (err) {
    console.error("❌ Cloudinary Error");
    console.error(err.message);
  }
}

test();

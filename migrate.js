require("dotenv").config();

const fs = require("fs");
const path = require("path");
const db = require("./database/postgres/db");

async function migrate() {
  try {
    const schemaPath = path.join(
      __dirname,
      "database",
      "postgres",
      "schema.sql"
    );

    const sql = fs.readFileSync(schemaPath, "utf8");

    await db.pool.query(sql);

    console.log("✅ Database schema berhasil diimport");

    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal import schema");
    console.error(err);
    process.exit(1);
  }
}

migrate();

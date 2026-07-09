require("dotenv").config();

const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async()=>{

const result = await db.query(`
SELECT
column_name,
data_type
FROM information_schema.columns
WHERE table_name='offers'
ORDER BY ordinal_position
`);

console.table(result.rows);

process.exit();

})();

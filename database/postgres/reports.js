const db = require("./db");

/* =========================
   CREATE REPORT
========================= */

async function createReport(data){

  const exists = await db.query(
    `
    SELECT id

    FROM reports

    WHERE

      reporter_id=$1

      AND

      product_id=$2

    LIMIT 1
    `,
    [
      data.reporterId,
      data.productId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO reports
    (
      reporter_id,
      product_id,
      reason,
      status
    )
    VALUES
    ($1,$2,$3,'pending')
    RETURNING *
    `,
    [
      data.reporterId,
      data.productId,
      data.reason
    ]
  );

  return result.rows[0];

}

/* =========================
   GET REPORT
========================= */

async function getReport(id){

  const result = await db.query(
    `
    SELECT

      r.*,

      u.username AS reporter_name,

      p.title AS product_title

    FROM reports r

    JOIN users u
      ON u.id=r.reporter_id

    JOIN products p
      ON p.id=r.product_id

    WHERE r.id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   GET ALL REPORTS
========================= */

async function getReports(){

  const result = await db.query(
    `
    SELECT

      r.*,

      u.username AS reporter_name,

      p.title AS product_title,

      p.seller_id

    FROM reports r

    JOIN users u
      ON u.id=r.reporter_id

    JOIN products p
      ON p.id=r.product_id

    ORDER BY

      r.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   PENDING REPORTS
========================= */

async function getPendingReports(){

  const result = await db.query(
    `
    SELECT

      r.*,

      u.username AS reporter_name,

      p.title AS product_title

    FROM reports r

    JOIN users u
      ON u.id=r.reporter_id

    JOIN products p
      ON p.id=r.product_id

    WHERE

      r.status='pending'

    ORDER BY

      r.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(id,status){

  const result = await db.query(
    `
    UPDATE reports

    SET status=$1

    WHERE id=$2

    RETURNING *
    `,
    [
      status,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE REPORT
========================= */

async function deleteReport(id){

  const result = await db.query(
    `
    DELETE FROM reports

    WHERE id=$1

    RETURNING *
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   TOTAL REPORTS
========================= */

async function countReports(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM reports
    `
  );

  return result.rows[0].total;

}

/* =========================
   TOTAL PENDING
========================= */

async function countPendingReports(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM reports

    WHERE status='pending'
    `
  );

  return result.rows[0].total;

}

module.exports={

createReport,

getReport,

getReports,

getPendingReports,

updateStatus,

deleteReport,

countReports,

countPendingReports

};


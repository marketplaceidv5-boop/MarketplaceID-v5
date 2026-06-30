const db = require("./db");

/* =========================
   CREATE APPEAL
========================= */

async function createAppeal(data){

  const exists = await db.query(
    `
    SELECT id

    FROM appeals

    WHERE

      product_id=$1

      AND

      seller_id=$2

      AND

      status='pending'

    LIMIT 1
    `,
    [
      data.productId,
      data.sellerId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO appeals
    (
      product_id,
      seller_id,
      reason,
      status
    )
    VALUES
    ($1,$2,$3,'pending')
    RETURNING *
    `,
    [
      data.productId,
      data.sellerId,
      data.reason
    ]
  );

  return result.rows[0];

}

/* =========================
   GET APPEAL
========================= */

async function getAppeal(id){

  const result = await db.query(
    `
    SELECT

      a.*,

      p.title,

      u.username,

      u.avatar

    FROM appeals a

    JOIN products p
      ON p.id=a.product_id

    JOIN users u
      ON u.id=a.seller_id

    WHERE a.id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   GET ALL APPEALS
========================= */

async function getAppeals(){

  const result = await db.query(
    `
    SELECT

      a.*,

      p.title,

      u.username,

      u.avatar

    FROM appeals a

    JOIN products p
      ON p.id=a.product_id

    JOIN users u
      ON u.id=a.seller_id

    ORDER BY a.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   USER APPEALS
========================= */

async function getUserAppeals(userId){

  const result = await db.query(
    `
    SELECT

      a.*,

      p.title

    FROM appeals a

    JOIN products p
      ON p.id=a.product_id

    WHERE a.seller_id=$1

    ORDER BY a.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   APPROVE APPEAL
========================= */

async function approveAppeal(id){

  const result = await db.query(
    `
    UPDATE appeals

    SET status='approved'

    WHERE id=$1

    RETURNING *
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   REJECT APPEAL
========================= */

async function rejectAppeal(id){

  const result = await db.query(
    `
    UPDATE appeals

    SET status='rejected'

    WHERE id=$1

    RETURNING *
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   DELETE APPEAL
========================= */

async function deleteAppeal(id){

  const result = await db.query(
    `
    DELETE FROM appeals

    WHERE id=$1

    RETURNING *
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   TOTAL APPEALS
========================= */

async function countAppeals(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM appeals
    `
  );

  return result.rows[0].total;

}

/* =========================
   PENDING APPEALS
========================= */

async function countPendingAppeals(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM appeals

    WHERE status='pending'
    `
  );

  return result.rows[0].total;

}

module.exports={

createAppeal,

getAppeal,

getAppeals,

getUserAppeals,

approveAppeal,

rejectAppeal,

deleteAppeal,

countAppeals,

countPendingAppeals

};

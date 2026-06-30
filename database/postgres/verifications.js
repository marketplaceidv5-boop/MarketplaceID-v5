const db = require("./db");

/* =========================
   CREATE VERIFICATION
========================= */

async function createVerification(data){

  const exists = await db.query(
    `
    SELECT id

    FROM verifications

    WHERE

      user_id=$1

      AND

      status='pending'

    LIMIT 1
    `,
    [
      data.userId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO verifications
    (
      user_id,
      photo,
      ktp,
      selfie,
      status
    )
    VALUES
    ($1,$2,$3,$4,'pending')
    RETURNING *
    `,
    [
      data.userId,
      data.photo,
      data.ktp,
      data.selfie
    ]
  );

  return result.rows[0];

}

/* =========================
   GET VERIFICATION
========================= */

async function getVerification(id){

  const result = await db.query(
    `
    SELECT

      v.*,

      u.username,

      u.email,

      u.avatar

    FROM verifications v

    JOIN users u

      ON u.id=v.user_id

    WHERE

      v.id=$1

    LIMIT 1
    `,
    [
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   GET USER VERIFICATION
========================= */

async function getUserVerification(userId){

  const result = await db.query(
    `
    SELECT *

    FROM verifications

    WHERE user_id=$1

    ORDER BY created_at DESC

    LIMIT 1
    `,
    [
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   GET ALL
========================= */

async function getAllVerifications(){

  const result = await db.query(
    `
    SELECT

      v.*,

      u.username,

      u.email,

      u.avatar

    FROM verifications v

    JOIN users u

      ON u.id=v.user_id

    ORDER BY v.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   PENDING
========================= */

async function getPendingVerifications(){

  const result = await db.query(
    `
    SELECT

      v.*,

      u.username,

      u.email,

      u.avatar

    FROM verifications v

    JOIN users u

      ON u.id=v.user_id

    WHERE

      v.status='pending'

    ORDER BY

      v.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   APPROVE
========================= */

async function approveVerification(id){

  const verification = await db.query(
    `
    UPDATE verifications

    SET status='approved'

    WHERE id=$1

    RETURNING *
    `,
    [
      id
    ]
  );

  if(!verification.rows.length){

    return null;

  }

  await db.query(
    `
    UPDATE users

    SET verified=TRUE

    WHERE id=$1
    `,
    [
      verification.rows[0].user_id
    ]
  );

  return verification.rows[0];

}

/* =========================
   REJECT
========================= */

async function rejectVerification(id){

  const result = await db.query(
    `
    UPDATE verifications

    SET status='rejected'

    WHERE id=$1

    RETURNING *
    `,
    [
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE
========================= */

async function deleteVerification(id){

  const result = await db.query(
    `
    DELETE FROM verifications

    WHERE id=$1

    RETURNING *
    `,
    [
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   TOTAL
========================= */

async function countVerifications(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM verifications
    `
  );

  return result.rows[0].total;

}

/* =========================
   TOTAL PENDING
========================= */

async function countPendingVerifications(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM verifications

    WHERE status='pending'
    `
  );

  return result.rows[0].total;

}

module.exports = {

  createVerification,

  getVerification,

  getUserVerification,

  getAllVerifications,

  getPendingVerifications,

  approveVerification,

  rejectVerification,

  deleteVerification,

  countVerifications,

  countPendingVerifications

};

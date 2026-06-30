const db = require("./db");

/* =========================
   CREATE REVIEW
========================= */

async function createReview(data){

  const exists = await db.query(
    `
    SELECT id

    FROM reviews

    WHERE

      seller_id=$1

      AND

      buyer_id=$2

    LIMIT 1
    `,
    [
      data.sellerId,
      data.buyerId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO reviews
    (
      seller_id,
      buyer_id,
      rating,
      comment
    )
    VALUES
    ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      data.sellerId,
      data.buyerId,
      Number(data.rating),
      data.comment || ""
    ]
  );

  return result.rows[0];

}

/* =========================
   GET SELLER REVIEWS
========================= */

async function getSellerReviews(sellerId){

  const result = await db.query(
    `
    SELECT

      r.*,

      u.username,

      u.avatar,

      u.verified

    FROM reviews r

    JOIN users u

      ON u.id=r.buyer_id

    WHERE

      r.seller_id=$1

    ORDER BY

      r.created_at DESC
    `,
    [sellerId]
  );

  return result.rows;

}

/* =========================
   GET REVIEW
========================= */

async function getReview(id){

  const result = await db.query(
    `
    SELECT *

    FROM reviews

    WHERE id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   UPDATE REVIEW
========================= */

async function updateReview(id,buyerId,data){

  const result = await db.query(
    `
    UPDATE reviews

    SET

      rating=$1,

      comment=$2

    WHERE

      id=$3

      AND

      buyer_id=$4

    RETURNING *
    `,
    [
      Number(data.rating),
      data.comment || "",
      id,
      buyerId
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE REVIEW
========================= */

async function deleteReview(id,buyerId){

  const result = await db.query(
    `
    DELETE FROM reviews

    WHERE

      id=$1

      AND

      buyer_id=$2

    RETURNING *
    `,
    [
      id,
      buyerId
    ]
  );

  return result.rows[0];

}

/* =========================
   REVIEW COUNT
========================= */

async function getReviewCount(sellerId){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM reviews

    WHERE seller_id=$1
    `,
    [sellerId]
  );

  return result.rows[0].total;

}

/* =========================
   AVERAGE RATING
========================= */

async function getAverageRating(sellerId){

  const result = await db.query(
    `
    SELECT

      COALESCE(
        ROUND(AVG(rating)::numeric,1),
        0
      ) AS rating

    FROM reviews

    WHERE seller_id=$1
    `,
    [sellerId]
  );

  return Number(result.rows[0].rating);

}

/* =========================
   TOTAL REVIEWS
========================= */

async function countReviews(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM reviews
    `
  );

  return result.rows[0].total;

}

module.exports={

createReview,

getSellerReviews,

getReview,

updateReview,

deleteReview,

getReviewCount,

getAverageRating,

countReviews

};

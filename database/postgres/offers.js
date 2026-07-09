const db = require("./db");

/* =========================
   CREATE OFFER
========================= */

async function createOffer(data){

  const result = await db.query(
    `
    INSERT INTO offers
    (
      product_id,
      buyer_id,
      seller_id,
      price,
      message,
      last_sender,
      status,
      updated_at
    )
    VALUES
    ($1,$2,$3,$4,$5,'buyer','pending',NOW())
    RETURNING *
    `,
    [
      data.productId,
      data.buyerId,
      data.sellerId,
      Number(data.price),
      data.message || ""
    ]
  );

  return result.rows[0];

}

/* =========================
   GET OFFER
========================= */

async function getOffer(id){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price AS original_price,

      buyer.username AS buyer_name,
      buyer.avatar AS buyer_avatar,

      seller.username AS seller_name,
      seller.avatar AS seller_avatar

    FROM offers o

    JOIN products p
      ON p.id=o.product_id

    JOIN users buyer
      ON buyer.id=o.buyer_id

    JOIN users seller
      ON seller.id=o.seller_id

    WHERE o.id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   BUYER OFFERS
========================= */

async function getBuyerOffers(userId){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price

    FROM offers o

    JOIN products p
      ON p.id=o.product_id

    WHERE o.buyer_id=$1

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   SELLER OFFERS
========================= */

async function getSellerOffers(userId){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price,

      u.username AS buyer_name,
      u.avatar AS buyer_avatar

    FROM offers o

    JOIN products p
      ON p.id=o.product_id

    JOIN users u
      ON u.id=o.buyer_id

    WHERE o.seller_id=$1

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   UPDATE STATUS
========================= */

async function updateOfferStatus(id,status){

  const result = await db.query(
    `
    UPDATE offers

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
   COUNTER OFFER
========================= */

async function counterOffer(id, price, message, sender){

  const result = await db.query(
    `
    UPDATE offers

    SET

      price=$1,
      message=$2,
      last_sender=$3,
      status='pending',
      updated_at=NOW()

    WHERE id=$4

    RETURNING *
    `,
    [
      Number(price),
      message || "",
      sender,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE OFFER
========================= */

async function deleteOffer(id,userId){

  const result = await db.query(
    `
    DELETE FROM offers

    WHERE

      id=$1

      AND

      buyer_id=$2

    RETURNING *
    `,
    [
      id,
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   REPLY OFFER
========================= */

async function replyOffer(id,data){

  const result = await db.query(
    `
    UPDATE offers

    SET

      price=$1,

      message=$2,

      last_sender=$3,

      updated_at=NOW()

    WHERE id=$4

    RETURNING *
    `,
    [
      Number(data.price),
      data.message || "",
      data.lastSender,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   PRODUCT OFFERS
========================= */

async function getProductOffers(productId){

  const result = await db.query(
    `
    SELECT *

    FROM offers

    WHERE product_id=$1

    ORDER BY created_at DESC
    `,
    [productId]
  );

  return result.rows;

}

/* =========================
   TOTAL OFFERS
========================= */

async function countOffers(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM offers
    `
  );

  return result.rows[0].total;

}

/* =========================
   PENDING OFFERS
========================= */

async function countPendingOffers(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM offers

    WHERE status='pending'
    `
  );

  return result.rows[0].total;

}

module.exports = {

  createOffer,

  getOffer,

  getBuyerOffers,

  getSellerOffers,

  updateOfferStatus,

  replyOffer,

  counterOffer,

  deleteOffer,

  getProductOffers,

  countOffers,

  countPendingOffers

};

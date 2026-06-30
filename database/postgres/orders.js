const db = require("./db");

/* =========================
   CREATE ORDER
========================= */

async function createOrder(data){

  const result = await db.query(
    `
    INSERT INTO orders
    (
      product_id,
      buyer_id,
      seller_id,
      meeting_point,
      meeting_date,
      meeting_time,
      status
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,'pending')
    RETURNING *
    `,
    [
      data.productId,
      data.buyerId,
      data.sellerId,
      data.meetingPoint,
      data.meetingDate,
      data.meetingTime
    ]
  );

  return result.rows[0];

}

/* =========================
   GET ORDER
========================= */

async function getOrder(id){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price,

      buyer.username AS buyer_name,
      buyer.avatar AS buyer_avatar,

      seller.username AS seller_name,
      seller.avatar AS seller_avatar

    FROM orders o

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
   BUYER ORDERS
========================= */

async function getBuyerOrders(userId){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price,

      u.username AS seller_name,
      u.avatar AS seller_avatar

    FROM orders o

    JOIN products p
      ON p.id=o.product_id

    JOIN users u
      ON u.id=o.seller_id

    WHERE o.buyer_id=$1

    ORDER BY o.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   SELLER ORDERS
========================= */

async function getSellerOrders(userId){

  const result = await db.query(
    `
    SELECT

      o.*,

      p.title,
      p.images,
      p.price,

      u.username AS buyer_name,
      u.avatar AS buyer_avatar

    FROM orders o

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
   ALL MY ORDERS
========================= */

async function getMyOrders(userId){

  const result = await db.query(
    `
    SELECT *

    FROM orders

    WHERE

      buyer_id=$1

      OR

      seller_id=$1

    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   UPDATE STATUS
========================= */

async function updateStatus(id,status){

  const result = await db.query(
    `
    UPDATE orders

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
   DELETE ORDER
========================= */

async function deleteOrder(id){

  const result = await db.query(
    `
    DELETE FROM orders

    WHERE id=$1

    RETURNING *
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   TOTAL ORDERS
========================= */

async function countOrders(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM orders
    `
  );

  return result.rows[0].total;

}

/* =========================
   PENDING ORDERS
========================= */

async function countPendingOrders(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM orders

    WHERE status='pending'
    `
  );

  return result.rows[0].total;

}

module.exports={

createOrder,

getOrder,

getBuyerOrders,

getSellerOrders,

getMyOrders,

updateStatus,

deleteOrder,

countOrders,

countPendingOrders

};

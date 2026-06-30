const db = require("./db");

/* =========================
   ADD FAVORITE
========================= */

async function addFavorite(
  userId,
  productId
){

  const exists = await db.query(
    `
    SELECT id

    FROM favorites

    WHERE

      user_id=$1

      AND

      product_id=$2

    LIMIT 1
    `,
    [
      userId,
      productId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO favorites
    (
      user_id,
      product_id
    )
    VALUES
    ($1,$2)
    RETURNING *
    `,
    [
      userId,
      productId
    ]
  );

  await db.query(
    `
    UPDATE products

    SET favorites=(

      SELECT COUNT(*)

      FROM favorites

      WHERE product_id=$1

    )

    WHERE id=$1
    `,
    [productId]
  );

  return result.rows[0];

}

/* =========================
   REMOVE FAVORITE
========================= */

async function removeFavorite(
  userId,
  productId
){

  const result = await db.query(
    `
    DELETE FROM favorites

    WHERE

      user_id=$1

      AND

      product_id=$2

    RETURNING *
    `,
    [
      userId,
      productId
    ]
  );

  await db.query(
    `
    UPDATE products

    SET favorites=(

      SELECT COUNT(*)

      FROM favorites

      WHERE product_id=$1

    )

    WHERE id=$1
    `,
    [productId]
  );

  return result.rows[0];

}

/* =========================
   GET USER FAVORITES
========================= */

async function getUserFavorites(
  userId
){

  const result = await db.query(
    `
    SELECT

      p.*,

      u.username,

      u.avatar,

      u.verified

    FROM favorites f

    JOIN products p

      ON p.id=f.product_id

    JOIN users u

      ON u.id=p.seller_id

    WHERE

      f.user_id=$1

    ORDER BY

      f.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   IS FAVORITE
========================= */

async function isFavorite(
  userId,
  productId
){

  const result = await db.query(
    `
    SELECT id

    FROM favorites

    WHERE

      user_id=$1

      AND

      product_id=$2

    LIMIT 1
    `,
    [
      userId,
      productId
    ]
  );

  return result.rows.length > 0;

}

/* =========================
   FAVORITE COUNT
========================= */

async function getFavoriteCount(
  productId
){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM favorites

    WHERE product_id=$1
    `,
    [productId]
  );

  return result.rows[0].total;

}

/* =========================
   TOTAL USER FAVORITES
========================= */

async function countUserFavorites(
  userId
){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM favorites

    WHERE user_id=$1
    `,
    [userId]
  );

  return result.rows[0].total;

}

module.exports={

  addFavorite,

  removeFavorite,

  getUserFavorites,

  isFavorite,

  getFavoriteCount,

  countUserFavorites

};

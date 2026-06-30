const db = require("./db");

/* =========================
   DASHBOARD
========================= */

async function getDashboard(){

  const result = await db.query(
    `
    SELECT

      (SELECT COUNT(*)::INTEGER FROM users) AS users,

      (SELECT COUNT(*)::INTEGER FROM products) AS products,

      (SELECT COUNT(*)::INTEGER FROM orders) AS orders,

      (SELECT COUNT(*)::INTEGER FROM reports WHERE status='pending') AS reports,

      (SELECT COUNT(*)::INTEGER FROM verifications WHERE status='pending') AS verifications,

      (SELECT COUNT(*)::INTEGER FROM appeals WHERE status='pending') AS appeals
    `
  );

  return result.rows[0];

}

/* =========================
   USERS
========================= */

async function getUsers(){

  const result = await db.query(
    `
    SELECT

      id,
      username,
      email,
      avatar,
      role,
      verified,
      blocked,
      created_at,
      last_active

    FROM users

    ORDER BY created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   PRODUCTS
========================= */

async function getProducts(){

  const result = await db.query(
    `
    SELECT

      p.*,

      u.username

    FROM products p

    JOIN users u

      ON u.id=p.seller_id

    ORDER BY p.created_at DESC
    `
  );

  return result.rows;

}

/* =========================
   CHANGE ROLE
========================= */

async function changeRole(userId,role){

  const result = await db.query(
    `
    UPDATE users

    SET role=$1

    WHERE id=$2

    RETURNING *
    `,
    [
      role,
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   BLOCK USER
========================= */

async function blockUser(userId){

  const result = await db.query(
    `
    UPDATE users

    SET blocked=NOT blocked

    WHERE id=$1

    RETURNING blocked
    `,
    [
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   DISABLE PRODUCT
========================= */

async function disableProduct(
  productId,
  reason,
  adminId
){

  const result = await db.query(
    `
    UPDATE products

    SET

      status='disabled',

      disable_reason=$1,

      disabled_by=$2,

      disabled_at=NOW()

    WHERE id=$3

    RETURNING *
    `,
    [
      reason,
      adminId,
      productId
    ]
  );

  return result.rows[0];

}

/* =========================
   ENABLE PRODUCT
========================= */

async function enableProduct(productId){

  const result = await db.query(
    `
    UPDATE products

    SET

      status='active',

      disable_reason=NULL,

      disabled_by=NULL,

      disabled_at=NULL

    WHERE id=$1

    RETURNING *
    `,
    [
      productId
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE USER
========================= */

async function deleteUser(userId){

  const result = await db.query(
    `
    DELETE FROM users

    WHERE id=$1

    RETURNING *
    `,
    [
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(productId){

  const result = await db.query(
    `
    DELETE FROM products

    WHERE id=$1

    RETURNING *
    `,
    [
      productId
    ]
  );

  return result.rows[0];

}

module.exports={

getDashboard,

getUsers,

getProducts,

changeRole,

blockUser,

disableProduct,

enableProduct,

deleteUser,

deleteProduct

};

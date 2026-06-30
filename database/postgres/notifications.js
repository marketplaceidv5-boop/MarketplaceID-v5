const db = require("./db");

/* =========================
   CREATE NOTIFICATION
========================= */

async function createNotification(data){

  const result = await db.query(
    `
    INSERT INTO notifications
    (
      user_id,
      from_user_id,
      product_id,
      type,
      title,
      message
    )
    VALUES
    ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      data.userId,
      data.fromUserId || null,
      data.productId || null,
      data.type,
      data.title,
      data.message || ""
    ]
  );

  return result.rows[0];

}

/* =========================
   USER NOTIFICATIONS
========================= */

async function getNotifications(userId){

  const result = await db.query(
    `
    SELECT

      n.*,

      u.username,

      u.avatar,

      u.verified

    FROM notifications n

    LEFT JOIN users u

      ON u.id=n.from_user_id

    WHERE

      n.user_id=$1

    ORDER BY

      n.created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   UNREAD COUNT
========================= */

async function getUnreadCount(userId){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM notifications

    WHERE

      user_id=$1

      AND

      read=FALSE
    `,
    [userId]
  );

  return result.rows[0].total;

}

/* =========================
   READ ONE
========================= */

async function readNotification(id,userId){

  const result = await db.query(
    `
    UPDATE notifications

    SET

      read=TRUE

    WHERE

      id=$1

      AND

      user_id=$2

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
   READ ALL
========================= */

async function readAll(userId){

  await db.query(
    `
    UPDATE notifications

    SET

      read=TRUE

    WHERE

      user_id=$1
    `,
    [userId]
  );

}

/* =========================
   DELETE ONE
========================= */

async function deleteNotification(id,userId){

  const result = await db.query(
    `
    DELETE FROM notifications

    WHERE

      id=$1

      AND

      user_id=$2

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
   DELETE ALL
========================= */

async function deleteAll(userId){

  await db.query(
    `
    DELETE FROM notifications

    WHERE user_id=$1
    `,
    [userId]
  );

}

/* =========================
   TOTAL NOTIFICATIONS
========================= */

async function countNotifications(userId){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM notifications

    WHERE user_id=$1
    `,
    [userId]
  );

  return result.rows[0].total;

}

module.exports={

createNotification,

getNotifications,

getUnreadCount,

readNotification,

readAll,

deleteNotification,

deleteAll,

countNotifications

};

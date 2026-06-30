const db = require("./db");

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage(data){

  const result = await db.query(
    `
    INSERT INTO chats
    (
      product_id,
      from_user_id,
      to_user_id,
      message,
      image
    )
    VALUES
    ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      data.productId || null,
      data.fromUserId,
      data.toUserId,
      data.message || "",
      data.image || ""
    ]
  );

  return result.rows[0];

}

/* =========================
   CHAT ROOM
========================= */

async function getMessages(userA,userB){

  const result = await db.query(
    `
    SELECT

      c.*,

      fu.username AS from_username,
      fu.avatar AS from_avatar,

      tu.username AS to_username,
      tu.avatar AS to_avatar

    FROM chats c

    JOIN users fu
      ON fu.id=c.from_user_id

    JOIN users tu
      ON tu.id=c.to_user_id

    WHERE

    (

      c.from_user_id=$1

      AND

      c.to_user_id=$2

    )

    OR

    (

      c.from_user_id=$2

      AND

      c.to_user_id=$1

    )

    ORDER BY c.created_at ASC
    `,
    [
      userA,
      userB
    ]
  );

  return result.rows;

}

/* =========================
   MARK READ
========================= */

async function markAsRead(fromUser,toUser){

  await db.query(
    `
    UPDATE chats

    SET

      read=TRUE

    WHERE

      from_user_id=$1

      AND

      to_user_id=$2

      AND

      read=FALSE
    `,
    [
      fromUser,
      toUser
    ]
  );

}

/* =========================
   DELETE MESSAGE
========================= */

async function deleteMessage(id,userId){

  const result = await db.query(
    `
    DELETE FROM chats

    WHERE

      id=$1

      AND

      from_user_id=$2

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
   UNREAD COUNT
========================= */

async function getUnreadCount(userId){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM chats

    WHERE

      to_user_id=$1

      AND

      read=FALSE
    `,
    [userId]
  );

  return result.rows[0].total;

}

/* =========================
   INBOX
========================= */

async function getInbox(userId){

  const result = await db.query(
    `
    SELECT DISTINCT ON(other_user)

      other_user,

      username,

      avatar,

      verified,

      message,

      image,

      created_at,

      unread

    FROM(

      SELECT

        CASE

          WHEN c.from_user_id=$1

          THEN c.to_user_id

          ELSE c.from_user_id

        END AS other_user,

        u.username,

        u.avatar,

        u.verified,

        c.message,

        c.image,

        c.created_at,

        (

          SELECT COUNT(*)

          FROM chats x

          WHERE

            x.from_user_id=u.id

            AND

            x.to_user_id=$1

            AND

            x.read=FALSE

        )::INTEGER AS unread

      FROM chats c

      JOIN users u

      ON u.id=

      CASE

        WHEN c.from_user_id=$1

        THEN c.to_user_id

        ELSE c.from_user_id

      END

      WHERE

      c.from_user_id=$1

      OR

      c.to_user_id=$1

    ) t

    ORDER BY

      other_user,

      created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   PRODUCT CHAT
========================= */

async function getProductChat(productId){

  const result = await db.query(
    `
    SELECT *

    FROM chats

    WHERE product_id=$1

    ORDER BY created_at ASC
    `,
    [productId]
  );

  return result.rows;

}

/* =========================
   TOTAL CHAT
========================= */

async function countMessages(userId){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM chats

    WHERE

      from_user_id=$1

      OR

      to_user_id=$1
    `,
    [userId]
  );

  return result.rows[0].total;

}

module.exports={

sendMessage,

getMessages,

markAsRead,

deleteMessage,

getUnreadCount,

getInbox,

getProductChat,

countMessages

};

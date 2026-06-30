const db = require("./db");

/* =========================
   FOLLOW USER
========================= */

async function followUser(
  followerId,
  sellerId
){

  if(
    Number(followerId) ===
    Number(sellerId)
  ){

    return null;

  }

  const exists = await db.query(
    `
    SELECT id

    FROM follows

    WHERE

      follower_id=$1

      AND

      seller_id=$2

    LIMIT 1
    `,
    [
      followerId,
      sellerId
    ]
  );

  if(exists.rows.length){

    return null;

  }

  const result = await db.query(
    `
    INSERT INTO follows
    (
      follower_id,
      seller_id
    )
    VALUES
    ($1,$2)
    RETURNING *
    `,
    [
      followerId,
      sellerId
    ]
  );

  return result.rows[0];

}

/* =========================
   UNFOLLOW USER
========================= */

async function unfollowUser(
  followerId,
  sellerId
){

  const result = await db.query(
    `
    DELETE FROM follows

    WHERE

      follower_id=$1

      AND

      seller_id=$2

    RETURNING *
    `,
    [
      followerId,
      sellerId
    ]
  );

  return result.rows[0];

}

/* =========================
   IS FOLLOWING
========================= */

async function isFollowing(
  followerId,
  sellerId
){

  const result = await db.query(
    `
    SELECT id

    FROM follows

    WHERE

      follower_id=$1

      AND

      seller_id=$2

    LIMIT 1
    `,
    [
      followerId,
      sellerId
    ]
  );

  return result.rows.length > 0;

}

/* =========================
   IS FRIEND
========================= */

async function isFriend(
  userA,
  userB
){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM follows f1

    JOIN follows f2

      ON f1.follower_id=f2.seller_id

      AND f1.seller_id=f2.follower_id

    WHERE

      f1.follower_id=$1

      AND

      f1.seller_id=$2
    `,
    [
      userA,
      userB
    ]
  );

  return result.rows[0].total > 0;

}

/* =========================
   FOLLOWERS
========================= */

async function getFollowers(
  sellerId
){

  const result = await db.query(
    `
    SELECT

      u.id,

      u.username,

      u.avatar,

      u.verified

    FROM follows f

    JOIN users u

      ON u.id=f.follower_id

    WHERE

      f.seller_id=$1

    ORDER BY

      f.created_at DESC
    `,
    [sellerId]
  );

  return result.rows;

}

/* =========================
   FOLLOWING
========================= */

async function getFollowing(
  followerId
){

  const result = await db.query(
    `
    SELECT

      u.id,

      u.username,

      u.avatar,

      u.verified

    FROM follows f

    JOIN users u

      ON u.id=f.seller_id

    WHERE

      f.follower_id=$1

    ORDER BY

      f.created_at DESC
    `,
    [followerId]
  );

  return result.rows;

}

/* =========================
   FOLLOWER COUNT
========================= */

async function getFollowerCount(
  sellerId
){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM follows

    WHERE seller_id=$1
    `,
    [sellerId]
  );

  return result.rows[0].total;

}

/* =========================
   FOLLOWING COUNT
========================= */

async function getFollowingCount(
  followerId
){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM follows

    WHERE follower_id=$1
    `,
    [followerId]
  );

  return result.rows[0].total;

}

module.exports = {

  followUser,

  unfollowUser,

  isFollowing,

  isFriend,

  getFollowers,

  getFollowing,

  getFollowerCount,

  getFollowingCount

};

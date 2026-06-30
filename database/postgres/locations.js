const db = require("./db");

/* =========================
   SAVE LOCATION
========================= */

async function saveLocation(data){

  const exists = await db.query(
    `
    SELECT id

    FROM locations

    WHERE user_id=$1

    LIMIT 1
    `,
    [
      data.userId
    ]
  );

  if(exists.rows.length){

    const result = await db.query(
      `
      UPDATE locations

      SET

        latitude=$1,

        longitude=$2,

        address=$3,

        updated_at=NOW()

      WHERE user_id=$4

      RETURNING *
      `,
      [
        Number(data.latitude),
        Number(data.longitude),
        data.address || "",
        data.userId
      ]
    );

    return result.rows[0];

  }

  const result = await db.query(
    `
    INSERT INTO locations
    (
      user_id,
      latitude,
      longitude,
      address
    )
    VALUES
    ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      data.userId,
      Number(data.latitude),
      Number(data.longitude),
      data.address || ""
    ]
  );

  return result.rows[0];

}

/* =========================
   GET LOCATION
========================= */

async function getLocation(userId){

  const result = await db.query(
    `
    SELECT *

    FROM locations

    WHERE user_id=$1

    LIMIT 1
    `,
    [
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE LOCATION
========================= */

async function deleteLocation(userId){

  const result = await db.query(
    `
    DELETE FROM locations

    WHERE user_id=$1

    RETURNING *
    `,
    [
      userId
    ]
  );

  return result.rows[0];

}

/* =========================
   USERS NEARBY
========================= */

async function getNearbyUsers(
  latitude,
  longitude,
  limit=20
){

  const result = await db.query(
    `
    SELECT

      l.*,

      u.username,

      u.avatar,

      u.verified

    FROM locations l

    JOIN users u

      ON u.id=l.user_id

    ORDER BY

      POWER(latitude-$1,2)

      +

      POWER(longitude-$2,2)

    ASC

    LIMIT $3
    `,
    [
      Number(latitude),
      Number(longitude),
      Number(limit)
    ]
  );

  return result.rows;

}

/* =========================
   TOTAL LOCATIONS
========================= */

async function countLocations(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM locations
    `
  );

  return result.rows[0].total;

}

module.exports={

saveLocation,

getLocation,

deleteLocation,

getNearbyUsers,

countLocations

};

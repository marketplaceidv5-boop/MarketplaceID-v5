const db = require("./db");
const bcrypt = require("bcryptjs");

/* =========================
   REGISTER
========================= */

async function registerUser(data){

  const hash = await bcrypt.hash(
    data.password,
    Number(process.env.BCRYPT_ROUNDS || 10)
  );

  const result = await db.query(
    `
    INSERT INTO users
    (
      username,
      email,
      password
    )
    VALUES
    ($1,$2,$3)
    RETURNING
      id,
      username,
      email,
      avatar,
      role,
      verified,
      blocked,
      created_at
    `,
    [
      data.username,
      data.email,
      hash
    ]
  );

  return result.rows[0];

}

/* =========================
   LOGIN
========================= */

async function findUser(login){

  const result = await db.query(
    `
    SELECT *
    FROM users
    WHERE
      username=$1
      OR
      email=$1
    LIMIT 1
    `,
    [login]
  );

  return result.rows[0];

}

/* =========================
   USER EXISTS
========================= */

async function userExists(username,email){

  const result = await db.query(
    `
    SELECT id
    FROM users
    WHERE
      username=$1
      OR
      email=$2
    LIMIT 1
    `,
    [
      username,
      email
    ]
  );

  return result.rows.length>0;

}

/* =========================
   GET USER
========================= */

async function getUserById(id){

  const result = await db.query(
    `
    SELECT *

    FROM users

    WHERE id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   UPDATE PROFILE
========================= */

async function updateProfile(id,data){

  const result = await db.query(
    `
    UPDATE users

    SET

      fullname=$1,

      bio=$2,

      city=$3,

      phone=$4,

      latitude=$5,

      longitude=$6,

      updated_at=NOW()

    WHERE id=$7

    RETURNING *

    `,
    [

      data.fullname || "",

      data.bio || "",

      data.city || "",

      data.phone || "",

      Number(data.latitude || 0),

      Number(data.longitude || 0),

      id

    ]
  );

  return result.rows[0];

}

/* =========================
   UPDATE USERNAME
========================= */

async function updateUsername(id,username){

  const result = await db.query(
    `
    UPDATE users

    SET

      username=$1,

      updated_at=NOW()

    WHERE id=$2

    RETURNING *

    `,
    [
      username,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   UPDATE AVATAR
========================= */

async function updateAvatar(id,avatar){

  const result = await db.query(
    `
    UPDATE users

    SET

      avatar=$1,

      updated_at=NOW()

    WHERE id=$2

    RETURNING avatar

    `,
    [
      avatar,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   LAST ACTIVE
========================= */

async function updateLastActive(id){

  await db.query(
    `
    UPDATE users

    SET last_active=NOW()

    WHERE id=$1
    `,
    [id]
  );

}

/* =========================
   BLOCK USER
========================= */

async function blockUser(id,blocked){

  const result = await db.query(
    `
    UPDATE users

    SET blocked=$1

    WHERE id=$2

    RETURNING *

    `,
    [
      blocked,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   UPDATE ROLE
========================= */

async function updateRole(id,role){

  const result = await db.query(
    `
    UPDATE users

    SET role=$1

    WHERE id=$2

    RETURNING *

    `,
    [
      role,
      id
    ]
  );

  return result.rows[0];

}

/* =========================
   VERIFY USER
========================= */

async function verifyUser(id){

  const result = await db.query(
    `
    UPDATE users

    SET verified=TRUE

    WHERE id=$1

    RETURNING *

    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   DELETE USER
========================= */

async function deleteUser(id){

  const result = await db.query(
    `
    DELETE FROM users

    WHERE id=$1

    RETURNING *

    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   TOTAL USERS
========================= */

async function countUsers(){

  const result = await db.query(
    `
    SELECT COUNT(*)::INTEGER AS total

    FROM users
    `
  );

  return result.rows[0].total;

}

module.exports={

  registerUser,

  findUser,

  userExists,

  getUserById,

  updateProfile,

  updateUsername,

  updateAvatar,

  updateLastActive,

  blockUser,

  updateRole,

  verifyUser,

  deleteUser,

  countUsers

};

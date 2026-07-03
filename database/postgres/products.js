const db = require("./db");

/* =========================
   CREATE PRODUCT
========================= */

async function createProduct(data){

  const result = await db.query(
    `
    INSERT INTO products
    (
      seller_id,
      title,
      description,
      category,
      price,
      old_price,
      location,
      latitude,
      longitude,
      images
    )
    VALUES
    ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    RETURNING *
    `,
    [
      data.sellerId,
      data.title,
      data.description || "",
      data.category || "",
      Number(data.price),
      Number(data.oldPrice || 0),
      data.location || "",
      Number(data.latitude || 0),
      Number(data.longitude || 0),
      data.images || []
    ]
  );

  return result.rows[0];

}

/* =========================
   HOME PRODUCTS
========================= */

async function getHomeProducts(){

  const latest = await db.query(
    `
    SELECT
      p.*,
      u.username,
      u.avatar,
      u.verified
    FROM products p
    JOIN users u
      ON u.id=p.seller_id
    WHERE p.status='active'
    ORDER BY p.created_at DESC
    LIMIT 20
    `
  );

  const recommend = await db.query(
    `
    SELECT
      p.*,
      u.username,
      u.avatar,
      u.verified
    FROM products p
    JOIN users u
      ON u.id=p.seller_id
    WHERE p.status='active'
    ORDER BY RANDOM()
    LIMIT 20
    `
  );

  return {

    latest:latest.rows,

    recommend:recommend.rows

  };

}

/* =========================
   PRODUCT DETAIL
========================= */

async function getProduct(id){

  await db.query(
    `
    UPDATE products

    SET views=views+1

    WHERE id=$1
    `,
    [id]
  );

  const result = await db.query(
    `
    SELECT

      p.*,

      u.username,

      u.avatar,

      u.verified

    FROM products p

    JOIN users u

      ON u.id=p.seller_id

    WHERE p.id=$1

    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];

}

/* =========================
   Tap Seller detail produck
========================= */

async function getSellerProducts(id){

const result = await db.query(
`
SELECT *

FROM products

WHERE

seller_id=$1

AND status='active'

ORDER BY created_at DESC
`,
[id]
);

return result.rows;

}

/* =========================
   MY PRODUCTS
========================= */

async function getMyProducts(userId){

  const result = await db.query(
    `
    SELECT *

    FROM products

    WHERE seller_id=$1

    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;

}

/* =========================
   UPDATE PRODUCT
========================= */

async function updateProduct(id,userId,data){

  const result = await db.query(
    `
    UPDATE products

    SET

      title=$1,

      description=$2,

      category=$3,

      price=$4,

      old_price=$5,

      location=$6,

      latitude=$7,

      longitude=$8,

      updated_at=NOW()

    WHERE

      id=$9

      AND seller_id=$10

    RETURNING *
    `,
    [

      data.title,

      data.description,

      data.category,

      Number(data.price),

      Number(data.oldPrice || 0),

      data.location,

      Number(data.latitude || 0),

      Number(data.longitude || 0),

      id,

      userId

    ]
  );

  return result.rows[0];

}

/* =========================
   UPDATE IMAGES
========================= */

async function updateImages(id,userId,images){

  const result = await db.query(
    `
    UPDATE products

    SET

      images=$1,

      updated_at=NOW()

    WHERE

      id=$2

      AND seller_id=$3

    RETURNING *
    `,
    [

      images,

      id,

      userId

    ]
  );

  return result.rows[0];

}

/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id,userId){

  const result = await db.query(
    `
    DELETE FROM products

    WHERE

      id=$1

      AND seller_id=$2

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
   SOLD PRODUCT
========================= */

async function soldProduct(id,userId){

  const result = await db.query(
    `
    UPDATE products

    SET

      status='sold',

      updated_at=NOW()

    WHERE

      id=$1

      AND seller_id=$2

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
   SEARCH
========================= */

async function search(keyword){

  const result = await db.query(
    `
    SELECT

      p.*,

      u.username,

      u.avatar

    FROM products p

    JOIN users u

      ON u.id=p.seller_id

    WHERE

      p.status='active'

      AND

      (

        LOWER(p.title)

        LIKE LOWER($1)

        OR

        LOWER(p.category)

        LIKE LOWER($1)

        OR

        LOWER(p.location)

        LIKE LOWER($1)

      )

    ORDER BY p.created_at DESC
    `,
    [

      `%${keyword}%`

    ]
  );

  return result.rows;

}

/* =========================
   CATEGORY
========================= */

async function getCategory(category){

  const result = await db.query(
    `
    SELECT

      p.*,

      u.username,

      u.avatar

    FROM products p

    JOIN users u

      ON u.id=p.seller_id

    WHERE

      LOWER(p.category)=LOWER($1)

      AND

      p.status='active'

    ORDER BY p.created_at DESC
    `,
    [

      category

    ]
  );

  return result.rows;

}

/* =========================
   RELATED
========================= */

async function getRelatedProducts(id){

  const product = await getProduct(id);

  if(!product){

    return [];

  }

  const result = await db.query(
    `
    SELECT *

    FROM products

    WHERE

      category=$1

      AND

      status='active'

      AND

      id<>$2

    LIMIT 6
    `,
    [

      product.category,

      id

    ]
  );

  return result.rows;

}

/* =========================
   RECOMMEND
========================= */

async function getRecommendProducts(){

  const result = await db.query(
    `
    SELECT *

    FROM products

    WHERE status='active'

    ORDER BY RANDOM()

    LIMIT 20
    `
  );

  return result.rows;

}

/* =========================
   ADMIN
========================= */

async function getAllProducts(){

  const result = await db.query(
    `
    SELECT *

    FROM products

    ORDER BY created_at DESC
    `
  );

  return result.rows;

}

module.exports={

createProduct,

getHomeProducts,

getProduct,

getSellerProducts,

getMyProducts,

updateProduct,

updateImages,

deleteProduct,

soldProduct,

search,

getCategory,

getRelatedProducts,

getRecommendProducts,

getAllProducts

};

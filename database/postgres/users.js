async function getSellerProfile(id){

const result = await db.query(
`
SELECT

id,
username,
fullname,
avatar,
bio,
city,
verified,
created_at

FROM users

WHERE id=$1

LIMIT 1
`,
[id]
);

return result.rows[0];

}

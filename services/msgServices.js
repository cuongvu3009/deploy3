import { sql } from "../database/database.js";

const create = async (sender, message) => {
  await sql`INSERT INTO messages (sender, message)
    VALUES (${sender}, ${message})`;
};

// find the most recent N records in the table
// the  `id` field act as timestamp
const findRecentN = async (n) => {
  return await sql`SELECT * FROM messages ORDER BY id DESC LIMIT ${n}`;
};

// seems no need to use delete function
// const deleteById = async (id) => {
//   try {
//     await sql`DELETE FROM addresses WHERE id = ${ id }`;
//   } catch (e) {
//     console.log(e);
//   }
// };

// leave in case
const findAll = async () => {
  return await sql`SELECT * FROM messages`;
};

export { findRecentN, create, findAll };

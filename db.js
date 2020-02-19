const pg = require('pg');
const { Client } = pg;

const client = new Client('postgres://localhost/postgres_data_layer');

client.connect();

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS authors;
    CREATE TABLE authors (
      first_name VARCHAR,
      last_name VARCHAR,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4 ()
    );
    CREATE TABLE articles (
      title VARCHAR,
      body VARCHAR,
      date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
      author_id UUID REFERENCES authors(id)
    );
  `;
  await client.query(SQL);
  console.log(await createAuthor('Hunter', 'Thompson'));
  const authors = await readAuthors();
  console.log(authors[0].id);
};

const readAuthors = async () => {
  const SQL = 'SELECT * FROM authors';
  const response = await client.query(SQL);
  return response.rows;
};

const createAuthor = async (firstName, lastName) => {
  const SQL =
    'INSERT INTO authors(first_name, last_name) VALUES($1, $2) RETURNING *';
  const response = await client.query(SQL, [firstName, lastName]);
  return response.rows[0];
};

sync();

module.exports = {
  sync,
};

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
};
sync();

module.exports = {
  sync,
};

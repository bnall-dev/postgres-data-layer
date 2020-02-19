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

const readAuthor = async id => {
  const SQL = 'SELECT * FROM authors WHERE id=$1';
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const readAuthors = async () => {
  const SQL = 'SELECT * FROM authors';
  const response = await client.query(SQL);
  return response.rows;
};

const updateAuthor = async author => {
  const SQL =
    'UPDATE authors SET first_name = $1, last_name = $2 WHERE id=$3 RETURNING *';
  await client.query(SQL, [author.firstName, author.lastName, author.id]);
  return response.rows[0];
};

const deleteAuthor = async id => {
  const SQL = 'DELETE FROM authors WHERE id=$1';
  await client.query(SQL, [id]);
};

const createAuthor = async (firstName, lastName) => {
  const SQL =
    'INSERT INTO authors(first_name, last_name) VALUES($1, $2) RETURNING *';
  const response = await client.query(SQL, [firstName, lastName]);
  return response.rows[0];
};

const readArticle = async id => {
  const SQL = 'SELECT * FROM articles WHERE id=$1';
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const readArticles = async () => {
  const SQL = 'SELECT * FROM articles';
  const response = await client.query(SQL);
  return response.rows;
};

sync();

module.exports = {
  sync,
  createAuthor,
  readAuthor,
  readAuthors,
  updateAuthor,
  deleteAuthor,
  createArticle,
  readArticle,
  readArticles,
  updateArticle,
  deleteArticle,
};

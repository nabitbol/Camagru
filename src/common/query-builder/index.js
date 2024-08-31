import pg from "pg";

const { Pool } = pg;

class QueryBuilder {
  constructor(pgConfig) {
    this.query = "";
    this.value = [];
    this.pool = new Pool(pgConfig);
  }

  select(columns) {
    this.query += `SELECT ${columns.join(", ")}`;
    return this;
  }

  insert(table, columns, toInsert) {
    this.query += `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${Object.keys(toInsert).map((key, index) =>
      index == 0 ? `$${index + 1}` : ` $${index + 1}`
    )})`;
    this.values = Object.values(toInsert);
    return this;
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(toFind) {
    this.query += ` WHERE ${Object.keys(toFind).map((key, index) =>
      index == 0 ? `${key} = $${index + 1}` : ` ${key} = $${index + 1}`
    )}`;
    this.values = Object.values(toFind);
    return this;
  }

  limit(limit) {
    this.query += ` LIMIT ${limit}`;
    return this;
  }

  build() {
    const text = this.query.trim();
    const values = this.values;
    this.query = "";
    this.values = [];
    return { text, values };
  }

  /*
   ** The Pool is preferred because it manages connections automatically,
   ** allowing you to run queries without manually handling the connection lifecycle.
   ** Unlike the Client, which requires you to explicitly await a connection
   ** and close it when done, the Pool takes care of these tasks for you.
   ** Details node-pg doc https://node-postgres.com/apis/pool#poolquery
   **
   */

  async run() {
    try {
      const res = await this.pool.query(this.query, this.values);
      return res;
    } catch (err) {
      throw err;
    }
  }
}

export default QueryBuilder;

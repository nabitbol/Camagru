import pg from "pg";

const { Pool } = pg;

class QueryBuilder {
  constructor(pgConfig) {
    this.query = "";
    this.values = [];
    this.countValues = 0;
    this.pool = new Pool(pgConfig);
  }

  #stackVaulesList = () => {
    const valuesArray = Array.from(
      { length: this.values.length },
      (_, index) => `$${index + 1}`
    );

    this.query += ` VALUES (${valuesArray.join(", ")})`;
  };

  #addValues = (toAdd) => {
    const tmp = this.values;
    this.values = tmp.concat(Object.values(toAdd));
  };

  select(columns) {
    this.query += `SELECT ${columns.join(", ")}`;
    return this;
  }

  insert(table, toInsert) {
    const columns = Object.keys(toInsert);
    this.query += `INSERT INTO ${table} (${columns.join(", ")})`;
    this.#addValues(toInsert);
    this.#stackVaulesList();
    return this;
  }

  update(table, toUpdate) {
    this.query += `UPDATE ${table} SET ${Object.keys(toUpdate).map(
      (key, index) =>
        index == 0 ? `${key} = $${index + 1}` : ` ${key} = $${index + 1}`
    )}`;
    this.#addValues(toUpdate);
    this.countValues += Object.keys(toUpdate).length;
    return this;
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(toFind) {
    this.query += ` WHERE ${Object.keys(toFind).map((key, index) =>
      index + this.countValues == 0
        ? `${key} = $${index + this.countValues + 1}`
        : ` ${key} = $${index + this.countValues + 1}`
    )}`;
    this.#addValues(toFind);
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
    this.countValues = 0;
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
      this.query = "";
      this.values = [];
      this.countValues = 0;
      return res;
    } catch (err) {
      throw err;
    }
  }
}

export default QueryBuilder;

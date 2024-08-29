class QueryBuilder {
  constructor() {
    this.query = "";
    this.value = [];
  }

  select(columns) {
    this.query += `SELECT ${columns.join(", ")}`;
    return this;
  }

  insert(table, columns, toInsert) {
    this.query += `INSERT INTO ${table} (${columns.join(
      ", "
    )}) VALUES (${Object.keys(toInsert).map(
      (key, index) => ` $${index + 1}`
    )})`;
    this.values = Object.values(toInsert);
    return this;
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(toFind) {
    this.query += ` WHERE ${Object.keys(toFind).map(
      (key, index) => ` ${key} = $${index + 1}`
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
}

export default QueryBuilder;

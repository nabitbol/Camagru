import { describe, expect, it } from "vitest";
import QueryBuilder from "@camagru/query-builder";

const queryBuilder = new QueryBuilder();

const table = "test";
const data = {
  email: "test@test.t",
  password: "test",
};
const limit = 10;

describe("Insert Query", () => {
  const query = queryBuilder.insert(table, data).build();

  it("Test text", () => {
    expect(query.text).toEqual(
      `INSERT INTO ${table} (email, password) VALUES ($1, $2)`
    );
  });

  it("Test values", () => {
    expect(query.values).toEqual(["test@test.t", "test"]);
  });
});

describe("Select Query", () => {
  const query = queryBuilder
    .select([Object.keys(data)[0]])
    .from(table)
    .where({ email: data.email })
    .limit(limit)
    .build();

  it("Test text", () => {
    expect(query.text).toEqual(
      `SELECT email FROM ${table} WHERE email = $1 LIMIT ${limit}`
    );
  });

  it("Test values", () => {
    expect(query.values).toEqual(["test@test.t"]);
  });
});

describe("Update Query", () => {
  const query = queryBuilder.update(table, { email: data.email }).build();
  const columns = "email";

  it("Test text", () => {
    expect(query.text).toEqual(`UPDATE ${table} SET ${columns} = $1`);
  });

  it("Test values", () => {
    expect(query.values).toEqual(["test@test.t"]);
  });
});

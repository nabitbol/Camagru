import { expect, test } from "vitest";
import { sumExample } from "@camagru/common-examples";

test("adds 1 + 2 to equal 3", () => {
  expect(sumExample(1, 2)).toBe(3);
});

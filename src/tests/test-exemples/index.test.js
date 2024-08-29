import { expect, test } from "vitest";
import { sumExemple } from "@camagru/common-exemples";

test("adds 1 + 2 to equal 3", () => {
  expect(sumExemple(1, 2)).toBe(3);
});

import match from "./match";

test("Success to match to equal arrays", () => {
  expect(match([1, 2, 3], [3, 2, 1])).toBe(true);
});

test("Matching unequal arrays return false", () => {
  expect(match([1, 2, 3], [1, 2, 4])).toBe(false);
});

test("Matching different length arrays", () => {
  expect(match([1, 2], [1, 2, 3])).toBe(false);
});

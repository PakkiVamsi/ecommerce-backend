const productModel = require("../../src/models/product");
const productController = require("../../src/controllers/productController");

const testPayload = [
  {
    id: 1,
    name: "Sony Bravia",
    price: 100000,
  },
  {
    id: 2,
    name: "Samsung s10",
    price: 50000,
  },
];
test("two plus two is four", () => {
  expect(2 + 2).toBe(4);
});

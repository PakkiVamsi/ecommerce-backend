const Product = require("../models/product");

listProducts = function (req, res) {
  let data = req.body;
  console.log(typeof req.body);
  Product.listProducts(data, function (err, result) {
    if (err) {
      console.log(err);
      return res.status(500).send({ message: "Not ok!" });
    }
    return res.status(200).send({
      success: true,
      msg: "Successfully fetched products",
      products: result,
    });
  });
};

addProducts = function (req, res) {
  let data = req.body;
  if (
    data.name &&
    data.price &&
    data.description &&
    data.categoryId &&
    data.vendorId
  ) {
    Product.addProduct(data, function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).send({ status: "NOT OK" });
      }
      return res.status(200).send({
        success: true,
        products: result,
        msg: "Successfully added products",
      });
    });
  }
};

module.exports = { listProducts, addProducts };

var express = require("express");
const categoryController = require("../../../src/controllers/categoryController");
const productController = require("../../../src/controllers/productController");
const orderController = require("../../../src/controllers/orderController");
const userController = require("../../../src/controllers/userController");

var router = express.Router();
router.get("/", (req, res) => {
  res.send("Hello World");
});
router.post("/category/all", categoryController.listCategories);
router.post("/product/all", productController.listProducts);
router.post("/product/add", productController.addProducts);
router.post(
  "/order/details",
  userController.isAuthenticated,
  orderController.listOrderDetails
);
router.post("/order/add", orderController.createOrder);
router.post("/user/signup", userController.signup);
router.post("/order/edit", orderController.editOrder);
router.post("/user/login", userController.login);
router.post(
  "/user/updatePassword",
  userController.isAuthenticated,
  userController.updatePassword
);
module.exports = router;
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//   .eyJpZCI6MTU5LCJpYXQiOjE2NDIwMDk2MjEsImV4cCI6MTY0Mjg3MzYyMX0
//   ._ZqacVG4ff4w8wJi_shm3SQoqP635gq8XHiBwo - JQkg;

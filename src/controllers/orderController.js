const OrderDetails = require("../models/OrderDetails");
const Product = require("../models/product");
const OrderItem = require("../models/orderItem");

createOrder = function (req, res) {
  var data = req.body;
  let responseData = {
    success: false,
    msg: "Invalid params for creating order",
  };
  if (data.userId && data.productId) {
    Product.getProductDetails(data, function (err, product) {
      if (err) {
        console.log("error in fetching products", err);
        responseData.msg = "Error in creating the order";
        return res.status(500).send(responseData);
      }
      OrderDetails.findOrderByUser(data, function (err1, order) {
        if (err) {
          console.log("error in fetching products", err);
          responseData.msg = "Error in creating the order";
          return res.status(500).send(responseData);
        }
        if (order.length > 0) {
          data.total =
            parseInt(order[0].total, 10) +
            parseInt(product[0].price, 10) * data.quantity;
          data.orderId = order[0].ID;
          OrderDetails.editOrder(data, function (err2, orderDetail) {
            if (err2) {
              console.log("error in feditting order", err);
              responseData.msg = "Error in creating the order";
              return res.status(500).send(responseData);
            }
            OrderItem.addOrderItem(data, function (err3, orderItem) {
              if (err3) {
                console.log("error in adding orderitem", err);
                responseData.msg = "Error in creating the order";
                return res.status(500).send(responseData);
              }
              responseData.msg = "Successfully created an order";
              responseData.success = true;
              responseData.orderDetails = {
                orderId: order[0].ID,
              };
              return res.status(200).send(responseData);
            });
          });
        } else {
          data.total = parseInt(product[0].price, 10) * data.quantity;
          OrderDetails.addOrder(data, function (err2, orderDetail) {
            if (err2) {
              console.log("error in adding new order", err);
              responseData.msg = "Error in creating the order";
              return res.status(500).send(responseData);
            }
            //console.log()
            data.orderId = orderDetail.insertId;
            OrderItem.addOrderItem(data, function (err3, orderItem) {
              if (err3) {
                console.log("error in adding orderitem", err);
                responseData.msg = "Error in creating the order";
                return res.status(500).send(responseData);
              }
              responseData.msg = "Successfully created an order";
              responseData.success = true;
              responseData.orderDetails = {
                orderId: orderDetail.insertId,
              };
              return res.status(200).send(responseData);
            });
          });
        }
      });
    });
  } else {
    return res.status(400).send({ message: "Invalid data" });
  }
};

function editOrder(req, res) {
  let data = req.body;
  let responseData = {
    success: false,
    msg: "Invalid params for updating order details",
  };
  if (data.orderId && data.userId && data.productId) {
    Product.getProductDetails(data, function (err, product) {
      if (err) {
        console.log(err);
        return res.status(500).send(responseData);
      }
      OrderDetails.getOrderDetails(data, function (err1, orderDetail) {
        console.log("delete1");
        if (data.remove) {
          console.log("delete");
          if (err1) {
            console.log(err1);
            return res.status(500).send(responseData);
          }
          OrderItem.deleteOrderItem(data, function (err2, orderItem) {
            console.log("delete");
            if (err2) {
              console.log(err2);
              return res.status(500).send(responseData);
            }
            let productTotal = 0;
            orderDetail.forEach((item) => {
              if (item.productId == data.productId) {
                productTotal += item.price * item.quantity;
              }
            });
            console.log(productTotal);
            data.total = orderDetail[0].total - productTotal;
            console.log(data.total);
            OrderDetails.editOrder(data, function (err3, updatedOrder) {
              if (err3) {
                console.log(err3);
                return res.status(500).send(responseData);
              }
              responseData.success = true;
              responseData.msg = "Successfully updated order";
              return res.status(200).send(responseData);
            });
          });
        } else {
          OrderItem.editOrderItem(data, function (err2, orderItem) {
            if (err2) {
              console.log(err2);
              return res.status(500).send(responseData);
            }
            let productTotal = 0;
            orderDetail.forEach((item) => {
              if (item.productId == data.productId) {
                productTotal += item.price * item.quantity;
              }
            });
            data.total =
              orderDetail[0].total -
              productTotal +
              parseInt(data.quantity, 10) * product[0].price;
            OrderDetails.editOrder(data, function (err3, updatedOrder) {
              if (err3) {
                console.log(err3);
                return res.status(500).send(responseData);
              }
              responseData.success = true;
              responseData.msg = "Successfully updated order";
              return res.status(200).send(responseData);
            });
          });
        }
      });
    });
  } else {
    return res.status(400).send(responseData);
  }
}
listOrderDetails = function (req, res) {
  var data = req.body;
  OrderDetails.listOrderDetails(data, function (err, result) {
    if (err) return res.status(500).send({ msg: "NOT OK!" });
    return res.status(200).send({
      success: true,
      msg: "Successfully fetched Order details",
      orderDetails: result,
    });
  });
};

module.exports = { listOrderDetails, createOrder, editOrder };

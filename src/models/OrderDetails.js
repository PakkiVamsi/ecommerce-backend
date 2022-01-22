var sqlConnection = require("../services/sqlConnection");

function listOrderDetails(data, cb) {
  var sql =
    "SELECT d.UserID,ud.Username,p.Name,p.Price,i.Quantity,d.Total FROM ecommercedb.OrderDetails d inner join ecommercedb.OrderItems i on ( d.ID = i.OrderID &&  UserID= ? ) inner join ecommercedb.Products p on i.ProductID=p.ID inner join ecommercedb.Users ud on d.UserID=ud.ID";
  values = [];
  values.push(data.UserID);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}
function findOrderByUser(data, cb) {
  var sql = ` SELECT ID, Total AS total
                FROM OrderDetails
                WHERE UserId = ? AND OrderStatus = 1
                LIMIT 1`;
  var values = [];
  values.push(data.userId);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function addOrder(data, cb) {
  var sql = ` INSERT INTO OrderDetails
                (Total, UserID, OrderStatus, CreatedAt, UpdatedAt)
                VALUES (? , ? , 1, now(), now())`;
  var values = [];
  values.push(data.total);
  values.push(data.userId);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function editOrder(data, cb) {
  var sql = ` UPDATE OrderDetails
                SET Total = ?, OrderStatus = ?,
                UpdatedAt = now() WHERE ID = ?`;

  var values = [];
  if (data.payment) {
    sql = ` UPDATE OrderDetails SET OrderStatus = ?,
                UpdatedAt = now() WHERE ID = ?`;
    values.push(2);
  } else {
    values.push(data.total);
    values.push(1);
  }
  values.push(data.orderId);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function getOrderDetails(data, cb) {
  var sql = ` SELECT od.ID AS orderId, od.Total AS total, p.ID AS productId,
                p.Name AS productName, p.price AS price, oi.Quantity AS quantity
                FROM OrderDetails AS od LEFT JOIN OrderItems as oi
                ON od.ID = oi.OrderID LEFT JOIN Products AS p ON
                p.ID = oi.ProductID WHERE od.UserID = ? AND od.OrderStatus = 1`;
  var values = [];
  values.push(data.userId);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

module.exports = {
  listOrderDetails,
  findOrderByUser,
  getOrderDetails,
  editOrder,
  addOrder,
};

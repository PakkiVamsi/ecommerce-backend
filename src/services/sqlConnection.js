var mysql = require("mysql");
var config = require("../constants/backendConfig.js");
var pool = mysql.createPool(config.mysql.prod);

executeQuery = function (sql, data, cb) {
  pool.getConnection(function (err, connection) {
    if (err) {
      cb(err);
    } else {
      connection.query(sql, data, function (err1, result) {
        connection.release();
        cb(err1, result);
      });
    }
  });
};
module.exports = { executeQuery };

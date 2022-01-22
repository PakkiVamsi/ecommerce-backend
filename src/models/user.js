const sqlConnection = require("../services/sqlConnection");
const bcrypt = require("bcrypt");
const auth = require("../util/auth");

console.log("helooooooo");
function signup(data, cb) {
  var sql =
    "INSERT INTO ecommercedb.Users(Username,Password,UserType,CreatedAt,UpdatedAt) VALUES(?,?,0,now(),now())";
  var values = [];
  values.push(data.username);
  values.push(data.password);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}
function strongSignup(data, cb) {
  var sql =
    "INSERT INTO ecommercedb.Users(Username,Password,UserType,CreatedAt,UpdatedAt) VALUES(?,?,0,now(),now())";
  var values = [];
  values.push(data.username);
  bcrypt.hash(data.password, 8, function (err, hash) {
    if (err) {
      console.log(err);
      return;
    }
    values.push(hash);

    sqlConnection.executeQuery(sql, values, function (err, result) {
      cb(err, result);
    });
  });
}

function getUsersSignupDetails(data, cb) {
  let sql = "SELECT * FROM Users WHERE Username = ?";
  let values = [];
  values.push(data.username);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function login(data, cb) {
  let sql = `SELECT ID as UserId, Username, UserType
               FROM Users WHERE
               Username = ? AND Password = ?`;
  let values = [];
  values.push(data.username);
  values.push(data.password);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function strongLogin(data, cb) {
  let sql = `SELECT ID as UserId, Username,Password, UserType
               FROM Users WHERE
               Username = ? `;
  let values = [];
  values.push(data.username);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    // console.log(data.password, result, result[0].Password);
    const isValidPass = bcrypt.compareSync(data.password, result[0].Password);

    if (isValidPass) {
      const token = auth.newToken(result[0]);
      const response = [
        {
          UserId: result[0].UserId,
          Username: result[0].Username,
          UserType: result[0].UserType,
          authToken: token,
        },
      ];
      cb(err, response);
    } else {
      cb(err, []);
    }
    //cb(err, result);
  });
}

function getUserById(id, cb) {
  let sql = `SELECT ID as UserId, Username, UserType
               FROM Users WHERE
               ID = ?`;
  let values = [];
  values.push(id);
  sqlConnection.executeQuery(sql, values, function (err, result) {
    cb(err, result);
  });
}

function updatePassword(data, cb) {
  console.log("innnn");
  console.log(data);
  let sql = `UPDATE ecommercedb.Users SET Password = ? WHERE ID = ? and Username = ? `;
  let values = [];
  bcrypt.hash(data.newPassword, 8, function (err, hash) {
    if (err) {
      console.log(err);
      return;
    }
    values.push(hash);
    values.push(data.UserId);
    values.push(data.Username);
    sqlConnection.executeQuery(sql, values, function (err, result) {
      cb(err, result);
    });
  });
}

module.exports = {
  signup,
  strongSignup,
  getUsersSignupDetails,
  login,
  strongLogin,
  getUserById,
  updatePassword,
};

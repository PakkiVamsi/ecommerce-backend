const Category = require("../models/category");
module.exports = {
  listCategories: function (req, res) {
    Category.listCategories(function (err, result) {
      if (err) {
        console.log(err);
        return res.send({ message: "NOT OK!" });
      } else {
        console.log(result);
        return res.send({ message: "ALL OK!", category: result });
      }
    });
  },
};

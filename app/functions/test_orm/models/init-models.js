var DataTypes = require("sequelize").DataTypes;
var _department = require("./department");
var _enterprise = require("./enterprise");
var _goods = require("./goods");
var _order_details = require("./order_details");
var _order_pictures = require("./order_pictures");
var _order_view = require("./order_view");
var _order_view2 = require("./order_view2");
var _pictures = require("./pictures");
var _unit = require("./unit");

function initModels(sequelize) {
  var department = _department(sequelize, DataTypes);
  var enterprise = _enterprise(sequelize, DataTypes);
  var goods = _goods(sequelize, DataTypes);
  var order_details = _order_details(sequelize, DataTypes);
  var order_pictures = _order_pictures(sequelize, DataTypes);
  var order_view = _order_view(sequelize, DataTypes);
  var order_view2 = _order_view2(sequelize, DataTypes);
  var pictures = _pictures(sequelize, DataTypes);
  var unit = _unit(sequelize, DataTypes);


  return {
    department,
    enterprise,
    goods,
    order_details,
    order_pictures,
    order_view,
    order_view2,
    pictures,
    unit,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

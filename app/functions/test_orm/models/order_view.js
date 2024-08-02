const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_view', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Primary Key"
    },
    ent_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dept_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    good_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    count: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    unit_name: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Create Time"
    }
  }, {
    sequelize,
    tableName: 'order_view',
    timestamps: false
  });
};

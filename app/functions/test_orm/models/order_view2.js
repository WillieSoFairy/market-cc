const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_view2', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true,
      comment: "Primary Key"
    },
    ent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ent_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    dept_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dept_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    good_id: {
      type: DataTypes.INTEGER,
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
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Create Time"
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    pic_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reamrk: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order_view2',
    timestamps: false
  });
};

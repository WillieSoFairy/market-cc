const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pictures', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Create Time"
    },
    pic_fileID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    thumb_fileID: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    upload_user: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    entered_orders: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pictures',
    timestamps: false
  });
};

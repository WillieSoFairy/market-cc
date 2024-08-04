const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pictures', {
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
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Create Time"
    },
    pic_fileID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    thumb_fileID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upload_user: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'pictures',
    timestamps: false
  });
};

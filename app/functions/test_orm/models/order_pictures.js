const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order_pictures', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "Primary Key"
    },
    order_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    MD5: {
      type: DataTypes.CHAR(32),
      allowNull: false
    },
    pic_fileID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    upload_user: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Create Time"
    },
    ent_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    thumb_fileID: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    removed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'order_pictures',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};

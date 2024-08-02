const dbConfig = require("./db.config");
const { Sequelize } = require('sequelize');
const { database, user, password, host } = dbConfig;
const initModels = require('./models/init-models');


try {
    const sequelize = new Sequelize(database, user, password, {
        host: host, dialect: 'mysql'
    });
    module.exports = initModels(sequelize);
}
catch (error) {
    console.log(error);
    module.exports = null;
    throw error;
}



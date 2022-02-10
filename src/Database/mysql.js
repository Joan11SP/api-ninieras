const mysql = require('mysql');
const config = require('../config');

const connection = mysql.createConnection(
  {
    host: config.SERVER_DB,
    password: config.PASSWORD_DB,
    user: config.USER_DB,
    database: config.NAME_DB,
    port: config.PORT_DB,
    multipleStatements: true
  }
);

connection.connect( err => 
  {
    if (err) 
    {
      console.error(err);
      return;
    }   
    console.log('conectado a mysql');
  }
);

module.exports = connection;


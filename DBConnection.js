const mysql = require('mysql');

function newConnection()
{
    let connection = mysql.createConnection({
        host: '104.198.24.39',
        user: 'root',
        password: 'JIcmozn2pdbFHwIa',
        database: 'bankDB'
      });
      return connection;
}
module.exports = newConnection;




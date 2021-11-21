const mysql = require('mysql2/promise');

async function newConnection()
{
    let connection = await mysql.createConnection({
        host: '104.198.24.39',
        user: 'root',
        password: 'JIcmozn2pdbFHwIa',
        database: 'bankDB'
      });
      return connection;
}
module.exports = newConnection;




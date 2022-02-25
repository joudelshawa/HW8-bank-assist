const mysql = require('mysql2/promise');

async function newConnection()
{
    let connection = await mysql.createConnection({
        host: '35.222.11.233',
        user: 'root',
        password: 'JIcmozn2pdbFHwIa',
        database: 'bankDB'
      });
      return connection;
}
module.exports = newConnection;




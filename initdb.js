const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '104.198.24.39',
    user: 'root',
    password: 'JIcmozn2pdbFHwIa',
    database: 'bankDB'
})

connection.connect();

connection.query('Drop Table Client',
    (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Client table dropped');
        }

    });

connection.query(`
        CREATE TABLE Client (
            clientID int AUTO_INCREMENT PRIMARY KEY,
            fname varchar(40),
            lname varchar(40),
            address varchar(20)
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Client Table Created');
        }
    });

    /*connection.query(`
        CREATE TABLE Statement (
            statementID int AUTO_INCREMENT PRIMARY KEY,
            duedate date,
            amount decimal(10,2)
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Statement Table Created');
        }
    });

    connection.query(`
        CREATE TABLE Transaction (
            transactionID int AUTO_INCREMENT PRIMARY KEY,
            dateposted date,
            amount decimal(10,2),
            clientID int,
            statementID int
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Transaction Table Created');
        }
    });*/

connection.end();
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '104.198.24.39',
    user: 'root',
    password: 'JIcmozn2pdbFHwIa',
    database: 'bankDB'
})

connection.connect();

connection.query('Drop Table TimeSlot',
    (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('TimeSlot Table Dropped');
        }

    });

connection.query(`
        CREATE TABLE TimeSlot (
            name varchar(20),
            timeone varchar(20),
            timetwo varchar(20),
            timethree varchar(20),
            timefour varchar(20),
            timefive varchar(20),
            timesix varchar(20),
            timeseven varchar(20),
            timeeight varchar(20),
            timenine varchar(20),
            timeten varchar(20)

    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('TimeSlot Table Created');
        }
    });

connection.end();
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '104.198.24.39',
    user: 'root',
    password: 'JIcmozn2pdbFHwIa',
    database: 'bankDB'
})

connection.connect();

// dropping old tables

connection.query('DROP Table Client',
    (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Client table dropped');
        }

    });

connection.query('DROP Table Statement',
(error, rows, fields) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Statement table dropped');
    }

});

connection.query('DROP Table Transaction',
(error, rows, fields) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Transaction table dropped');
    }

});

// creating tables -- removed autoincrement stuff 

connection.query(`
        CREATE TABLE Client (
            clientID int PRIMARY KEY,
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


connection.query(`
    CREATE TABLE Statement (
        statementID int PRIMARY KEY,
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
        transactionID int PRIMARY KEY,
        location char(40),
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
});


// inserting values into tables 

connection.query(`
    INSERT INTO TABLE Client VALUES(
        14,
        "Jon",
        "Snow",
        "1234 Baker Avenue" 
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Could not insert data into Client table');
        }
});

connection.query(`
    INSERT INTO TABLE Statement VALUES(
        13,
        "2021-11-29",
        439.52,
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Could not insert data into Statement table');
        }
});

connection.query(`
    INSERT INTO TABLE Transaction VALUES (
        "2021-11-20",
        "bubble tea",
        23.74,
        14,
        13
    ), (
        "2021-11-21",
        "hack western",
        30.95,
        14,
        13
    ), (
        "2021-11-21",
        "dasha",
        49.99,
        14,
        13
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Could not insert data into Statement table');
        }
});

connection.end();
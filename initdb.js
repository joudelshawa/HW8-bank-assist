const mysql = require('mysql');

let connection = mysql.createConnection({
    host: '104.198.24.39',
    user: 'root',
    password: 'JIcmozn2pdbFHwIa',
    database: 'bankDB'
})

connection.connect();

// dropping old tables

connection.query('DROP Table Transaction',
(error, rows, fields) => {
    if (error) {
        console.log(error);
    }
    else {
        console.log('Transaction table dropped');
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

connection.query('DROP Table Client',
    (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Client table dropped');
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
        amount decimal(10,2),
        clientID int,
        FOREIGN KEY (clientID) REFERENCES Client(clientID)
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
        statementID int,
        FOREIGN KEY (clientID) REFERENCES Client(clientID) ON DELETE CASCADE,
        FOREIGN KEY (statementID) REFERENCES Statement(statementID) ON DELETE CASCADE
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
    INSERT INTO Client VALUES(
        11,
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
            console.log('inserted data into Client table');
        }
});

connection.query(`
    INSERT INTO Statement VALUES(
        13,
        "2021-11-29",
        439.52,
        11
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('inserted data into Statement table');
        }
});

connection.query(`
    INSERT INTO Transaction VALUES (
        1546,
        "bubble tea",
        "2021-11-20",
        7.74,
        11,
        13
    ), (
        1547,
        "hack western",
        "2021-11-21",
        30.95,
        11,
        13
    ), (
        1548,
        "dasha",
        "2021-11-21",
        49.99,
        11,
        13
    );
    `
    , (error, rows, fields) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('inserted data into Statement table');
        }
});

connection.end();
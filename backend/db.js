const mysql = require('mysql2');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'hospital'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});
module.exports = connection;
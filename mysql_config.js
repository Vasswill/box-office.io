const mysql = require('mysql');

const mysql_connection = mysql.createConnection({
    host     : '85.10.205.173',
    user     : 'boxoffice_admin',
    password : '11121150',
    database : 'db_boxoffice_io'
});

const connect = (query) => {
    return new Promise(function(resolve, reject){
        mysql_connection.connect();
        mysql_connection.query(query, (err, rows, fields)=>{
            if(err) reject(err);
            mysql_connection.end()
            resolve({
                rows: rows,
                fields: fields
            });
        });
    });
}

module.exports = {connect: connect};

// ==== MySQL DB @ db4free.net ====
// host: 85.10.205.173 or db4free.net
// phpMyAdmin: https://www.db4free.net/phpMyAdmin/
// Database: db_boxoffice_io
// Username: boxoffice_admin
// Email: htraexd@gmail.com
// ================================
// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Syt@cd#$2m',
  database: 'petcare',
});

module.exports = pool;

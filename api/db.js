const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
    connectionString: process.env.DB_CONNECTION_STRING, // URI yang valid
    max: 10, // Maksimal 10 koneksi dalam pool
    idleTimeoutMillis: 30000, // Timeout untuk koneksi idle (30 detik)
    connectionTimeoutMillis: 5000, // Timeout saat menunggu koneksi (5 detik)
});


module.exports = pool
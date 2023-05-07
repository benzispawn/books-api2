const {Client, Pool} = require("pg");
const fs = require("fs");
/**
 * Database
 */
async function startConn(req, res, next) {
    // let client;
    try {
        if (!res.databasePool) {
            const { Pool } = require('pg');
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                // ssl: {
                //     rejectUnauthorized: false,
                //     ca: fs.readFileSync('root.crt').toString(),
                // },
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
            res.databasePool = pool;
            res.databasePool.on('error', (err, client) => {
                console.log('@@@ passou no error gerals')
                console.error('Unexpected error on idle client', err)
                process.exit(-1)
            });
            
        }

    } catch (e) {
        console.log('@@@ passou no catch')
        console.log(e.stack)
    } 
    next();
}
module.exports = {
    startConn: startConn
}

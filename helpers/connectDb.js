const {Client, Pool} = require("pg");
const fs = require("fs");
/**
 * Database
 */
async function startConn(req, res, next) {
    console.log('@@@ ta ligando???');
    let client;
    try {
        if (!res.databasePool) {
            const { Pool } = require('pg');
            const pool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                    rejectUnauthorized: false,
                    ca: fs.readFileSync('root.crt').toString(),
                },
                max: 20,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            });
            console.log('@@ foi malucao');
            res.databasePool = pool;
            pool.on('error', (err, client) => {
                console.error('Unexpected error on idle client', err)
                process.exit(-1)
            });
            client = await pool.connect();
            const resultado = await client.query('SELECT NOW()');
            console.log(resultado.rows[0])

        }

    } catch (e) {
        console.log(e.stack)
    } finally {
        // client.release();
    }
    next();
}
module.exports = {
    startConn: startConn
}

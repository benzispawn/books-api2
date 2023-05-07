const { permissions } = require("../configs/urlPermissions");
const queries = require("../queries/guard/secret");
const jwt = require("jsonwebtoken");


async function guard(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    const public = req.headers['x-api'];
    if (!permissions.includes(req.url)) {
        const client = await res.databasePool.connect();
        try {
            let getLog = queries.getLog();
            getLog.values.push(public);
            const resultGetLog = await client.query(getLog);
            console.log(resultGetLog)
            if (resultGetLog.rows?.length == 0) {
                return res.status(400).json({
                    status: 'failed',
                    message: `Permission denied...`
                })
            }
            
            jwt.verify(token, resultGetLog.rows[0].secret);

        } catch (error) {
            const updateLog = queries.updateLogInactive();
            updateLog.values.push(public);
            const resultUpdateLog = client.query(updateLog);
            return res.status(400).json({
                status: 'failed',
                message: error?.message
            })
        } finally {
            client.release();
        }
    }
    next();
}

module.exports = {
    guard
}
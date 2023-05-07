/**
 * @swagger
 * components: 
 *  schemas:
 *    RegUser:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - birth
 *        - pass
 *      properties:
 *        name:
 *          type: string
 *          description: Name of the user
 *        email:
 *          type:  string
 *          description: Email of the user
 *        birth:
 *          type: string
 *          format: date
 *          description: The birthday of the user
 *        pass:
 *          type: string
 *          descirption: The password of the user
 *    RespToken:
 *      type: object
 *      required:
 *        - status
 *        - data
 *      properties:
 *        status:
 *          type: string
 *          description: Status of the response (success, error, notfound)
 *        token:
 *          type: string
 *          description: The token
 * tags:
 *  name: Register User
 *  description: The register of a user in the API
 * /api/v1/register:
 *  get:
 *    summary: register an user
 *    tags: [Register Users]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RespToken'
 *      500:
 *        description: Some server error
 */

var express = require('express');
var router = express.Router();


const { validate } = require('../validators/validate');
const { authValidation } = require('../validators/auth');
const { compare, genHash } = require('../helpers/compareHash');
var queries = require('../queries/clients/register');
const jwt = require('jsonwebtoken');

router.post(
  '/', 
  validate(authValidation),
  async function(req, res, next) {
    const client = await res.databasePool.connect();
    try {

        client.query('BEGIN');
        let getUserByEmail = queries.getUserByEmail();
        getUserByEmail.values.push(req.body.email);
        const emailExist = await client.query(getUserByEmail);
        if (!emailExist.rows?.length) {
            client.query('ROLLBACK');
            return res.status(400).json({
                status: 'failed',
                message: 'The login must be wrong...'
            }) 
        }

        let updateLog = queries.updateLogInactive();
        updateLog.values.push(emailExist.rows[0]?.cli_id);
        const updateLogInactive = client.query(updateLog);

        /**
         * Is it blocked???
         */

        let blocked = queries.blocked();
        blocked.values.push(emailExist.rows[0]?.cli_id);
        const resultBlocked = await client.query(blocked);
        if (resultBlocked.rows[0]?.blocked == 1) {
            client.query('COMMIT');
            return res.status(400).json({
                status: 'failed',
                message: `You've been blocked temporarily...`
            }) 
        }

        /**End of blocked */

        const resultCompare = await compare(req.body.pass, emailExist.rows[0].pass);

        let insertLog = queries.insertLog();
        insertLog.values.push(emailExist.rows[0]?.cli_id)

        const log = await client.query(insertLog);

        if (!resultCompare) {
            client.query('COMMIT');
            let updateLogFailed = queries.updateLogFailed();
            updateLogFailed.values.push(log.rows[0]?.clg_id);
            const resultLogFailed = client.query(updateLogFailed);
            return res.status(400).json({
                status: 'failed',
                message: 'The login must be wrong...'
            }) 
        }

        let getLog = queries.getLog();
        getLog.values.push(log.rows[0].clg_id);

        const resultGetLog = await client.query(getLog);

        const token = jwt.sign({
        exp: Math.floor(new Date(resultGetLog.rows[0].valid) / 1000),
        data: resultGetLog.rows[0].public
        }, resultGetLog.rows[0].secret);

        client.query('COMMIT');
        res.status(200).json({
            status: 'success',
            token: token,
        })
    } catch (error) {
        client.query('ROLLBACK');
        return res.status(400).json({
            status: 'failed',
            message: error?.message
        })
    } finally {
        client.release();
    }
});

module.exports = router;
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
var queries = require('../queries/clients/register');
const { validate } = require('../validators/validate');
const { registeUserValidation } = require('../validators/clientRegister');
const jwt = require('jsonwebtoken');

router.post(
  '/', 
  validate(registeUserValidation),
  async function(req, res, next) {

  const client = await res.databasePool.connect();
  try {
    client.query('BEGIN');
    queries.getUserByEmail.values.push(req.body.email);
    const emailExist = await client.query(queries.getUserByEmail);

    if (emailExist.rows?.length) {
      return res.status(400).json({
        status: 'failed',
        message: 'The email has been register...'
      })
    }
    let insertClient = queries.insertClient();
    insertClient.values.push(req.body.birth);
    insertClient.values.push(req.body.email);
    insertClient.values.push(req.body.name);
    insertClient.values.push(req.body.pass);
    const resultado = await client.query(insertClient)

    let insertLog = queries.insertLog();
    insertLog.values.push(resultado.rows[0]?.cli_id)

    const log = await client.query(insertLog);

    let getLog = queries.getLog();
    getLog.values.push(log.rows[0].clg_id);

    const resultGetLog = await client.query(getLog);

    const token = jwt.sign({
      exp: Math.floor(new Date(resultGetLog.rows[0].valid) / 1000),
      data: resultGetLog.rows[0].public
    }, resultGetLog.rows[0].secret);

    client.query('COMMIT');

    client.release();

    res.json({
      "status": "success",
      "token": token
    });
  } catch (error) {
    client.query('ROLLBACK');
    return res.status(400).json({
      "status": "failed",
      "error": error?.message
    })
  } finally {
    client.release();
  }

  
});

module.exports = router;
/**
 * @swagger
 * components: 
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - birth
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
 *    RespUsers:
 *      type: object
 *      required:
 *        - status
 *        - data
 *      properties:
 *        status:
 *          type: string
 *          description: Status of the response (success, error, notfound)
 *        data:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/User'
 *          description: Array of users
 *    RespUser:
 *      type: object
 *      required:
 *        - status
 *        - data
 *      properties:
 *        status:
 *          type: string
 *          description: Status of the response (success, error, notfound)
 *        data:
 *          $ref: '#/components/schemas/User'
 *          description: An user
 * tags:
 *  name: Users
 *  description: The users managing API
 * /api/v1/users:
 *  get:
 *    summary: get all users
 *    tags: [Users]
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RespUsers'
 *      500:
 *        description: Some server error
 * /api/v1/users/{id}:
 *  get:
 *    summary: get an user by id
 *    tags: [User]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: integer
 *        decription: The user ID
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/RespUser'
 *      500:
 *        description: Some server error
 */

var express = require('express');
var router = express.Router();
var queries = require('../queries/clients/all');

/* GET users listing. */
router.get('/', async function(req, res, next) {

  const client = await res.databasePool.connect();
  const resultado = await client.query(queries.all);
  // console.log(resultado.rows[0])
  client.release();

  res.json({
    "status": "success",
    "data": resultado.rows
  });
});

router.get('/:id', async function(req, res, next) {

  const client = await res.databasePool.connect();
  queries.byId.values.push(req.params?.id);
  const resultado = await client.query(queries.byId);

  console.log(resultado)
  
  client.release();
  if (resultado.rowCount == 0) {
    return res.json({
      "status": "notfound",
      "data": resultado.rows
    });
  }
  res.json({
    "status": "success",
    "data": resultado.rows
  });
});

module.exports = {
  router
};

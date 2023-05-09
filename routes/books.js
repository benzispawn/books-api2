var express = require('express');
var router = express.Router();
const queries = require('../queries/books/all');
const { validate } = require('../validators/validate');
const { registeBookValidation } = require('../validators/bookRegister');
const { editBookValidation } = require('../validators/bookEdit');
const { delBookValidation } = require('../validators/bookDel');

router.get('/', async function(req, res, next) {

  const client = await res.databasePool.connect();
  let all = queries.all();
  const resultado = await client.query(all);
  client.release();

  res.json({
    "status": "success",
    "data": resultado.rows
  });
});

router.get('/:id', async function(req, res, next) {

  const client = await res.databasePool.connect();
  let byId = queries.byId();
  byId.values.push(req.params?.id);
  const resultado = await client.query(byId);

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
/**
 * Insert book
 */
router.post('/', async function(req, res, next) {
  const client = await res.databasePool.connect();
  try {
    let insertBook = queries.insertBook();
    insertBook.values.push(req.body.name);
    insertBook.values.push(req.client);
    const resultado = await client.query(insertBook);
  
    client.release();
    
    res.json({
      "status": "success",
      "data": resultado.rows
    });
  } catch (error) {
    return res.status(400).json({
        status: 'failed',
        message: error?.message
    })
  }
 
});

router.put(
  '/',
  validate(editBookValidation),
  async function(req, res, next) {
  
  const client = await res.databasePool.connect();
  try {
    client.query('BEGIN');
    let updateBook = queries.updateBook();
    updateBook.values.push(req.body.name);
    updateBook.values.push(req.body.id);
    const resultado = await client.query(updateBook);

    client.query('COMMIT');
    client.release();
    
    res.json({
      "status": "success",
      "data": resultado.rows
    });
  } catch (error) {
    client.query('ROLLBACK');
    return res.status(400).json({
        status: 'failed',
        message: error?.message
    })
  }
  
});

router.delete(
  '/:id',
  validate(delBookValidation),
  async function(req, res, next) {

  const client = await res.databasePool.connect();
  try {
    client.query('BEGIN');
    let deleteBook = queries.deleteBook();
    deleteBook.values.push(req.body.id);
    const resultado = await client.query(deleteBook);
    client.query('COMMIT');
    client.release();
    
    res.json({
      "status": "success",
      "data": resultado.rows
    });
  } catch (error) {
    client.query('ROLLBACK');
    return res.status(400).json({
        status: 'failed',
        message: error?.message
    })
  }
  
});

module.exports = router;
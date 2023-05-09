var express = require('express');
var router = express.Router();
const queries = require('../queries/books/all');

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

  module.exports = router;
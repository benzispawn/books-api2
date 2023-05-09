const { body } = require('express-validator');


const delBookValidation = [
    body('id').isInt().notEmpty(),
];

module.exports = {
    delBookValidation
}

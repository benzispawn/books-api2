const { body } = require('express-validator');


const editBookValidation = [
    body('id').isInt().notEmpty(),
    body('name').isLength({ min: 1, max: 50 }).notEmpty()
];

module.exports = {
    editBookValidation
}

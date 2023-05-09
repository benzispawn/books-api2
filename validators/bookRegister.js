const { body } = require('express-validator');


const registeBookValidation = [
    body('name').isLength({ min: 1, max: 50 })
];

module.exports = {
    registeBookValidation
}

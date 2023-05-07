const { body } = require('express-validator');


const authValidation = [
    body('email').isEmail().notEmpty(),
    body('pass').isStrongPassword(),
];

module.exports = {
    authValidation
}
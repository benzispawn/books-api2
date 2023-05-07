const { body } = require('express-validator');


const registeUserValidation = [
    body('email').isEmail().notEmpty(),
    body('name').isLength({ min: 1, max: 50 }),
    body('birth').isISO8601(),
    body('pass').isStrongPassword(),
];

module.exports = {
    registeUserValidation
}

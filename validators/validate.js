const { validationResult, validationChain } = require('express-validator');

const validate = validations => {
    return async (req, res, next) => {
        const arrbody = Object.keys(req.body);
        const arrVal = validations.map(_val => _val.builder.fields[0]) ?? [];
        for (let _b of arrbody) {
            const hasBody = arrVal.includes(_b);
            if (!hasBody) {
                return res.status(400).json({
                    status: 'failed',
                    error: `The field '${_b}' has not been validated properly...`,
                });
            }
        }

        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        res.status(400).json({ errors: errors.array() });
    }
}

module.exports = {
    validate,
}
const bcrypt = require('bcrypt');


async function compare(password, hash) {
    try {
        const comp = bcrypt.compare(password, hash);
        return comp
    } catch (error) {
        return {
            error: error?.message
        }
    }       
}

async function genHash(password) {
    try {
        const getSalt = await bcrypt.genSalt(13);
        const hash = await bcrypt.hash(password, getSalt);
        return hash;
    } catch (error) {
        return {
            error: error?.message
        }
    }
}

module.exports = {
    compare,
    genHash
}
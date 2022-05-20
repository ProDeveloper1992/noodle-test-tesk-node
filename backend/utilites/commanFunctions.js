const jwt = require('jsonwebtoken');
const secret = require('../config/secret-manager');
const bcrypt = require('bcryptjs');

/**
 * @description: This function is used to check type of the object
 * @param {any} variable
 * @param {string} type
 * @returns {Boolean}
 */
exports.checkTypeof = (variable, type) => {
    if (typeof variable === type) {
        return false;
    } else {
        return true;
    }
};
/**
 * @description: Generate hash for password
 * @param {string} data
 * @returns {*}
 */
exports.getHash = (data) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data, salt);
    return hash;
};
/**
 * @description: Compare hashed password
 * @param {string} data
 * @param {string} data1
 * @returns {*}
 */
exports.compareHash = (data, data1) => {
    return bcrypt.compareSync(data, data1);
};

/**
 * @description: Get or generate JWT token
 * @returns {Promise<*>}
 * @param {object} data
 * @param {number} expiresIn
 */
exports.genToken = async (data, expiresIn = 2592000) => {
    return await jwt.sign(data, secret('secretOrKey'), {
        expiresIn: expiresIn,
    });
};

/**
 * @description: Validate the JWT token
 * @param {token} data
 * @returns {Promise<*|{err}>}
 */
exports.validateToken = async (data) => {
    try {
        return await jwt.verify(data, secret('secretOrKey'));
    } catch (err) {
        return { err: err.name };
    }
};

exports.readExcel = readExcel;

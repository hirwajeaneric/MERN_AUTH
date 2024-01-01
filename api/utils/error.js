/**
 * This is an error handling middleware that is going to be returning a preformatted error message by using the in buidl javascript `new Error()` function.
 * @param {Number} statusCode 
 * @param {String} message 
 * @returns {Error} error
 */
export const errorHandler = (statusCode, message) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = message;
    return error;
};
const { CustomError } = require('./custom-error');

class NotFoundError extends CustomError {
    constructor() {
        super('Route Not Found');
        this.statusCode = 404;

        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Not Found' }];
    }
}

module.exports = { NotFoundError };

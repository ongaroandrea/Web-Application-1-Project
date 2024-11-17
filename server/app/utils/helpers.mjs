import { validationResult } from 'express-validator'

/**
 * The ErrorHandler class is used to handle errors in the application.
 */

const errorFormatter = ({msg}) => {
    return msg;
};

class ErrorHandler {

    /**
     * Validates the request object and returns an error if the request object is not formatted properly, according to the middlewares used when defining the request.
     * @param req - The request object
     * @param res - The response object
     * @param next - The next function
     * @returns Returns the next function if there are no errors or a response with a status code of 422 if there are errors.
     */
    validateRequest(req, res, next) { 
        const invalidFields = validationResult(req);

        if (!invalidFields.isEmpty()) {
            const errors = invalidFields.formatWith(errorFormatter)
            //from map to string 
            const errors_mapped = Object.entries(errors.mapped())
                                        .map(([key, value]) => `${key} ${value}`)
                                        .join(', ');
            return res.status(422).json({ message: errors_mapped });
        }
        return next()
    }
}

export default ErrorHandler
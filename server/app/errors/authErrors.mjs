import { CustomError } from "./customError.mjs";

const FAILED_LOGIN = 'Failed to login';
const NOT_AUTHENTICATED = 'Not authenticated';
const NOT_AUTHENTICATED_ADMIN = 'Not authenticated as admin';
const MISSING_FIELDS = 'Missing fields';
const USER_ALREADY_EXISTS = 'User already exists';

export class FailedLogin extends CustomError {
    constructor() {
        super(FAILED_LOGIN, 401);
    }
}

export class NotAuthenticated extends CustomError {
    constructor() {
        super(NOT_AUTHENTICATED, 401);
    }
}

export class NotAuthenticatedAdmin extends CustomError {
    constructor() {
        super(NOT_AUTHENTICATED_ADMIN, 401);
    }
}

export class MissingFields extends CustomError {
    constructor() {
        super(MISSING_FIELDS, 422);
    }
}

export class UserAlreadyExists extends CustomError {
    constructor() {
        super(USER_ALREADY_EXISTS, 409);
    }
}
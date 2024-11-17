import { CustomError } from "./customError.mjs";

const PREFERENCE_NOT_FOUND = 'Preference not found'
const NOT_AUTHORIZED = 'Not authorized to access this preference'
const BUDGET_PHASE_ERROR = 'Budget is not in the preference phase'
const PREFERENCE_ALREADY_EXISTS = 'Preference for this proposal already exists'

export class PreferenceNotFound extends CustomError {
    constructor() {
        super(PREFERENCE_NOT_FOUND, 404)
    }
}

export class NotAuthorized extends CustomError {
    constructor() {
        super(NOT_AUTHORIZED, 401)
    }
}

export class BudgetPhaseError extends CustomError {
    constructor() {
        super(BUDGET_PHASE_ERROR, 403)
    }
}

export class PreferenceAlreadyExistsError extends CustomError {
    constructor() {
        super(PREFERENCE_ALREADY_EXISTS, 409)
    }
}
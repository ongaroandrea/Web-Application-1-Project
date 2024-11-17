import { CustomError } from "./customError.mjs";

const BUDGET_PHASE_ERROR = 'Budget is not in the proposal phase'
const BUDGET_ALREADY_EXISTS = 'Budget for this year already exists'
const BUDGET_IN_PHASE_3 = 'Budget is already in phase 3'
const BUDGET_NOT_FOUND = 'Budget not found'
const BUDGET_NOT_PHASE3 = 'Budget is not in phase 3'

export class BudgetPhaseError extends CustomError {
    constructor() {
        super(BUDGET_PHASE_ERROR, 403)
    }
}

export class BudgetAlreadyExistsError extends CustomError {
    constructor() {
        super(BUDGET_ALREADY_EXISTS, 409);
        
    }
}

export class BudgetInPhase3Error extends CustomError {
    constructor() {
        super(BUDGET_IN_PHASE_3, 403)
    }
}

export class BudgetNotFoundError extends CustomError {
    constructor() {
        super(BUDGET_NOT_FOUND, 404)
    }
}

export class BudgetNotPhase3Error extends CustomError {
    constructor() {
        super(BUDGET_NOT_PHASE3, 403)
    }
}
import { CustomError } from "./customError.mjs"

const NOT_AUTHORIZED = 'User is not the creator of this proposal'
const AMOUNT_GREATER_THAN_BUDGET = 'Amount is greater than budget value'
const USER_ALREADY_HAS_THREE_PROPOSALS = 'User already has three proposals for this budget'
const BUDGET_NOT_IN_PROPOSAL_PHASE = 'Budget is not in the proposal phase'
const PROPOSAL_NOT_FOUND = 'Proposal not found'
const PROPOSAL_SAME_TITLE = 'There is already a proposal with the same title'

export class NotAuthorized extends CustomError {
    constructor() {
        super(NOT_AUTHORIZED, 401);
    }
}

export class AmountGreaterThanBudget extends CustomError {
    constructor() {
        super(AMOUNT_GREATER_THAN_BUDGET, 400)
    }
}

export class UserAlreadyHasThreeProposals extends CustomError {
    constructor() {
        super(USER_ALREADY_HAS_THREE_PROPOSALS, 409);
    }
}

export class BudgetPhaseError extends CustomError {
    constructor() {
        super(BUDGET_NOT_IN_PROPOSAL_PHASE, 403)
    }
}

export class ProposalNotFoundError extends CustomError {
    constructor() {
        super(PROPOSAL_NOT_FOUND, 404);
    }
}

export class ProposalSameTitle extends CustomError {
    constructor() {
        super(PROPOSAL_SAME_TITLE, 409);
    }
}

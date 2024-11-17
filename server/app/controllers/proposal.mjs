
import ProposalDAO from '../dao/proposal.mjs';
import BudgetDAO from '../dao/budget.mjs';
import { BudgetPhaseError,  BudgetNotFoundError } from '../errors/budgetErrors.mjs';
import { NotAuthorized, UserAlreadyHasThreeProposals, AmountGreaterThanBudget, ProposalNotFoundError, ProposalSameTitle } from '../errors/proposalErrors.mjs';

export default class ProposalController {

    proposalDAO;
    budgetDAO;
    constructor() {
        this.proposalDAO = new ProposalDAO();
        this.budgetDAO = new BudgetDAO();

    }

    /**
     * Get all proposals of a user. The user can be null, in this case, it will return all proposals accepted in the current budget
     * @param {number} userID 
     * @returns the list of proposals
     * @throws {BudgetNotFoundError} if there is no current budget
     */
    async getAll(userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if(!budget) {
                throw new BudgetNotFoundError()
            }
            if (userID == null) {
                if (budget.phase == 3) {
                    return await this.proposalDAO.getByBudgetIDAccepted(budget.id);
                } else {
                    return []
                }
            }

            if (budget.phase == 3) {
                return await this.proposalDAO.getByBudgetIDAcceptedAndNot(budget.id, userID);
            }

            if (budget.phase == 2) {
                return await this.proposalDAO.getByBudgetID(budget.id);
            }

            if(budget.phase == 1) {
                return await this.proposalDAO.getByUserAndBudgetID(userID, budget.id);
            }

            return []
        } catch (error) {
            throw error
        }

    }

    /**
     * Get a proposal by its id
     * @param {number} id 
     * @param {number} userID 
     * @returns the proposal
     * @throws {ProposalNotFoundError} if the proposal does not exist
     * @throws {NotAuthorized} if the user is not the creator of the proposal
     */
    async get(id, userID) {
        try {
            const proposal = await this.proposalDAO.getByID(id);
            if(!proposal) {
                throw new ProposalNotFoundError()
            }
            if (proposal.createdBy != userID) {
                throw new NotAuthorized()
            }

            return proposal
        } catch (error) {
            throw error
        }
    }

    /**
     * Create a proposal
     * @param {string} title 
     * @param {number} amount 
     * @param {number} userID 
     * @returns true if the proposal was created successfully
     * @throws {BudgetPhaseError} if the budget is not in the proposal phase
     * @throws {AmountGreaterThanBudget} if the amount is greater than the budget
     * @throws {UserAlreadyHasThreeProposals} if the user already has 3 proposals
     * @throws {ProposalSameTitle} if there is already a proposal with the same title
     */
    async create(title, amount, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (budget.phase != 1) {
                throw new BudgetPhaseError()
            }
            if (budget.value < amount) {
                throw new AmountGreaterThanBudget()
            }
            const proposal = await this.proposalDAO.getByUserAndBudgetID(userID, budget.id);
            // If someone has already made 3 proposals, they can't make more. 
            //It's bigger and equal to avoid situation where somehow the user has more than 3 proposals
            if (proposal.length >= 3) {
                throw new UserAlreadyHasThreeProposals()
            }
            
            //check if there is already a proposal with the same title
            const proposals = await this.proposalDAO.getByBudgetID(budget.id);
            for (let i = 0; i < proposals.length; i++) {
                if (proposals[i].title == title) {
                    throw new ProposalSameTitle()
                }
            }

            return await this.proposalDAO.create(title, amount, budget.id, userID);
        } catch (error) {
            throw error
        }
    }

    /**
     * Update a proposal
     * @param {*} id 
     * @param {*} budgetValue 
     * @param {*} title 
     * @param {*} userID 
     * @returns true if the proposal was updated successfully
     * @throws {AmountGreaterThanBudget} if the amount is greater than the budget
     * @throws {ProposalNotFoundError} if the proposal does not exist
     * @throws {NotAuthorized} if the user is not the creator of the proposal
     * @throws {BudgetPhaseError} if the budget is not in the proposal phase
     * @throws {ProposalSameTitle} if there is already a proposal with the same title
     */
    async update(id, budgetValue, title, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (budget.phase != 1) {
                throw new Error("Budget is not in the proposal phase");
            }
            if (budget.value < budgetValue) {
                throw new AmountGreaterThanBudget()
            }
            const proposal = await this.proposalDAO.getByID(id);
            if(!proposal) {
                throw new ProposalNotFoundError()
            }
            if (proposal.createdBy != userID) {
                throw new NotAuthorized()
            }

            //check if there is already a proposal with the same title
            const proposals = await this.proposalDAO.getByBudgetID(budget.id);
            for (let i = 0; i < proposals.length; i++) {
                if (proposals[i].title == title && proposals[i].id != id) {
                    throw new ProposalSameTitle()
                }
            }

            return await this.proposalDAO.update(id, budgetValue, title);
        } catch (error) {
            throw error
        }
    }

    /**
     * Delete a proposal
     * @param {number} id 
     * @param {number} userID 
     * @returns true if the proposal was deleted successfully
     * @throws {BudgetPhaseError} if the budget is not in the proposal phase
     * @throws {ProposalNotFoundError} if the proposal does not exist
     * @throws {NotAuthorized} if the user is not the creator of the proposal
     * @throws {BudgetNotFoundError} if there is no current budget
     */
    async delete(id, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget()
            if(!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 1) {
                throw new BudgetPhaseError()
            }
            const proposal = await this.proposalDAO.getByID(id);
            if(!proposal) {
                throw new ProposalNotFoundError()
            }
            if (proposal.createdBy != userID) {
                throw new NotAuthorized()
            }
            return await this.proposalDAO.delete(id);
        } catch (error) {
            throw error
        }
    }
}

export { ProposalController }
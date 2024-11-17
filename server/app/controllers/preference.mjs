
import PreferenceDAO from '../dao/preference.mjs';
import BudgetDAO from '../dao/budget.mjs';
import ProposalDAO from '../dao/proposal.mjs';

import { PreferenceNotFound, NotAuthorized, BudgetPhaseError, PreferenceAlreadyExistsError } from '../errors/preferenceErrors.mjs';
import { ProposalNotFoundError } from '../errors/proposalErrors.mjs';
import { BudgetNotFoundError } from '../errors/budgetErrors.mjs';
import dayjs from 'dayjs';

export default class PreferenceController {
    preferenceDAO;
    budgetDAO;
    proposalDAO;

    constructor() {
        this.preferenceDAO = new PreferenceDAO();
        this.budgetDAO = new BudgetDAO();
        this.proposalDAO = new ProposalDAO();
    }

    /**
     * Get all preferences of a user
     * @param {number} userID 
     * @returns the list of preferences
     * @throws {BudgetNotFoundError} if there is no current budget
     */
    async getAll(userID) {
        try {
            const currentBudget = await this.budgetDAO.getCurrentBudget();
            if (!currentBudget) {
                throw new BudgetNotFoundError()
            }
            return await this.preferenceDAO.getByUserIDBudgetID(userID, currentBudget.id);
        } catch (error) {
            throw error
        }
    }

    /**
     * Get a preference by its id and the user id
     * @param {number} id 
     * @param {number} userID 
     * @returns the preference
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetPhaseError} if the current budget is not in phase 2
     * @throws {PreferenceNotFound} if the preference does not exist
     * @throws {NotAuthorized} if the user is not the creator of the preference
     */
    async get(id, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 2) {
                throw new BudgetPhaseError()
            }
            const preference = await this.preferenceDAO.getByID(id);
            if (!preference) {
                throw new PreferenceNotFound()
            } 
            if (preference.createdBy != userID) {
                throw new NotAuthorized()
            }
            return preference
        } catch (error) {
            throw error
        }
    }

    /**
     * Get all preferences of a proposal
     * @param {number} userID 
     * @returns the list of proposals
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetPhaseError} if the current budget is not in phase 2
     */
    async getProposals(userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 2) {
                throw new BudgetPhaseError()
            }
            return await this.proposalDAO.getNoPreferenceProposal(userID, budget.id);
        } catch (error) {
            throw error
        }
    }

    /**
     * Create a preference
     * @param {number} value 
     * @param {number} proposalID 
     * @param {number} userID 
     * @returns true if the preference was created successfully
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetPhaseError} if the current budget is not in phase 2
     * @throws {ProposalNotFoundError} if the proposal does not exist
     * @throws {PreferenceAlreadyExistsError} if the preference already exists
     */
    async create(value, proposalID, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 2) {
                throw new BudgetPhaseError()
            }

            const proposal = await this.proposalDAO.getByID(proposalID);
            if (!proposal) {
                throw new ProposalNotFoundError()
            }

            const preferences = await this.preferenceDAO.getByUserIDProposalID(userID, proposalID);
            if (preferences.length > 0) {
                throw new PreferenceAlreadyExistsError()
            }
            
            const createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
            return await this.preferenceDAO.create(value, proposalID, userID, createdAt);
        } catch (error) {
            throw error
        }
    }

    /**
     * Update a preference
     * @param {number} id 
     * @param {number} value 
     * @param {number} userID 
     * @returns true if the preference was updated successfully
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetPhaseError} if the current budget is not in phase 2
     * @throws {PreferenceNotFound} if the preference does not exist
     * @throws {NotAuthorized} if the user is not the creator of the preference
     */
    async update(id, value, userID) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 2) {
                throw new BudgetPhaseError()
            }
            const preference = await this.preferenceDAO.getByID(id);
            if (!preference) {
                throw new PreferenceNotFound()
            }
            if (preference.createdBy != userID) {
                throw new NotAuthorized()
            }
            const updatedAt = dayjs().format('YYYY-MM-DD HH:mm:ss');
            return await this.preferenceDAO.update(id, value, updatedAt);
        } catch (error) {
            throw error
        }
    }

    /**
     * Delete a preference
     * @param {number} id 
     * @returns true if the preference was deleted successfully
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetPhaseError} if the current budget is not in phase 2
     * @throws {PreferenceNotFound} if the preference does not exist
     */
    async delete(id) {
        try {
            const budget = await this.budgetDAO.getCurrentBudget();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase != 2) {
                throw new BudgetPhaseError()
            }
            const preference = await this.preferenceDAO.getByID(id);
            if (!preference) {
                throw new PreferenceNotFound()
            }
            return await this.preferenceDAO.delete(id);
        } catch (error) {
            throw error
        }
    }
}

export { PreferenceController }
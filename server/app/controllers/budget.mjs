
import dayjs from 'dayjs';
import BudgetDAO from '../dao/budget.mjs'
import PreferenceDAO from '../dao/preference.mjs'
import ProposalDAO from '../dao/proposal.mjs'
import { BudgetAlreadyExistsError, BudgetInPhase3Error, BudgetNotFoundError, BudgetNotPhase3Error } from '../errors/budgetErrors.mjs'
export default class BudgetController {

    budgetDAO = null;
    preferencesDAO = null;
    proposalDAO = null;

    constructor() {
        this.budgetDAO = new BudgetDAO();
        this.preferencesDAO = new PreferenceDAO();
        this.proposalDAO = new ProposalDAO();

    }

    /**
     * Create a budget
     * @param {int} year 
     * @param {number} budget 
     * @param {int} userID 
     * @returns the created budget
     * @throws {BudgetAlreadyExistsError} if a budget for the current year already exists
     */
    async create(budget, userID) {
        try {
            const currentYear = dayjs().year();
            const check = await this.budgetDAO.getBudgetsByYear(currentYear);
            if (check != null) {
                throw new BudgetAlreadyExistsError()
            }
            return await this.budgetDAO.create(currentYear, budget, userID);
        } catch (error) {
            throw error
        }
    }

    /**
     * Go to the next phase of the budget  
     * @returns true if the budget was updated successfully
     * @throws {BudgetInPhase3Error} if the budget is already in phase 3
     * @throws {BudgetNotFoundError} if there is no current budget
     */
    async nextPhase() {
        try {
            const budget = await this.getCurrent();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            const phase = budget.phase + 1;
            if (phase > 3) {
                throw new BudgetInPhase3Error()
            }
            if (phase == 3) {
                const proposals = await this.proposalDAO.getGroupedProposals(budget.id);

                let budgetRemaining = budget.value
                let stop = false;
                for (let i = 0; i < proposals.length; i++) {
                    if (proposals[i].total_preferences != 0 && proposals[i].total_preferences != null) {
                        if (proposals[i].budget <= budgetRemaining && !stop) {
                            await this.proposalDAO.accept(proposals[i].id, proposals[i].total_preferences);
                            budgetRemaining -= proposals[i].budget;
                        } else {
                            await this.proposalDAO.updateTotalPreferences(proposals[i].id, proposals[i].total_preferences);
                            stop = true; // avoid maximize the budget
                        }
                    }
                }
            }

            return await this.budgetDAO.update(budget.id, budget.year, budget.value, phase, budget.createdBy);
        } catch (error) {
            throw error
        }
    }

    /**
     * Delete the current budget
     * @returns true if the budget was deleted successfully
     * @throws {BudgetNotFoundError} if there is no current budget
     * @throws {BudgetNotPhase3Error} if the budget is not in phase 3
     */
    async deleteCurrent() {
        try {
            const budget = await this.getCurrent();
            if (!budget) {
                throw new BudgetNotFoundError()
            }
            if (budget.phase == 3) {
                await this.preferencesDAO.deleteBudgetPreferences(budget.id);
                await this.proposalDAO.deleteBudgetProposals(budget.id);
                return await this.budgetDAO.delete(budget.id);
            }
            throw new BudgetNotPhase3Error()
        } catch (error) {
            throw error
        }
    }

    /**
     * Get the current budget
     * @returns the current budget
     * @throws {BudgetNotFoundError} if there is no current budget
     */
    async getCurrent() {
        try {
            const current = await this.budgetDAO.getCurrentBudget();
            if (!current) {
                throw new BudgetNotFoundError()
            }
            return current;
        } catch (error) {
            throw error
        }
    }

}

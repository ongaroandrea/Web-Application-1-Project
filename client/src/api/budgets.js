import Budget from "../models/budget";
import { handleInvalidResponse, SERVER_URL } from "./util/apiUtils";


/**
 * Create a budget
 * @param {*} value 
 * @returns 
 */
async function createBudget(value) {
    return await fetch(SERVER_URL + '/budgets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
            ...value,
        })
    }).then(handleInvalidResponse)
}

/**
 * Get the current budget
 * @returns the current budget
 */
async function getCurrentBudget() {
    return await fetch(SERVER_URL + '/budgets/current', { credentials: 'include' })
        .then(handleInvalidResponse)
        .then(response => response.json())
        .then(budget_response => {
            const budget = budget_response["data"];
            if (budget === null) return null;
            return new Budget(budget.id, budget.year, budget.value, budget.phase, budget.createdBy, budget.createdDate);
        })
}

/**
 * Move to the next phase of the current budget
 * @returns the updated budget
 */
async function nextPhaseBudget() {
    return await fetch(SERVER_URL + '/budgets/current/next', {
        method: 'PUT',
        credentials: 'include'
    }).then(handleInvalidResponse)
}

/**
 * Delete the current budget
 * @returns 
 */
async function deleteCurrentBudget() {
    return await fetch(SERVER_URL + '/budgets/current', {
        method: 'DELETE',
        credentials: 'include'
    }).then(handleInvalidResponse)

}

export default { createBudget, getCurrentBudget, nextPhaseBudget, deleteCurrentBudget };
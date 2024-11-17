import { Preference } from "../models/preference.mjs";
import { Proposal } from "../models/proposal.mjs";

import db from "../db/db.mjs";

export default class PreferenceDAO {

    /**
     * Get all preferences from the database
     * @returns A Promise that resolves a list of preferences
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            db.run('SELECT * FROM preferences', (err, rows) => {
                if (err) {
                    reject(err);
                }
                const preferences = rows.map((element) => {
                    return new Preference(element.id, element.value, element.proposalID, element.createdBy)
                })

                resolve(preferences)
            })
        })
    }

    /**
     * Get a preference by its id
     * @param {number} id 
     * @returns A Promise that resolves a preference
     */
    async getByID(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT  prop.id as propID, prop.title, prop.budget, prop.accepted, prop.budgetID, prop.createdBy as propCB, prop.total_preferences, prop.createdAt as propCA, prop.updatedAt as propUA, \
                pref.id, pref.value, pref.proposalID, pref.createdBy, pref.createdAt, pref.updatedAt \ FROM preferences pref, proposals prop WHERE pref.id = ? AND pref.proposalID = prop.id', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve(null)
                } else {
                    const proposal = new Proposal(row.propID, row.title, row.budget, row.accepted, row.total_preferences, row.budgetID, row.propCB, row.propCA, row.propUA)
                    const preference = new Preference(row.id, row.value, row.proposalID, row.createdBy, row.createdAt, row.updatedAt, proposal)
                    resolve(preference)
                }

            })
        })
    }

    /**
     * Get all preferences of a budget
     * @param {number} budgetID 
     * @returns A Promise that resolves a list of preferences
     */
    async getByBudgetID(budgetID) {
        return new Promise((resolve, reject) => {
            db.run('SELECT * FROM preferences WHERE budgetID = ?', [budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const preferences = rows.map((element) => {
                    return new Preference(element.id, element.value, element.proposalID, element.createdBy)
                })
                resolve(preferences)
            })
        })
    }

    /**
     * Get all preferences of a proposal
     * @param {number} proposalID
     * @returns A Promise that resolves a list of preferences
     */
    async getByProposalID(proposalID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM preferences WHERE proposalID = ?', [proposalID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const preferences = rows.map((element) => {
                    let proposal = new Proposal(element.propID, element.title, element.budget, element.accepted, element.propCB, element.propCA, element.propUA)
                    return new Preference(element.id, element.value, element.proposalID, element.createdBy, element.createdAt, element.updatedAt, proposal)
                })
                resolve(preferences)
            })
        })
    }

    /**
     * Get all preferences of a user in a proposal
     * @param {number} userID 
     * @param {number} proposalID 
     * @returns 
     */
    async getByUserIDProposalID(userID, proposalID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM preferences WHERE proposalID = ? AND createdBy = ?', [proposalID, userID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined || rows.length == 0) {
                    resolve([])
                } else {
                    const preferences = rows.map((element) => {
                        return new Preference(element.id, element.value, element.proposalID, element.createdBy)
                    })
                    resolve(preferences)
                }
            })
        })
    }

    /**
     * Get all preferences of a user
     * @param {string} userID 
     * @param {string} budgetID
     * @returns A Promise that resolves a list of preferences of a user
     */
    async getByUserIDBudgetID(userID, budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT prop.id as propID, prop.title, prop.budget, prop.accepted, prop.budgetID, prop.createdBy as propCB, prop.total_preferences, prop.createdAt as propCA, prop.updatedAt as propUA, \
                pref.id, pref.value, pref.proposalID, pref.createdBy, pref.createdAt, pref.updatedAt \ FROM preferences pref, proposals prop, budgets b \
                WHERE b.id = prop.budgetID AND prop.id = pref.proposalID AND pref.createdBy = ? AND b.id = ?', [userID, budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined || rows.length == 0) {
                    resolve([])
                } else {
                    const preferences = rows.map((row) => {
                        let proposal = new Proposal(row.propID, row.title, row.budget, row.accepted, row.total_preferences, row.budgetID, row.propCB, row.propCA, row.propUA)
                        return new Preference(row.id, row.value, row.proposalID, row.createdBy, row.createdAt, row.updatedAt, proposal)
                    })
                    resolve(preferences)
                }

            })
        })
    }

    /**
     * Get all preferences of a user in a budget
     * @param {string} budgetID
     * @param {string} userID
     * @returns A Promise that resolves a list of preferences of a user in a budget
     */
    async update(id, value, updatedAt) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE preferences SET value = ?, updatedAt = ? WHERE id = ? ', [value, updatedAt, id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Delete a preference by its id
     * @param {number} id
     * @returns A Promise that resolves true if the preference was deleted
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM preferences WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Create a preference
     * @param {string} value
     * @param {string} proposalID
     * @param {string} createdBy
     * @returns A Promise that resolves true if the preference was created
     */
    async create(value, proposalID, createdBy, createdAt) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO preferences (value, proposalID, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?,?)', [value, proposalID, createdBy, createdAt, createdAt], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Delete all preferences of a budget
     * @param {number} budgetID 
     * @returns A Promise that resolves true if the preferences were deleted
     */
    async deleteBudgetPreferences(budgetID) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM preferences WHERE proposalID IN (SELECT id FROM proposals WHERE budgetID = ?)', [budgetID], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Delete all preferences of a user in all proposals of a budget
     * @param {number} userID 
     * @param {number} budgetID 
     * @returns A Promise that resolves true if the preferences were deleted
     */
    async deleteAll(userID, budgetID) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM preferences WHERE createdBy = ? AND proposalID IN (SELECT id FROM proposals WHERE budgetID = ?)', [userID, budgetID], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }
}

export { PreferenceDAO }
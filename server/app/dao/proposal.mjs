import { Proposal } from '../models/proposal.mjs'
import { User } from '../models/user.mjs'

import db from "../db/db.mjs";
import dayjs from 'dayjs';

export default class ProposalDAO {

    /**
     * Get all proposals
     * @returns A Promise that resolves a list of proposals
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            db.run('SELECT proposals.*, users.username FROM proposals, users WHERE users.id = proposals.createdBy', (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    return new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })

                resolve(proposals)
            })
        })
    }

    /**
     * Get a proposal by its id
     * @param {number} id
     * @returns A Promise that resolves a proposal
     */
    async getByID(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT proposals.*, users.username FROM proposals, users WHERE proposals.id = ? AND users.id = proposals.createdBy', [id], (err, element) => {
                if (err) {
                    reject(err);
                }
                if (!element) {
                    resolve(null)
                } else {
                    const user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    const proposal = new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                    resolve(proposal)
                }

            })
        })
    }

    /**
     * Get all proposals of a budget
     * @param {number} budgetID
     * @returns A Promise that resolves a list of proposals 
     */
    async getByBudgetID(budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.*, users.username FROM proposals, users WHERE budgetID = ? AND users.id = proposals.createdBy', [budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    return new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })
                resolve(proposals)
            })
        })
    }

    /**
     * Get all proposals of a user
     * @param {number} userID
     * @returns A Promise that resolves a list of proposals
     */
    async getByUserID(userID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.*, users.username FROM proposals, users WHERE createdBy = ? AND users.id = createdBy', [userID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    return new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })
                resolve(proposals)
            })
        })
    }

    /**
     * Get a proposal by its user and budget id
     * @param {number} userID
     * @param {number} budgetID
     * @returns A Promise that resolves a proposal
     */
    async getByUserAndBudgetID(userID, budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.*, users.username FROM proposals, users WHERE createdBy = ? AND budgetID = ? AND users.id = createdBy', [userID, budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    return new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })
                resolve(proposals)
            })
        })
    }

    /**
     * Get all proposals that are not written by the user and the user has not given a preference
     * @param {int} userID 
     * @param {int} budgetID 
     * @returns A Promise that resolves a list of proposals
     */
    async getNoPreferenceProposal(userID, budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM proposals WHERE proposals.budgetID = ? AND \
                proposals.id NOT IN (SELECT proposalID FROM preferences WHERE preferences.createdBy = ? ) AND \
                proposals.id NOT IN (SELECT id FROM proposals WHERE createdBy = ? )',
                [budgetID, userID, userID], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    const proposals = rows.map((element) => {
                        return new Proposal(element.id, element.title, element.budget, element.accepted, undefined, element.budgetID, element.createdBy, undefined, element.createdAt, element.updatedAt)
                    })
                    resolve(proposals)
                })
        })
    }

    /**
     * Create a new proposal
     * @param {string} title
     * @param {string} description
     * @param {number} budget
     * @param {number} createdBy
     * @returns A Promise that resolves true if the proposal was created
     */
    async create(title, amount, budgetID, createdBy) {
        return new Promise((resolve, reject) => {
            let createdAt = dayjs().format('YYYY-MM-DD HH:mm:ss')
            db.run('INSERT INTO proposals (title, budget, accepted, budgetID, total_preferences, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [title, amount, 0, budgetID, 0, createdBy, createdAt, createdAt], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Update a proposal
     * @param {number} id
     * @param {number} budget
     * @param {string} title
     * @param {number} budget
     * @returns A Promise that resolves true if the proposal was updated
     */
    async update(id, budget, title) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE proposals SET budget = ?, title = ? WHERE id = ?', [budget, title, id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Accept a proposal by its id and set the total preferences
     * @param {int} id 
     * @param {int} total_preferences 
     * @returns A Promise that resolves true if the proposal was accepted
     */
    async accept(id, total_preferences) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE proposals SET accepted = 1, total_preferences = ? WHERE id = ?', [total_preferences, id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Update the total preferences of a proposal
     * @param {int} id
     * @param {int} total_preferences
     * @returns A Promise that resolves true if the total preferences were updated
     */
    async updateTotalPreferences(id, total_preferences) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE proposals SET total_preferences = ? WHERE id = ?', [total_preferences, id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Delete a proposal by its id
     * @param {*} id 
     * @returns A Promise that resolves true if the proposal was deleted
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM proposals WHERE id = ?', [id], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Get all proposals that are accepted by a budget
     * @param {int} budgetID 
     * @returns A Promise that resolves a list of proposals
     */
    async getByBudgetIDAccepted(budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.*, users.username FROM proposals, users WHERE budgetID = ? AND accepted = 1 AND users.id = proposals.createdBy ORDER BY total_preferences DESC', [budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    return new Proposal(element.id, element.title, element.budget, element.accepted, element.total_preferences, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })
                resolve(proposals)
            })
        })
    }

    /**
     * Get all proposals that are accepted and not by a budget
     * @param {int} budgetID
     * @returns A Promise that resolves a list of proposals where the user is undefined if the proposal is not accepted
     * */
    async getByBudgetIDAcceptedAndNot(budgetID, userID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.*, users.username FROM proposals, users WHERE budgetID = ? AND users.id = proposals.createdBy ORDER BY accepted DESC, total_preferences DESC', [budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const proposals = rows.map((element) => {
                    let user = undefined
                    if (element.accepted == 1 || element.createdBy == userID) {
                        user = new User(element.createdBy, element.username, undefined, undefined, undefined, undefined)
                    }
                    return new Proposal(element.id, element.title, element.budget, element.accepted, element.total_preferences, element.budgetID, element.createdBy, user, element.createdAt, element.updatedAt)
                })
                resolve(proposals)
            })
        })
    }

    /**
     * Delete all proposals of a budget
     * @param {int} budgetID
     * @returns A Promise that resolves true if the proposals were deleted
     */
    async deleteBudgetProposals(budgetID) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM proposals WHERE budgetID = ?', [budgetID], (err) => {
                if (err) {
                    reject(err);
                }
                resolve(true)
            })
        })
    }

    /**
     * Get each proposal with the total preferences
     * @param {int} budgetID 
     * @returns  A Promise that resolves a list of proposal with the total preferences
     */
    async getGroupedProposals(budgetID) {
        return new Promise((resolve, reject) => {
            db.all('SELECT proposals.id, proposals.title, proposals.budget, SUM(preferences.value) as total_preferences FROM proposals LEFT JOIN preferences ON proposals.id = preferences.proposalID WHERE proposals.budgetID = ? GROUP BY proposals.id ORDER BY total_preferences DESC', [budgetID], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(rows)
            })
        })
    }

}

export { ProposalDAO }
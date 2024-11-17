import { Budget } from "../models/budget.mjs";
import db from "../db/db.mjs";
import dayjs from 'dayjs'

// The DAO class is responsible for handling all database operations.
export default class BudgetDAO {


    /**
     * Get all the budgets in the database
     * @returns A promise that resolves with all the budgets in the database
     */
    async getAll() {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM budgets', (err, rows) => {
                if (err) {
                    reject(err);
                }
                const budgets = rows.map(row => {
                    new Budget(row.id, row.year, row.budget, row.userID, row.createdAt, row.updatedAt);
                });
                resolve(budgets);
            });
        });
    }

    /**
     * Get all the budgets in the database by year
     * @param {int} year 
     * @returns A promise that resolves with all the budgets in the database
     */
    async getBudgetsByYear(year) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM budgets WHERE year = ?', [year], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row || row == undefined) {
                    resolve(null);
                } else {
                    const budget = new Budget(row.id, row.year, row.value, row.phase, row.createdBy, row.createdAt, row.updatedAt);
                    resolve(budget);
                }
            });
        });
    }
    
    /**
     * Get a budget by its id
     * @param {number} id The id of the budget
     * @returns A promise that resolves with the budget with the given id
     */
    async get(id) {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM budgets WHERE id = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                const budgets = rows.map(row => {
                    new Budget(row.id, row.year, row.budget, row.userID, row.createdAt, row.updatedAt);
                });
                resolve(budgets);
            });
        });
    }

    /**
     * Create a new budget
     * @param {number} year The year of the budget
     * @param {number} budget The budget amount
     * @param {number} userID The user id of the user who created the budget
     * @returns A promise that resolves with the id of the newly created budget
     */
    async create(year, budget, userID) {
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO budgets (year, phase, value, createdBy, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ? )', [year, 1, budget, userID, dayjs().format("YYYY-MM-DD HH:mm:ss"), dayjs().format("YYYY-MM-DD HH:mm:ss")], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }

    /**
     * Update a budget
     * @param {number} id The id of the budget
     * @param {number} year The year of the budget
     * @param {number} budget The budget amount
     * @param {number} userID The user id of the user who updated the budget
     * @returns A promise that resolves with true if the budget was updated
     */
    async update(id, year, budget, phase, userID) {
        return new Promise((resolve, reject) => {
            db.run('UPDATE budgets SET year = ?, value = ?, createdBy = ?, phase = ? WHERE id = ?', [year, budget, userID, phase, id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }


    /**
     * Get the current budget
     * @returns A promise that resolves with the current year budget
     */
    async getCurrentBudget() {
        const year = dayjs().format("YYYY");
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM budgets WHERE year = ?', [year],  (err, row) => {
                if (err) {
                    reject(err);
                }
                if (!row || row == undefined) {
                    resolve(null);
                } else {
                    const budget = new Budget(row.id, row.year, row.value, row.phase, row.createdBy, row.createdAt, row.updatedAt);
                    resolve(budget);
                }
            });
        });
    }

    /**
     * Update the phase of the current budget
     * @param {number} id The id of the budget
     * @returns A promise that resolves with the updated budget
     */
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM budgets WHERE id = ?', [id], (err, rows) => {
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        });
    }
}
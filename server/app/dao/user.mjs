
import { User } from "../models/user.mjs";
import db from "../db/db.mjs";
import crypto from 'crypto';
import dayjs from "dayjs";

export default class UserDAO {

    /**
     * Get User by id
     * @param {number} id 
     * @returns A Promise that resolves a user
     */
    async getUserByID(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                const user = new User(row.id, row.username, undefined, row.role, row.createdAt, row.updatedAt);
                resolve(user);
            });
        })
    }

    /**
     * Get User by username and password
     * @param {string} username 
     * @param {string} password
     * @returns A Promise that resolves a user
     */
    async getUserByCredentials(username, password) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row === undefined) {
                    resolve(false);
                }
                else {

                    const storedSalt = Buffer.from(row.salt, 'hex');
                    const storedHashedPassword = Buffer.from(row.password, 'hex');

                    // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                    crypto.scrypt(password, storedSalt, 64, (err, hashedPassword) => { // WARN: it is 64 and not 32 (as in the week example) in the DB
                        if (err) reject(err);
                        if (!crypto.timingSafeEqual(storedHashedPassword, hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
                            resolve(false);
                        else
                            resolve(new User(row.id, row.username, row.email, row.role, row.createdAt));
                    });
                }
            });
        })
    }

    /**
     * Create a new user in the database
     * @param {string} username
     * @param {string} password
     * @returns A Promise that resolves a user
     */
    async createUser(username, password) {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, salt) => {
                if (err) reject(err);
                crypto.scrypt(password, salt, 64, (err, hash) => {
                    if (err) reject(err);
                    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
                    const sql = 'INSERT INTO users (username, password, salt, createdAt, role) VALUES (?, ?, ?, ?, ?)';
                    db.run(sql, [username,  hash.toString('hex'), salt.toString('hex'), now, "user" ], function (err) {
                        if (err) reject(err);
                        resolve();
                    });
                });
            });
        });
    }

    /**
     * Get user by username
     * @param {string} username
     * @returns A Promise that resolves a user
     */
    async getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username=?';
            db.get(sql, [username], (err, row) => {
                if (err) reject(err);
                if (row === undefined) resolve(false);
                else {
                    resolve(new User(row.id, row.username, "", row.role, row.createdAt, row.updatedAt));
                }
            });
        });
    }
}
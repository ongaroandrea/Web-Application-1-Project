/** DB access module **/

import sqlite3 from "sqlite3";

// Opening the database
const database_path = './app/db/' 
const db_path = database_path + 'exam.sqlite';
const db = new sqlite3.Database(db_path, (err) => {
    if (err) throw err;
    console.log('Connected to the database.');
});

export default db;
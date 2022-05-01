// This ensures that things do not fail silently but will throw errors instead.
"use strict";
// Require better-sqlite.
const Database = require('better-sqlite3');
const db = new Database('log.db');

const stmt = logdb.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

let row = stmt.get()

if (row === undefined) {
    console.log('Log db currently empty. Creating log db...')

    const sqlInit = `
        CREATE TABLE IF NOT EXISTS accesslog ( id INTEGER NOT NULL PRIMARY KEY, 
            remoteaddr TEXT, remoteuser TEXT, time INTEGER, 
            method TEXT, url TEXT, protocol TEXT, 
            httpversion TEXT, status INTEGER, 
            referer TEXT, useragent TEXT);
    `;

    db.exec(sqlInit)
    console.log('Your database has been initialized.');
} else {
    console.log("Log db exists");
}


/*
const fs = require('fs');
const datadir = './data';

if (!fs.existsSync(datadir)) {
    fs.mkdirSync(datadir);
}

const logdb = new Database(datadir+'log.db');

if (row === undefined) {
    console.log('Log database appears to be empty. Creating log database...')

    const sqlInit = `
        CREATE TABLE accesslog ( 
            id INTEGER PRIMARY KEY, 
            remoteaddr TEXT,
            remoteuser TEXT,
            time TEXT,
            method TEXT,
            url TEXT,
            protocol TEXT,
            httpversion TEXT,
            status TEXT, 
            referrer TEXT,
            useragent TEXT
        );
    `

    logdb.exec(sqlInit)
} else {
    console.log('Log database exists.')
}

*/

module.exports = db
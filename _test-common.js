/** code common to tests */

const db = require("./db")

async function createData() {
    await db.query("DELETE FROM invoices");
    await db.query("DELETE FROM companies");
    await db.query("SELECT setval('invoices_id_seq', 1, false)");

    await db.query(`INSERT INTO companies (code, name, description)
    VALUES ('apple', 'Apple', 'Maker of OSX'),
           ('microsoft', 'Microsoft', 'Maker of Windows')`);
}
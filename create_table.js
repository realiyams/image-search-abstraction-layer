const db = require('./db');

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS searches (
        id INTEGER PRIMARY KEY,
        searchQuery TEXT,
        timeSearched DATETIME
    )
`;

db.serialize(() => {
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table created successfully');
        }
    });
});

// db.close();

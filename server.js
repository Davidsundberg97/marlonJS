const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database setup
const db = new sqlite3.Database('./notes.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        db.run(`
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                link TEXT NOT NULL,
                description TEXT NOT NULL,
                topics TEXT NOT NULL,
                levels TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                selection INTEGER DEFAULT 0
            )
        `, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Database and table created successfully.');
            }
        });
    }
});

// API routes
app.get('/notes', (req, res) => {
    console.log('GET /notes endpoint accessed');
    db.all('SELECT * FROM notes', [], (err, rows) => {
        if (err) {
            console.error('Error fetching notes:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            console.log('Fetched Notes from Database:', rows);
            res.json(rows);
        }
    });
});

app.post('/notes', (req, res) => {
    const { title, link, description, topics, levels, content } = req.body;

    console.log('Received Note:', { title, link, description, topics, levels, content });

    if (!title || !link || !description || !topics || !levels || !content) {
        console.error('Validation Error: All fields are required.');
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const now = new Date().toISOString();
    db.run(
        `INSERT INTO notes (title, link, description, topics, levels, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, link, description, topics.join(','), levels.join(','), content, now, now],
        function (err) {
            if (err) {
                console.error('Error inserting note:', err.message);
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID });
            }
        }
    );
});

// Get a single note by ID
app.get('/notes/:id', (req, res) => {
    const { id } = req.params;

    db.get(`SELECT * FROM notes WHERE id = ?`, [id], (err, row) => {
        if (err) {
            console.error('Error fetching note:', err.message);
            res.status(500).json({ error: err.message });
        } else if (!row) {
            res.status(404).json({ error: 'Note not found.' });
        } else {
            res.json(row);
        }
    });
});

// Update a note by ID
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, topics, levels } = req.body;

    db.run(
        `UPDATE notes SET title = ?, description = ?, topics = ?, levels = ?, updated_at = ? WHERE id = ?`,
        [title, description, topics.join(','), levels.join(','), new Date().toISOString(), id],
        function (err) {
            if (err) {
                console.error('Error updating note:', err.message);
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Note not found.' });
            } else {
                res.json({ message: 'Note updated successfully.' });
            }
        }
    );
});

// Update selection of a note by ID
app.put('/notes/:id/selection', (req, res) => {
    const { id } = req.params;
    const { selection } = req.body;

    db.run(
        `UPDATE notes SET selection = ? WHERE id = ?`,
        [selection ? 1 : 0, id],
        function (err) {
            if (err) {
                console.error('Error updating selection:', err.message);
                res.status(500).json({ error: err.message });
            } else if (this.changes === 0) {
                res.status(404).json({ error: 'Note not found.' });
            } else {
                res.json({ message: 'Selection updated successfully.' });
            }
        }
    );
});

// Delete a note by ID
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM notes WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error('Error deleting note:', err.message);
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Note not found.' });
        } else {
            res.json({ message: 'Note deleted successfully.' });
        }
    });
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

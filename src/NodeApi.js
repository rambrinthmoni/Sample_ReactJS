const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let items = [];
let idCounter = 1;

// CREATE
app.post('/api/items', (req, res) => {
    const item = { id: idCounter++, ...req.body };
    items.push(item);
    res.status(201).json(item);
});

// READ ALL
app.get('/api/items', (req, res) => {
    res.json(items);
});

// READ ONE
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});

// UPDATE
app.put('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    items[index] = { ...items[index], ...req.body };
    res.json(items[index]);
});

// DELETE
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    const deleted = items.splice(index, 1);
    res.json(deleted[0]);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
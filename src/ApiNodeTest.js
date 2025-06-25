const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the app logic from NodeApi.js, or redefine it here for testing
const app = express();
app.use(cors());
app.use(bodyParser.json());

let items = [];
let idCounter = 1;

app.post('/api/items', (req, res) => {
    const item = { id: idCounter++, ...req.body };
    items.push(item);
    res.status(201).json(item);
});
app.get('/api/items', (req, res) => {
    res.json(items);
});
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
});
app.put('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    items[index] = { ...items[index], ...req.body };
    res.json(items[index]);
});
app.delete('/api/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ message: 'Item not found' });
    const deleted = items.splice(index, 1);
    res.json(deleted[0]);
});

describe('Item API', () => {
    beforeEach(() => {
        // Reset in-memory data before each test
        items = [];
        idCounter = 1;
    });

    it('should create a new item', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({ name: 'Test Item' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Test Item');
    });

    it('should get all items', async () => {
        await request(app).post('/api/items').send({ name: 'Item 1' });
        await request(app).post('/api/items').send({ name: 'Item 2' });
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('should get a single item by id', async () => {
        await request(app).post('/api/items').send({ name: 'Single Item' });
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Single Item');
    });

    it('should return 404 for non-existent item', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should update an item', async () => {
        await request(app).post('/api/items').send({ name: 'Old Name' });
        const res = await request(app)
            .put('/api/items/1')
            .send({ name: 'New Name' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'New Name');
    });

    it('should return 404 when updating non-existent item', async () => {
        const res = await request(app)
            .put('/api/items/999')
            .send({ name: 'Does Not Exist' });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should delete an item', async () => {
        await request(app).post('/api/items').send({ name: 'To Delete' });
        const res = await request(app).delete('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'To Delete');
        // Confirm item is deleted
        const getRes = await request(app).get('/api/items/1');
        expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent item', async () => {
        const res = await request(app).delete('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });
});
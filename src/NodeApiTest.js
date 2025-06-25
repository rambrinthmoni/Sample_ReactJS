const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the NodeApi.js code as a function for testing
function createApp() {
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

    // For testing: reset items and idCounter
    app.resetData = () => {
        items = [];
        idCounter = 1;
    };

    return app;
}

describe('NodeApi.js CRUD endpoints', () => {
    let app;

    beforeEach(() => {
        app = createApp();
        app.resetData();
    });

    test('POST /api/items creates a new item', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({ name: 'Test Item' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Test Item');
    });

    test('GET /api/items returns all items', async () => {
        await request(app).post('/api/items').send({ name: 'Item1' });
        await request(app).post('/api/items').send({ name: 'Item2' });
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name', 'Item1');
        expect(res.body[1]).toHaveProperty('name', 'Item2');
    });

    test('GET /api/items/:id returns the correct item', async () => {
        await request(app).post('/api/items').send({ name: 'Item1' });
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Item1');
    });

    test('GET /api/items/:id returns 404 for non-existent item', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    test('PUT /api/items/:id updates an item', async () => {
        await request(app).post('/api/items').send({ name: 'Old Name' });
        const res = await request(app)
            .put('/api/items/1')
            .send({ name: 'New Name' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'New Name');
    });

    test('PUT /api/items/:id returns 404 for non-existent item', async () => {
        const res = await request(app)
            .put('/api/items/999')
            .send({ name: 'Does not exist' });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    test('DELETE /api/items/:id deletes an item', async () => {
        await request(app).post('/api/items').send({ name: 'To Delete' });
        const res = await request(app).delete('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'To Delete');
        // Confirm item is deleted
        const res2 = await request(app).get('/api/items/1');
        expect(res2.statusCode).toBe(404);
    });

    test('DELETE /api/items/:id returns 404 for non-existent item', async () => {
        const res = await request(app).delete('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });
});const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import the app code (refactored for testability)
function createApp() {
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

    // For testing: reset items
    app.resetItems = () => {
        items = [];
        idCounter = 1;
    };

    return app;
}

describe('NodeApi items endpoints', () => {
    let app;

    beforeEach(() => {
        app = createApp();
        app.resetItems();
    });

    it('should create an item', async () => {
        const res = await request(app)
            .post('/api/items')
            .send({ name: 'Test Item' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'Test Item');
    });

    it('should get all items', async () => {
        await request(app).post('/api/items').send({ name: 'Item1' });
        await request(app).post('/api/items').send({ name: 'Item2' });
        const res = await request(app).get('/api/items');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        expect(res.body[0]).toHaveProperty('name', 'Item1');
        expect(res.body[1]).toHaveProperty('name', 'Item2');
    });

    it('should get one item by id', async () => {
        await request(app).post('/api/items').send({ name: 'SingleItem' });
        const res = await request(app).get('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', 1);
        expect(res.body).toHaveProperty('name', 'SingleItem');
    });

    it('should return 404 for non-existent item', async () => {
        const res = await request(app).get('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should update an item', async () => {
        await request(app).post('/api/items').send({ name: 'OldName' });
        const res = await request(app)
            .put('/api/items/1')
            .send({ name: 'NewName' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'NewName');
    });

    it('should return 404 when updating non-existent item', async () => {
        const res = await request(app)
            .put('/api/items/123')
            .send({ name: 'DoesNotExist' });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });

    it('should delete an item', async () => {
        await request(app).post('/api/items').send({ name: 'ToDelete' });
        const res = await request(app).delete('/api/items/1');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('name', 'ToDelete');
        // Confirm deletion
        const getRes = await request(app).get('/api/items/1');
        expect(getRes.statusCode).toBe(404);
    });

    it('should return 404 when deleting non-existent item', async () => {
        const res = await request(app).delete('/api/items/999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Item not found');
    });
});
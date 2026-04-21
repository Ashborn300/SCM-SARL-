import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');

// Helper to read/write DB
async function getDB() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If doesn't exist, create with initial data
    const initialData = {
      employees: [],
      managers: [],
      sites: [],
      attendance: [],
      documents: []
    };
    await saveDB(initialData);
    return initialData;
  }
}

async function saveDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  
  // Generic GET all for a collection
  app.get('/api/:collection', async (req, res) => {
    const db = await getDB();
    const collection = req.params.collection;
    if (db[collection]) {
      res.json(db[collection]);
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  });

  // POST create item
  app.post('/api/:collection', async (req, res) => {
    const db = await getDB();
    const collection = req.params.collection;
    if (db[collection]) {
      const newItem = { ...req.body, id: req.body.id || `${collection.charAt(0).toUpperCase()}-${Date.now()}` };
      db[collection].push(newItem);
      await saveDB(db);
      res.status(201).json(newItem);
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  });

  // PUT update item
  app.put('/api/:collection/:id', async (req, res) => {
    const db = await getDB();
    const { collection, id } = req.params;
    if (db[collection]) {
      const index = db[collection].findIndex((item: any) => item.id === id);
      if (index !== -1) {
        db[collection][index] = { ...db[collection][index], ...req.body };
        await saveDB(db);
        res.json(db[collection][index]);
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  });

  // DELETE item
  app.delete('/api/:collection/:id', async (req, res) => {
    const db = await getDB();
    const { collection, id } = req.params;
    if (db[collection]) {
      const initialLength = db[collection].length;
      db[collection] = db[collection].filter((item: any) => item.id !== id);
      if (db[collection].length < initialLength) {
        await saveDB(db);
        res.status(204).send();
      } else {
        res.status(404).json({ error: 'Item not found' });
      }
    } else {
      res.status(404).json({ error: 'Collection not found' });
    }
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

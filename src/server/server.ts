import express from 'express';
import { searchRouter } from './routes/search.route.js';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(cors());
app.use('/api', searchRouter);

app.get('/status', (req, res) => {
    res.status(200).send('OK!');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './pages/index.html'));
});



const server = {
    app,
    port,
} as const;

export default server;

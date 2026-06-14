import express, { type Request, type Response } from 'express';
import { search } from 'src/services/search.js';
import logger from 'src/utils/logger.js';

export const searchRouter = express.Router();

searchRouter.get('/search', async (req: Request, res: Response) => {
    try {
        const query = req.query.q as string;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter "q" is required.' });
        }

        logger.info(`Search request for: "${query}"`);

        const results = await search(query);
        if (!results) {
            return res.status(404).json({ error: 'No results found for query: ' + query });
        }
        logger.info(`Found ${results.length} results for: "${query}"`);
        return res.json(results);
    } catch (error) {
        logger.error('Search error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

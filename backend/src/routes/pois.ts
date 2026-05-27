import { Router, Request, Response } from 'express';
import { pgPool } from '../db/connection';

const router = Router();

// Get all POIs
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, country, city, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM pois WHERE 1=1';
    const params: any[] = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (country) {
      params.push(country);
      query += ` AND country = $${params.length}`;
    }

    if (city) {
      params.push(city);
      query += ` AND city = $${params.length}`;
    }

    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pgPool.query(query, params);
    res.json({
      data: result.rows,
      total: result.rows.length,
      limit,
      offset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch POIs' });
  }
});

// Get POI by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pgPool.query('SELECT * FROM pois WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'POI not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch POI' });
  }
});

// Get nearby POIs
router.get('/nearby/:latitude/:longitude', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 10 } = req.query; // radius in km

    const result = await pgPool.query(
      `SELECT * FROM pois 
       WHERE earth_distance(
         ll_to_earth($1, $2),
         ll_to_earth(latitude, longitude)
       ) < $3 * 1000
       ORDER BY earth_distance(
         ll_to_earth($1, $2),
         ll_to_earth(latitude, longitude)
       )`,
      [latitude, longitude, radius]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby POIs' });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { pgPool } from '../db/connection';

const router = Router();

// Get all hotels with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, country, minPrice, maxPrice, starRating, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM hotels WHERE 1=1';
    const params: any[] = [];

    if (city) {
      params.push(city);
      query += ` AND city = $${params.length}`;
    }

    if (country) {
      params.push(country);
      query += ` AND country = $${params.length}`;
    }

    if (minPrice) {
      params.push(parseFloat(minPrice as string));
      query += ` AND price_per_night >= $${params.length}`;
    }

    if (maxPrice) {
      params.push(parseFloat(maxPrice as string));
      query += ` AND price_per_night <= $${params.length}`;
    }

    if (starRating) {
      params.push(parseInt(starRating as string));
      query += ` AND star_rating >= $${params.length}`;
    }

    query += ` ORDER BY rating DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await pgPool.query(query, params);
    res.json({
      data: result.rows,
      total: result.rows.length,
      limit,
      offset,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// Get nearby hotels
router.get('/nearby/:latitude/:longitude', async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.params;
    const { radius = 5 } = req.query;

    const result = await pgPool.query(
      `SELECT * FROM hotels 
       WHERE earth_distance(
         ll_to_earth($1, $2),
         ll_to_earth(latitude, longitude)
       ) < $3 * 1000
       ORDER BY rating DESC, price_per_night ASC, earth_distance(
         ll_to_earth($1, $2),
         ll_to_earth(latitude, longitude)
       )
       LIMIT 20`,
      [latitude, longitude, radius]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nearby hotels' });
  }
});

export default router;

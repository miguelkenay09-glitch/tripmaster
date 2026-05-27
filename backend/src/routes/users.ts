import { Router, Request, Response } from 'express';
import { pgPool } from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Get user profile
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pgPool.query(
      `SELECT id, email, first_name, last_name, avatar_url, preferences, created_at
       FROM users WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, avatar_url, preferences } = req.body;

    const result = await pgPool.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           avatar_url = COALESCE($3, avatar_url),
           preferences = COALESCE($4, preferences),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, email, first_name, last_name, avatar_url, preferences`,
      [first_name, last_name, avatar_url, preferences, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// Get user favorites
router.get('/:id/favorites', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Implement favorites table
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

export default router;

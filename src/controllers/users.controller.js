const db = require('../config/database');

// GET /users
const getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, name, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    res.json({ data: rows, total: rows.length });
  } catch (err) { next(err); }
};

// GET /users/:id
const getById = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
};

// POST /users
const create = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    const { rows } = await db.query(
      `INSERT INTO users (email, name, password)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, created_at`,
      [email, name, password]
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
};

// PUT /users/:id
const update = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET email = COALESCE($1, email), name = COALESCE($2, name)
       WHERE id = $3
       RETURNING id, email, name, created_at, updated_at`,
      [email, name, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
};

// DELETE /users/:id
const remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};

// GET /users/:id/resumes
const getUserResumes = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, pi.full_name, pi.job_title, pi.avatar_url
       FROM resumes r
       LEFT JOIN personal_info pi ON pi.resume_id = r.id
       WHERE r.user_id = $1
       ORDER BY r.updated_at DESC`,
      [req.params.id]
    );
    res.json({ data: rows, total: rows.length });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, getUserResumes };

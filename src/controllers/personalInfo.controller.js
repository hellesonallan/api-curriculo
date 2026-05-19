const db = require('../config/database');

const fields = [
  'full_name','job_title','email','phone','location',
  'linkedin_url','github_url','portfolio_url','avatar_url',
  'birth_date','nationality'
];

// GET /resumes/:resumeId/personal-info
const get = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM personal_info WHERE resume_id = $1',
      [req.params.resumeId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Personal info not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
};

// POST /resumes/:resumeId/personal-info
const create = async (req, res, next) => {
  try {
    const cols = fields.filter((f) => req.body[f] !== undefined);
    const vals = cols.map((f) => req.body[f]);
    const ph = cols.map((_, i) => `$${i + 1}`).join(', ');
    const sql = `
      INSERT INTO personal_info (${[...cols, 'resume_id'].join(', ')})
      VALUES (${ph}, $${cols.length + 1})
      RETURNING *`;
    const { rows } = await db.query(sql, [...vals, req.params.resumeId]);
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
};

// PUT /resumes/:resumeId/personal-info
const update = async (req, res, next) => {
  try {
    const cols = fields.filter((f) => req.body[f] !== undefined);
    if (!cols.length) return res.status(400).json({ error: 'No valid fields to update' });
    const set = cols.map((f, i) => `${f} = $${i + 1}`).join(', ');
    const vals = cols.map((f) => req.body[f]);
    const sql = `
      UPDATE personal_info SET ${set}
      WHERE resume_id = $${cols.length + 1}
      RETURNING *`;
    const { rows } = await db.query(sql, [...vals, req.params.resumeId]);
    if (!rows[0]) return res.status(404).json({ error: 'Personal info not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
};

// DELETE /resumes/:resumeId/personal-info
const remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query(
      'DELETE FROM personal_info WHERE resume_id = $1',
      [req.params.resumeId]
    );
    if (!rowCount) return res.status(404).json({ error: 'Personal info not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { get, create, update, remove };

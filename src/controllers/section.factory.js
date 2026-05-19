/**
 * Factory that returns a full CRUD controller for any resume sub-entity.
 * @param {string} table     - DB table name
 * @param {string[]} fields  - Allowed writable fields (used for INSERT/UPDATE)
 */
const db = require('../config/database');

const makeController = (table, fields) => {
  // Build parameterised INSERT
  const buildInsert = (body) => {
    const cols = fields.filter((f) => body[f] !== undefined);
    const vals = cols.map((f) => body[f]);
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
    const resumePlaceholder = `$${cols.length + 1}`;
    return {
      sql: `INSERT INTO ${table} (${cols.join(', ')}, resume_id)
            VALUES (${placeholders}, ${resumePlaceholder})
            RETURNING *`,
      values: [...vals, null], // resume_id injected separately
      colCount: cols.length,
    };
  };

  // GET /resumes/:resumeId/<section>
  const getAll = async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `SELECT * FROM ${table} WHERE resume_id = $1 ORDER BY order_index ASC, created_at ASC`,
        [req.params.resumeId]
      );
      res.json({ data: rows, total: rows.length });
    } catch (err) { next(err); }
  };

  // GET /resumes/:resumeId/<section>/:id
  const getById = async (req, res, next) => {
    try {
      const { rows } = await db.query(
        `SELECT * FROM ${table} WHERE id = $1 AND resume_id = $2`,
        [req.params.id, req.params.resumeId]
      );
      if (!rows[0]) return res.status(404).json({ error: 'Record not found' });
      res.json({ data: rows[0] });
    } catch (err) { next(err); }
  };

  // POST /resumes/:resumeId/<section>
  const create = async (req, res, next) => {
    try {
      const cols = fields.filter((f) => req.body[f] !== undefined);
      const vals = cols.map((f) => req.body[f]);
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
      const sql = `
        INSERT INTO ${table} (${[...cols, 'resume_id'].join(', ')})
        VALUES (${placeholders}, $${cols.length + 1})
        RETURNING *`;
      const { rows } = await db.query(sql, [...vals, req.params.resumeId]);
      res.status(201).json({ data: rows[0] });
    } catch (err) { next(err); }
  };

  // PUT /resumes/:resumeId/<section>/:id
  const update = async (req, res, next) => {
    try {
      const cols = fields.filter((f) => req.body[f] !== undefined);
      if (!cols.length) return res.status(400).json({ error: 'No valid fields to update' });
      const setClauses = cols.map((f, i) => `${f} = $${i + 1}`).join(', ');
      const vals = cols.map((f) => req.body[f]);
      const sql = `
        UPDATE ${table}
        SET ${setClauses}
        WHERE id = $${cols.length + 1} AND resume_id = $${cols.length + 2}
        RETURNING *`;
      const { rows } = await db.query(sql, [...vals, req.params.id, req.params.resumeId]);
      if (!rows[0]) return res.status(404).json({ error: 'Record not found' });
      res.json({ data: rows[0] });
    } catch (err) { next(err); }
  };

  // DELETE /resumes/:resumeId/<section>/:id
  const remove = async (req, res, next) => {
    try {
      const { rowCount } = await db.query(
        `DELETE FROM ${table} WHERE id = $1 AND resume_id = $2`,
        [req.params.id, req.params.resumeId]
      );
      if (!rowCount) return res.status(404).json({ error: 'Record not found' });
      res.status(204).send();
    } catch (err) { next(err); }
  };

  // PATCH /resumes/:resumeId/<section>/reorder  — bulk update order_index
  const reorder = async (req, res, next) => {
    try {
      const { order } = req.body; // [{ id, order_index }]
      if (!Array.isArray(order)) return res.status(400).json({ error: 'order must be an array' });
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        for (const item of order) {
          await client.query(
            `UPDATE ${table} SET order_index = $1 WHERE id = $2 AND resume_id = $3`,
            [item.order_index, item.id, req.params.resumeId]
          );
        }
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
      res.json({ message: 'Order updated successfully' });
    } catch (err) { next(err); }
  };

  return { getAll, getById, create, update, remove, reorder };
};

module.exports = makeController;

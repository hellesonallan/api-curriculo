const db = require('../config/database');

// GET /resumes  (publico)
const getAll = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, pi.full_name, pi.job_title, pi.avatar_url, pi.location
       FROM resumes r
       LEFT JOIN personal_info pi ON pi.resume_id = r.id
       WHERE r.is_public = true
       ORDER BY r.updated_at DESC`
    );
    res.json({ data: rows, total: rows.length });
  } catch (err) { next(err); }
};

// GET /resumes/:id
const getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const resumeResult = await db.query('SELECT * FROM resumes WHERE id = $1', [id]);
    if (!resumeResult.rows[0]) return res.status(404).json({ error: 'Resume not found' });

    const [
      personal, experiences, edu, skills, languages,
      projects, certs, awards, volunteer, publications, refs
    ] = await Promise.all([
      db.query('SELECT * FROM personal_info WHERE resume_id = $1', [id]),
      db.query('SELECT * FROM work_experiences WHERE resume_id = $1 ORDER BY order_index, start_date DESC', [id]),
      db.query('SELECT * FROM education WHERE resume_id = $1 ORDER BY order_index, start_date DESC', [id]),
      db.query('SELECT * FROM skills WHERE resume_id = $1 ORDER BY order_index, name', [id]),
      db.query('SELECT * FROM languages WHERE resume_id = $1 ORDER BY order_index', [id]),
      db.query('SELECT * FROM projects WHERE resume_id = $1 ORDER BY order_index', [id]),
      db.query('SELECT * FROM certifications WHERE resume_id = $1 ORDER BY order_index, issue_date DESC', [id]),
      db.query('SELECT * FROM awards WHERE resume_id = $1 ORDER BY order_index, date DESC', [id]),
      db.query('SELECT * FROM volunteer_experiences WHERE resume_id = $1 ORDER BY order_index', [id]),
      db.query('SELECT * FROM publications WHERE resume_id = $1 ORDER BY order_index, publish_date DESC', [id]),
      db.query('SELECT * FROM references_list WHERE resume_id = $1 ORDER BY order_index', [id]),
    ]);

    res.json({
      data: {
        ...resumeResult.rows[0],
        personal_info: personal.rows[0] || null,
        work_experiences: experiences.rows,
        education: edu.rows,
        skills: skills.rows,
        languages: languages.rows,
        projects: projects.rows,
        certifications: certs.rows,
        awards: awards.rows,
        volunteer_experiences: volunteer.rows,
        publications: publications.rows,
        references: refs.rows,
      },
    });
  } catch (err) { next(err); }
};

// POST /resumes
const create = async (req, res, next) => {
  try {
    const { user_id, title, summary, is_public, slug, template } = req.body;
    const { rows } = await db.query(
      `INSERT INTO resumes (user_id, title, summary, is_public, slug, template)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, title, summary, is_public ?? false, slug, template ?? 'default']
    );
    res.status(201).json({ data: rows[0] });
  } catch (err) { next(err); }
};

// PUT /resumes/:id
const update = async (req, res, next) => {
  try {
    const { title, summary, is_public, slug, template } = req.body;
    const { rows } = await db.query(
      `UPDATE resumes
       SET title    = COALESCE($1, title),
           summary  = COALESCE($2, summary),
           is_public = COALESCE($3, is_public),
           slug     = COALESCE($4, slug),
           template = COALESCE($5, template)
       WHERE id = $6
       RETURNING *`,
      [title, summary, is_public, slug, template, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Resume not found' });
    res.json({ data: rows[0] });
  } catch (err) { next(err); }
};

// DELETE /resumes/:id
const remove = async (req, res, next) => {
  try {
    const { rowCount } = await db.query('DELETE FROM resumes WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Resume not found' });
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };

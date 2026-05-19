const { Router } = require('express');
const { body, param } = require('express-validator');
const { validate } = require('../middlewares/errorHandler');

const usersCtrl       = require('../controllers/users.controller');
const resumesCtrl     = require('../controllers/resumes.controller');
const personalCtrl    = require('../controllers/personalInfo.controller');
const makeController  = require('../controllers/section.factory');

const router = Router();

// ── Section controllers (via factory) ────────────────────────────────────────
const workCtrl    = makeController('work_experiences', [
  'company','job_title','location','start_date','end_date','is_current','description','order_index'
]);
const eduCtrl     = makeController('education', [
  'institution','degree','field_of_study','location','start_date','end_date','is_current','grade','description','order_index'
]);
const skillsCtrl  = makeController('skills',   ['name','level','category','order_index']);
const langsCtrl   = makeController('languages',['name','proficiency','order_index']);
const projCtrl    = makeController('projects', ['name','description','url','repo_url','start_date','end_date','order_index']);
const certCtrl    = makeController('certifications',['name','issuing_org','issue_date','expiry_date','credential_id','credential_url','order_index']);
const awardsCtrl  = makeController('awards',   ['title','issuer','date','description','order_index']);
const volCtrl     = makeController('volunteer_experiences',['organization','role','start_date','end_date','is_current','description','order_index']);
const pubCtrl     = makeController('publications',['title','publisher','publish_date','url','description','order_index']);
const refsCtrl    = makeController('references_list',['name','job_title','company','email','phone','relationship','order_index']);

// ── Validators ────────────────────────────────────────────────────────────────
const uuidParam = (name) => param(name).isUUID().withMessage(`${name} must be a valid UUID`);

// ── USERS ─────────────────────────────────────────────────────────────────────
router.get   ('/users',             usersCtrl.getAll);
router.get   ('/users/:id',         uuidParam('id'), validate, usersCtrl.getById);
router.get   ('/users/:id/resumes', uuidParam('id'), validate, usersCtrl.getUserResumes);
router.post  ('/users',
  body('email').isEmail(),
  body('name').notEmpty(),
  body('password').isLength({ min: 6 }),
  validate, usersCtrl.create
);
router.put   ('/users/:id', uuidParam('id'), validate, usersCtrl.update);
router.delete('/users/:id', uuidParam('id'), validate, usersCtrl.remove);

// ── RESUMES ───────────────────────────────────────────────────────────────────
router.get   ('/resumes',           resumesCtrl.getAll);
router.get   ('/resumes/:id',       uuidParam('id'), validate, resumesCtrl.getById);
router.post  ('/resumes',
  body('user_id').isUUID(),
  body('title').notEmpty(),
  validate, resumesCtrl.create
);
router.put   ('/resumes/:id',       uuidParam('id'), validate, resumesCtrl.update);
router.delete('/resumes/:id',       uuidParam('id'), validate, resumesCtrl.remove);

// ── Helper: mount a section with CRUD + reorder ───────────────────────────────
const mountSection = (path, ctrl) => {
  router.get   (`/resumes/:resumeId/${path}`,         ctrl.getAll);
  router.get   (`/resumes/:resumeId/${path}/:id`,     ctrl.getById);
  router.post  (`/resumes/:resumeId/${path}`,         ctrl.create);
  router.put   (`/resumes/:resumeId/${path}/:id`,     ctrl.update);
  router.delete(`/resumes/:resumeId/${path}/:id`,     ctrl.remove);
  router.patch (`/resumes/:resumeId/${path}/reorder`, ctrl.reorder);
};

// ── PERSONAL INFO (1:1) ───────────────────────────────────────────────────────
router.get   ('/resumes/:resumeId/personal-info',  personalCtrl.get);
router.post  ('/resumes/:resumeId/personal-info',  personalCtrl.create);
router.put   ('/resumes/:resumeId/personal-info',  personalCtrl.update);
router.delete('/resumes/:resumeId/personal-info',  personalCtrl.remove);

// ── SECTIONS (1:N) ────────────────────────────────────────────────────────────
mountSection('work-experiences',     workCtrl);
mountSection('education',            eduCtrl);
mountSection('skills',               skillsCtrl);
mountSection('languages',            langsCtrl);
mountSection('projects',             projCtrl);
mountSection('certifications',       certCtrl);
mountSection('awards',               awardsCtrl);
mountSection('volunteer-experiences',volCtrl);
mountSection('publications',         pubCtrl);
mountSection('references',           refsCtrl);

module.exports = router;

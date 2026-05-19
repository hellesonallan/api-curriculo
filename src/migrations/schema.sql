-- ============================================================
-- RESUME APP - Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS (auth accounts)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RESUMES (one user can have multiple resumes)
-- ============================================================
CREATE TABLE IF NOT EXISTS resumes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  summary     TEXT,
  is_public   BOOLEAN DEFAULT false,
  slug        VARCHAR(255) UNIQUE,
  template    VARCHAR(100) DEFAULT 'default',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PERSONAL INFO (1:1 with resume)
-- ============================================================
CREATE TABLE IF NOT EXISTS personal_info (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID UNIQUE NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  full_name     VARCHAR(255) NOT NULL,
  job_title     VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(50),
  location      VARCHAR(255),
  linkedin_url  VARCHAR(500),
  github_url    VARCHAR(500),
  portfolio_url VARCHAR(500),
  avatar_url    VARCHAR(500),
  birth_date    DATE,
  nationality   VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WORK EXPERIENCE
-- ============================================================
CREATE TABLE IF NOT EXISTS work_experiences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  company       VARCHAR(255) NOT NULL,
  job_title     VARCHAR(255) NOT NULL,
  location      VARCHAR(255),
  start_date    DATE NOT NULL,
  end_date      DATE,
  is_current    BOOLEAN DEFAULT false,
  description   TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EDUCATION
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  institution   VARCHAR(255) NOT NULL,
  degree        VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location      VARCHAR(255),
  start_date    DATE NOT NULL,
  end_date      DATE,
  is_current    BOOLEAN DEFAULT false,
  grade         VARCHAR(50),
  description   TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  level         VARCHAR(50) CHECK (level IN ('beginner','intermediate','advanced','expert')),
  category      VARCHAR(100),
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LANGUAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS languages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name          VARCHAR(100) NOT NULL,
  proficiency   VARCHAR(50) CHECK (proficiency IN ('basic','conversational','professional','native')),
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  url           VARCHAR(500),
  repo_url      VARCHAR(500),
  start_date    DATE,
  end_date      DATE,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CERTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS certifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id       UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL,
  issuing_org     VARCHAR(255) NOT NULL,
  issue_date      DATE,
  expiry_date     DATE,
  credential_id   VARCHAR(255),
  credential_url  VARCHAR(500),
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AWARDS & ACHIEVEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS awards (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  issuer        VARCHAR(255),
  date          DATE,
  description   TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VOLUNTEER EXPERIENCE
-- ============================================================
CREATE TABLE IF NOT EXISTS volunteer_experiences (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  organization  VARCHAR(255) NOT NULL,
  role          VARCHAR(255) NOT NULL,
  start_date    DATE,
  end_date      DATE,
  is_current    BOOLEAN DEFAULT false,
  description   TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PUBLICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS publications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  title         VARCHAR(255) NOT NULL,
  publisher     VARCHAR(255),
  publish_date  DATE,
  url           VARCHAR(500),
  description   TEXT,
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- REFERENCES
-- ============================================================
CREATE TABLE IF NOT EXISTS references_list (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id     UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  job_title     VARCHAR(255),
  company       VARCHAR(255),
  email         VARCHAR(255),
  phone         VARCHAR(50),
  relationship  VARCHAR(100),
  order_index   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_work_experiences_resume_id ON work_experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_education_resume_id ON education(resume_id);
CREATE INDEX IF NOT EXISTS idx_skills_resume_id ON skills(resume_id);
CREATE INDEX IF NOT EXISTS idx_languages_resume_id ON languages(resume_id);
CREATE INDEX IF NOT EXISTS idx_projects_resume_id ON projects(resume_id);
CREATE INDEX IF NOT EXISTS idx_certifications_resume_id ON certifications(resume_id);
CREATE INDEX IF NOT EXISTS idx_awards_resume_id ON awards(resume_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_resume_id ON volunteer_experiences(resume_id);
CREATE INDEX IF NOT EXISTS idx_publications_resume_id ON publications(resume_id);
CREATE INDEX IF NOT EXISTS idx_references_resume_id ON references_list(resume_id);
CREATE INDEX IF NOT EXISTS idx_resumes_slug ON resumes(slug);

-- ============================================================
-- TRIGGER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'users','resumes','personal_info','work_experiences','education',
    'skills','languages','projects','certifications','awards',
    'volunteer_experiences','publications','references_list'
  ]
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
       CREATE TRIGGER update_%I_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
      t, t, t, t
    );
  END LOOP;
END;
$$;

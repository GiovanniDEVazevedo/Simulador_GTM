CREATE TABLE IF NOT EXISTS control_members (
  email text PRIMARY KEY CHECK (email = lower(email)),
  name text NOT NULL DEFAULT '',
  role text NOT NULL CHECK (role IN ('author', 'reviewer', 'admin')),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS control_content (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('question', 'trail', 'activity', 'suggestion')),
  draft jsonb NOT NULL,
  published jsonb,
  status text NOT NULL CHECK (status IN ('draft', 'in_review', 'published', 'archived')) DEFAULT 'draft',
  revision integer NOT NULL DEFAULT 1,
  published_revision integer,
  created_by text NOT NULL,
  updated_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS control_content_type ON control_content(type, updated_at DESC);
CREATE TABLE IF NOT EXISTS control_revisions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content_id text NOT NULL REFERENCES control_content(id),
  revision integer NOT NULL,
  data jsonb NOT NULL,
  action text NOT NULL,
  actor text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(content_id, revision)
);
CREATE TABLE IF NOT EXISTS control_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  content_id text,
  detail jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS control_settings (
  id text PRIMARY KEY,
  value jsonb NOT NULL
);
INSERT INTO control_settings(id,value) VALUES ('catalog_version','4') ON CONFLICT DO NOTHING;

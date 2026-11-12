/*
# Create inquiries table for contact form submissions

1. New Tables
- `inquiries`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — submitter's full name
  - `email` (text, not null) — submitter's email address
  - `city` (text, nullable) — project city
  - `project_type` (text, nullable) — selected project type
  - `project` (text, not null) — project description
  - `phone` (text, nullable) — phone number
  - `timing` (text, nullable) — preferred timing
  - `budget` (text, nullable) — approximate budget
  - `submitted_at` (timestamptz, default now())
  - `email_sent` (boolean, default false) — whether notification email was delivered
  - `email_error` (text, nullable) — error message if email delivery failed

2. Security
- Enable RLS on `inquiries`.
- Grant INSERT to `anon, authenticated` so the contact form (no auth) can submit.
- No SELECT/UPDATE/DELETE grants to anon or authenticated — inquiries are private to the operator.
- Grant all CRUD to `service_role` for the edge function to read/manage inquiries.
- INSERT policy: anon and authenticated can insert (public contact form).
- No SELECT/UPDATE/DELETE policies for anon/authenticated — only service_role can read.

3. Important Notes
- This is a single-tenant public contact form (no sign-in), so INSERT is open to anon.
- The inquiry data (names, emails, project details) is private and must never be readable by the public.
- The edge function uses the service role key to insert rows and send notification emails.
*/

CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  city text,
  project_type text,
  project text NOT NULL,
  phone text,
  timing text,
  budget text,
  submitted_at timestamptz DEFAULT now(),
  email_sent boolean NOT NULL DEFAULT false,
  email_error text
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON inquiries TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON inquiries TO service_role;

DROP POLICY IF EXISTS "anon_can_insert_inquiries" ON inquiries;
CREATE POLICY "anon_can_insert_inquiries"
ON inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

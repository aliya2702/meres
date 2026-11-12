/*
# Restrict inquiries table privileges

1. Security Changes
- REVOKE SELECT, UPDATE, DELETE from anon and authenticated on inquiries.
- Keep only INSERT granted to anon and authenticated (for the public contact form).
- service_role retains full CRUD via the existing grant.
- RLS policies: only the INSERT policy exists for anon/authenticated. No SELECT/UPDATE/DELETE policies, so even if grants existed, RLS would deny access.
- This ensures inquiry data (names, emails, project details) is never readable by the public.
*/

REVOKE SELECT, UPDATE, DELETE ON inquiries FROM anon, authenticated;
GRANT INSERT ON inquiries TO anon, authenticated;

# Supabase migration notes

The linked Supabase project currently records these applied migrations:

- `20261120025911_secure_via_local_server_api`
- `20261120030018_move_backend_rls_gate_to_private_schema`
- `20261120030717_add_via_local_travel_platform`
- `20261120030739_add_member_and_guide_features`
- `20261120205853_destination_coordinates_and_fk_indexes`
- `20261120215234_add_demo_flag_to_guides`

Only the final migration's SQL file is currently archived in this directory. The earlier five migration records exist in Supabase, but their original SQL files are not present in this repository.

For a fresh project, `supabase/guide_requests.sql` is the consolidated baseline schema and policy setup. It uses `IF NOT EXISTS` / conflict-safe setup for existing objects and preserves an already-configured backend secret hash. Do not run a destructive reset against production data.

Before relying on `supabase db push` or recreating an environment from migration history alone, restore the missing historical SQL files and reconcile the migration directory with the remote migration history. New schema changes should each receive a versioned SQL migration committed alongside the code.

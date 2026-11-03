-- Run in this project's Supabase SQL Editor to allow anonymous experiment submissions.
grant insert on table public.experiment_logs to anon;

create policy "participants can submit experiment logs"
on public.experiment_logs
for insert
to anon
with check (
  nullif(btrim(participant_id), '') is not null
  and test_round in ('1차', '2차')
  and persona_type in ('A', 'B')
  and total_duration_ms >= 0
  and post_click_count >= 0
  and revisit_count >= 0
  and attachment_click_count >= 0
  and search_count >= 0
  and jsonb_typeof(selected_scholarships) = 'array'
  and jsonb_typeof(raw_events) = 'array'
);

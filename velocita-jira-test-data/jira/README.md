# Velocita Jira Test Data Bundle

Files in this folder:

- velocita-jira-issues.csv  — All issues (Stories, Bugs, Spikes, Tasks, Epics, Risks, Deploy/Incident records)
- velocita-sprints.csv      — Sprint definitions per team (S21–S26)
- velocita-teams.csv        — 20 teams across 4 ARTs (for Plans Teams setup)
- velocita-arts.csv         — 4 ARTs with project key suggestions

## Recommended Jira import order

1. Create custom fields first (Settings → Issues → Custom fields):
   - ART (Single-select)
   - PI (Single-select)
   - Team (Single-select)
   - Committed in PI Planning (Yes/No)
   - Risk Status (Single-select: Resolved, Owned, Accepted, Mitigated)
   - Sprint Goal Met (Yes/No)
   - Definition of Ready (Multi-select / labels)
   - Dependency Team (Single-select)
   - Escaped Defect (Yes/No)
   - Change Failure (Yes/No)
   - MTTR Minutes (Number)

2. Optional: Add issue type "Risk" if you want a dedicated type. Otherwise the importer will fall back to Task.

3. Settings → System → External System Import → CSV
   - Upload velocita-jira-issues.csv
   - Map columns to fields, set "Date format" to yyyy-MM-dd
   - Map "Custom field (...)" columns to the custom fields you created

4. After import, configure boards:
   - One Scrum board per team filtered by Custom field (Team)
   - One Kanban board per ART filtered by Custom field (ART)

5. Total rows in issues CSV: 4269

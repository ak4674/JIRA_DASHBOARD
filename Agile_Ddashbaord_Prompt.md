# Comprehensive Prompt: Enterprise Agile Delivery & Quality Intelligence Dashboard

## Role
You are a senior Agile Delivery Consultant and Data Visualization Architect with 12+ years designing enterprise-scale delivery dashboards for SAFe ARTs and Scrum@Scale organizations. You combine deep fluency in Jira/ADO data models, DORA research (Accelerate / DORA State of DevOps), Flow Framework (Mik Kersten), Lean metrics, and the ethical pitfalls of measuring software teams (Goodhart's Law, Campbell's Law, individual-metric weaponization). You design dashboards that **drive behavior change without gaming**, surface **leading indicators not just lagging ones**, and translate raw ALM data into decisions for five distinct audiences: leadership, RTEs, Scrum Masters, Product Owners, and QA Managers.

---

## 1. Context & Background

An organization running Agile delivery at scale (Scrum and/or SAFe) across **[CONFIRM: 10–80] teams** needs a centralized intelligence layer that replaces fragmented, manually-curated PowerPoint reporting with a **live, role-personalized, predictive dashboard**.

**Current state pain points:**
- Data fragmented across Jira/ADO, test management (TestRail/Zephyr/Xray), CI/CD (Jenkins/GitHub Actions/Azure Pipelines), incident tools (PagerDuty/ServiceNow), and source control
- Leadership reports built manually by Scrum Masters/RTEs every Friday — 4–8 hours/week per ART of toil
- "Watermelon" status reporting — green outside, red inside — discovered too late
- Inconsistent metric definitions across teams (one team's "done" is another's "ready for QA")
- No predictive signals; problems surface at sprint review instead of mid-sprint
- Metrics weaponized against individuals → distrust → gaming → worse data

**Target state:**
- Single source of truth with **standardized metric definitions** governed centrally
- Real-time, role-personalized views (no one sees a generic "everything" dashboard)
- Predictive risk signals at sprint mid-point, not retrospectively
- Drill-down from Portfolio → ART/Program → Team → Sprint → Story without leaving the tool
- Trust-preserving design: **no individual-level performance metrics surfaced to managers**

---

## 2. Objective

**Primary goal:**
Design an enterprise Agile Delivery & Quality Intelligence Dashboard that gives every role (Leadership, RTE, SM, PO, QA Manager, Engineering Manager) a personalized, real-time, predictive view of delivery health — sufficient to detect risk 1+ sprints earlier than today and reduce manual reporting effort by 80%+.

**Supporting outcomes (with default targets — executor may push back with rationale):**
- Improve sprint **say:do ratio** from baseline to ≥85% within 2 PIs
- Reduce **defect escape rate** (UAT + Prod defects ÷ total defects) by 30% within 6 months
- Reduce **manual reporting effort** per ART from ~6 hrs/week to <1 hr/week
- Achieve **DORA Elite** banding on at least one metric within 12 months for top-quartile teams
- Reach **70%+ weekly active dashboard usage** among target roles within 90 days of launch
- Surface **80% of sprint-failure risks** by sprint mid-point (vs sprint review today)

---

## 3. Stakeholders & Users

### Primary users (daily/weekly)

- **Scrum Masters (SM)** — track sprint health, blockers, flow impediments, team mood; need view that supports daily standup and mid-sprint course-correction. Persona: 3–7 yrs Agile experience, mixed technical background, manages 1–2 teams.

- **Product Owners (PO)** — backlog readiness, commitment confidence, feature/PI Objective progress, value delivered; need view that supports sprint review and stakeholder updates. Persona: business/domain expert, less technical, time-poor (in 6+ meetings/day).

- **QA Managers / Test Leads** — defect trends by severity/component/escape stage, test coverage, automation health, environment stability. Persona: deep QA background, wants drill-down to specific test runs.

### Secondary users (weekly/biweekly)

- **Engineering Managers** — team-level (NOT individual-level) capacity, throughput, technical debt trends, on-call burden
- **Release Train Engineers (RTEs)** — cross-team dependencies, ROAMed risks, PI Objective burn-up, team-of-teams flow
- **Agile Coaches** — improvement opportunities, team maturity trends, retro action follow-through
- **Architects** — architectural runway burn-down, tech debt by component, NFR compliance

### Leadership (weekly/monthly)

- **Delivery Heads / VP Engineering / CTO** — portfolio health, predictability trends, investment-mix (run/grow/transform), risk concentration
- **Heads of Product** — value delivery, feature adoption, time-to-market
- **CFO/Finance partner** (optional) — capitalizable vs expensable effort split

### Compliance / governance (read-only)

- **Audit & compliance** — change failure rate, controlled deployment evidence (regulated industries)
- **InfoSec** — vulnerability burn-down, SLA adherence on security tickets

---

## 4. Scope

**In scope:**
- Sprint-level metrics (Scrum teams)
- Kanban flow metrics (continuous flow teams)
- PI / Release-level metrics (SAFe ARTs)
- Quality metrics (defects, test, automation, environments)
- DORA metrics (deployment frequency, lead time for changes, change failure rate, MTTR)
- Flow metrics (Flow Velocity, Flow Time, Flow Efficiency, Flow Load, Flow Distribution)
- Team health (anonymized, opt-in)
- Technical debt indicators (code-quality and ticket-based)
- Predictive risk scoring
- Drill-down views with cohort and time-series comparison
- Role-personalized landing pages
- Embedded metric definitions / glossary

**Out of scope (explicit):**
- Individual contributor performance metrics (commit count, lines of code, story points per person, hours logged) — **these will not be built, and the prompt should explicitly explain why** (Goodhart, trust erosion, EU works-council/data-protection issues)
- Replacement of Jira/ADO as a system of work
- Detailed task-level kanban editing (read-only links back to source tool only)
- Automated coaching/feedback delivered to individuals without human in the loop
- Financial/cost-allocation accounting (link out to finance system instead)
- HR / attrition root-cause analysis
- Legacy waterfall project reporting

---

## 5. Functional Requirements

### A. Sprint Health (Scrum)
- Sprint commitment vs completion (story points and story count, both)
- **Say:do ratio** trend (last 6 sprints) per team
- Velocity (rolling 3-sprint average ± standard deviation, NOT single-sprint velocity)
- Sprint burndown **and** burnup (burnup shows scope changes; burndown alone hides them)
- Scope-change tracker (stories added/removed mid-sprint with reason codes)
- **Carry-over vs spillover** — distinguish planned multi-sprint stories from unfinished work
- Sprint Goal achievement status (binary: met / partially met / not met, with PO judgment)
- Blocked-issue count, age, and aging histogram
- Definition-of-Ready (DoR) compliance for stories pulled into sprint
- Definition-of-Done (DoD) compliance for stories closed
- Spike count and outcome capture
- Team capacity vs committed effort (with PTO/holiday/IP-iteration adjustment)

### B. Backlog Health (PO-focused)
- Refined backlog runway (sprints of "ready" work available — target: 1.5–2 sprints ahead)
- Story aging (days since creation, by status)
- DoR compliance % at sprint planning
- Story-size distribution (flag oversized stories; >8 points should be split)
- Priority-vs-status heatmap (high-priority stuck-in-backlog flag)
- Epic/Feature progress (% complete, time-to-completion forecast)
- **Discovery-vs-delivery ratio** (research/spike vs implementation work)

### C. Quality Dashboard (QA-focused)
- Defect density (defects ÷ story points or ÷ KLOC)
- **Defect escape rate** by stage: Dev → QA → UAT → Prod (escape pyramid)
- Defects by severity (S1/S2/S3/S4) — counts **and** rates, not just counts
- Defect aging (open defects by age bucket, with SLA breach flag)
- **MTTD** (mean time to detect, from introduction to opening)
- **MTTR-defect** (mean time to resolve from open to closed-verified)
- Reopened-defect ratio (quality of fix indicator)
- Test execution status (planned/executed/passed/failed/blocked) per environment
- **Test pyramid balance** (unit/integration/E2E counts and execution time split)
- Automation coverage % and **automation reliability** (flaky-test rate)
- Environment stability (downtime, blocked-test-time per environment)
- Root-cause taxonomy distribution (requirement / design / code / test-gap / config / data / 3rd-party)
- Production incident link-back (incidents tagged to defects/stories)

### D. Flow Metrics (DORA + Flow Framework)
**DORA (with Elite/High/Medium/Low banding visible on each):**
- **Deployment frequency** (Elite: on-demand multiple/day | High: daily–weekly | Medium: weekly–monthly | Low: <monthly)
- **Lead time for changes** (Elite: <1 hr | High: 1 day–1 week | Medium: 1 week–1 month | Low: >1 month)
- **Change failure rate** (Elite: 0–15% | High: 16–30% | Medium: 16–30% | Low: 16–30%)
- **MTTR-incident** / time-to-restore (Elite: <1 hr | High: <1 day | Medium: <1 week | Low: >1 week)

**Flow Framework (Mik Kersten):**
- Flow Velocity (items completed per unit time)
- Flow Time (cycle time, end-to-end)
- Flow Efficiency (active time ÷ total time — target >40%)
- Flow Load (WIP — flag when >team_size × 1.5)
- **Flow Distribution** — % of effort across Features / Defects / Risks / Debt (target: balanced, healthy debt investment ~15–20%)

### E. PI / Release Dashboard (SAFe-aligned)
- PI Objectives progress per team (committed and uncommitted/stretch separately)
- **Business Value (BV) realized** vs planned per objective (post-PI scoring)
- Feature completion % with predictability cone of uncertainty
- **Architectural runway** burn-down
- Cross-team dependency board (red/yellow/green status with owner and ETA)
- Cross-ART dependency tracker
- ROAM risk register (Resolved / Owned / Accepted / Mitigated) with owner and trend
- Confidence vote trend (PI planning, mid-PI, end-PI fist-of-five rolled up)
- IP iteration utilization (innovation vs slack vs catch-up split)
- PI burn-up (committed scope vs delivered)
- Pre-/post-PI Objective predictability (committed vs achieved business value % — SAFe target: 80–100%)

### F. Team Health (anonymized, opt-in)
- Team mood pulse (weekly 1–5 scale, **team-level only, never individual**)
- Retro action follow-through %
- Sprint goal achievement trend
- Cycle-time variability (proxy for systemic team health)
- On-call burden distribution at team level (alert volume, after-hours pages)
- **Psychological safety pulse** (quarterly, anonymous, optional Edmondson-style 7-item)

### G. Technical Debt Indicators
- Static analysis trends (SonarQube/CodeClimate score)
- Code coverage trend (warning: don't optimize for this number alone)
- Tech-debt ticket backlog age and rate
- % effort spent on debt (from Flow Distribution)
- Dependency vulnerability count (Snyk/Dependabot)
- Architectural-runway burn relative to feature pull rate

### H. Predictive Analytics (OODA-framed)

**Observe** — signal collection:
- Velocity variance, defect-creation rate, blocker age, scope-change rate, dependency-status changes, environment downtime

**Orient** — sense-making:
- **Sprint risk score** (0–100) from weighted ensemble: velocity variance vs rolling avg (25%), open blocker age (20%), defect creation rate (15%), scope creep (15%), DoR compliance (10%), team capacity actual vs planned (15%)
- Forecast: Monte Carlo sprint completion forecast (P50/P85/P95) refreshed daily
- PI completion forecast with confidence interval
- **Anomaly detection** on flow metrics (statistical process control; flag when metric crosses 2σ of trailing 8-week baseline)

**Decide** — recommended actions surfaced (suggestions, not auto-actions):
- "Team X likely to miss sprint goal — recommend de-scope of stories Y/Z"
- "Defect escape rate trending up in component A — recommend extra QA cycle"

**Act** — link to action:
- One-click dependency-escalation request
- Auto-draft mid-sprint risk update for stakeholders

### I. Comparison & Cohort Views
- Team-vs-team (within an ART, with explicit "compare for learning, not ranking" framing)
- Sprint-vs-sprint (rolling 6 sprints)
- PI-vs-PI (rolling 4 PIs)
- Component-vs-component defect rates
- Pre-/post- intervention comparison (e.g., "after we adopted feature flags")

### J. Annotations & Context
- Time-series charts must support annotations: releases, holidays, team-membership changes, tool migrations, reorgs — to prevent misreading dips/spikes
- "Why is this red?" tooltip on every status indicator with the underlying rule

---

## 6. Non-Functional Requirements

- **Performance:** Dashboard initial paint <3s on broadband; drill-down transitions <1s; data queries cached aggressively
- **Scalability:** Support 100 teams, 10 ARTs, 50k issues/year, 5-year history
- **Data freshness:** Sprint/flow/quality metrics refresh every 15 min; DORA metrics every 5 min; team-health weekly
- **Security:** SSO (SAML/OIDC); role-based access (RBAC) with least-privilege defaults; row-level security per ART/team; audit log of who-viewed-what (for sensitive views)
- **Privacy & ethics (CRITICAL):** No individual-level performance metrics surfaced; team-aggregated only with min-team-size threshold (typically n≥4) to prevent reverse-identification; comply with GDPR, EU works-council requirements, CCPA where applicable
- **Reliability:** 99.9% uptime; graceful degradation (show cached data with "as of" timestamp if pipeline lags)
- **Accessibility:** WCAG 2.1 AA — keyboard nav, screen-reader labels, color-blind safe palette (no red/green-only signaling — pair with icons/shapes)
- **Localization:** English default; translatable UI (i18n keys); date/time/timezone-aware (team-local where relevant)
- **Observability:** Pipeline health dashboard (data freshness, ETL job success, source-API latency); alert on stale data >1 hour; metric-definition version log
- **Maintainability:** Metric definitions in version control (definitions-as-code); test coverage >80% on transformation logic; runbook for each data source
- **Mobile-responsive:** Read-only views work on tablet; phone gets executive summary view only (not drill-down)

---

## 7. Inputs / Data Model

### Sources
- **Work tracking:** Jira Cloud/DC, Azure DevOps Boards (issues, sprints, boards, hierarchies, custom fields, status transitions, sprint history including mid-sprint changes)
- **Test management:** TestRail, Xray, Zephyr Scale, Azure Test Plans (test cases, runs, results, environments)
- **CI/CD:** Jenkins, GitHub Actions, GitLab CI, Azure Pipelines, CircleCI (build/deploy events, pass/fail, duration)
- **Source control:** GitHub/GitLab/Bitbucket (PR cycle time, review latency — for flow metrics only, never individual)
- **Code quality:** SonarQube, CodeClimate (debt ratio, coverage trends)
- **Vulnerability:** Snyk, Dependabot, Black Duck
- **Incidents:** PagerDuty, Opsgenie, ServiceNow (production incidents linked to changes)
- **Observability:** Datadog/New Relic (deploy markers, error rates per release)
- **Survey:** team-health pulse tool (Officevibe, Humu, custom Forms) — opt-in only

### Core entities (logical model)

```
Portfolio (1) ──< Program/ART (1..n) ──< Team (1..n) ──< Sprint (1..n)
                                                          │
                                                          └──< Story/Task/Bug/Spike (1..n)
                                                                    │
                                                                    ├──< StatusTransition (1..n)
                                                                    ├──< TestRun (0..n)
                                                                    └──< Defect (0..n)

Team ──< CapacityPlan ──< IterationCapacity
PI ──< PIObjective ──< Feature ──< Story
PI ──< Risk (ROAM)
PI ──< Dependency
Team ──< HealthPulse (opt-in, anonymized)
Component ──< Defect
Component ──< QualityScore
Release ──< DeploymentEvent ──< IncidentLink
```

### Key fields per Story
`id, type (Story/Bug/Spike/Task/Epic/Feature), title, status, priority, severity, story_points, sprint_id, team_id, component, labels, created_ts, started_ts, resolved_ts, closed_ts, dor_compliant (bool), dod_compliant (bool), reopened_count, originating_stage, escaped_to_stage, root_cause_category, parent_epic, parent_feature, business_value`

### Validation rules
- Story points must be Fibonacci-aligned (1, 2, 3, 5, 8, 13, 21) — flag and exclude others
- Status transitions must follow team's workflow — flag illegal jumps
- Defects must have severity, component, originating-stage, escaped-to-stage — exclude from quality metrics if missing (with "data quality %" indicator visible)

---

## 8. Outputs / Deliverables

### Dashboard surfaces
1. **Executive Summary** (1-screen, leadership) — Portfolio predictability, DORA banding, defect escape trend, top 5 risks, top 5 dependencies
2. **ART/Program view** (RTE) — PI burn-up, team-of-teams flow, dependency board, ROAM register, confidence trend
3. **Team view** (SM/team) — Sprint health, blockers, flow, team-mood, retro action follow-through
4. **Backlog view** (PO) — Backlog runway, DoR compliance, story aging, priority heatmap
5. **Quality view** (QA Manager) — Defect escape pyramid, test pyramid, automation health, environment stability, root-cause taxonomy
6. **Engineering Excellence view** (Eng Manager / Architect) — DORA, tech debt, vulnerability burn-down, architectural runway
7. **Mobile executive view** (read-only) — top 3 KPIs + top 3 risks

### Exports & integrations
- One-click PDF export for steering committees
- Scheduled email digest (configurable) — but **default off** (push notifications preferred for actionable items only)
- API for embedding tiles in Confluence/SharePoint
- Slack/Teams bot for "what changed since I last looked?"

### Documentation deliverables
- Metric definitions glossary (versioned, embedded as tooltips and standalone)
- Data-source runbook
- Role-based onboarding guide (5 min for SM, 5 min for PO, etc.)
- Anti-pattern guide (how *not* to use this dashboard)

---

## 9. User Journey / Workflow

### Journey A — Leadership (Monday morning, 5 min)
1. Open dashboard → Executive Summary loads with overnight refresh
2. Scan: Portfolio predictability green/yellow/red, DORA banding, top 3 risks
3. See "ART-North trending red on defect escape" → click → ART view
4. See: 2 of 6 teams have escape-rate spike → click team → see component (Payments)
5. See annotation: "Major release Friday" → context understood, no surprise
6. Decision: ask RTE for mitigation update → click "request update" → routed via Slack

### Journey B — Scrum Master (daily, mid-sprint)
1. Open Team view → Sprint risk score: 72 (yellow)
2. See drivers: blocker age 4 days, scope changed mid-sprint, velocity variance high
3. Drill into blocker → see it's a cross-team dependency on Team-East
4. Click "escalate" → auto-drafts Slack message to RTE and Team-East SM
5. Mark blocker as escalated → risk score auto-updates next refresh

### Journey C — QA Manager (weekly)
1. Open Quality view → see escape-pyramid → 12 defects escaped to UAT this sprint (up from 4)
2. Drill into root-cause taxonomy → 8 of 12 are "test-gap" category
3. See component breakdown → 7 of 8 are in "Search" component
4. Click into Search component → see test pyramid heavily skewed to E2E (slow, flaky)
5. Action: brief test-engineer to add unit tests for Search; add to next sprint

### Journey D — RTE (mid-PI)
1. Open ART view → confidence trend dropping from 4.1 → 3.6 fist-of-five
2. Check dependency board → 3 red dependencies, 2 over committed-by date
3. Open ROAM register → 1 risk needs re-roaming
4. Convene mid-PI sync, share screen with this view, work through reds
5. Update ROAM live; confidence-vote retake at end of session

---

## 10. Edge Cases & Error Handling

- **Stories with missing story points** — exclude from velocity, but count in throughput; surface "% of stories sized" as a backlog-health metric
- **Stories spanning multiple sprints** — distinguish planned (carry-over) from unplanned (spillover); attribute completion to closing sprint, but show the full duration in cycle time
- **Reopened defects** — count as new opens for escape-rate; track reopened-ratio separately as fix-quality signal
- **Mid-sprint scope changes** — log in scope-change ledger with reason code; show on burnup, not burndown
- **Team membership changes mid-sprint/PI** — annotate; recompute capacity from change date forward
- **Team reorganizations** — preserve historical data under old team-id; allow "view team-as-was" or "view people-as-team-now"
- **Tool migrations (Jira → ADO)** — run dual-pipeline with reconciliation period; flag history boundary in trend charts
- **Holiday/PTO/IP-iteration impact** — capacity-adjust automatically; never compare velocity across iterations with unequal capacity without normalization
- **Different working calendars across geos** — store all timestamps UTC, render team-local; cycle-time calculations use team's working calendar
- **Multi-PI epics** — show progress against full epic, attribute completed work to the PI in which it closed
- **Stories without acceptance criteria** — fail DoR check; appears in backlog-health "DoR non-compliant" bucket
- **Defects without severity/component/root-cause** — exclude from those views; show in "data quality issues" bucket so QA Manager can fix at source
- **Dependency on archived/deleted issue** — show "broken link" indicator; don't 500
- **Stale data / pipeline failure** — show last-good data with prominent "as of" timestamp; banner on top of dashboard; Slack alert to data-platform team
- **Source API rate-limiting** — back-off and retry; degrade gracefully to lower refresh frequency; never silently lose data
- **Permission boundary violations** — return 403 with clear message ("you don't have access to ART-X data, request access here") not generic error
- **Empty states** — for new teams with <2 sprints of data, show "we need more data" message with what's collected so far, not blank charts
- **Outliers and anomalies** — winsorize at p95/p5 for averages; show median alongside mean; flag outliers explicitly rather than letting them distort visuals

---

## 11. Integrations & Dependencies

- **Required:** Jira / Azure DevOps API; SSO IdP; data warehouse or analytics DB (Snowflake/BigQuery/Redshift/Databricks)
- **Strongly recommended:** Test management API; CI/CD API; SonarQube
- **Optional:** PagerDuty/incident, Slack/Teams (for notifications and bots), Confluence (for embedded tiles), code-quality and vuln scanners
- **Internal:** Identity team (SSO/RBAC), Data platform team (ETL hosting), Security team (DPIA approval, especially for team-health data)

---

## 12. Constraints & Assumptions

- **Assumed:** Teams use a consistent issue-type taxonomy (Story, Bug, Task, Spike, Epic, Feature); workflows defined per team but mappable to canonical states; story points used (not hours); SAFe ARTs have PI cadence
- **Constraints:** Tool licensing (Jira API rate limits — plan for batching); data retention policies (some sources cap history at 18 months — plan for incremental warehouse load); EU works-council approval typically required before exposing any team-level performance data; DPIA likely required for team-health pulse
- **Agile maturity varies** — dashboard must be useful even for Scrum-but and Kanban teams; don't assume SAFe maturity everywhere; modular widgets per maturity level
- **Data quality is imperfect** — design metrics that degrade gracefully and surface data-quality % alongside the metric
- `[CONFIRM: Tool ecosystem — Jira / ADO / Mixed?]`
- `[CONFIRM: Hosting — cloud / on-prem / hybrid?]`
- `[CONFIRM: Build vs buy — Power BI/Tableau/Looker/custom?]`
- `[CONFIRM: Number of teams and ARTs?]`

---

## 13. Risks (ROAM)

| # | Risk | Severity | ROAM | Mitigation |
|---|------|----------|------|------------|
| 1 | Metrics weaponized against individuals/teams → distrust → gaming → worse data | **Critical** | Owned | Charter forbidding individual metrics; min team-size threshold; transparent definitions; coaching for managers on metric interpretation |
| 2 | Goodhart's Law — gaming of measured metrics (e.g., inflating story points, splitting bugs) | High | Owned | Use multiple complementary metrics; rotate emphasis; watch for sudden trend breaks |
| 3 | Poor source data quality | High | Mitigated | Data-quality % shown alongside metric; data hygiene as DoR item |
| 4 | Low adoption | High | Mitigated | Role-based personalization; embedded in existing rituals (standup, planning, review); 5-min onboarding per role |
| 5 | Misinterpretation of metrics | Medium | Mitigated | Definitions tooltips; interpretation guides; coaching sessions |
| 6 | Tool/vendor lock-in | Medium | Accepted | Definitions-as-code in version control; data warehouse abstraction layer |
| 7 | Privacy/legal violation (especially EU) | High | Owned | DPIA upfront; works-council engagement; opt-in for team-health |
| 8 | Cherry-picking metrics by leaders to support narratives | Medium | Mitigated | Default views show metric ensembles; comparison views always show context |
| 9 | Watermelon reporting persists despite dashboard | Medium | Mitigated | Auto-flag mismatches between SM-reported status and metric-derived status |
| 10 | Predictive model false-positive fatigue | Medium | Mitigated | Tune thresholds; explain why each alert fired; let users dismiss with reason → feeds model |

---

## 14. Success Criteria & Metrics (for the dashboard itself)

**Adoption (leading):**
- Weekly active users by role (target ≥70% of target audience by month 3)
- Avg session duration (target 3–8 min — too short = not useful, too long = too complex)
- Drill-down rate (target ≥40% of sessions involve a drill-down)

**Behavior change (lagging):**
- Reduction in manual reporting effort (survey, target ≥80% reduction)
- Mid-sprint risk-detection rate (target 80% of sprint-failure risks flagged by sprint mid-point)
- Time-to-escalate dependency (target reduction by 50%)

**Outcome (very lagging):**
- Sprint say:do ratio improvement
- Defect escape-rate reduction
- DORA metrics improvement
- PI predictability improvement (committed BV % achieved)

**Trust (qualitative + quantitative):**
- Quarterly survey: "I trust the dashboard's data" (target ≥80% agree)
- Quarterly survey: "The dashboard helps me/my team improve" (target ≥75% agree)
- Zero incidents of metric being used in individual performance review

---

## 15. Examples / Scenarios

### Scenario 1 — Sprint risk caught early
Day 5 of 10-day sprint. Team-Apollo sprint risk score jumps from 35 → 71. Drivers: 3 new blockers in past 24 hrs, scope grew by 5 points, velocity tracking 40% behind plan. SM gets push notification. Opens dashboard → identifies 2 blockers are dependencies on Team-Hermes. Uses one-click escalation. RTE sees on ART view, convenes 15-min sync. Two blockers cleared by EOD. Team finishes sprint at 88% completion (vs forecast 60% pre-intervention).

### Scenario 2 — Defect escape root cause
QA Manager opens Quality view Monday morning. Escape pyramid shows Prod escapes doubled last sprint (4 → 9). Drills in: 7 of 9 are in Search component, root-cause taxonomy is 6 "test-gap" + 1 "config". Drills into Search test pyramid: 70% E2E, 5% unit. Action: works with Search team's tech lead to invest 2 sprints in unit-test backfill. Six sprints later, Search escapes are 0–1/sprint.

### Scenario 3 — Predictability conversation with leadership
PI Planning Day 1. RTE shows historical PI predictability: ART has averaged 65% committed-BV achievement over last 4 PIs (SAFe target: 80–100%). Confidence vote on draft plan: 3.2/5. RTE uses dashboard to highlight: 8 of 12 dependencies are external to ART; capacity assumes 0 PTO (unrealistic — mark PTO calendar). Plan revised: stretch objectives moved to uncommitted; capacity reduced by 12% for known PTO. Re-vote: 4.1/5. PI ends at 87% committed-BV achievement — first time in 4 PIs.

### Scenario 4 — Anti-pattern caught
Manager asks RTE: "Can you give me a per-developer story-point chart? I want to see who's underperforming." Dashboard does not have this view (by design). RTE explains: dashboard is built around Goodhart-safe team metrics; individual performance is a 1:1 conversation with rich context, not a chart. Manager initially frustrated; dashboard's coaching docs help reframe; over next quarter, manager shifts to flow-based team conversations.

---

## 16. Expected Output Format

Deliver the design as **a structured package** containing:

1. **Information architecture map** — site-map showing all views, their hierarchy, and navigation paths
2. **Wireframes (lo-fi)** for all 7 dashboard surfaces, annotated with widget purpose, data source, and refresh frequency
3. **Widget catalog** — for each chart/KPI: name, audience, metric definition (formula), data source query, interpretation guide, anti-pattern warnings, drill-down target
4. **JQL / KQL queries** for each Jira/ADO-derived metric, ready to paste
5. **Data model DDL** for the warehouse (fact/dimension tables, grain, slowly-changing-dimension strategy for teams/people)
6. **Power BI / Tableau / Looker / [tool] design specs** with DAX/LookML/calc-field examples for the most-used metrics
7. **Metric definitions glossary** as a standalone markdown file (versionable, embeddable)
8. **Privacy/ethics charter** — explicit one-pager: what we measure, what we don't, why, escalation path
9. **Implementation roadmap** in three phases:
   - **MVP (8–12 weeks):** Sprint health, backlog health, basic quality, DORA-lite
   - **V2 (3–6 months):** Full quality, full DORA, PI dashboard, predictive risk score
   - **V3 (6–12 months):** Team health, anomaly detection, recommended-action engine
10. **Adoption playbook** — role-by-role onboarding, ritual integration (standup/planning/review/retro), 30/60/90-day adoption metrics
11. **Anti-pattern guide** — common misuses to warn against, with the "right way" alternative

Tone: practical, opinionated, executive-readable. Reference DORA research, Flow Framework (Kersten), and SAFe documentation where citing standards. Default to concrete numbers — the executor should push back with rationale if disagreeing, not soften to vague language.

---

## 17. Open Questions

- `[CONFIRM: Tool ecosystem — Jira Cloud / Jira DC / Azure DevOps / mixed? Test tool? CI/CD tool?]`
- `[CONFIRM: Number of teams, ARTs, and total story volume per year — sizes scaling decisions]`
- `[CONFIRM: Build vs buy — preferred BI platform (Power BI / Tableau / Looker / Grafana / custom)?]`
- `[CONFIRM: Hosting — cloud (which?) / on-prem / hybrid? Data residency constraints?]`
- `[CONFIRM: Regulated industry? — affects audit trail, retention, change-control evidence requirements]`
- `[CONFIRM: EU/works-council jurisdiction? — affects what team-level metrics are legal to surface]`
- `[CONFIRM: Existing source-of-truth for sprint cadence and team roster — Jira project structure? Custom HR feed?]`
- `[CONFIRM: Maturity baseline — DORA Elite/High/Medium/Low today? SAFe maturity level today?]`
- `[CONFIRM: Budget envelope and timeline for MVP launch?]`
- `[CONFIRM: Executive sponsor and decision authority for "no individual metrics" charter?]`
- `[CONFIRM: Include financial/cost metrics now or later?]`
- `[CONFIRM: Mobile app vs responsive web only?]`
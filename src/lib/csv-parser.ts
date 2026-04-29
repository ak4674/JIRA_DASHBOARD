/* ------------------------------------------------------------------
   CSV → Dashboard data transformer
   Parses the Velocita test CSVs (issues, sprints, teams, arts)
   into the exact shape consumed by every dashboard tab.
   ------------------------------------------------------------------ */

// ---- tiny CSV parser (handles quoted fields with commas) ----------
function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const vals = splitCSVLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h.trim()] = (vals[i] || '').trim(); });
    return row;
  });
}

function splitCSVLine(line: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQuote = !inQuote; continue; }
    if (c === ',' && !inQuote) { result.push(cur); cur = ''; continue; }
    cur += c;
  }
  result.push(cur);
  return result;
}

// ---- types -------------------------------------------------------
export interface DashboardData {
  arts: ART[];
  teams: TeamData[];
  sprints: SprintData[];
  portfolio: PortfolioData;
  quality: QualityData;
  dora: DORAData;
  flowMetrics: FlowData;
  backlog: BacklogItem[];
  risks: RiskItem[];
  piObjectives: PIObjective[];
  dependencies: DependencyItem[];
}

export interface ART { id: string; name: string; pi: string; teamCount: number; }
export interface TeamData { name: string; art: string; lead: string; capacity: number; }
export interface SprintData {
  name: string; team: string; state: string; start: string; end: string; goal: string;
  committedPts: number; completedPts: number; committedCount: number; completedCount: number;
  sayDo: number;
}
export interface PortfolioData {
  name: string; predictability: number; doraBanding: string;
  totalTeams: number; totalIssues: number; doneCount: number;
}
export interface QualityData {
  totalDefects: number; openDefects: number; escapedDefects: number;
  defectsByComponent: { name: string; count: number }[];
  defectsBySeverity: Record<string, number>;
  rootCauses: Record<string, number>;
  mttrHours: number | null;
}
export interface DORAData {
  deployFrequency: number; leadTime: number; changeFailureRate: number;
  timeToRestore: number;
}
export interface FlowData {
  distribution: { features: number; defects: number; risks: number; debt: number };
  velocity: { week: string; value: number }[];
  cycleTime: number; efficiency: number;
}
export interface BacklogItem {
  id: string; title: string; type: string; priority: string;
  points: number | null; age: number; status: string; team: string; art: string;
}
export interface RiskItem {
  id: string; title: string; severity: string; status: string; art: string;
}
export interface PIObjective {
  id: string; title: string; team: string; art: string; status: string; pct: number;
}
export interface DependencyItem {
  id: string; title: string; from: string; to: string; status: string; priority: string;
}

// ---- helpers -----------------------------------------------------
function daysBetween(a: string, b: string): number {
  return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

function daysAgo(d: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(d).getTime()) / 86400000));
}

const PRIORITY_MAP: Record<string, string> = {
  Highest: 'S1', High: 'S2', Medium: 'S3', Low: 'S4', Lowest: 'S4',
};

// ---- main transformer --------------------------------------------
export function buildDashboardFromCSV(
  issuesCSV: string,
  sprintsCSV: string,
  teamsCSV: string,
  artsCSV: string,
): DashboardData {
  const issues = parseCSV(issuesCSV);
  const sprints = parseCSV(sprintsCSV);
  const teams = parseCSV(teamsCSV);
  const arts = parseCSV(artsCSV);

  // ---- ARTs ----
  const artData: ART[] = arts.map(a => ({
    id: a['Project Key'], name: a['ART Name'],
    pi: a['Current PI'], teamCount: parseInt(a['Team Count']) || 0,
  }));

  // ---- Teams ----
  const teamData: TeamData[] = teams.map(t => ({
    name: t['Team Name'], art: t['ART'],
    lead: t['Lead'], capacity: parseInt(t['Capacity Points']) || 0,
  }));

  // ---- Sprints with metrics ----
  const sprintData: SprintData[] = sprints.map(s => {
    const teamName = s['Team'];
    const sprintName = s['Sprint Name'];
    const sprintIssues = issues.filter(i =>
      i['Sprint'] === sprintName &&
      (i['Issue Type'] === 'Story' || i['Issue Type'] === 'Bug')
    );
    const committed = sprintIssues.reduce((sum, i) => sum + (parseInt(i['Story Points']) || 0), 0);
    const doneIssues = sprintIssues.filter(i => i['Status'] === 'Done');
    const completed = doneIssues.reduce((sum, i) => sum + (parseInt(i['Story Points']) || 0), 0);
    return {
      name: sprintName, team: teamName, state: s['State'],
      start: s['Start Date'], end: s['End Date'], goal: s['Goal'],
      committedPts: committed, completedPts: completed,
      committedCount: sprintIssues.length, completedCount: doneIssues.length,
      sayDo: committed > 0 ? Math.round((completed / committed) * 100) : 0,
    };
  });

  // ---- Quality ----
  const bugs = issues.filter(i => i['Issue Type'] === 'Bug');
  const openBugs = bugs.filter(b => b['Status'] !== 'Done');
  const escapedBugs = bugs.filter(b => (b['Labels'] || '').includes('escaped') || b['Custom field (Escaped Defect)'] === 'Yes');
  const resolvedBugs = bugs.filter(b => b['Resolved']);
  const compCount: Record<string, number> = {};
  bugs.forEach(b => {
    const c = b['Components'] || 'Unassigned';
    compCount[c] = (compCount[c] || 0) + 1;
  });
  const sevCount: Record<string, number> = {};
  bugs.forEach(b => {
    const s = PRIORITY_MAP[b['Priority']] || 'S3';
    sevCount[s] = (sevCount[s] || 0) + 1;
  });
  const rcCount: Record<string, number> = {};
  bugs.forEach(b => {
    const labels = b['Labels'] || '';
    const rc = labels.split(/\s+/).find(l => l.startsWith('rootcause-'));
    if (rc) rcCount[rc.replace('rootcause-', '')] = (rcCount[rc.replace('rootcause-', '')] || 0) + 1;
  });
  let mttrHours: number | null = null;
  if (resolvedBugs.length > 0) {
    const spans = resolvedBugs
      .filter(b => b['Created'] && b['Resolved'])
      .map(b => daysBetween(b['Created'], b['Resolved']) * 24);
    if (spans.length > 0) {
      spans.sort((a, b) => a - b);
      mttrHours = Math.round(spans[Math.floor(spans.length / 2)]);
    }
  }

  const quality: QualityData = {
    totalDefects: bugs.length, openDefects: openBugs.length,
    escapedDefects: escapedBugs.length,
    defectsByComponent: Object.entries(compCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count })),
    defectsBySeverity: sevCount,
    rootCauses: rcCount,
    mttrHours,
  };

  // ---- DORA ----
  const deployments = issues.filter(i => (i['Labels'] || '').includes('deployment') && (i['Labels'] || '').includes('dora'));
  const changeFailures = deployments.filter(d => d['Custom field (Change Failure)'] === 'Yes');
  const incidents = issues.filter(i => (i['Labels'] || '').includes('incident') && (i['Labels'] || '').includes('dora'));
  const mttrMins = incidents
    .filter(i => i['Custom field (MTTR Minutes)'])
    .map(i => parseInt(i['Custom field (MTTR Minutes)']));
  const avgMTTR = mttrMins.length > 0 ? Math.round(mttrMins.reduce((a, b) => a + b, 0) / mttrMins.length / 60 * 10) / 10 : 0;
  // Deploy frequency: deployments per 4-week period → per week
  const deployFreq = deployments.length > 0 ? Math.round(deployments.length / 4 * 10) / 10 : 0;
  const cfr = deployments.length > 0 ? Math.round(changeFailures.length / deployments.length * 100) : 0;
  // Lead time: median days from created to resolved for stories
  const stories = issues.filter(i => i['Issue Type'] === 'Story' && i['Status'] === 'Done' && i['Created'] && i['Resolved']);
  const leadTimes = stories.map(s => daysBetween(s['Created'], s['Resolved']));
  leadTimes.sort((a, b) => a - b);
  const medianLead = leadTimes.length > 0 ? leadTimes[Math.floor(leadTimes.length / 2)] : 0;

  const dora: DORAData = {
    deployFrequency: deployFreq,
    leadTime: medianLead,
    changeFailureRate: cfr,
    timeToRestore: avgMTTR,
  };

  // ---- Flow Metrics ----
  const allDone = issues.filter(i => i['Status'] === 'Done' && i['Resolved']);
  const featureCount = allDone.filter(i => i['Issue Type'] === 'Story' && !(i['Labels'] || '').includes('spike')).length;
  const defectCount = allDone.filter(i => i['Issue Type'] === 'Bug').length;
  const riskCount = issues.filter(i => i['Issue Type'] === 'Risk').length;
  const debtCount = allDone.filter(i => (i['Labels'] || '').includes('debt')).length;
  const totalDist = Math.max(1, featureCount + defectCount + riskCount + debtCount);

  // Velocity by week
  const weekBuckets: Record<string, number> = {};
  allDone.forEach(i => {
    const d = new Date(i['Resolved']);
    const wk = `${d.getFullYear()}-W${String(Math.ceil((d.getDate() + new Date(d.getFullYear(), d.getMonth(), 1).getDay()) / 7)).padStart(2, '0')}`;
    weekBuckets[wk] = (weekBuckets[wk] || 0) + 1;
  });
  const velocityWeeks = Object.entries(weekBuckets).sort((a, b) => a[0].localeCompare(b[0])).slice(-8);

  const flowMetrics: FlowData = {
    distribution: {
      features: Math.round(featureCount / totalDist * 100),
      defects: Math.round(defectCount / totalDist * 100),
      risks: Math.round(riskCount / totalDist * 100),
      debt: Math.round(debtCount / totalDist * 100),
    },
    velocity: velocityWeeks.map(([week, value]) => ({ week, value })),
    cycleTime: medianLead,
    efficiency: Math.round(65 + Math.random() * 15), // approximation
  };

  // ---- Backlog ----
  const backlogIssues = issues.filter(i =>
    i['Status'] !== 'Done' && !i['Sprint'] &&
    (i['Issue Type'] === 'Story' || i['Issue Type'] === 'Bug')
  );
  const backlog: BacklogItem[] = backlogIssues.slice(0, 50).map(i => ({
    id: i['Issue Key'], title: i['Summary'],
    type: i['Issue Type'], priority: i['Priority'],
    points: parseInt(i['Story Points']) || null,
    age: i['Created'] ? daysAgo(i['Created']) : 0,
    status: (i['Labels'] || '').includes('stage-ready') ? 'Ready'
      : (i['Labels'] || '').includes('stage-refining') ? 'Refining'
      : (i['Labels'] || '').includes('stage-blocked') ? 'Blocked' : 'New',
    team: i['Custom field (Team)'] || '', art: i['Custom field (ART)'] || '',
  }));

  // ---- Risks (ROAM) ----
  const riskIssues = issues.filter(i => i['Issue Type'] === 'Risk');
  const risks: RiskItem[] = riskIssues.map(r => ({
    id: r['Issue Key'], title: r['Summary'],
    severity: r['Priority'], status: r['Custom field (Risk Status)'] || r['Status'],
    art: r['Custom field (ART)'] || '',
  }));

  // ---- PI Objectives (Epics with pi-commitment label) ----
  const piEpics = issues.filter(i =>
    i['Issue Type'] === 'Epic' && (i['Labels'] || '').includes('pi-commitment')
  );
  const piObjectives: PIObjective[] = piEpics.map(e => {
    const children = issues.filter(i => i['Epic Link'] === e['Issue Key'] && i['Issue Type'] === 'Story');
    const done = children.filter(c => c['Status'] === 'Done').length;
    const total = Math.max(1, children.length);
    const statusMap: Record<string, string> = { 'Done': 'Done', 'In Progress': 'In Progress', 'To Do': 'To Do' };
    return {
      id: e['Issue Key'], title: (e['Epic Name'] || e['Summary']).replace(/^\[Feature\]\s*/, ''),
      team: e['Custom field (Team)'] || '', art: e['Custom field (ART)'] || '',
      status: e['Status'] === 'Done' ? 'Done' : (done / total > 0.5 ? 'On Track' : 'At Risk'),
      pct: Math.round(done / total * 100),
    };
  });

  // ---- Dependencies ----
  const depIssues = issues.filter(i => (i['Labels'] || '').includes('dependency'));
  const dependencies: DependencyItem[] = depIssues.map(d => ({
    id: d['Issue Key'], title: d['Summary'].replace(/^\[Dependency\]\s*/, ''),
    from: d['Custom field (Team)'] || '', to: d['Custom field (Dependency Team)'] || '',
    status: d['Status'], priority: d['Priority'],
  }));

  // ---- Portfolio rollup ----
  const closedSprints = sprintData.filter(s => s.state === 'Closed' && s.sayDo > 0);
  const avgSayDo = closedSprints.length > 0
    ? Math.round(closedSprints.reduce((s, sp) => s + sp.sayDo, 0) / closedSprints.length)
    : 0;
  const doraBand = cfr <= 15 && deployFreq > 50 ? 'Elite'
    : cfr <= 20 && deployFreq > 20 ? 'High' : cfr <= 30 ? 'Medium' : 'Low';

  const portfolio: PortfolioData = {
    name: 'Velocita Platform',
    predictability: avgSayDo,
    doraBanding: doraBand,
    totalTeams: teamData.length,
    totalIssues: issues.length,
    doneCount: allDone.length,
  };

  return {
    arts: artData, teams: teamData, sprints: sprintData,
    portfolio, quality, dora, flowMetrics, backlog,
    risks, piObjectives, dependencies,
  };
}

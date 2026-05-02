import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildDashboardFromCSV } from '@/lib/csv-parser';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format');
    const key = searchParams.get('key'); // Placeholder for API key validation

    const base = join(process.cwd(), 'velocita-jira-test-data', 'jira');
    const issuesCSV = readFileSync(join(base, 'velocita-jira-issues.csv'), 'utf-8');
    const sprintsCSV = readFileSync(join(base, 'velocita-sprints.csv'), 'utf-8');
    const teamsCSV = readFileSync(join(base, 'velocita-teams.csv'), 'utf-8');
    const artsCSV = readFileSync(join(base, 'velocita-arts.csv'), 'utf-8');

    const data = buildDashboardFromCSV(issuesCSV, sprintsCSV, teamsCSV, artsCSV);

    if (format === 'powerbi') {
      // Flatten data for Power BI consumption (Tables: Issues, Sprints, Portfolio)
      return NextResponse.json({
        issues: data.backlog.map(b => ({
          ID: b.id,
          Title: b.title,
          Type: b.type,
          Priority: b.priority,
          Status: b.status,
          Points: b.points,
          Age: b.age
        })),
        sprints: data.sprints.map(s => ({
          Name: s.name,
          Team: s.team,
          Status: s.state,
          Committed: s.committedPts,
          Completed: s.completedPts,
          Predictability: s.sayDo
        })),
        portfolio: {
          Name: data.portfolio.name,
          Predictability: data.portfolio.predictability,
          Teams: data.portfolio.totalTeams,
          DORA: data.portfolio.doraBanding
        }
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to parse CSV data: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    );
  }
}

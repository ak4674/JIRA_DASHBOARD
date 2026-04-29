import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';
import { buildDashboardFromCSV } from '@/lib/csv-parser';

export async function GET() {
  try {
    const base = join(process.cwd(), 'velocita-jira-test-data', 'jira');
    const issuesCSV = readFileSync(join(base, 'velocita-jira-issues.csv'), 'utf-8');
    const sprintsCSV = readFileSync(join(base, 'velocita-sprints.csv'), 'utf-8');
    const teamsCSV = readFileSync(join(base, 'velocita-teams.csv'), 'utf-8');
    const artsCSV = readFileSync(join(base, 'velocita-arts.csv'), 'utf-8');

    const data = buildDashboardFromCSV(issuesCSV, sprintsCSV, teamsCSV, artsCSV);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to parse CSV data: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    );
  }
}

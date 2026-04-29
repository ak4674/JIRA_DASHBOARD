import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { jiraUrl, apiToken, email } = await request.json();

    if (!jiraUrl || !apiToken || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: jiraUrl, email, apiToken' },
        { status: 400 }
      );
    }

    // Clean URL — remove trailing slash
    const baseUrl = jiraUrl.replace(/\/+$/, '');

    // Test the connection by fetching the user's own profile
    const authHeader = Buffer.from(`${email}:${apiToken}`).toString('base64');

    const testResponse = await fetch(`${baseUrl}/rest/api/3/myself`, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
    });

    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      return NextResponse.json(
        { error: `Jira authentication failed (${testResponse.status}): ${errorText}` },
        { status: 401 }
      );
    }

    const userInfo = await testResponse.json();

    // Fetch projects
    const projectsRes = await fetch(`${baseUrl}/rest/api/3/project?maxResults=10`, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
    });

    let projects: { key: string; name: string }[] = [];
    if (projectsRes.ok) {
      const projectsData = await projectsRes.json();
      projects = projectsData.map((p: { key: string; name: string }) => ({
        key: p.key,
        name: p.name,
      }));
    }

    // Fetch active sprints from all boards
    const boardsRes = await fetch(`${baseUrl}/rest/agile/1.0/board?maxResults=5`, {
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: 'application/json',
      },
    });

    let sprints: { id: number; name: string; state: string }[] = [];
    if (boardsRes.ok) {
      const boardsData = await boardsRes.json();
      for (const board of boardsData.values?.slice(0, 3) || []) {
        try {
          const sprintsRes = await fetch(
            `${baseUrl}/rest/agile/1.0/board/${board.id}/sprint?state=active,closed&maxResults=5`,
            {
              headers: {
                Authorization: `Basic ${authHeader}`,
                Accept: 'application/json',
              },
            }
          );
          if (sprintsRes.ok) {
            const sprintData = await sprintsRes.json();
            sprints.push(
              ...(sprintData.values || []).map((s: { id: number; name: string; state: string }) => ({
                id: s.id,
                name: s.name,
                state: s.state,
              }))
            );
          }
        } catch {
          // Skip boards that don't support sprints
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        displayName: userInfo.displayName,
        emailAddress: userInfo.emailAddress,
        accountId: userInfo.accountId,
      },
      projects,
      sprints,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

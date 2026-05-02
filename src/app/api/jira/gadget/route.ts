import { NextRequest, NextResponse } from 'next/server';

/**
 * Serves the Atlassian Gadget Specification XML.
 * This allows the dashboard to be added as a native widget in Jira.
 */
export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<Module>
  <ModulePrefs 
    title="Intelligence Hub Dashboard" 
    description="Live Enterprise Jira & Agile Metrics"
    author="Antigravity AI"
    thumbnail="${baseUrl}/favicon.ico"
    screenshot="${baseUrl}/screenshot.png">
    <Optional feature="dynamic-height"/>
    <Optional feature="auth-refresh"/>
  </ModulePrefs>
  <Content type="html">
    <![CDATA[
      <div id="dashboard-container" style="width:100%; height:800px; overflow:hidden; border-radius:12px;">
        <iframe 
          src="${baseUrl}?view=gadget" 
          width="100%" 
          height="100%" 
          frameborder="0" 
          style="border:none;">
        </iframe>
      </div>
      <script type="text/javascript">
        // Ensure the gadget resizes correctly within Jira
        gadgets.window.adjustHeight(820);
      </script>
    ]]>
  </Content>
</Module>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Access-Control-Allow-Origin': '*', // Required for Jira to fetch the manifest
    },
  });
}

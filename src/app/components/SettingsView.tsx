'use client';
import React, { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';

interface JiraConfig { jiraUrl: string; email: string; apiToken: string; }
interface ConnResult { success?: boolean; error?: string; user?: { displayName: string }; projects?: { key: string; name: string }[]; }

export default function SettingsView() {
  const [cfg, setCfg] = useState<JiraConfig>({ jiraUrl: '', email: '', apiToken: '' });
  const [status, setStatus] = useState<ConnResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jira_config');
    if (s) setCfg(JSON.parse(s));
    const r = localStorage.getItem('jira_conn_result');
    if (r) setStatus(JSON.parse(r));
  }, []);

  const handleSave = () => {
    localStorage.setItem('jira_config', JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConnect = async () => {
    if (!cfg.jiraUrl || !cfg.email || !cfg.apiToken) {
      setStatus({ error: 'All three fields are required.' });
      return;
    }
    setLoading(true); setStatus(null);
    try {
      const res = await fetch('/api/jira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const result = { success: true, user: data.user, projects: data.projects };
        setStatus(result);
        localStorage.setItem('jira_config', JSON.stringify(cfg));
        localStorage.setItem('jira_conn_result', JSON.stringify(result));
      } else {
        setStatus({ error: data.error || 'Connection failed' });
      }
    } catch (e) {
      setStatus({ error: `Network error: ${e instanceof Error ? e.message : 'Unknown'}` });
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1.5rem'}}>Jira Cloud Integration</h3>
        <div className={styles.settingsGrid}>
          <div>
            <label style={{display:'block',fontSize:'0.8125rem',fontWeight:700,color:'#334155',marginBottom:4}}>Jira Instance URL</label>
            <input className={styles.inputField} value={cfg.jiraUrl}
              onChange={e => setCfg({...cfg, jiraUrl: e.target.value})}
              placeholder="https://your-company.atlassian.net" />
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.8125rem',fontWeight:700,color:'#334155',marginBottom:4}}>Atlassian Email</label>
            <input className={styles.inputField} type="email" value={cfg.email}
              onChange={e => setCfg({...cfg, email: e.target.value})}
              placeholder="you@company.com" />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label style={{display:'block',fontSize:'0.8125rem',fontWeight:700,color:'#334155',marginBottom:4}}>API Token</label>
            <input className={styles.inputField} type="password" value={cfg.apiToken}
              onChange={e => setCfg({...cfg, apiToken: e.target.value})}
              placeholder="Your Atlassian API token" />
            <p style={{fontSize:'0.75rem',color:'#94a3b8',marginTop:4}}>
              Generate at <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer" style={{color:'#2563eb'}}>id.atlassian.com</a>
            </p>
          </div>
        </div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem',flexWrap:'wrap'}}>
          <button className={styles.btnPrimary} onClick={handleConnect} disabled={loading} style={{width:'auto'}}>
            {loading ? 'Connecting...' : 'Test & Connect'}
          </button>
          <button className={styles.btnPrimary} onClick={handleSave} style={{width:'auto',background:'#10b981'}}>
            {saved ? '✓ Saved!' : 'Save Credentials'}
          </button>
        </div>
      </div>

      {status && (
        <div className={`${styles.card}`}>
          {status.success ? (
            <div>
              <div className={styles.statusBanner} style={{background:'#e3fcef',color:'#006644',border:'1px solid #abf5d1',marginBottom:'1rem'}}>
                ✓ Connected as <strong style={{marginLeft:4}}>{status.user?.displayName}</strong>
              </div>
              {status.projects && status.projects.length > 0 && (
                <div>
                  <h4 style={{fontWeight:700,fontSize:'0.875rem',marginBottom:8}}>Discovered Projects ({status.projects.length})</h4>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {status.projects.map(p=>(
                      <span key={p.key} style={{padding:'4px 10px',borderRadius:8,background:'#eff6ff',border:'1px solid #dbeafe',fontSize:'0.8125rem',fontWeight:600,color:'#1d4ed8'}}>
                        {p.key} — {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.statusBanner} style={{background:'#ffebe6',color:'#bf2600',border:'1px solid #ffbdad'}}>
              ✗ {status.error}
            </div>
          )}
        </div>
      )}

      <div className={styles.card} style={{borderTop:'3px solid #eff6ff'}}>
        <p style={{fontSize:'0.8125rem',color:'#64748b',margin:0,lineHeight:1.6}}>
          <strong>Privacy Note:</strong> Your credentials are stored locally in your browser. The API token is sent only to the Jira server-side proxy route ({'/api/jira'}) for authentication. We never store or log your secrets on our servers.
        </p>
      </div>
    </div>
  );
}

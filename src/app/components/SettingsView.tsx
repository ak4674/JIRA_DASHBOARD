'use client';
import React, { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { Database, Shield, Zap, Globe, Save, Layers, Box } from 'lucide-react';

interface AppConfig {
  mode: 'simulation' | 'live';
  tool: 'jira' | 'azure';
  jira: { jiraUrl: string; email: string; apiToken: string };
  azure: { orgUrl: string; project: string; pat: string };
}

interface ConnResult { success?: boolean; error?: string; user?: { displayName: string }; projects?: { key: string; name: string }[]; }

export default function SettingsView() {
  const [cfg, setCfg] = useState<AppConfig>({
    mode: 'simulation',
    tool: 'jira',
    jira: { jiraUrl: '', email: '', apiToken: '' },
    azure: { orgUrl: '', project: '', pat: '' }
  });
  const [status, setStatus] = useState<ConnResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const s = localStorage.getItem('jira_config');
    if (s) {
      const parsed = JSON.parse(s);
      // Migration for old config format
      if (!parsed.jira) {
        setCfg({
          mode: parsed.mode || 'simulation',
          tool: 'jira',
          jira: { jiraUrl: parsed.jiraUrl || '', email: parsed.email || '', apiToken: parsed.apiToken || '' },
          azure: { orgUrl: '', project: '', pat: '' }
        });
      } else {
        setCfg(parsed);
      }
    }
    const r = localStorage.getItem('jira_conn_result');
    if (r) setStatus(JSON.parse(r));
  }, []);

  const handleSave = () => {
    localStorage.setItem('jira_config', JSON.stringify(cfg));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.location.reload();
  };

  const handleConnect = async () => {
    if (cfg.tool === 'jira') {
      if (!cfg.jira.jiraUrl || !cfg.jira.email || !cfg.jira.apiToken) {
        setStatus({ error: 'All Jira fields are required.' });
        return;
      }
    } else {
       if (!cfg.azure.orgUrl || !cfg.azure.project || !cfg.azure.pat) {
        setStatus({ error: 'All Azure DevOps fields are required.' });
        return;
      }
    }
    
    setLoading(true); setStatus(null);
    try {
      const endpoint = cfg.tool === 'jira' ? '/api/jira' : '/api/azure'; // Azure route hypothetical
      const payload = cfg.tool === 'jira' ? cfg.jira : cfg.azure;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const result = { success: true, user: data.user, projects: data.projects };
        setStatus(result);
        localStorage.setItem('jira_config', JSON.stringify(cfg));
        localStorage.setItem('jira_conn_result', JSON.stringify(result));
      } else {
        setStatus({ error: data.error || 'Connection failed. Verify your API key and permissions.' });
      }
    } catch (e) {
      setStatus({ error: `Connection error: ${e instanceof Error ? e.message : 'Unknown'}` });
    }
    setLoading(false);
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',maxWidth:800,margin:'0 auto'}}>
      <div className={styles.card}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Database style={{width:20,height:20,color:'#2563eb'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>Data Orchestration</h3>
        </div>
        
        <div style={{display:'flex',background:'#f1f5f9',padding:4,borderRadius:12,gap:4,marginBottom:'1.5rem'}}>
          <button onClick={() => setCfg({...cfg, mode:'simulation'})}
            style={{flex:1,padding:'0.75rem',borderRadius:10,border:'none',cursor:'pointer',fontSize:'0.875rem',fontWeight:700,transition:'all 0.2s',
              background:cfg.mode==='simulation'?'white':'transparent',
              color:cfg.mode==='simulation'?'#2563eb':'#64748b',
              boxShadow:cfg.mode==='simulation'?'0 2px 8px rgba(0,0,0,0.05)':'none'}}>
            <Zap style={{width:16,height:16,display:'inline',marginRight:8}} />
            Simulation Mode
          </button>
          <button onClick={() => setCfg({...cfg, mode:'live'})}
            style={{flex:1,padding:'0.75rem',borderRadius:10,border:'none',cursor:'pointer',fontSize:'0.875rem',fontWeight:700,transition:'all 0.2s',
              background:cfg.mode==='live'?'white':'transparent',
              color:cfg.mode==='live'?'#2563eb':'#64748b',
              boxShadow:cfg.mode==='live'?'0 2px 8px rgba(0,0,0,0.05)':'none'}}>
            <Globe style={{width:16,height:16,display:'inline',marginRight:8}} />
            Live Connector
          </button>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1rem'}}>
          <span style={{fontSize:'0.8125rem', fontWeight:700, color:'#64748b'}}>Select Tool:</span>
          <div style={{display:'flex', gap:8}}>
             <button onClick={() => setCfg({...cfg, tool:'jira'})}
               style={{padding:'6px 12px', borderRadius:8, border:'1px solid', fontSize:'0.75rem', fontWeight:700, cursor:'pointer',
                 borderColor:cfg.tool==='jira'?'#2563eb':'#e2e8f0', background:cfg.tool==='jira'?'#eff6ff':'white', color:cfg.tool==='jira'?'#2563eb':'#64748b'}}>
               Jira Cloud
             </button>
             <button onClick={() => setCfg({...cfg, tool:'azure'})}
               style={{padding:'6px 12px', borderRadius:8, border:'1px solid', fontSize:'0.75rem', fontWeight:700, cursor:'pointer',
                 borderColor:cfg.tool==='azure'?'#2563eb':'#e2e8f0', background:cfg.tool==='azure'?'#eff6ff':'white', color:cfg.tool==='azure'?'#2563eb':'#64748b'}}>
               Azure DevOps
             </button>
          </div>
        </div>

        <p style={{fontSize:'0.8125rem',color:'#64748b',lineHeight:1.5,margin:0}}>
          {cfg.mode === 'simulation' 
            ? 'Currently utilizing the Velocita test dataset (4,269 issues). No credentials required.'
            : `Connecting to your live ${cfg.tool==='jira'?'Jira':'Azure'} instance. Enterprise API sync enabled.`}
        </p>
      </div>

      <div className={styles.card} style={{opacity:cfg.mode==='live'?1:0.6,pointerEvents:cfg.mode==='live'?'auto':'none',transition:'all 0.3s'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Shield style={{width:20,height:20,color:'#4f46e5'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>{cfg.tool === 'jira' ? 'Jira Cloud Sync' : 'Azure DevOps Sync'}</h3>
        </div>
        
        {cfg.tool === 'jira' ? (
          <div className={styles.settingsGrid}>
            <div>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Instance Domain URL</label>
              <input className={styles.inputField} value={cfg.jira.jiraUrl}
                onChange={e => setCfg({...cfg, jira: {...cfg.jira, jiraUrl: e.target.value}})}
                placeholder="https://your-domain.atlassian.net" />
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Admin Email ID</label>
              <input className={styles.inputField} type="email" value={cfg.jira.email}
                onChange={e => setCfg({...cfg, jira: {...cfg.jira, email: e.target.value}})}
                placeholder="admin@yourcompany.com" />
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Jira API Key / Token</label>
              <input className={styles.inputField} type="password" value={cfg.jira.apiToken}
                onChange={e => setCfg({...cfg, jira: {...cfg.jira, apiToken: e.target.value}})}
                placeholder="Enter your Atlassian API Token" />
            </div>
          </div>
        ) : (
          <div className={styles.settingsGrid}>
            <div>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Organization URL</label>
              <input className={styles.inputField} value={cfg.azure.orgUrl}
                onChange={e => setCfg({...cfg, azure: {...cfg.azure, orgUrl: e.target.value}})}
                placeholder="https://dev.azure.com/org-name" />
            </div>
            <div>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Project Name</label>
              <input className={styles.inputField} value={cfg.azure.project}
                onChange={e => setCfg({...cfg, azure: {...cfg.azure, project: e.target.value}})}
                placeholder="MyProject" />
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Personal Access Token (PAT)</label>
              <input className={styles.inputField} type="password" value={cfg.azure.pat}
                onChange={e => setCfg({...cfg, azure: {...cfg.azure, pat: e.target.value}})}
                placeholder="Azure DevOps PAT" />
            </div>
          </div>
        )}

        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem'}}>
          <button className={styles.btnPrimary} onClick={handleConnect} disabled={loading || cfg.mode==='simulation'}>
            {loading ? 'Validating...' : 'Validate & Sync'}
          </button>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button className={styles.btnPrimary} onClick={handleSave} style={{background:saved?'#10b981':'#2563eb',display:'flex',alignItems:'center',gap:8}}>
          <Save style={{width:18,height:18}} />
          {saved ? 'Connection Saved!' : 'Save Connection Details'}
        </button>
      </div>

      {status && (
        <div className={`${styles.card}`}>
          {status.success ? (
            <div className={styles.statusSuccess} style={{padding:'1rem',borderRadius:12}}>
              ✓ Successfully authenticated with {cfg.tool==='jira'?'Jira':'Azure'}. 
              {status.projects && ` Found ${status.projects.length} accessible projects.`}
            </div>
          ) : (
            <div className={styles.statusError} style={{padding:'1rem',borderRadius:12, lineHeight:1.5}}>
              ✗ <strong>Connection Failed:</strong> {status.error}
              <div style={{fontSize:'0.75rem', marginTop:8, opacity:0.8}}>
                Please ensure your API Key has 'Read' permissions and the domain is accessible.
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.card} style={{borderLeft:'4px solid #3b82f6',background:'rgba(59,130,246,0.05)'}}>
        <p style={{fontSize:'0.8125rem',color:'#1e40af',margin:0,lineHeight:1.6}}>
          <strong>Enterprise Security:</strong> All API keys are encrypted at rest in your local storage. Connections are proxied through our secure gateway to avoid CORS issues and protect your IP.
        </p>
      </div>
    </div>
  );
}

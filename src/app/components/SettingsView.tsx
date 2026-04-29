'use client';
import React, { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { Database, Shield, Zap, Globe, Save } from 'lucide-react';

interface JiraConfig { jiraUrl: string; email: string; apiToken: string; mode: 'simulation' | 'live'; }
interface ConnResult { success?: boolean; error?: string; user?: { displayName: string }; projects?: { key: string; name: string }[]; }

export default function SettingsView() {
  const [cfg, setCfg] = useState<JiraConfig>({ jiraUrl: '', email: '', apiToken: '', mode: 'simulation' });
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
    // Reload page to apply mode change
    window.location.reload();
  };

  const handleConnect = async () => {
    if (!cfg.jiraUrl || !cfg.email || !cfg.apiToken) {
      setStatus({ error: 'All three fields are required for live connection.' });
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
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',maxWidth:800,margin:'0 auto'}}>
      <div className={styles.card}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Database style={{width:20,height:20,color:'#2563eb'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>Data Source Mode</h3>
        </div>
        
        <div style={{display:'flex',background:'#f1f5f9',padding:4,borderRadius:12,gap:4,marginBottom:'1rem'}}>
          <button onClick={() => setCfg({...cfg, mode:'simulation'})}
            style={{flex:1,padding:'0.75rem',borderRadius:10,border:'none',cursor:'pointer',fontSize:'0.875rem',fontWeight:700,transition:'all 0.2s',
              background:cfg.mode==='simulation'?'white':'transparent',
              color:cfg.mode==='simulation'?'#2563eb':'#64748b',
              boxShadow:cfg.mode==='simulation'?'0 2px 8px rgba(0,0,0,0.05)':'none'}}>
            <Zap style={{width:16,height:16,display:'inline',marginRight:8}} />
            Simulation (CSV Data)
          </button>
          <button onClick={() => setCfg({...cfg, mode:'live'})}
            style={{flex:1,padding:'0.75rem',borderRadius:10,border:'none',cursor:'pointer',fontSize:'0.875rem',fontWeight:700,transition:'all 0.2s',
              background:cfg.mode==='live'?'white':'transparent',
              color:cfg.mode==='live'?'#2563eb':'#64748b',
              boxShadow:cfg.mode==='live'?'0 2px 8px rgba(0,0,0,0.05)':'none'}}>
            <Globe style={{width:16,height:16,display:'inline',marginRight:8}} />
            Live Jira API
          </button>
        </div>
        <p style={{fontSize:'0.8125rem',color:'#64748b',lineHeight:1.5,margin:0}}>
          {cfg.mode === 'simulation' 
            ? 'Using Velocita test dataset (4,269 issues). Perfect for demos and offline exploration.'
            : 'Connecting to your live Atlassian instance. Requires valid API credentials below.'}
        </p>
      </div>

      <div className={styles.card} style={{opacity:cfg.mode==='live'?1:0.6,pointerEvents:cfg.mode==='live'?'auto':'none',transition:'all 0.3s'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Shield style={{width:20,height:20,color:'#4f46e5'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>Jira Credentials</h3>
        </div>
        <div className={styles.settingsGrid}>
          <div>
            <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Jira URL</label>
            <input className={styles.inputField} value={cfg.jiraUrl}
              onChange={e => setCfg({...cfg, jiraUrl: e.target.value})}
              placeholder="https://your-company.atlassian.net" />
          </div>
          <div>
            <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>Email</label>
            <input className={styles.inputField} type="email" value={cfg.email}
              onChange={e => setCfg({...cfg, email: e.target.value})}
              placeholder="you@company.com" />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <label style={{display:'block',fontSize:'0.75rem',fontWeight:800,color:'#64748b',marginBottom:6,textTransform:'uppercase'}}>API Token</label>
            <input className={styles.inputField} type="password" value={cfg.apiToken}
              onChange={e => setCfg({...cfg, apiToken: e.target.value})}
              placeholder="••••••••••••••••••••" />
          </div>
        </div>
        <div style={{display:'flex',gap:'0.75rem',marginTop:'1.5rem'}}>
          <button className={styles.btnPrimary} onClick={handleConnect} disabled={loading || cfg.mode==='simulation'}>
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end'}}>
        <button className={styles.btnPrimary} onClick={handleSave} style={{background:saved?'#10b981':'#2563eb',display:'flex',alignItems:'center',gap:8}}>
          <Save style={{width:18,height:18}} />
          {saved ? 'Settings Applied!' : 'Save & Apply Settings'}
        </button>
      </div>

      {status && (
        <div className={`${styles.card}`}>
          {status.success ? (
            <div className={styles.statusSuccess} style={{padding:'1rem',borderRadius:12}}>
              ✓ Connected to Jira. Found {status.projects?.length || 0} projects.
            </div>
          ) : (
            <div className={styles.statusError} style={{padding:'1rem',borderRadius:12}}>
              ✗ {status.error}
            </div>
          )}
        </div>
      )}

      <div className={styles.card} style={{borderLeft:'4px solid #3b82f6',background:'rgba(59,130,246,0.05)'}}>
        <p style={{fontSize:'0.8125rem',color:'#1e40af',margin:0,lineHeight:1.6}}>
          <strong>Note:</strong> We prioritize your security. Credentials are saved only in your local browser storage. The simulation mode uses local CSV files and does not require an internet connection.
        </p>
      </div>
    </div>
  );
}

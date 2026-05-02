'use client';
import React, { useState, useEffect } from 'react';
import styles from '../dashboard.module.css';
import { Database, Shield, Zap, Globe, Save, Layers, Box, BarChart, ExternalLink, Copy, Check } from 'lucide-react';

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
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem('jira_config');
    if (s) {
      const parsed = JSON.parse(s);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
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
      const res = await fetch('/api/jira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg.tool === 'jira' ? cfg.jira : cfg.azure),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ success: true, user: data.user, projects: data.projects });
        localStorage.setItem('jira_config', JSON.stringify(cfg));
      } else {
        setStatus({ error: data.error || 'Connection failed.' });
      }
    } catch (e) {
      setStatus({ error: `Error: ${e instanceof Error ? e.message : 'Unknown'}` });
    }
    setLoading(false);
  };

  const powerBiUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/data?format=powerbi&key=${cfg.jira.apiToken.slice(0, 8)}`;
  const gadgetUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/jira/gadget`;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem',maxWidth:800,margin:'0 auto', paddingBottom:'4rem'}}>
      {/* Existing Data Source Section */}
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
      </div>

      {/* Connection Credentials */}
      <div className={styles.card} style={{opacity:cfg.mode==='live'?1:0.6,pointerEvents:cfg.mode==='live'?'auto':'none',transition:'all 0.3s'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <Shield style={{width:20,height:20,color:'#4f46e5'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>Connector Settings</h3>
        </div>
        
        <div style={{display:'flex', gap:8, marginBottom:'1.5rem'}}>
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

        {cfg.tool === 'jira' ? (
          <div className={styles.settingsGrid}>
            <div style={{gridColumn:'1 / -1'}}>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>Jira Domain URL</label>
              <input className={styles.inputField} value={cfg.jira.jiraUrl} onChange={e => setCfg({...cfg, jira:{...cfg.jira, jiraUrl:e.target.value}})} placeholder="https://akyanand.atlassian.net" />
            </div>
            <div>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>Email ID</label>
              <input className={styles.inputField} value={cfg.jira.email} onChange={e => setCfg({...cfg, jira:{...cfg.jira, email:e.target.value}})} placeholder="name@company.com" />
            </div>
            <div>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>API Key / Token</label>
              <input className={styles.inputField} type="password" value={cfg.jira.apiToken} onChange={e => setCfg({...cfg, jira:{...cfg.jira, apiToken:e.target.value}})} placeholder="••••••••" />
            </div>
          </div>
        ) : (
          <div className={styles.settingsGrid}>
            <div style={{gridColumn:'1 / -1'}}>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>Azure Org URL</label>
              <input className={styles.inputField} value={cfg.azure.orgUrl} onChange={e => setCfg({...cfg, azure:{...cfg.azure, orgUrl:e.target.value}})} placeholder="https://dev.azure.com/org" />
            </div>
            <div>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>Project</label>
              <input className={styles.inputField} value={cfg.azure.project} onChange={e => setCfg({...cfg, azure:{...cfg.azure, project:e.target.value}})} placeholder="MyProject" />
            </div>
            <div>
              <label className={styles.kpiLabel} style={{fontSize:10, marginBottom:4, display:'block'}}>PAT Token</label>
              <input className={styles.inputField} type="password" value={cfg.azure.pat} onChange={e => setCfg({...cfg, azure:{...cfg.azure, pat:e.target.value}})} placeholder="••••••••" />
            </div>
          </div>
        )}
        <button className={styles.btnPrimary} style={{marginTop:'1.5rem'}} onClick={handleConnect} disabled={loading}>{loading ? 'Testing...' : 'Test Connection'}</button>
      </div>

      {/* NEW: Power BI & Jira Integration Section */}
      <div className={styles.card} style={{borderLeft:'4px solid #f59e0b', background:'rgba(245,158,11,0.02)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
          <div style={{width:40,height:40,borderRadius:12,background:'#fef3c7',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <BarChart style={{width:20,height:20,color:'#d97706'}} />
          </div>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',margin:0}}>Enterprise Integrations</h3>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
           {/* Power BI */}
           <div style={{padding:'1rem', borderRadius:16, background:'white', border:'1px solid #fcd34d'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                 <div style={{fontWeight:800, fontSize:'0.875rem', color:'#92400e'}}>Power BI Data Feed (OData)</div>
                 <div style={{fontSize:10, fontWeight:800, color:'#d97706', background:'#fef3c7', padding:'2px 8px', borderRadius:6}}>EXPORT ENABLED</div>
              </div>
              <p style={{fontSize:'0.75rem', color:'#64748b', marginBottom:12}}>Use this URL in Power BI "Get Data → Web" to sync your Jira metrics in real-time.</p>
              <div style={{display:'flex', gap:8}}>
                 <input readOnly value={powerBiUrl} className={styles.inputField} style={{background:'#f8fafc', fontSize:'0.7rem', fontFamily:'monospace'}} />
                 <button onClick={() => copyToClipboard(powerBiUrl, 'pbi')} style={{padding:'0 12px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', cursor:'pointer'}}>
                    {copied === 'pbi' ? <Check style={{width:16,color:'#10b981'}} /> : <Copy style={{width:16,color:'#64748b'}} />}
                 </button>
              </div>
           </div>

           {/* Jira Gadget */}
           <div style={{padding:'1rem', borderRadius:16, background:'white', border:'1px solid #93c5fd'}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
                 <div style={{fontWeight:800, fontSize:'0.875rem', color:'#1e40af'}}>Native Jira Dashboard Gadget</div>
                 <div style={{fontSize:10, fontWeight:800, color:'#2563eb', background:'#eff6ff', padding:'2px 8px', borderRadius:6}}>JIRA INTEGRATION</div>
              </div>
              <p style={{fontSize:'0.75rem', color:'#64748b', marginBottom:12}}>Install this dashboard directly into your Jira home. Copy the manifest URL below and add it to "Jira → Dashboards → Manage Gadgets".</p>
              <div style={{display:'flex', gap:8}}>
                 <input readOnly value={gadgetUrl} className={styles.inputField} style={{background:'#f8fafc', fontSize:'0.7rem', fontFamily:'monospace'}} />
                 <button onClick={() => copyToClipboard(gadgetUrl, 'gadget')} style={{padding:'0 12px', borderRadius:10, border:'1px solid #e2e8f0', background:'white', cursor:'pointer'}}>
                    {copied === 'gadget' ? <Check style={{width:16,color:'#10b981'}} /> : <Copy style={{width:16,color:'#64748b'}} />}
                 </button>
              </div>
              <div style={{marginTop:12, display:'flex', gap:12}}>
                 <a href={gadgetUrl} target="_blank" style={{fontSize:10, fontWeight:700, color:'#2563eb', display:'flex', alignItems:'center', gap:4, textDecoration:'none'}}>
                    <ExternalLink style={{width:12}} /> Preview XML Manifest
                 </a>
              </div>
           </div>
        </div>
      </div>

      <div style={{display:'flex',justifyContent:'flex-end', marginTop:'1rem'}}>
        <button className={styles.btnPrimary} onClick={handleSave} style={{background:saved?'#10b981':'#2563eb',display:'flex',alignItems:'center',gap:8, padding:'0.75rem 2rem'}}>
          <Save style={{width:18,height:18}} />
          {saved ? 'Settings Applied!' : 'Save & Sync All Tools'}
        </button>
      </div>

      {status && (
        <div className={styles.card} style={{borderColor:status.success?'#10b981':'#f43f5e'}}>
          <p style={{fontSize:'0.875rem', fontWeight:700, color:status.success?'#059669':'#dc2626', margin:0}}>
            {status.success ? `✓ Successfully connected to ${cfg.tool}. Found ${status.projects?.length} projects.` : `✗ ${status.error}`}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Activity, ShieldCheck, Zap, 
  BarChart3, Settings, LogOut, Link2, RefreshCcw,
  Database, Globe
} from 'lucide-react';
import styles from './dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import ExecutiveSummary from './components/ExecutiveSummary';
import TeamView from './components/TeamView';
import QualityView from './components/QualityView';
import EngineeringView from './components/EngineeringView';
import ARTView from './components/ARTView';
import BacklogView from './components/BacklogView';
import SettingsView from './components/SettingsView';

export default function JiraDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('executive');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [mode, setMode] = useState<'simulation' | 'live'>('simulation');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const configStr = localStorage.getItem('jira_config');
      if (!configStr) {
        // Default to simulation if no config exists
        const res = await fetch('/api/data');
        const d = await res.json();
        setData(d);
        setLoading(false);
        return;
      }

      const config = JSON.parse(configStr);
      const currentMode = config.mode || 'simulation';
      setMode(currentMode);

      let res;
      if (currentMode === 'simulation') {
        res = await fetch('/api/data');
      } else {
        // For live mode, we use POST to securely pass credentials
        res = await fetch('/api/jira/fetch-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(config)
        });
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Invalid response from server: ${text.slice(0, 100)}`);
      }

      const d = await res.json();
      
      if (res.ok) {
        setData(d);
      } else {
        setError(d.error || 'Failed to load data');
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const u = localStorage.getItem('jira_dash_user');
    if (!u) { router.replace('/login'); return; }
    setUser(JSON.parse(u));
    loadData();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('jira_dash_user');
    router.push('/login');
  };

  const tabs = [
    { id: 'executive', label: 'Overview', icon: LayoutDashboard },
    { id: 'art', label: 'ART / Program', icon: Users },
    { id: 'team', label: 'Team Pulse', icon: Activity },
    { id: 'backlog', label: 'Backlog', icon: BarChart3 },
    { id: 'quality', label: 'Quality', icon: ShieldCheck },
    { id: 'engineering', label: 'Engineering', icon: Zap },
    { id: 'dependencies', label: 'Network', icon: Link2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f4f5f7'}}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{textAlign:'center'}}>
          <div className={styles.loader}>
            <div className={styles.loaderCircle} />
          </div>
          <div style={{color:'#1e40af',fontWeight:800,fontSize:'1.25rem',marginTop:'1.5rem'}}>Intelligence Hub</div>
          <div style={{color:'#64748b',fontSize:'0.875rem',marginTop:4}}>Synthesizing {mode === 'simulation' ? '4,269 Velocita issues' : 'Live Jira Data'}...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <main style={{maxWidth:1400,margin:'0 auto'}}>
        <header className={styles.header}>
          <div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={styles.title}>
              {tabs.find(t => t.id === activeTab)?.label}
            </motion.h1>
            <p style={{color:'#64748b',fontSize:'0.875rem',fontWeight:500,marginTop:4,display:'flex',alignItems:'center',gap:6}}>
              <span style={{color:'#2563eb',fontWeight:700}}>{data?.portfolio.name || 'Jira Hub'}</span>
              <span style={{color:'#cbd5e1'}}>•</span>
              <span>PI 26.2</span>
              <span style={{color:'#cbd5e1'}}>•</span>
              <span>{data?.portfolio.totalTeams} Teams</span>
            </p>
          </div>
          
          <div className={styles.headerActions}>
            <div style={{padding:'4px',background:'rgba(255,255,255,0.6)',borderRadius:14,border:'1px solid rgba(226,232,240,0.8)',display:'flex',gap:4}}>
              <div style={{padding:'6px 12px',borderRadius:10,display:'flex',alignItems:'center',gap:8,background:'white',boxShadow:'0 2px 8px rgba(0,0,0,0.05)'}}>
                {mode === 'simulation' ? <Database style={{width:14,height:14,color:'#2563eb'}} /> : <Globe style={{width:14,height:14,color:'#10b981'}} />}
                <span style={{fontSize:'0.75rem',fontWeight:700,color:'#334155'}}>
                  {mode === 'simulation' ? 'Simulation' : `${localStorage.getItem('jira_config') ? JSON.parse(localStorage.getItem('jira_config')!).tool === 'azure' ? 'Azure DevOps' : 'Jira Cloud' : 'Live'}`}
                </span>
              </div>
              <button onClick={loadData} title="Refresh Data" style={{background:'none',border:'none',padding:'6px 10px',cursor:'pointer',color:'#64748b'}}>
                <RefreshCcw style={{width:16,height:16}} />
              </button>
            </div>

            {user && (
              <div style={{padding:'0.5rem 1rem',background:'rgba(255,255,255,0.6)',borderRadius:14,border:'1px solid rgba(226,232,240,0.8)',display:'flex',alignItems:'center',gap:10}}>
                <div style={{width:30,height:30,borderRadius:10,background:'linear-gradient(135deg,#6366f1,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:800,fontSize:14,boxShadow:'0 4px 12px rgba(37,99,235,0.2)'}}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div style={{display:'flex',flexDirection:'column'}}>
                  <span style={{fontSize:'0.8125rem',fontWeight:700,color:'#1e293b'}}>{user.name}</span>
                  <span style={{fontSize:'0.6875rem',color:'#64748b',fontWeight:500}}>Lead Engineer</span>
                </div>
                <button onClick={logout} style={{background:'none',border:'none',cursor:'pointer',padding:4,color:'#94a3b8',marginLeft:4}}>
                  <LogOut style={{width:18,height:18}} />
                </button>
              </div>
            )}
          </div>
        </header>

        <div className={styles.tabScroller}>
          <div className={styles.tabBar}>
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}>
                <tab.icon style={{width:18,height:18}} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{padding:'1rem',borderRadius:16,background:'#ffebe6',color:'#bf2600',border:'1px solid #ffbdad',marginBottom:'1.5rem',fontWeight:600,fontSize:'0.875rem'}}>
            Error loading data: {error}. {mode === 'live' && 'Please check your Jira credentials in Settings.'}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            {data && activeTab === 'executive' && <ExecutiveSummary data={data} />}
            {data && activeTab === 'art' && <ARTView data={data} />}
            {data && activeTab === 'team' && <TeamView data={data} />}
            {data && activeTab === 'backlog' && <BacklogView data={data} />}
            {data && activeTab === 'quality' && <QualityView data={data} />}
            {data && activeTab === 'engineering' && <EngineeringView data={data} />}
            {data && activeTab === 'dependencies' && <DependenciesView data={data} />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        .loader {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          position: relative;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }
        .loaderCircle {
          width: 40px;
          height: 40px;
          border: 4px solid #f1f5f9;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function DependenciesView({ data }: { data: DashboardData }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Total Linkages</div>
          <div className={styles.kpiValue}>{data.dependencies.length}</div>
          <div className={styles.badgeSuccess} style={{fontSize:10,padding:'2px 8px',borderRadius:4,display:'inline'}}>Active Network</div>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Resolved</div>
          <div className={styles.kpiValue}>{data.dependencies.filter(d=>d.status==='Done').length}</div>
          <div style={{fontSize:11,color:'#64748b',fontWeight:600}}>Blocking issues cleared</div>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Critical Path</div>
          <div className={styles.kpiValue} style={{color:'#f43f5e'}}>{data.dependencies.filter(d=>d.priority==='Highest').length}</div>
          <div className={styles.badgeDanger} style={{fontSize:10,padding:'2px 8px',borderRadius:4,display:'inline'}}>High Attention</div>
        </div>
      </div>
      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <Link2 style={{width:20,height:20,color:'#2563eb'}} /> Cross-Team Dependency Matrix
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Reference</th><th>Dependency Name</th><th>Producer Team</th><th>Consumer Team</th><th>Impact</th><th>Status</th></tr></thead>
            <tbody>
              {data.dependencies.map(d=>(
                <tr key={d.id}>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{d.id}</td>
                  <td style={{fontWeight:600,maxWidth:250,whiteSpace:'normal'}}>{d.title}</td>
                  <td><span style={{fontWeight:600,color:'#334155'}}>{d.from}</span></td>
                  <td><span style={{fontWeight:600,color:'#334155'}}>{d.to}</span></td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:800,padding:'4px 10px',borderRadius:6,
                    background:d.priority==='Highest'?'#ffebe6':d.priority==='High'?'#fffae6':'#eff6ff',
                    color:d.priority==='Highest'?'#bf2600':d.priority==='High'?'#825c00':'#1d4ed8'}}>{d.priority}</span></td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:800,padding:'4px 10px',borderRadius:9999,
                    background:d.status==='In Progress'?'#eff6ff':d.status==='To Do'?'#ffebe6':'#e3fcef',
                    color:d.status==='In Progress'?'#1d4ed8':d.status==='To Do'?'#bf2600':'#006644'}}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

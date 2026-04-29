'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Activity, ShieldCheck, Zap, BarChart3, Settings, LogOut } from 'lucide-react';
import styles from './dashboard.module.css';
import { generateMockData } from '@/lib/jira-mock';
import { JiraData } from '@/lib/jira-types';
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
  const [data, setData] = useState<JiraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const u = localStorage.getItem('jira_dash_user');
    if (!u) { router.replace('/login'); return; }
    setUser(JSON.parse(u));
    setTimeout(() => { setData(generateMockData()); setLoading(false); }, 800);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('jira_dash_user');
    router.push('/login');
  };

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: LayoutDashboard },
    { id: 'art', label: 'ART / Program', icon: Users },
    { id: 'team', label: 'Team View', icon: Activity },
    { id: 'backlog', label: 'Backlog Health', icon: BarChart3 },
    { id: 'quality', label: 'Quality Intelligence', icon: ShieldCheck },
    { id: 'engineering', label: 'Engineering Excellence', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f4f5f7'}}>
        <div style={{textAlign:'center'}}>
          <div style={{width:48,height:48,background:'#2563eb',borderRadius:'50%',margin:'0 auto 1rem',animation:'pulse 2s infinite'}} />
          <div style={{color:'#2563eb',fontWeight:700}}>Syncing Jira Intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <main>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p style={{color:'#64748b',fontSize:'0.875rem',marginTop:4}}>
              Portfolio: {data?.portfolio.name} • FY26 Q2
            </p>
          </div>
          <div className={styles.headerActions}>
            <div style={{padding:'0.5rem 1rem',background:'white',borderRadius:12,border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:8,height:8,background:'#22c55e',borderRadius:'50%'}} />
              <span style={{fontSize:'0.8125rem',fontWeight:500}}>Jira Cloud Connected</span>
            </div>
            {user && (
              <div style={{padding:'0.5rem 1rem',background:'white',borderRadius:12,border:'1px solid #e2e8f0',display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#6366f1,#2563eb)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:12}}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{fontSize:'0.8125rem',fontWeight:600}}>{user.name}</span>
                <button onClick={logout} title="Logout" style={{background:'none',border:'none',cursor:'pointer',padding:2,display:'flex'}}>
                  <LogOut style={{width:16,height:16,color:'#94a3b8'}} />
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
                <tab.icon style={{width:16,height:16}} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {activeTab === 'executive' && <ExecutiveSummary data={data!} />}
            {activeTab === 'art' && <ARTView data={data!} />}
            {activeTab === 'team' && <TeamView data={data!} />}
            {activeTab === 'backlog' && <BacklogView />}
            {activeTab === 'quality' && <QualityView data={data!} />}
            {activeTab === 'engineering' && <EngineeringView data={data!} />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

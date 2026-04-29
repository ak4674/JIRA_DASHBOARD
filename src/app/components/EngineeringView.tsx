'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import { JiraData } from '@/lib/jira-types';
import { ShieldCheck, Activity } from 'lucide-react';

export default function EngineeringView({ data }: { data: JiraData }) {
  const m = data.doraMetrics;
  const cards = [
    {label:'Deploy Freq',value:`${m.deploymentFrequency}/wk`,sub:'Daily avg: 1.7',c:'#2563eb'},
    {label:'Lead Time',value:`${m.leadTimeForChanges}d`,sub:'P95: 3.2d',c:'#6366f1'},
    {label:'Change Failure',value:`${m.changeFailureRate}%`,sub:'Target: <15%',c:'#f43f5e'},
    {label:'Time To Restore',value:`${m.timeToRestore}h`,sub:'MTTR Incident',c:'#f59e0b'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.gridFour}>
        {cards.map((c,i)=>(
          <div key={i} className={styles.card}>
            <div style={{fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>{c.label}</div>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:c.c}}>{c.value}</div>
            <div style={{fontSize:10,color:'#64748b',fontWeight:500,marginTop:4}}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className={styles.gridTwo}>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <ShieldCheck style={{width:20,height:20,color:'#10b981'}} /> Tech Debt &amp; Vulnerabilities
          </h3>
          <div style={{marginBottom:'1rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.875rem',marginBottom:4}}>
              <span style={{fontWeight:600}}>Code Coverage</span>
              <span style={{fontWeight:700,color:'#10b981'}}>78%</span>
            </div>
            <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
              <div style={{background:'#10b981',height:'100%',width:'78%'}} />
            </div>
          </div>
          <div style={{display:'flex',gap:'1rem'}}>
            <div style={{flex:1,padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase'}}>Critical Vulns</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#f43f5e'}}>2</div>
            </div>
            <div style={{flex:1,padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
              <div style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase'}}>Tech Debt %</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#f59e0b'}}>14%</div>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Activity style={{width:20,height:20,color:'#2563eb'}} /> Deployment Success Rate
          </h3>
          <div className={styles.chartPlaceholder}>
            <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontWeight:500,fontStyle:'italic'}}>
              98.2% Success Rate • 45 Deployments this month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

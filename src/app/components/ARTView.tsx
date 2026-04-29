'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import { JiraData } from '@/lib/jira-types';
import { Users, Target } from 'lucide-react';

export default function ARTView({ data }: { data: JiraData }) {
  const teams = data.teams;
  const piObjectives = [
    {id:'PO-1',title:'Platform Migration to K8s',status:'On Track',pct:72,team:'Apollo'},
    {id:'PO-2',title:'Auth Service v2 Rollout',status:'At Risk',pct:45,team:'Hermes'},
    {id:'PO-3',title:'Data Pipeline Refactor',status:'On Track',pct:88,team:'Zeus'},
    {id:'PO-4',title:'Mobile App MVP',status:'Done',pct:100,team:'Apollo'},
    {id:'PO-5',title:'CI/CD Pipeline Hardening',status:'On Track',pct:65,team:'Zeus'},
  ];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Total Teams</div>
          <div className={styles.kpiValue}>{teams.length}</div>
          <span style={{fontSize:'0.75rem',color:'#64748b'}}>{teams.reduce((a,t)=>a+t.size,0)} members across ART</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>PI Objectives</div>
          <div className={styles.kpiValue}>{piObjectives.length}</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>{piObjectives.filter(o=>o.status==='Done').length} completed</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Avg Say:Do Ratio</div>
          <div className={styles.kpiValue}>{Math.round((data.sprints[0].sayDoRatio+data.sprints[1].sayDoRatio)/2)}%</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>Healthy</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <Target style={{width:20,height:20,color:'#2563eb'}} /> PI Objectives Tracker
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>Objective</th><th>Team</th><th>Status</th><th>Progress</th></tr></thead>
            <tbody>
              {piObjectives.map(o=>(
                <tr key={o.id}>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{o.id}</td>
                  <td style={{fontWeight:600}}>{o.title}</td>
                  <td>{o.team}</td>
                  <td>
                    <span style={{
                      display:'inline-flex',padding:'2px 8px',borderRadius:9999,fontSize:'0.6875rem',fontWeight:700,
                      background:o.status==='Done'?'#e3fcef':o.status==='At Risk'?'#ffebe6':'#eff6ff',
                      color:o.status==='Done'?'#006644':o.status==='At Risk'?'#bf2600':'#1d4ed8',
                    }}>{o.status}</span>
                  </td>
                  <td style={{minWidth:120}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,height:6,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                        <div style={{height:'100%',borderRadius:9999,width:`${o.pct}%`,background:o.pct===100?'#10b981':o.pct>=60?'#3b82f6':'#f59e0b'}} />
                      </div>
                      <span style={{fontSize:'0.75rem',fontWeight:700,color:'#334155',minWidth:32}}>{o.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <Users style={{width:20,height:20,color:'#2563eb'}} /> Team Capacity Overview
        </h3>
        <div className={styles.gridTwo} style={{marginTop:0}}>
          {teams.map(t=>(
            <div key={t.id} style={{padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
              <div style={{fontWeight:700,fontSize:'1rem',marginBottom:4}}>{t.name}</div>
              <div style={{fontSize:'0.8125rem',color:'#64748b'}}>{t.size} members</div>
              <div style={{marginTop:8,height:6,background:'#e2e8f0',borderRadius:9999,overflow:'hidden'}}>
                <div style={{height:'100%',background:'#3b82f6',width:`${Math.min(100,t.size*12)}%`,borderRadius:9999}} />
              </div>
              <div style={{fontSize:'0.6875rem',color:'#94a3b8',marginTop:4}}>Utilization: {Math.min(100,t.size*12)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

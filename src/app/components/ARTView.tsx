'use client';
import React, { useState } from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { Users, Target } from 'lucide-react';

export default function ARTView({ data }: { data: DashboardData }) {
  const [selArt, setSelArt] = useState('All');
  const artList = ['All', ...data.arts.map(a => a.name)];
  const filteredObjectives = selArt === 'All' ? data.piObjectives : data.piObjectives.filter(o => o.art === selArt);
  const filteredTeams = selArt === 'All' ? data.teams : data.teams.filter(t => t.art === selArt);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card} style={{padding:'0.75rem'}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {artList.map(a=>(
            <button key={a} onClick={()=>setSelArt(a)}
              style={{padding:'6px 14px',borderRadius:10,border:'1px solid',fontSize:'0.8125rem',fontWeight:600,cursor:'pointer',
                borderColor:selArt===a?'#2563eb':'#e2e8f0',
                background:selArt===a?'#2563eb':'white',
                color:selArt===a?'white':'#334155'}}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Teams</div>
          <div className={styles.kpiValue}>{filteredTeams.length}</div>
          <span style={{fontSize:'0.75rem',color:'#64748b'}}>{filteredTeams.reduce((a,t)=>a+t.capacity,0)} capacity pts</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>PI Objectives</div>
          <div className={styles.kpiValue}>{filteredObjectives.length}</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>{filteredObjectives.filter(o=>o.status==='Done').length} completed</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>At Risk</div>
          <div className={styles.kpiValue} style={{color:'#f43f5e'}}>{filteredObjectives.filter(o=>o.status==='At Risk').length}</div>
          <span className={`${styles.badge} ${styles.badgeWarning}`}>Need attention</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <Target style={{width:20,height:20,color:'#2563eb'}} /> PI Objectives ({filteredObjectives.length})
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>Objective</th><th>Team</th><th>ART</th><th>Status</th><th>Progress</th></tr></thead>
            <tbody>
              {filteredObjectives.map(o=>(
                <tr key={o.id}>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{o.id}</td>
                  <td style={{fontWeight:600,maxWidth:200,overflow:'hidden',textOverflow:'ellipsis'}}>{o.title}</td>
                  <td>{o.team}</td>
                  <td style={{fontSize:'0.75rem'}}>{o.art}</td>
                  <td><span style={{display:'inline-flex',padding:'2px 8px',borderRadius:9999,fontSize:'0.6875rem',fontWeight:700,
                    background:o.status==='Done'?'#e3fcef':o.status==='At Risk'?'#ffebe6':'#eff6ff',
                    color:o.status==='Done'?'#006644':o.status==='At Risk'?'#bf2600':'#1d4ed8'}}>{o.status}</span></td>
                  <td style={{minWidth:120}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{flex:1,height:6,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                        <div style={{height:'100%',borderRadius:9999,width:`${o.pct}%`,background:o.pct===100?'#10b981':o.pct>=50?'#3b82f6':'#f59e0b'}} />
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
          <Users style={{width:20,height:20,color:'#2563eb'}} /> Team Capacity
        </h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'0.75rem'}}>
          {filteredTeams.map(t=>{
            const teamSprints = data.sprints.filter(s=>s.team===t.name&&s.state==='Closed');
            const avgVel = teamSprints.length>0?Math.round(teamSprints.reduce((s,sp)=>s+sp.completedPts,0)/teamSprints.length):0;
            const util = t.capacity>0?Math.round(avgVel/t.capacity*100):0;
            return (
              <div key={t.name} style={{padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
                <div style={{fontWeight:700,fontSize:'0.875rem'}}>{t.name}</div>
                <div style={{fontSize:'0.75rem',color:'#64748b'}}>{t.art} • {t.lead}</div>
                <div style={{marginTop:8,height:6,background:'#e2e8f0',borderRadius:9999,overflow:'hidden'}}>
                  <div style={{height:'100%',background:util>90?'#f43f5e':util>70?'#f59e0b':'#3b82f6',width:`${Math.min(100,util)}%`,borderRadius:9999}} />
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                  <span style={{fontSize:'0.6875rem',color:'#94a3b8'}}>Avg vel: {avgVel}</span>
                  <span style={{fontSize:'0.6875rem',color:'#94a3b8'}}>Cap: {t.capacity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

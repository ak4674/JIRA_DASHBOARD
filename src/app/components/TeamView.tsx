'use client';
import React, { useState } from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { Activity, Clock } from 'lucide-react';

export default function TeamView({ data }: { data: DashboardData }) {
  const [selTeam, setSelTeam] = useState(data.teams[0]?.name || '');
  const teamSprints = data.sprints.filter(s => s.team === selTeam);
  const activeSprint = teamSprints.find(s => s.state === 'Active');
  const closedSprints = teamSprints.filter(s => s.state === 'Closed');
  const teamInfo = data.teams.find(t => t.name === selTeam);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card} style={{padding:'0.75rem'}}>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {data.teams.map(t=>(
            <button key={t.name} onClick={()=>setSelTeam(t.name)}
              style={{padding:'6px 14px',borderRadius:10,border:'1px solid',fontSize:'0.8125rem',fontWeight:600,cursor:'pointer',
                borderColor:selTeam===t.name?'#2563eb':'#e2e8f0',
                background:selTeam===t.name?'#2563eb':'white',
                color:selTeam===t.name?'white':'#334155'}}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {activeSprint && (
        <div className={styles.sprintHeader}>
          <div>
            <h2 style={{fontSize:'1.25rem',fontWeight:700,margin:0}}>{selTeam} • {activeSprint.name}</h2>
            <p style={{color:'#64748b',fontSize:'0.875rem',margin:'4px 0 0'}}>{activeSprint.start} → {activeSprint.end} | ART: {teamInfo?.art}</p>
            <p style={{color:'#2563eb',fontSize:'0.8125rem',margin:'4px 0 0',fontWeight:600}}>Goal: {activeSprint.goal}</p>
          </div>
          <div className={styles.sprintStats}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Committed</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#334155'}}>{activeSprint.committedPts} pts</div>
            </div>
            <div className={styles.statDivider} />
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Completed</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#2563eb'}}>{activeSprint.completedPts} pts</div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.gridTwo}>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Activity style={{width:20,height:20,color:'#2563eb'}} /> Sprint History (Say:Do %)
          </h3>
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:140,padding:'0 0.5rem'}}>
            {closedSprints.map((s,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <span style={{fontSize:11,fontWeight:700,color:s.sayDo>=80?'#10b981':s.sayDo>=60?'#f59e0b':'#f43f5e'}}>{s.sayDo}%</span>
                <div style={{width:'100%',borderRadius:'6px 6px 0 0',height:`${Math.max(10,s.sayDo*1.2)}px`,background:s.sayDo>=80?'linear-gradient(180deg,#10b981,#059669)':s.sayDo>=60?'linear-gradient(180deg,#f59e0b,#d97706)':'linear-gradient(180deg,#f43f5e,#dc2626)'}} />
                <span style={{fontSize:9,color:'#94a3b8',whiteSpace:'nowrap'}}>S{s.name.match(/\d+$/)?.[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Clock style={{width:20,height:20,color:'#2563eb'}} /> Sprint Velocity (Points)
          </h3>
          <div style={{display:'flex',alignItems:'flex-end',gap:8,height:140,padding:'0 0.5rem'}}>
            {closedSprints.map((s,i)=>(
              <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <span style={{fontSize:10,fontWeight:700,color:'#6366f1'}}>{s.completedPts}</span>
                <div style={{width:'100%',borderRadius:'6px 6px 0 0',height:`${Math.max(10,s.completedPts*2)}px`,background:'linear-gradient(180deg,#6366f1,#4f46e5)'}} />
                <span style={{fontSize:9,color:'#94a3b8'}}>S{s.name.match(/\d+$/)?.[0]}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop:'1rem',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
            <div style={{padding:'0.75rem',borderRadius:12,background:'#eff6ff',border:'1px solid #dbeafe'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#1d4ed8',textTransform:'uppercase'}}>Avg Velocity</div>
              <div style={{fontSize:'1.25rem',fontWeight:700,color:'#1e3a5f'}}>{closedSprints.length>0?Math.round(closedSprints.reduce((s,sp)=>s+sp.completedPts,0)/closedSprints.length):0} pts</div>
            </div>
            <div style={{padding:'0.75rem',borderRadius:12,background:'#eef2ff',border:'1px solid #e0e7ff'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#4338ca',textTransform:'uppercase'}}>Capacity</div>
              <div style={{fontSize:'1.25rem',fontWeight:700,color:'#312e81'}}>{teamInfo?.capacity || 0} pts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

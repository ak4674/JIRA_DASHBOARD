'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import { JiraData } from '@/lib/jira-types';
import { Activity, Clock } from 'lucide-react';

export default function TeamView({ data }: { data: JiraData }) {
  const sprint = data.sprints[1];
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.sprintHeader}>
        <div>
          <h2 style={{fontSize:'1.25rem',fontWeight:700,margin:0}}>Team Apollo • {sprint.name}</h2>
          <p style={{color:'#64748b',fontSize:'0.875rem',margin:'4px 0 0'}}>Active: {sprint.startDate} — {sprint.endDate}</p>
        </div>
        <div className={styles.sprintStats}>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Risk Score</div>
            <div style={{fontSize:'1.5rem',fontWeight:700,color:'#f59e0b'}}>{sprint.riskScore}</div>
          </div>
          <div className={styles.statDivider} />
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>Say:Do Ratio</div>
            <div style={{fontSize:'1.5rem',fontWeight:700,color:'#2563eb'}}>{sprint.sayDoRatio}%</div>
          </div>
        </div>
      </div>
      <div className={styles.gridTwo}>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Activity style={{width:20,height:20,color:'#2563eb'}} /> Sprint Burndown
          </h3>
          <div className={styles.chartPlaceholder}>
            <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontWeight:500,fontStyle:'italic'}}>
              Ideal vs Actual burn... (Points: {sprint.completedPoints} / {sprint.committedPoints})
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Clock style={{width:20,height:20,color:'#2563eb'}} /> Flow Metrics (Rolling 30d)
          </h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div style={{padding:'1rem',borderRadius:16,background:'#eff6ff',border:'1px solid #dbeafe'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#1d4ed8',textTransform:'uppercase'}}>Cycle Time</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1e3a5f'}}>{data.flowMetrics.time}d</div>
            </div>
            <div style={{padding:'1rem',borderRadius:16,background:'#eef2ff',border:'1px solid #e0e7ff'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#4338ca',textTransform:'uppercase'}}>Flow Efficiency</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#312e81'}}>{data.flowMetrics.efficiency}%</div>
            </div>
          </div>
          <div style={{marginTop:'1rem',padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <span style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b',textTransform:'uppercase'}}>WIP (Flow Load)</span>
              <span style={{fontSize:'0.75rem',fontWeight:700,color:'#2563eb'}}>8 / 12 Limit</span>
            </div>
            <div style={{width:'100%',height:8,background:'#e2e8f0',borderRadius:9999,overflow:'hidden'}}>
              <div style={{background:'#2563eb',height:'100%',width:'66.7%'}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

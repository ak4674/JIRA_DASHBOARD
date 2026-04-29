'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';

export default function ExecutiveSummary({ data }: { data: DashboardData }) {
  const activeRisks = data.risks.filter(r => r.status !== 'Resolved');
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Portfolio Predictability</div>
            <Target style={{width:20,height:20,color:'#3b82f6'}} />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.predictability}%</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>Avg Say:Do across {data.sprints.filter(s=>s.state==='Closed').length} sprints</span>
        </div>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>DORA Banding</div>
            <Zap style={{width:20,height:20,color:'#f59e0b'}} />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.doraBanding}</div>
          <span style={{fontSize:'0.75rem',fontWeight:600,color:'#64748b'}}>CFR: {data.dora.changeFailureRate}% • Deploy: {data.dora.deployFrequency}/wk</span>
        </div>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Defect Escape Rate</div>
            <AlertTriangle style={{width:20,height:20,color:'#f43f5e'}} />
          </div>
          <div className={styles.kpiValue}>{data.quality.totalDefects > 0 ? Math.round(data.quality.escapedDefects / data.quality.totalDefects * 100) : 0}%</div>
          <span className={`${styles.badge} ${styles.badgeDanger}`}>{data.quality.escapedDefects} escaped of {data.quality.totalDefects}</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
              <TrendingUp style={{width:20,height:20,color:'#2563eb'}} /> Flow Velocity (Items Resolved / Week)
            </h3>
            <div style={{display:'flex',alignItems:'flex-end',gap:6,height:120,padding:'0 0.5rem'}}>
              {data.flowMetrics.velocity.map((v,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2}}>
                  <span style={{fontSize:10,fontWeight:700,color:'#2563eb'}}>{v.value}</span>
                  <div style={{width:'100%',background:'linear-gradient(180deg,#3b82f6,#6366f1)',borderRadius:'4px 4px 0 0',height:`${Math.max(8,v.value*1.2)}px`}} />
                  <span style={{fontSize:8,color:'#94a3b8',whiteSpace:'nowrap'}}>{v.week.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
              <AlertTriangle style={{width:20,height:20,color:'#e11d48'}} /> Active ROAM Risks ({activeRisks.length})
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',maxHeight:220,overflowY:'auto'}}>
              {activeRisks.slice(0,8).map((risk,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem',borderRadius:12,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0}}>
                    <div style={{width:8,height:8,borderRadius:'50%',flexShrink:0,background:risk.severity==='Highest'?'#f43f5e':risk.severity==='High'?'#f59e0b':'#3b82f6'}} />
                    <span style={{fontSize:'0.8125rem',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{risk.title}</span>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,background:'white',border:'1px solid #e2e8f0',color:'#64748b',flexShrink:0,marginLeft:8}}>{risk.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Investment Mix</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {Object.entries(data.flowMetrics.distribution).map(([key,val])=>(
                <div key={key}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',fontWeight:700,marginBottom:4,textTransform:'uppercase',color:'#64748b'}}>
                    <span>{key}</span><span>{val}%</span>
                  </div>
                  <div style={{width:'100%',background:'#f1f5f9',height:8,borderRadius:9999,overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:9999,width:`${val}%`,background:key==='features'?'#3b82f6':key==='defects'?'#f43f5e':key==='risks'?'#f59e0b':'#6366f1'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Portfolio Summary</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[{l:'Total Issues',v:data.portfolio.totalIssues,c:'#2563eb'},
                {l:'Done',v:data.portfolio.doneCount,c:'#10b981'},
                {l:'Open Defects',v:data.quality.openDefects,c:'#f43f5e'},
                {l:'MTTR',v:`${data.quality.mttrHours || 0}h`,c:'#f59e0b'}
              ].map((m,i)=>(
                <div key={i} style={{padding:'1rem',borderRadius:16,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
                  <div style={{fontSize:10,fontWeight:700,color:'#94a3b8',textTransform:'uppercase'}}>{m.l}</div>
                  <div style={{fontSize:'1.5rem',fontWeight:700,color:m.c}}>{typeof m.v==='number'?m.v.toLocaleString():m.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

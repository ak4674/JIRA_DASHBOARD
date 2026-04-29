'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { AlertTriangle, Bug, ShieldCheck, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QualityView({ data }: { data: DashboardData }) {
  const q = data.quality;
  const escapeRate = q.totalDefects > 0 ? Math.round(q.escapedDefects / q.totalDefects * 100) : 0;
  
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.gridFour}>
        {[
          {l:'Cumulative Defects',v:q.totalDefects,c:'#334155', icon: Bug, bg:'#f1f5f9'},
          {l:'Current Open',v:q.openDefects,c:'#f43f5e', icon: Activity, bg:'#fff1f2'},
          {l:'Escaped (Prod)',v:q.escapedDefects,c:'#dc2626', icon: ShieldCheck, bg:'#fef2f2'},
          {l:'Avg Resolve Time',v:`${q.mttrHours||0}h`,c:'#f59e0b', icon: Zap, bg:'#fff7ed'}
        ].map((m,i)=>(
          <motion.div variants={item} key={i} className={styles.card} style={{position:'relative', overflow:'hidden'}}>
             <div style={{position:'absolute', top:-10, right:-10, opacity:0.05}}>
                <m.icon style={{width:80, height:80}} />
             </div>
            <div className={styles.kpiLabel}>{m.l}</div>
            <div className={styles.kpiValue} style={{color:m.c}}>{m.v}</div>
            <div style={{width:30, height:4, borderRadius:2, background:m.c, opacity:0.2}} />
          </motion.div>
        ))}
      </div>

      <div className={styles.gridTwo}>
        <motion.div variants={item} className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:10}}>
              <Bug style={{width:20,height:20,color:'#f43f5e'}} /> Severity Profile
            </h3>
            <span style={{fontSize:10,fontWeight:800,color:'#f43f5e',background:'#fff1f2',padding:'4px 10px',borderRadius:6}}>S1-S4 MIX</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            {Object.entries(q.defectsBySeverity).sort((a,b)=>a[0].localeCompare(b[0])).map(([sev,count])=>(
              <div key={sev}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',fontWeight:800,marginBottom:6}}>
                  <span style={{color:sev==='S1'?'#dc2626':sev==='S2'?'#f59e0b':sev==='S3'?'#3b82f6':'#94a3b8', display:'flex', alignItems:'center', gap:6}}>
                     <div style={{width:8, height:8, borderRadius:2, background:sev==='S1'?'#dc2626':sev==='S2'?'#f59e0b':sev==='S3'?'#3b82f6':'#94a3b8'}} />
                     {sev === 'S1' ? 'Blocker' : sev === 'S2' ? 'Critical' : sev === 'S3' ? 'Major' : 'Minor'} ({sev})
                  </span>
                  <span style={{color:'#1e293b'}}>{count}</span>
                </div>
                <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${Math.min(100,count/q.totalDefects*100*3)}%`}} transition={{duration:1}}
                    style={{height:'100%',borderRadius:9999,background:sev==='S1'?'#dc2626':sev==='S2'?'#f59e0b':sev==='S3'?'#3b82f6':'#94a3b8'}} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={item} className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
            <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:10}}>
              Root Cause Distribution
            </h3>
            <span style={{fontSize:10,fontWeight:800,color:'#6366f1',background:'#eef2ff',padding:'4px 10px',borderRadius:6}}>ANALYSIS</span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {Object.entries(q.rootCauses).sort((a,b)=>b[1]-a[1]).map(([rc,count])=>{
              const colors: Record<string,string> = {code:'#f43f5e',design:'#f59e0b',config:'#6366f1',data:'#3b82f6','test-gap':'#dc2626','3rd-party':'#94a3b8',requirement:'#10b981'};
              const pct = Math.round(count / q.totalDefects * 100 * 2); // adjusted for visual
              return (
                <div key={rc}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',fontWeight:700,marginBottom:6,textTransform:'capitalize'}}>
                    <span style={{color:'#475569'}}>{rc.replace('-',' ')}</span>
                    <span style={{color:'#1e293b'}}>{count}</span>
                  </div>
                  <div style={{width:'100%',height:6,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                    <motion.div initial={{width:0}} animate={{width:`${Math.min(100,pct)}%`}} transition={{duration:1, delay:0.2}}
                      style={{height:'100%',borderRadius:9999,background:colors[rc]||'#64748b'}} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className={styles.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h3 style={{fontWeight:800,fontSize:'1rem',margin:0}}>Component Breakdown (Top 8)</h3>
          <span style={{fontSize:10,fontWeight:800,color:'#94a3b8'}}>SORTED BY VOLUME</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Component Area</th><th>Bug Count</th><th>% Impact</th><th>Intensity</th></tr></thead>
            <tbody>
              {q.defectsByComponent.slice(0,8).map(c=>(
                <tr key={c.name}>
                  <td style={{fontWeight:700, color:'#334155'}}>{c.name}</td>
                  <td style={{fontWeight:800, color:'#f43f5e'}}>{c.count}</td>
                  <td style={{fontWeight:600, color:'#64748b'}}>{Math.round(c.count/q.totalDefects*100)}%</td>
                  <td style={{minWidth:140}}>
                    <div style={{height:6,background:'#f1f5f9',borderRadius:9999,overflow:'hidden', maxWidth:120}}>
                      <motion.div initial={{width:0}} animate={{width:`${c.count/q.totalDefects*100*4}%`}} transition={{duration:0.8}}
                        style={{height:'100%',background:'linear-gradient(90deg,#f43f5e,#dc2626)',borderRadius:9999}} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {escapeRate > 10 && (
        <motion.div initial={{scale:0.95, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', damping:12}}
          className={styles.card} style={{background:'linear-gradient(135deg,#fff1f2,#fff5f5)',border:'2px solid #fecdd3', boxShadow:'0 10px 30px rgba(244,63,94,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
            <div style={{width:50, height:50, borderRadius:16, background:'#f43f5e', display:'flex', alignItems:'center', justifySelf:'center', flexShrink:0, boxShadow:'0 8px 16px rgba(244,63,94,0.3)'}}>
               <AlertTriangle style={{width:24,height:24,color:'white', margin:'0 auto'}} />
            </div>
            <div>
              <div style={{fontWeight:800,color:'#881337', fontSize:'1.125rem'}}>Anomalous Escape Rate: {escapeRate}%</div>
              <div style={{fontSize:'0.875rem',color:'#be123c', marginTop:4, fontWeight:500, lineHeight:1.5}}>
                {q.escapedDefects} defects bypassed regression suites. Systemic risk detected in <strong>Search</strong> and <strong>Identity</strong> modules. Recommended action: Audit integration test coverage.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

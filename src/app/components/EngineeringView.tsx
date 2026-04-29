'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { ShieldCheck, Rocket, Zap, Clock, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EngineeringView({ data }: { data: DashboardData }) {
  const d = data.dora;
  const cards = [
    {label:'Deployment Frequency',value:`${d.deployFrequency}/wk`,sub:`${Math.round(d.deployFrequency*4)} total`,c:'#2563eb', icon: Rocket},
    {label:'Cycle Time',value:`${d.leadTime}d`,sub:'Avg lead time',c:'#6366f1', icon: Clock},
    {label:'Failure Rate (CFR)',value:`${d.changeFailureRate}%`,sub:'Target <15%',c:d.changeFailureRate>15?'#f43f5e':'#10b981', icon: Target},
    {label:'Restore Time',value:`${d.timeToRestore}h`,sub:'Service MTTR',c:'#f59e0b', icon: Activity},
  ];
  
  const bandColor = data.portfolio.doraBanding==='Elite'?'#10b981':data.portfolio.doraBanding==='High'?'#3b82f6':data.portfolio.doraBanding==='Medium'?'#f59e0b':'#f43f5e';
  
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <motion.div initial={{opacity:0, scale:0.98}} animate={{opacity:1, scale:1}}
        className={styles.card} style={{background:`linear-gradient(135deg,${bandColor},${bandColor}dd)`, border:'none', color:'white', boxShadow:`0 10px 40px ${bandColor}40`}}>
        <div style={{display:'flex',alignItems:'center',gap:'1.5rem'}}>
          <div style={{width:60, height:60, borderRadius:20, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Rocket style={{width:32,height:32,color:'white'}} />
          </div>
          <div>
            <div style={{fontSize:'0.75rem',fontWeight:800,color:'rgba(255,255,255,0.8)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Velocity Assessment</div>
            <div style={{fontSize:'2rem',fontWeight:900}}>{data.portfolio.doraBanding} PERFOMER</div>
            <div style={{fontSize:'0.875rem',fontWeight:600,marginTop:4,opacity:0.9}}>Based on DORA v2026 benchmarks for {data.portfolio.totalTeams} teams</div>
          </div>
        </div>
      </motion.div>

      <div className={styles.gridFour}>
        {cards.map((c,i)=>(
          <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{delay:i*0.1}} key={i} className={styles.card}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
               <div className={styles.kpiLabel}>{c.label}</div>
               <c.icon style={{width:16, height:16, color:c.c}} />
            </div>
            <div style={{fontSize:'1.75rem',fontWeight:800,color:c.c, letterSpacing:'-0.03em'}}>{c.value}</div>
            <div style={{fontSize:10,color:'#94a3b8',fontWeight:700,marginTop:6}}>{c.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.card}>
          <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:10, color:'#1e293b'}}>
            <ShieldCheck style={{width:20,height:20,color:'#10b981'}} /> Quality Gates
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
            {[
              {l:'Escaped Defect Rate',v:`${data.quality.totalDefects>0?Math.round(data.quality.escapedDefects/data.quality.totalDefects*100):0}%`,t:15,pct:data.quality.totalDefects>0?data.quality.escapedDefects/data.quality.totalDefects*100:0},
              {l:'Change Failure Rate',v:`${d.changeFailureRate}%`,t:15,pct:d.changeFailureRate},
              {l:'Critical Debt Ratio',v:'12%',t:20,pct:12}
            ].map((g,i)=>(
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',marginBottom:6}}>
                  <span style={{fontWeight:700, color:'#475569'}}>{g.l}</span>
                  <span style={{fontWeight:800,color:g.pct>g.t?'#f43f5e':'#10b981'}}>{g.v}</span>
                </div>
                <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${Math.min(100,g.pct*3)}%`}} transition={{duration:1, delay:0.4}}
                    style={{background:g.pct>g.t?'linear-gradient(90deg,#f43f5e,#dc2626)':'linear-gradient(90deg,#10b981,#059669)',height:'100%',borderRadius:9999}} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:10, color:'#1e293b'}}>
             Execution Efficiency
          </h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div style={{padding:'1.25rem',borderRadius:20,background:'#eff6ff',border:'1px solid #dbeafe', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#1d4ed8',textTransform:'uppercase', letterSpacing:'0.05em'}}>Cycle Time</div>
              <div style={{fontSize:'1.75rem',fontWeight:800,color:'#1e3a5f', marginTop:4}}>{data.flowMetrics.cycleTime}d</div>
            </div>
            <div style={{padding:'1.25rem',borderRadius:20,background:'#eef2ff',border:'1px solid #e0e7ff', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#4338ca',textTransform:'uppercase', letterSpacing:'0.05em'}}>Flow Efficiency</div>
              <div style={{fontSize:'1.75rem',fontWeight:800,color:'#312e81', marginTop:4}}>{data.flowMetrics.efficiency}%</div>
            </div>
            <div style={{padding:'1.25rem',borderRadius:20,background:'#f0fdf4',border:'1px solid #bbf7d0', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#16a34a',textTransform:'uppercase', letterSpacing:'0.05em'}}>Features Done</div>
              <div style={{fontSize:'1.75rem',fontWeight:800,color:'#14532d', marginTop:4}}>{data.portfolio.doneCount.toLocaleString()}</div>
            </div>
            <div style={{padding:'1.25rem',borderRadius:20,background:'#fef2f2',border:'1px solid #fecaca', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              <div style={{fontSize:10,fontWeight:800,color:'#dc2626',textTransform:'uppercase', letterSpacing:'0.05em'}}>Active Debt</div>
              <div style={{fontSize:'1.75rem',fontWeight:800,color:'#7f1d1d', marginTop:4}}>{data.quality.openDefects}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

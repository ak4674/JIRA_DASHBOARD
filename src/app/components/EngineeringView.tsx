'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { ShieldCheck, Rocket } from 'lucide-react';

export default function EngineeringView({ data }: { data: DashboardData }) {
  const d = data.dora;
  const cards = [
    {label:'Deploy Frequency',value:`${d.deployFrequency}/wk`,sub:`Total: ${Math.round(d.deployFrequency*4)} in period`,c:'#2563eb'},
    {label:'Lead Time',value:`${d.leadTime}d`,sub:'Median created → resolved',c:'#6366f1'},
    {label:'Change Failure Rate',value:`${d.changeFailureRate}%`,sub:'Target: <15%',c:d.changeFailureRate>15?'#f43f5e':'#10b981'},
    {label:'MTTR (Incidents)',value:`${d.timeToRestore}h`,sub:'Avg time to restore service',c:'#f59e0b'},
  ];
  const bandColor = data.portfolio.doraBanding==='Elite'?'#10b981':data.portfolio.doraBanding==='High'?'#3b82f6':data.portfolio.doraBanding==='Medium'?'#f59e0b':'#f43f5e';
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card} style={{background:`linear-gradient(135deg,${bandColor}15,${bandColor}08)`,border:`1px solid ${bandColor}30`}}>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <Rocket style={{width:32,height:32,color:bandColor}} />
          <div>
            <div style={{fontSize:'0.75rem',fontWeight:700,color:bandColor,textTransform:'uppercase',letterSpacing:'0.05em'}}>DORA Performance Band</div>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:bandColor}}>{data.portfolio.doraBanding}</div>
          </div>
        </div>
      </div>

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
            <ShieldCheck style={{width:20,height:20,color:'#10b981'}} /> Quality Gate
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
            {[{l:'Defect Escape Rate',v:`${data.quality.totalDefects>0?Math.round(data.quality.escapedDefects/data.quality.totalDefects*100):0}%`,t:15,pct:data.quality.totalDefects>0?data.quality.escapedDefects/data.quality.totalDefects*100:0},
              {l:'Change Failure Rate',v:`${d.changeFailureRate}%`,t:15,pct:d.changeFailureRate},
              {l:'Open Critical Defects',v:`${data.quality.defectsBySeverity['S1']||0}`,t:5,pct:((data.quality.defectsBySeverity['S1']||0)/Math.max(1,data.quality.totalDefects))*100*5}
            ].map((g,i)=>(
              <div key={i}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',marginBottom:4}}>
                  <span style={{fontWeight:600}}>{g.l}</span>
                  <span style={{fontWeight:700,color:g.pct>g.t?'#f43f5e':'#10b981'}}>{g.v}</span>
                </div>
                <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                  <div style={{background:g.pct>g.t?'#f43f5e':'#10b981',height:'100%',width:`${Math.min(100,g.pct*3)}%`,borderRadius:9999}} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Flow Metrics</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div style={{padding:'1rem',borderRadius:16,background:'#eff6ff',border:'1px solid #dbeafe'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#1d4ed8',textTransform:'uppercase'}}>Cycle Time</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#1e3a5f'}}>{data.flowMetrics.cycleTime}d</div>
            </div>
            <div style={{padding:'1rem',borderRadius:16,background:'#eef2ff',border:'1px solid #e0e7ff'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#4338ca',textTransform:'uppercase'}}>Flow Efficiency</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#312e81'}}>{data.flowMetrics.efficiency}%</div>
            </div>
            <div style={{padding:'1rem',borderRadius:16,background:'#f0fdf4',border:'1px solid #bbf7d0'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#16a34a',textTransform:'uppercase'}}>Items Done</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#14532d'}}>{data.portfolio.doneCount}</div>
            </div>
            <div style={{padding:'1rem',borderRadius:16,background:'#fef2f2',border:'1px solid #fecaca'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#dc2626',textTransform:'uppercase'}}>Open Bugs</div>
              <div style={{fontSize:'1.5rem',fontWeight:700,color:'#7f1d1d'}}>{data.quality.openDefects}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

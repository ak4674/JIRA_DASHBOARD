'use client';
import React, { useState } from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { Users, Target, ChevronRight, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ARTView({ data }: { data: DashboardData }) {
  const [selArt, setSelArt] = useState('All');
  const artList = ['All', ...data.arts.map(a => a.name)];
  const filteredObjectives = selArt === 'All' ? data.piObjectives : data.piObjectives.filter(o => o.art === selArt);
  const filteredTeams = selArt === 'All' ? data.teams : data.teams.filter(t => t.art === selArt);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card} style={{padding:'0.75rem', background:'rgba(255,255,255,0.4)'}}>
        <div style={{display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none'}} className="hide-scrollbar">
          {artList.map(a=>(
            <button key={a} onClick={()=>setSelArt(a)}
              style={{padding:'8px 16px',borderRadius:12,border:'1px solid',fontSize:'0.75rem',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s',
                borderColor:selArt===a?'#2563eb':'transparent',
                background:selArt===a?'#2563eb':'white',
                color:selArt===a?'white':'#64748b',
                boxShadow:selArt===a?'0 4px 12px rgba(37,99,235,0.2)':'none'}}>
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card} style={{borderTop:'4px solid #3b82f6'}}>
          <div className={styles.kpiLabel}>Deployed Capacity</div>
          <div className={styles.kpiValue}>{filteredTeams.length} <span style={{fontSize:'1rem', color:'#94a3b8'}}>Teams</span></div>
          <div style={{fontSize:'0.75rem',color:'#64748b', fontWeight:600}}>{filteredTeams.reduce((a,t)=>a+t.capacity,0)} available points</div>
        </div>
        <div className={styles.card} style={{borderTop:'4px solid #10b981'}}>
          <div className={styles.kpiLabel}>Objective Delivery</div>
          <div className={styles.kpiValue}>{filteredObjectives.length} <span style={{fontSize:'1rem', color:'#94a3b8'}}>Goals</span></div>
          <div className={styles.badgeSuccess} style={{fontSize:10, padding:'2px 8px', borderRadius:4}}>{filteredObjectives.filter(o=>o.status==='Done').length} fully resolved</div>
        </div>
        <div className={styles.card} style={{borderTop:'4px solid #f43f5e'}}>
          <div className={styles.kpiLabel}>Operational Risk</div>
          <div className={styles.kpiValue} style={{color:'#f43f5e'}}>{filteredObjectives.filter(o=>o.status==='At Risk').length} <span style={{fontSize:'1rem', color:'#94a3b8'}}>Issues</span></div>
          <div className={styles.badgeDanger} style={{fontSize:10, padding:'2px 8px', borderRadius:4}}>Action required</div>
        </div>
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className={styles.card}>
        <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:10, color:'#1e293b'}}>
          <Target style={{width:20,height:20,color:'#2563eb'}} /> PI Roadmap Objectives
        </h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>Commitment</th><th>Owner</th><th>Status</th><th>Execution</th></tr></thead>
            <tbody>
              {filteredObjectives.map(o=>(
                <tr key={o.id}>
                  <td style={{fontWeight:800,color:'#2563eb'}}>{o.id}</td>
                  <td style={{fontWeight:700,maxWidth:250, whiteSpace:'normal', color:'#334155'}}>{o.title}</td>
                  <td style={{fontSize:'0.8125rem', color:'#64748b', fontWeight:600}}>{o.team} <br/><span style={{fontSize:10}}>{o.art}</span></td>
                  <td><span style={{display:'inline-flex',padding:'4px 10px',borderRadius:8,fontSize:'0.6875rem',fontWeight:800,
                    background:o.status==='Done'?'#e3fcef':o.status==='At Risk'?'#ffebe6':'#eff6ff',
                    color:o.status==='Done'?'#006644':o.status==='At Risk'?'#bf2600':'#1d4ed8'}}>{o.status}</span></td>
                  <td style={{minWidth:140}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{flex:1,height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                        <motion.div initial={{width:0}} animate={{width:`${o.pct}%`}} transition={{duration:1}}
                          style={{height:'100%',borderRadius:9999,background:o.pct===100?'#10b981':o.pct>=50?'#3b82f6':'#f59e0b'}} />
                      </div>
                      <span style={{fontSize:'0.75rem',fontWeight:800,color:'#1e293b',minWidth:32}}>{o.pct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className={styles.card}>
        <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.5rem',display:'flex',alignItems:'center',gap:10, color:'#1e293b'}}>
          <Users style={{width:20,height:20,color:'#2563eb'}} /> Resource Utilization
        </h3>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:'1rem'}}>
          {filteredTeams.map(t=>{
            const teamSprints = data.sprints.filter(s=>s.team===t.name&&s.state==='Closed');
            const avgVel = teamSprints.length>0?Math.round(teamSprints.reduce((s,sp)=>s+sp.completedPts,0)/teamSprints.length):0;
            const util = t.capacity>0?Math.round(avgVel/t.capacity*100):0;
            return (
              <div key={t.name} style={{padding:'1.25rem',borderRadius:20,background:'rgba(248,250,252,0.5)',border:'1px solid #f1f5f9', position:'relative'}}>
                <div style={{fontWeight:800,fontSize:'0.875rem', color:'#1e293b'}}>{t.name}</div>
                <div style={{fontSize:'0.6875rem',color:'#94a3b8', fontWeight:700, textTransform:'uppercase', marginTop:2}}>{t.art}</div>
                
                <div style={{marginTop:16,height:8,background:'#e2e8f0',borderRadius:9999,overflow:'hidden'}}>
                  <motion.div initial={{width:0}} animate={{width:`${Math.min(100,util)}%`}} transition={{duration:1, delay:0.4}}
                    style={{height:'100%',background:util>90?'linear-gradient(90deg,#f43f5e,#dc2626)':util>70?'linear-gradient(90deg,#f59e0b,#d97706)':'linear-gradient(90deg,#3b82f6,#2563eb)',width:`${Math.min(100,util)}%`,borderRadius:9999}} />
                </div>
                
                <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                   <div style={{display:'flex', flexDirection:'column'}}>
                      <span style={{fontSize:9,fontWeight:700,color:'#94a3b8'}}>AVG VEL</span>
                      <span style={{fontSize:12,fontWeight:800,color:'#334155'}}>{avgVel} pts</span>
                   </div>
                   <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                      <span style={{fontSize:9,fontWeight:700,color:'#94a3b8'}}>CAPACITY</span>
                      <span style={{fontSize:12,fontWeight:800,color:'#334155'}}>{t.capacity} pts</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

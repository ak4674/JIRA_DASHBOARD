'use client';
import React, { useState } from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { Activity, Clock, User, ChevronRight, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamView({ data }: { data: DashboardData }) {
  const [selTeam, setSelTeam] = useState(data.teams[0]?.name || '');
  const teamSprints = data.sprints.filter(s => s.team === selTeam);
  const activeSprint = teamSprints.find(s => s.state === 'Active');
  const closedSprints = teamSprints.filter(s => s.state === 'Closed').slice(-6);
  const teamInfo = data.teams.find(t => t.name === selTeam);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.card} style={{padding:'0.75rem',background:'rgba(255,255,255,0.4)',backdropFilter:'blur(4px)'}}>
        <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:4,scrollbarWidth:'none'}} className="hide-scrollbar">
          {data.teams.map(t=>(
            <button key={t.name} onClick={()=>setSelTeam(t.name)}
              style={{padding:'8px 16px',borderRadius:12,border:'1px solid',fontSize:'0.75rem',fontWeight:700,cursor:'pointer',whiteSpace:'nowrap',transition:'all 0.2s',
                borderColor:selTeam===t.name?'#2563eb':'transparent',
                background:selTeam===t.name?'#2563eb':'white',
                color:selTeam===t.name?'white':'#64748b',
                boxShadow:selTeam===t.name?'0 4px 12px rgba(37,99,235,0.2)':'none'}}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={selTeam} initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}} transition={{duration:0.2}}>
          {activeSprint && (
            <div className={styles.sprintHeader} style={{marginBottom:'1.5rem',borderLeft:'6px solid #2563eb'}}>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <span style={{fontSize:'0.625rem',fontWeight:800,background:'#eff6ff',color:'#2563eb',padding:'2px 8px',borderRadius:4,textTransform:'uppercase'}}>Active Sprint</span>
                  <span style={{fontSize:'0.625rem',fontWeight:800,background:'#f8fafc',color:'#64748b',padding:'2px 8px',borderRadius:4,textTransform:'uppercase'}}>{teamInfo?.art}</span>
                </div>
                <h2 style={{fontSize:'1.5rem',fontWeight:800,margin:0,color:'#1e293b'}}>{activeSprint.name}</h2>
                <div style={{display:'flex',alignItems:'center',gap:12,marginTop:8}}>
                   <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.8125rem',color:'#64748b',fontWeight:600}}>
                    <Clock style={{width:14,height:14}} /> {activeSprint.end}
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:4,fontSize:'0.8125rem',color:'#64748b',fontWeight:600}}>
                    <User style={{width:14,height:14}} /> {teamInfo?.lead}
                  </div>
                </div>
                <p style={{color:'#2563eb',fontSize:'0.8125rem',marginTop:12,fontWeight:700,background:'rgba(37,99,235,0.05)',padding:'8px 12px',borderRadius:8,display:'inline-block'}}>
                  Goal: {activeSprint.goal}
                </p>
              </div>
              <div className={styles.sprintStats} style={{minWidth:240}}>
                <div style={{flex:1,textAlign:'center'}}>
                  <div className={styles.kpiLabel} style={{fontSize:10}}>Committed</div>
                  <div style={{fontSize:'1.75rem',fontWeight:800,color:'#334155'}}>{activeSprint.committedPts}</div>
                </div>
                <div className={styles.statDivider} />
                <div style={{flex:1,textAlign:'center'}}>
                  <div className={styles.kpiLabel} style={{fontSize:10}}>Completed</div>
                  <div style={{fontSize:'1.75rem',fontWeight:800,color:'#2563eb'}}>{activeSprint.completedPts}</div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.gridTwo}>
            <div className={styles.card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:8}}>
                  <TrendingUp style={{width:18,height:18,color:'#2563eb'}} /> Reliability Trend (Say:Do)
                </h3>
                <span style={{fontSize:10,fontWeight:800,color:'#10b981'}}>STABLE</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:12,height:140,padding:'0 0.5rem'}}>
                {closedSprints.map((s,i)=>(
                  <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                    <div style={{position:'relative',width:'100%',display:'flex',justifyContent:'center'}}>
                      <motion.div initial={{height:0}} animate={{height:s.sayDo}} transition={{delay:0.2+i*0.1}}
                        style={{width:'100%',maxWidth:32,borderRadius:'4px 4px 2px 2px',background:s.sayDo>=80?'linear-gradient(180deg,#10b981,#059669)':s.sayDo>=60?'linear-gradient(180deg,#f59e0b,#d97706)':'linear-gradient(180deg,#f43f5e,#dc2626)'}} />
                    </div>
                    <span style={{fontSize:10,fontWeight:800,color:'#334155'}}>{s.sayDo}%</span>
                    <span style={{fontSize:9,fontWeight:700,color:'#94a3b8',whiteSpace:'nowrap'}}>S{s.name.match(/\d+$/)?.[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:8}}>
                  <Activity style={{width:18,height:18,color:'#6366f1'}} /> Throughput (Points)
                </h3>
                <span style={{fontSize:10,fontWeight:800,color:'#6366f1'}}>+12% vs PI avg</span>
              </div>
              <div style={{display:'flex',alignItems:'flex-end',gap:12,height:140,padding:'0 0.5rem'}}>
                {(() => {
                  const maxPts = Math.max(...closedSprints.map(s => s.completedPts), 1);
                  return closedSprints.map((s,i)=>(
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6,height:'100%',justifyContent:'flex-end'}}>
                      <motion.div initial={{height:0}} animate={{height:`${(s.completedPts / maxPts) * 100}%`}} transition={{delay:0.2+i*0.1}}
                        style={{width:'100%',maxWidth:32,borderRadius:'4px 4px 2px 2px',background:'linear-gradient(180deg,#6366f1,#4f46e5)',boxShadow:'0 4px 10px rgba(99,102,241,0.2)',minHeight:4}} />
                      <span style={{fontSize:10,fontWeight:800,color:'#334155'}}>{s.completedPts}</span>
                      <span style={{fontSize:9,fontWeight:700,color:'#94a3b8'}}>S{s.name.match(/\d+$/)?.[0]}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:'1.5rem',marginTop:'1.5rem'}}>
            <div className={styles.card} style={{display:'flex',alignItems:'center',gap:20,padding:'1.5rem'}}>
              <div style={{width:60,height:60,borderRadius:20,background:'#eff6ff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <TrendingUp style={{width:28,height:28,color:'#2563eb'}} />
              </div>
              <div>
                <div className={styles.kpiLabel}>Average Velocity</div>
                <div style={{fontSize:'1.75rem',fontWeight:800,color:'#1e293b'}}>
                  {closedSprints.length>0?Math.round(closedSprints.reduce((s,sp)=>s+sp.completedPts,0)/closedSprints.length):0} <span style={{fontSize:'1rem',color:'#94a3b8'}}>pts/sprint</span>
                </div>
              </div>
            </div>
            <div className={styles.card} style={{display:'flex',alignItems:'center',gap:20,padding:'1.5rem'}}>
              <div style={{width:60,height:60,borderRadius:20,background:'#eef2ff',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Zap style={{width:28,height:28,color:'#4f46e5'}} />
              </div>
              <div>
                <div className={styles.kpiLabel}>Current Capacity</div>
                <div style={{fontSize:'1.75rem',fontWeight:800,color:'#1e293b'}}>
                  {teamInfo?.capacity || 0} <span style={{fontSize:'1rem',color:'#94a3b8'}}>pts available</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { AlertTriangle, TrendingUp, Target, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExecutiveSummary({ data }: { data: DashboardData }) {
  const activeRisks = data.risks.filter(r => r.status !== 'Resolved');
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
      <div className={styles.grid}>
        <motion.div variants={item} className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Portfolio Predictability</div>
            <div style={{padding:6,borderRadius:8,background:'#eff6ff'}}><Target style={{width:16,height:16,color:'#2563eb'}} /></div>
          </div>
          <div className={styles.kpiValue}>{data.portfolio.predictability}%</div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
            <span style={{color:'#10b981',display:'flex',alignItems:'center',fontSize:'0.75rem',fontWeight:700}}><ArrowUpRight style={{width:14,height:14}} /> +2.4%</span>
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'#94a3b8'}}>from last PI</span>
          </div>
        </motion.div>

        <motion.div variants={item} className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Engineering Health</div>
            <div style={{padding:6,borderRadius:8,background:'#fef2f2'}}><Zap style={{width:16,height:16,color:'#ef4444'}} /></div>
          </div>
          <div className={styles.kpiValue}>{data.portfolio.doraBanding}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
            <div style={{display:'flex',gap:2}}>
              {[1,2,3,4].map(i=>(
                <div key={i} style={{width:12,height:4,borderRadius:2,background:i<=(data.portfolio.doraBanding==='Elite'?4:data.portfolio.doraBanding==='High'?3:2)?'#ef4444':'#e2e8f0'}} />
              ))}
            </div>
            <span style={{fontSize:'0.75rem',fontWeight:700,color:'#64748b'}}>Level 3 / 4</span>
          </div>
        </motion.div>

        <motion.div variants={item} className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Quality Governance</div>
            <div style={{padding:6,borderRadius:8,background:'#fff7ed'}}><ShieldCheck style={{width:16,height:16,color:'#f97316'}} /></div>
          </div>
          <div className={styles.kpiValue}>{data.quality.totalDefects > 0 ? Math.round(data.quality.escapedDefects / data.quality.totalDefects * 100) : 0}%</div>
          <div style={{display:'flex',alignItems:'center',gap:6,marginTop:4}}>
            <span style={{color:'#f43f5e',display:'flex',alignItems:'center',fontSize:'0.75rem',fontWeight:700}}><ArrowDownRight style={{width:14,height:14}} /> -1.2%</span>
            <span style={{fontSize:'0.75rem',fontWeight:600,color:'#94a3b8'}}>Escaped defect rate</span>
          </div>
        </motion.div>
      </div>

      <div className={styles.mainGrid}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <motion.div variants={item} className={styles.card}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
              <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:10,color:'#1e293b'}}>
                <TrendingUp style={{width:20,height:20,color:'#2563eb'}} /> Delivery Momentum
              </h3>
              <span style={{fontSize:'0.6875rem',fontWeight:800,color:'#2563eb',background:'#eff6ff',padding:'4px 8px',borderRadius:6}}>LAST 8 WEEKS</span>
            </div>
            <div style={{display:'flex',alignItems:'flex-end',gap:12,height:160,padding:'0 0.5rem'}}>
              {data.flowMetrics.velocity.map((v,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
                  <div style={{position:'relative',width:'100%',display:'flex',flexDirection:'column',alignItems:'center'}}>
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: Math.max(12, v.value * 0.2) }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      style={{width:'100%',maxWidth:40,background:'linear-gradient(180deg,#3b82f6,#6366f1)',borderRadius:'6px 6px 2px 2px',boxShadow:'0 4px 12px rgba(37,99,235,0.15)'}} />
                    <span style={{fontSize:10,fontWeight:800,color:'#1e293b',marginTop:4}}>{v.value}</span>
                  </div>
                  <span style={{fontSize:9,fontWeight:700,color:'#94a3b8',whiteSpace:'nowrap',transform:'rotate(-45deg)',marginTop:8}}>{v.week.slice(5)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className={styles.card}>
            <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.25rem',display:'flex',alignItems:'center',gap:10,color:'#1e293b'}}>
              <AlertTriangle style={{width:20,height:20,color:'#e11d48'}} /> High Priority Risks ({activeRisks.filter(r=>r.severity==='Highest').length})
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {activeRisks.slice(0,5).map((risk,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem',borderRadius:16,background:'rgba(248,250,252,0.5)',border:'1px solid #f1f5f9',transition:'all 0.2s'}} 
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#f1f5f9'}>
                  <div style={{display:'flex',alignItems:'center',gap:12,flex:1,minWidth:0}}>
                    <div style={{width:10,height:10,borderRadius:'50%',flexShrink:0,background:risk.severity==='Highest'?'#f43f5e':risk.severity==='High'?'#f59e0b':'#3b82f6',boxShadow:`0 0 10px ${risk.severity==='Highest'?'rgba(244,63,94,0.3)':'transparent'}`}} />
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <span style={{fontSize:'0.8125rem',fontWeight:700,color:'#334155',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{risk.title}</span>
                      <span style={{fontSize:'0.6875rem',color:'#94a3b8',fontWeight:500}}>{risk.art} • {risk.status}</span>
                    </div>
                  </div>
                  <button style={{background:'white',border:'1px solid #e2e8f0',borderRadius:8,padding:4,color:'#94a3b8'}}>
                    <ArrowUpRight style={{width:14,height:14}} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <motion.div variants={item} className={styles.card}>
            <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.5rem',color:'#1e293b'}}>Portfolio Mix</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
              {Object.entries(data.flowMetrics.distribution).map(([key,val])=>(
                <div key={key}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',fontWeight:800,marginBottom:6,textTransform:'uppercase',color:'#64748b'}}>
                    <span style={{display:'flex',alignItems:'center',gap:6}}>
                      <div style={{width:6,height:6,borderRadius:'50%',background:key==='features'?'#3b82f6':key==='defects'?'#f43f5e':key==='risks'?'#f59e0b':'#6366f1'}} />
                      {key}
                    </span>
                    <span>{val}%</span>
                  </div>
                  <div style={{width:'100%',background:'#f1f5f9',height:8,borderRadius:9999,overflow:'hidden'}}>
                    <motion.div 
                      initial={{ width: 0 }} animate={{ width: `${val}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{height:'100%',borderRadius:9999,background:key==='features'?'#3b82f6':key==='defects'?'#f43f5e':key==='risks'?'#f59e0b':'#6366f1'}} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div variants={item} className={styles.card} style={{background:'linear-gradient(135deg,#1e293b,#0f172a)',color:'white'}}>
            <h3 style={{fontWeight:800,fontSize:'1rem',marginBottom:'1.25rem',color:'rgba(255,255,255,0.9)'}}>Global Pulse</h3>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
              {[
                {l:'Total Issues',v:data.portfolio.totalIssues.toLocaleString(),c:'#3b82f6'},
                {l:'Done Count',v:data.portfolio.doneCount.toLocaleString(),c:'#10b981'},
                {l:'Open Defects',v:data.quality.openDefects,c:'#f43f5e'},
                {l:'MTTR (avg)',v:`${data.quality.mttrHours || 0}h`,c:'#f59e0b'}
              ].map((m,i)=>(
                <div key={i} style={{padding:'1rem',borderRadius:16,background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}>
                  <div style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.l}</div>
                  <div style={{fontSize:'1.25rem',fontWeight:800,color:m.c,marginTop:4}}>{m.v}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function ShieldCheck({ style, ...props }: any) {
  return <ShieldCheckIcon style={style} {...props} />;
}
import { ShieldCheck as ShieldCheckIcon } from 'lucide-react';

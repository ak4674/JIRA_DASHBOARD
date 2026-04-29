'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { BarChart3, Clock, CheckCircle, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BacklogView({ data }: { data: DashboardData }) {
  const items = data.backlog;
  const totalItems = items.length;
  const sized = items.filter(b => b.points !== null);
  const sizedPct = totalItems > 0 ? Math.round(sized.length / totalItems * 100) : 0;
  const readyPct = totalItems > 0 ? Math.round(items.filter(b => b.status === 'Ready').length / totalItems * 100) : 0;
  const oversized = items.filter(b => (b.points || 0) > 8).length;

  const agingBuckets = {'0-7d':0,'8-30d':0,'31-90d':0,'90d+':0};
  items.forEach(b => {
    if (b.age <= 7) agingBuckets['0-7d']++;
    else if (b.age <= 30) agingBuckets['8-30d']++;
    else if (b.age <= 90) agingBuckets['31-90d']++;
    else agingBuckets['90d+']++;
  });

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.gridFour}>
        {[
          {l:'Backlog Depth',v:totalItems,c:'#334155', icon: BarChart3},
          {l:'Estimation Coverage',v:`${sizedPct}%`,c:'#2563eb', icon: CheckCircle},
          {l:'Readiness Rate',v:`${readyPct}%`,c:'#10b981', icon: CheckCircle},
          {l:'Risk (Oversized)',v:oversized,c:'#f59e0b', icon: AlertOctagon}
        ].map((m,i)=>(
          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} transition={{delay:i*0.1}} key={i} className={styles.card}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
               <div className={styles.kpiLabel}>{m.l}</div>
               <m.icon style={{width:16, height:16, color:m.c}} />
            </div>
            <div style={{fontSize:'2rem',fontWeight:800,color:m.c}}>{m.v}</div>
            <div style={{width:40, height:4, borderRadius:2, background:m.c, opacity:0.1, marginTop:8}} />
          </motion.div>
        ))}
      </div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className={styles.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
          <h3 style={{fontWeight:800,fontSize:'1rem',margin:0,display:'flex',alignItems:'center',gap:10, color:'#1e293b'}}>
            <Clock style={{width:20,height:20,color:'#2563eb'}} /> Aging Distribution (Days in Backlog)
          </h3>
          <div style={{display:'flex', gap:12}}>
             {Object.entries(agingBuckets).map(([k,v]) => (
                <div key={k} style={{display:'flex', alignItems:'center', gap:6}}>
                   <div style={{width:8, height:8, borderRadius:2, background:k==='90d+'?'#f43f5e':k==='31-90d'?'#f59e0b':k==='8-30d'?'#3b82f6':'#10b981'}} />
                   <span style={{fontSize:10, fontWeight:700, color:'#64748b'}}>{k}</span>
                </div>
             ))}
          </div>
        </div>
        <div style={{display:'flex',gap:'1.5rem',alignItems:'flex-end',height:160,padding:'0 1rem'}}>
          {(() => {
            const maxVal = Math.max(...Object.values(agingBuckets), 1);
            return Object.entries(agingBuckets).map(([k,v], i)=>(
              <div key={k} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8,height:'100%',justifyContent:'flex-end'}}>
                <div style={{position:'relative', width:'100%', display:'flex', justifyContent:'center'}}>
                  <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${(v / maxVal) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8, type: 'spring' }}
                    style={{width:'100%',maxWidth:60,borderRadius:'8px 8px 2px 2px',background:k==='90d+'?'linear-gradient(180deg,#f43f5e,#dc2626)':k==='31-90d'?'linear-gradient(180deg,#f59e0b,#d97706)':k==='8-30d'?'linear-gradient(180deg,#3b82f6,#2563eb)':'linear-gradient(180deg,#10b981,#059669)', boxShadow:'0 4px 15px rgba(0,0,0,0.05)',minHeight:4}} />
                  <span style={{position:'absolute', top:-20, fontSize:11, fontWeight:800, color:'#1e293b'}}>{v}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:'#94a3b8'}}>{k}</span>
              </div>
            ));
          })()}
        </div>
      </motion.div>

      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className={styles.card}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
          <h3 style={{fontWeight:800,fontSize:'1rem',margin:0}}>Strategic Inventory (Top 50)</h3>
          <span style={{fontSize:10,fontWeight:800,color:'#94a3b8', background:'#f1f5f9', padding:'4px 10px', borderRadius:6}}>PRIORITY QUEUE</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Issue ID</th><th>Summary</th><th>Type</th><th>Priority</th><th>Sizing</th><th>Cycle Age</th><th>Status</th></tr></thead>
            <tbody>
              {items.map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:800,color:'#2563eb',whiteSpace:'nowrap'}}>{b.id}</td>
                  <td style={{fontWeight:700,maxWidth:250,whiteSpace:'normal', color:'#334155', lineHeight:1.4}}>{b.title}</td>
                  <td><span style={{fontSize:'0.625rem',fontWeight:800,padding:'3px 8px',borderRadius:6,textTransform:'uppercase',background:b.type==='Bug'?'#ffebe6':'#eff6ff',color:b.type==='Bug'?'#bf2600':'#1d4ed8'}}>{b.type}</span></td>
                  <td><span style={{fontSize:'0.75rem', fontWeight:600}}>{b.priority}</span></td>
                  <td style={{fontWeight:800, color:'#1e293b'}}>{b.points || '—'}</td>
                  <td>
                    <div style={{display:'flex', alignItems:'center', gap:6}}>
                       <div style={{width:6, height:6, borderRadius:'50%', background:b.age>90?'#f43f5e':b.age>30?'#f59e0b':'#10b981'}} />
                       <span style={{color:b.age>90?'#f43f5e':b.age>30?'#f59e0b':'#64748b',fontWeight:700, fontSize:'0.8125rem'}}>{b.age}d</span>
                    </div>
                  </td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:800,padding:'4px 10px',borderRadius:9999,
                    background:b.status==='Ready'?'#e3fcef':b.status==='Refining'?'#eff6ff':b.status==='Blocked'?'#ffebe6':'#f1f5f9',
                    color:b.status==='Ready'?'#006644':b.status==='Refining'?'#1d4ed8':b.status==='Blocked'?'#bf2600':'#64748b'}}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

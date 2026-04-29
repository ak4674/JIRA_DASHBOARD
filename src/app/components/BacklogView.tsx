'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import { BarChart3 } from 'lucide-react';

export default function BacklogView() {
  const backlog = [
    {id:'PLAT-201',title:'Implement SSO for enterprise clients',type:'Story',priority:'High',points:8,age:5,status:'Refined'},
    {id:'PLAT-198',title:'Fix memory leak in notification service',type:'Bug',priority:'Highest',points:3,age:12,status:'Ready'},
    {id:'PLAT-195',title:'Add bulk export to CSV',type:'Story',priority:'Medium',points:5,age:22,status:'Refined'},
    {id:'PLAT-190',title:'Database index optimization for reports',type:'Spike',priority:'High',points:5,age:35,status:'Needs Refinement'},
    {id:'PLAT-188',title:'Upgrade React to v19',type:'Task',priority:'Medium',points:3,age:41,status:'Refined'},
    {id:'PLAT-185',title:'User avatar upload feature',type:'Story',priority:'Low',points:5,age:60,status:'Needs Refinement'},
    {id:'PLAT-180',title:'Accessibility audit remediation',type:'Story',priority:'High',points:13,age:72,status:'Ready'},
    {id:'PLAT-175',title:'Legacy API deprecation cleanup',type:'Task',priority:'Low',points:8,age:95,status:'Needs Refinement'},
  ];
  const agingBuckets = {'0-7d':2,'8-30d':2,'31-90d':3,'90d+':1};
  const totalItems = backlog.length;
  const sizedPct = 100;
  const refinedPct = Math.round(backlog.filter(b=>b.status==='Refined'||b.status==='Ready').length/totalItems*100);
  const oversized = backlog.filter(b=>b.points>8).length;

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Backlog Size</div>
          <div className={styles.kpiValue}>{totalItems}</div>
          <span style={{fontSize:'0.75rem',color:'#64748b'}}>items total</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Sized %</div>
          <div className={styles.kpiValue}>{sizedPct}%</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>All estimated</span>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Refined %</div>
          <div className={styles.kpiValue}>{refinedPct}%</div>
          <span className={oversized>0?`${styles.badge} ${styles.badgeWarning}`:`${styles.badge} ${styles.badgeSuccess}`}>
            {oversized} oversized ({'>'}8 pts)
          </span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <BarChart3 style={{width:20,height:20,color:'#2563eb'}} /> Aging Distribution
        </h3>
        <div style={{display:'flex',gap:'0.5rem',alignItems:'flex-end',height:120,padding:'0 1rem'}}>
          {Object.entries(agingBuckets).map(([k,v])=>(
            <div key={k} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              <span style={{fontSize:'0.8125rem',fontWeight:700}}>{v}</span>
              <div style={{width:'100%',borderRadius:'6px 6px 0 0',background:k==='90d+'?'#f43f5e':k==='31-90d'?'#f59e0b':k==='8-30d'?'#3b82f6':'#10b981',height:`${Math.max(20,v*30)}px`}} />
              <span style={{fontSize:'0.6875rem',fontWeight:600,color:'#64748b'}}>{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Backlog Items</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Priority</th><th>Points</th><th>Age</th><th>Status</th></tr></thead>
            <tbody>
              {backlog.map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:700,color:'#2563eb'}}>{b.id}</td>
                  <td style={{fontWeight:600,maxWidth:250,overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:700,padding:'2px 6px',borderRadius:4,background:b.type==='Bug'?'#ffebe6':b.type==='Spike'?'#fffae6':'#eff6ff',color:b.type==='Bug'?'#bf2600':b.type==='Spike'?'#825c00':'#1d4ed8'}}>{b.type}</span></td>
                  <td><span className={styles.priorityDot} style={{background:b.priority==='Highest'?'#f43f5e':b.priority==='High'?'#f59e0b':b.priority==='Medium'?'#3b82f6':'#94a3b8'}} />{b.priority}</td>
                  <td style={{fontWeight:700}}>{b.points}</td>
                  <td><span style={{color:b.age>60?'#f43f5e':b.age>30?'#f59e0b':'#64748b',fontWeight:600}}>{b.age}d</span></td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:700,padding:'2px 8px',borderRadius:9999,background:b.status==='Ready'?'#e3fcef':b.status==='Refined'?'#eff6ff':'#fffae6',color:b.status==='Ready'?'#006644':b.status==='Refined'?'#1d4ed8':'#825c00'}}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

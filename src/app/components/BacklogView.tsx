'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { BarChart3 } from 'lucide-react';

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
        {[{l:'Backlog Size',v:totalItems,c:'#334155'},
          {l:'Sized %',v:`${sizedPct}%`,c:'#2563eb'},
          {l:'Ready %',v:`${readyPct}%`,c:'#10b981'},
          {l:'Oversized (>8pts)',v:oversized,c:'#f59e0b'}
        ].map((m,i)=>(
          <div key={i} className={styles.card}>
            <div style={{fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.l}</div>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:m.c}}>{m.v}</div>
          </div>
        ))}
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
          <BarChart3 style={{width:20,height:20,color:'#2563eb'}} /> Aging Distribution
        </h3>
        <div style={{display:'flex',gap:'1rem',alignItems:'flex-end',height:140,padding:'0 2rem'}}>
          {Object.entries(agingBuckets).map(([k,v])=>(
            <div key={k} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
              <span style={{fontSize:'0.875rem',fontWeight:700}}>{v}</span>
              <div style={{width:'100%',borderRadius:'8px 8px 0 0',background:k==='90d+'?'#f43f5e':k==='31-90d'?'#f59e0b':k==='8-30d'?'#3b82f6':'#10b981',height:`${Math.max(16,v*4)}px`,transition:'height 0.3s'}} />
              <span style={{fontSize:'0.75rem',fontWeight:600,color:'#64748b'}}>{k}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Backlog Items (Top 50)</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Priority</th><th>Pts</th><th>Age</th><th>Team</th><th>Status</th></tr></thead>
            <tbody>
              {items.map(b=>(
                <tr key={b.id}>
                  <td style={{fontWeight:700,color:'#2563eb',whiteSpace:'nowrap'}}>{b.id}</td>
                  <td style={{fontWeight:600,maxWidth:220,overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:700,padding:'2px 6px',borderRadius:4,background:b.type==='Bug'?'#ffebe6':'#eff6ff',color:b.type==='Bug'?'#bf2600':'#1d4ed8'}}>{b.type}</span></td>
                  <td style={{whiteSpace:'nowrap'}}>{b.priority}</td>
                  <td style={{fontWeight:700}}>{b.points||'-'}</td>
                  <td><span style={{color:b.age>90?'#f43f5e':b.age>30?'#f59e0b':'#64748b',fontWeight:600}}>{b.age}d</span></td>
                  <td style={{fontSize:'0.75rem'}}>{b.team}</td>
                  <td><span style={{fontSize:'0.6875rem',fontWeight:700,padding:'2px 8px',borderRadius:9999,background:b.status==='Ready'?'#e3fcef':b.status==='Refining'?'#eff6ff':b.status==='Blocked'?'#ffebe6':'#f1f5f9',color:b.status==='Ready'?'#006644':b.status==='Refining'?'#1d4ed8':b.status==='Blocked'?'#bf2600':'#64748b'}}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

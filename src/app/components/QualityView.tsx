'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import type { DashboardData } from '@/lib/csv-parser';
import { AlertTriangle, Bug } from 'lucide-react';

export default function QualityView({ data }: { data: DashboardData }) {
  const q = data.quality;
  const escapeRate = q.totalDefects > 0 ? Math.round(q.escapedDefects / q.totalDefects * 100) : 0;
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.gridFour}>
        {[{l:'Total Defects',v:q.totalDefects,c:'#334155'},
          {l:'Open',v:q.openDefects,c:'#f43f5e'},
          {l:'Escaped to Prod',v:q.escapedDefects,c:'#dc2626'},
          {l:'MTTR',v:`${q.mttrHours||0}h`,c:'#f59e0b'}
        ].map((m,i)=>(
          <div key={i} className={styles.card}>
            <div style={{fontSize:10,fontWeight:800,color:'#94a3b8',textTransform:'uppercase',letterSpacing:'0.05em'}}>{m.l}</div>
            <div style={{fontSize:'1.5rem',fontWeight:800,color:m.c}}>{m.v}</div>
          </div>
        ))}
      </div>

      <div className={styles.gridTwo}>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
            <Bug style={{width:20,height:20,color:'#f43f5e'}} /> Defects by Severity
          </h3>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {Object.entries(q.defectsBySeverity).sort((a,b)=>a[0].localeCompare(b[0])).map(([sev,count])=>(
              <div key={sev}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',fontWeight:700,marginBottom:4}}>
                  <span style={{color:sev==='S1'?'#dc2626':sev==='S2'?'#f59e0b':sev==='S3'?'#3b82f6':'#94a3b8'}}>{sev}</span>
                  <span>{count}</span>
                </div>
                <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                  <div style={{height:'100%',borderRadius:9999,width:`${Math.min(100,count/q.totalDefects*100*3)}%`,background:sev==='S1'?'#dc2626':sev==='S2'?'#f59e0b':sev==='S3'?'#3b82f6':'#94a3b8'}} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.card}>
          <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Root Cause Analysis</h3>
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {Object.entries(q.rootCauses).sort((a,b)=>b[1]-a[1]).map(([rc,count])=>{
              const colors: Record<string,string> = {code:'#f43f5e',design:'#f59e0b',config:'#6366f1',data:'#3b82f6','test-gap':'#dc2626','3rd-party':'#94a3b8',requirement:'#10b981'};
              return (
                <div key={rc}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.8125rem',fontWeight:700,marginBottom:4,textTransform:'capitalize'}}>
                    <span>{rc.replace('-',' ')}</span><span>{count}</span>
                  </div>
                  <div style={{width:'100%',height:8,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:9999,width:`${Math.min(100,count*4)}%`,background:colors[rc]||'#64748b'}} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Defects by Component</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Component</th><th>Defects</th><th>% of Total</th><th>Distribution</th></tr></thead>
            <tbody>
              {q.defectsByComponent.slice(0,10).map(c=>(
                <tr key={c.name}>
                  <td style={{fontWeight:600}}>{c.name}</td>
                  <td style={{fontWeight:700}}>{c.count}</td>
                  <td>{Math.round(c.count/q.totalDefects*100)}%</td>
                  <td style={{minWidth:120}}>
                    <div style={{height:6,background:'#f1f5f9',borderRadius:9999,overflow:'hidden'}}>
                      <div style={{height:'100%',background:'#f43f5e',width:`${c.count/q.totalDefects*100}%`,borderRadius:9999}} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {escapeRate > 10 && (
        <div className={styles.card} style={{background:'#fff1f2',border:'1px solid #fecdd3'}}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <AlertTriangle style={{width:32,height:32,color:'#f43f5e',flexShrink:0}} />
            <div>
              <div style={{fontWeight:700,color:'#881337'}}>Escape Rate Alert: {escapeRate}%</div>
              <div style={{fontSize:'0.875rem',color:'#be123c'}}>{q.escapedDefects} defects escaped to production out of {q.totalDefects} total. Review test coverage for top affected components.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

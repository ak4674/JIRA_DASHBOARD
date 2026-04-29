'use client';
import React from 'react';
import styles from '../dashboard.module.css';
import { JiraData } from '@/lib/jira-types';
import { AlertTriangle } from 'lucide-react';

export default function QualityView({ data }: { data: JiraData }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Defect Density</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.defectDensity}</div>
          <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Defects per Story Point</p>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>MTTR (Defects)</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.mttrDefect}d</div>
          <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Avg resolution time</p>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Reopened Rate</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.reopenedRatio}%</div>
          <p style={{fontSize:'0.75rem',color:'#64748b',margin:0}}>Fix quality indicator</p>
        </div>
      </div>
      <div className={styles.card}>
        <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1.5rem'}}>Defect Escape Pyramid</h3>
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div style={{width:'25%',minWidth:120,height:48,background:'#f43f5e',borderRadius:'8px 8px 0 0',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.8125rem',boxShadow:'0 4px 12px rgba(244,63,94,0.3)'}}>PRODUCTION (4)</div>
          <div style={{width:'50%',minWidth:180,height:48,background:'#f59e0b',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.8125rem'}}>UAT (12)</div>
          <div style={{width:'75%',minWidth:240,height:48,background:'#3b82f6',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.8125rem'}}>QA (28)</div>
          <div style={{width:'100%',height:48,background:'#6366f1',borderRadius:'0 0 8px 8px',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.8125rem'}}>UNIT/INT (65)</div>
        </div>
        <div style={{marginTop:'1.5rem',padding:'1rem',background:'#fff1f2',border:'1px solid #fecdd3',borderRadius:16,display:'flex',alignItems:'center',gap:'1rem'}}>
          <AlertTriangle style={{width:32,height:32,color:'#f43f5e',flexShrink:0}} />
          <div>
            <div style={{fontWeight:700,color:'#881337'}}>High Escape Rate Alert</div>
            <div style={{fontSize:'0.875rem',color:'#be123c'}}>Production escapes increased by 15% in the last sprint. Component &quot;Search&quot; is the primary driver.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

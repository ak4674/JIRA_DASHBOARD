'use client';
import React, { useState } from 'react';
import styles from '../dashboard.module.css';
import { JiraData } from '@/lib/jira-types';
import { AlertTriangle, TrendingUp, Target, Zap } from 'lucide-react';

export default function ExecutiveSummary({ data }: { data: JiraData }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Portfolio Predictability</div>
            <Target style={{width:20,height:20,color:'#3b82f6'}} />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.predictability}%</div>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>+4% from last PI</span>
        </div>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>DORA Banding</div>
            <Zap style={{width:20,height:20,color:'#f59e0b'}} />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.doraBanding}</div>
          <span style={{fontSize:'0.75rem',fontWeight:600,color:'#64748b'}}>Top 15% of organizations</span>
        </div>
        <div className={styles.card}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
            <div className={styles.kpiLabel}>Defect Escape Rate</div>
            <AlertTriangle style={{width:20,height:20,color:'#f43f5e'}} />
          </div>
          <div className={styles.kpiValue}>{data.qualityMetrics.defectEscapeRate}%</div>
          <span className={`${styles.badge} ${styles.badgeDanger}`}>Trending Up</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
              <TrendingUp style={{width:20,height:20,color:'#2563eb'}} /> Flow Velocity Trend
            </h3>
            <div className={styles.chartPlaceholder}>
              <div style={{height:'100%',width:'100%',display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontWeight:500,fontStyle:'italic'}}>
                Visualizing items completed per unit time across 12 weeks...
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem',display:'flex',alignItems:'center',gap:8}}>
              <AlertTriangle style={{width:20,height:20,color:'#e11d48'}} /> Active Portfolio Risks
            </h3>
            <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {[
                {title:'Resource bottleneck on Core Platform team',level:'High',roam:'Owned'},
                {title:'UAT environment instability for PI-3',level:'Medium',roam:'Mitigated'},
                {title:'Third-party API deprecation (Oct 2026)',level:'Low',roam:'Accepted'},
              ].map((risk,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.75rem',borderRadius:12,background:'#f8fafc',border:'1px solid #f1f5f9'}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:8,height:8,borderRadius:'50%',background:risk.level==='High'?'#f43f5e':risk.level==='Medium'?'#f59e0b':'#3b82f6'}} />
                    <span style={{fontSize:'0.875rem',fontWeight:600}}>{risk.title}</span>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:4,background:'white',border:'1px solid #e2e8f0',color:'#64748b'}}>{risk.roam}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'1.5rem'}}>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:'1rem'}}>Investment Mix</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              {Object.entries(data.flowMetrics.distribution).map(([key,val])=>(
                <div key={key}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.75rem',fontWeight:700,marginBottom:4,textTransform:'uppercase',color:'#64748b'}}>
                    <span>{key}</span><span>{val}%</span>
                  </div>
                  <div style={{width:'100%',background:'#f1f5f9',height:8,borderRadius:9999,overflow:'hidden'}}>
                    <div style={{height:'100%',borderRadius:9999,width:`${val}%`,background:key==='features'?'#3b82f6':key==='defects'?'#f43f5e':key==='risks'?'#f59e0b':'#6366f1'}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.card}>
            <h3 style={{fontWeight:700,fontSize:'1.125rem',marginBottom:8}}>Team Sentiment</h3>
            <div style={{fontSize:'1.875rem',fontWeight:700,color:'#2563eb',marginBottom:4}}>4.2 / 5</div>
            <p style={{fontSize:'0.75rem',color:'#64748b',marginBottom:'1rem'}}>Healthy • 92% response rate</p>
            <div style={{display:'flex',gap:4}}>
              {[1,2,3,4,5].map(i=>(
                <div key={i} style={{height:32,flex:1,borderRadius:2,background:i<=4?'#3b82f6':'#dbeafe'}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

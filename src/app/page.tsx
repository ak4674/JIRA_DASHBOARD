'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Settings,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';
import styles from './dashboard.module.css';
import { generateMockData } from '@/lib/jira-mock';
import { JiraData } from '@/lib/jira-types';

export default function JiraDashboard() {
  const [activeTab, setActiveTab] = useState('executive');
  const [data, setData] = useState<JiraData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => {
      setData(generateMockData());
      setLoading(false);
    }, 1000);
  }, []);

  const tabs = [
    { id: 'executive', label: 'Executive Summary', icon: LayoutDashboard },
    { id: 'art', label: 'ART / Program', icon: Users },
    { id: 'team', label: 'Team View', icon: Activity },
    { id: 'backlog', label: 'Backlog Health', icon: BarChart3 },
    { id: 'quality', label: 'Quality Intelligence', icon: ShieldCheck },
    { id: 'engineering', label: 'Engineering Excellence', icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f4f5f7]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full mb-4" />
          <div className="text-blue-600 font-bold">Syncing Jira Intelligence...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Main Content */}
      <main>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p className="text-slate-500 text-sm mt-1">
              Portfolio: {data?.portfolio.name} • FY26 Q2
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Jira Cloud Connected</span>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl mb-8 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm font-bold' 
                : 'text-slate-500 hover:text-slate-700 font-medium'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'executive' && <ExecutiveSummary data={data!} />}
            {activeTab === 'team' && <TeamView data={data!} />}
            {activeTab === 'quality' && <QualityView data={data!} />}
            {activeTab === 'engineering' && <EngineeringView data={data!} />}
            {activeTab === 'settings' && <SettingsView />}
            {['art', 'backlog'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-slate-300">
                <LayoutDashboard className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">View Coming Soon</h3>
                <p className="text-slate-500">We are currently integrating these metrics from your ART/Program boards.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function ExecutiveSummary({ data }: { data: JiraData }) {
  return (
    <div className="space-y-6">
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className="flex justify-between items-start">
            <div className={styles.kpiLabel}>Portfolio Predictability</div>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.predictability}%</div>
          <div className="flex items-center gap-1">
            <span className={`${styles.badge} ${styles.badgeSuccess}`}>+4% from last PI</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className="flex justify-between items-start">
            <div className={styles.kpiLabel}>DORA Banding</div>
            <Zap className="w-5 h-5 text-amber-500" />
          </div>
          <div className={styles.kpiValue}>{data.portfolio.doraBanding}</div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-500">Top 15% of organizations</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className="flex justify-between items-start">
            <div className={styles.kpiLabel}>Defect Escape Rate</div>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>
          <div className={styles.kpiValue}>{data.qualityMetrics.defectEscapeRate}%</div>
          <div className="flex items-center gap-1">
            <span className={`${styles.badge} ${styles.badgeDanger}`}>Trending Up</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className={styles.card}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Flow Velocity Trend
            </h3>
            <div className={styles.chartPlaceholder}>
              {/* Actual chart would go here */}
              <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium italic">
                Visualizing items completed per unit time across 12 weeks...
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Active Portfolio Risks
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Resource bottleneck on Core Platform team', level: 'High', roam: 'Owned' },
                { title: 'UAT environment instability for PI-3', level: 'Medium', roam: 'Mitigated' },
                { title: 'Third-party API deprecation (Oct 2026)', level: 'Low', roam: 'Accepted' },
              ].map((risk, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${risk.level === 'High' ? 'bg-rose-500' : risk.level === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                    <span className="text-sm font-semibold">{risk.title}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-slate-200 text-slate-500">{risk.roam}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={styles.card}>
            <h3 className="font-bold text-lg mb-4">Investment Mix</h3>
            <div className="space-y-4">
              {Object.entries(data.flowMetrics.distribution).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs font-bold mb-1 uppercase text-slate-500">
                    <span>{key}</span>
                    <span>{val}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        key === 'features' ? 'bg-blue-500' : 
                        key === 'defects' ? 'bg-rose-500' : 
                        key === 'risks' ? 'bg-amber-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className={styles.card}>
            <h3 className="font-bold text-lg mb-2">Team Sentiment</h3>
            <div className="text-3xl font-bold text-blue-600 mb-1">4.2 / 5</div>
            <p className="text-xs text-slate-500 mb-4">Healthy • 92% response rate</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-8 flex-1 rounded-sm ${i <= 4 ? 'bg-blue-500' : 'bg-blue-100'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamView({ data }: { data: JiraData }) {
  const sprint = data.sprints[1]; // Active sprint
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200">
        <div>
          <h2 className="text-xl font-bold">Team Apollo • {sprint.name}</h2>
          <p className="text-slate-500 text-sm">Active: {sprint.startDate} — {sprint.endDate}</p>
        </div>
        <div className="flex gap-4">
           <div className="text-center">
             <div className="text-xs font-bold text-slate-400 uppercase">Risk Score</div>
             <div className="text-2xl font-bold text-amber-500">{sprint.riskScore}</div>
           </div>
           <div className="w-[1px] h-10 bg-slate-200" />
           <div className="text-center">
             <div className="text-xs font-bold text-slate-400 uppercase">Say:Do Ratio</div>
             <div className="text-2xl font-bold text-blue-600">{sprint.sayDoRatio}%</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className={styles.card}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Sprint Burndown
          </h3>
          <div className={styles.chartPlaceholder}>
            <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium italic">
              Ideal vs Actual burn... (Points: {sprint.completedPoints} / {sprint.committedPoints})
            </div>
          </div>
        </div>
        
        <div className={styles.card}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Flow Metrics (Rolling 30d)
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
              <div className="text-[10px] font-bold text-blue-700 uppercase">Cycle Time</div>
              <div className="text-2xl font-bold text-blue-900">{data.flowMetrics.time}d</div>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">Flow Efficiency</div>
              <div className="text-2xl font-bold text-indigo-900">{data.flowMetrics.efficiency}%</div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase">WIP (Flow Load)</span>
               <span className="text-xs font-bold text-blue-600">8 / 12 Limit</span>
             </div>
             <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
               <div className="bg-blue-600 h-full w-2/3" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QualityView({ data }: { data: JiraData }) {
  return (
    <div className="space-y-6">
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Defect Density</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.defectDensity}</div>
          <p className="text-xs text-slate-500">Defects per Story Point</p>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>MTTR (Defects)</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.mttrDefect}d</div>
          <p className="text-xs text-slate-500">Avg resolution time</p>
        </div>
        <div className={styles.card}>
          <div className={styles.kpiLabel}>Reopened Rate</div>
          <div className={styles.kpiValue}>{data.qualityMetrics.reopenedRatio}%</div>
          <p className="text-xs text-slate-500">Fix quality indicator</p>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className="font-bold text-lg mb-6">Defect Escape Pyramid</h3>
        <div className="flex flex-col items-center gap-2">
          <div className="w-1/4 h-12 bg-rose-500 rounded-t-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">PRODUCTION (4)</div>
          <div className="w-1/2 h-12 bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">UAT (12)</div>
          <div className="w-3/4 h-12 bg-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">QA (28)</div>
          <div className="w-full h-12 bg-indigo-500 rounded-b-lg flex items-center justify-center text-white font-bold text-sm">UNIT/INT (65)</div>
        </div>
        <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
          <div>
            <div className="font-bold text-rose-900">High Escape Rate Alert</div>
            <div className="text-sm text-rose-700">Production escapes increased by 15% in the last sprint. Component &quot;Search&quot; is the primary driver.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EngineeringView({ data }: { data: JiraData }) {
  const metrics = data.doraMetrics;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Deployment Freq', value: `${metrics.deploymentFrequency}/wk`, sub: 'Daily average: 1.7', color: 'blue' },
          { label: 'Lead Time', value: `${metrics.leadTimeForChanges}d`, sub: 'P95: 3.2d', color: 'indigo' },
          { label: 'Change Failure', value: `${metrics.changeFailureRate}%`, sub: 'Target: <15%', color: 'rose' },
          { label: 'TimeToRestore', value: `${metrics.timeToRestore}h`, sub: 'MTTR Incident', color: 'amber' },
        ].map((m, i) => (
          <div key={i} className={styles.card}>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</div>
            <div className={`text-2xl font-black text-${m.color}-600`}>{m.value}</div>
            <div className="text-[10px] text-slate-500 font-medium mt-1">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className={styles.card}>
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             <ShieldCheck className="w-5 h-5 text-emerald-600" />
             Tech Debt & Vulnerabilities
           </h3>
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="font-semibold">Code Coverage</span>
                 <span className="font-bold text-emerald-600">78%</span>
               </div>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="bg-emerald-500 h-full w-[78%]" />
               </div>
             </div>
             <div className="flex gap-4">
               <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="text-xs font-bold text-slate-500 uppercase">Critical Vulns</div>
                 <div className="text-2xl font-bold text-rose-600">2</div>
               </div>
               <div className="flex-1 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="text-xs font-bold text-slate-500 uppercase">Tech Debt %</div>
                 <div className="text-2xl font-bold text-amber-600">14%</div>
               </div>
             </div>
           </div>
        </div>

        <div className={styles.card}>
           <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
             <Activity className="w-5 h-5 text-blue-600" />
             Deployment Success Rate
           </h3>
           <div className={styles.chartPlaceholder}>
             <div className="h-full w-full flex items-center justify-center text-slate-400 font-medium italic">
               98.2% Success Rate • 45 Deployments this month
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className={styles.card}>
      <h3 className="font-bold text-lg mb-6">Jira Integration Settings</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Jira Instance URL</label>
          <input 
            type="text" 
            placeholder="https://your-company.atlassian.net" 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">API Token</label>
          <input 
            type="password" 
            placeholder="••••••••••••••••" 
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="pt-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 w-full hover:bg-blue-700 transition-all">
            Save & Sync Intelligence
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 leading-relaxed">
          <strong>Privacy Note:</strong> Your credentials are stored locally in your browser&apos;s encrypted vault. We never send your secrets to our servers.
        </p>
      </div>
    </div>
  );
}

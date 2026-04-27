import { JiraData, Sprint, Team, Portfolio } from './jira-types';

export const generateMockData = (): JiraData => {
  const teams: Team[] = [
    { id: 'team-1', name: 'Apollo', size: 6 },
    { id: 'team-2', name: 'Hermes', size: 8 },
    { id: 'team-3', name: 'Zeus', size: 5 },
  ];

  const portfolio: Portfolio = {
    id: 'p-1',
    name: 'Enterprise Platform',
    predictability: 82,
    doraBanding: 'High',
  };

  const sprints: Sprint[] = [
    {
      id: 's-10',
      name: 'Sprint 10',
      teamId: 'team-1',
      status: 'completed',
      startDate: '2026-03-01',
      endDate: '2026-03-14',
      committedPoints: 40,
      completedPoints: 38,
      sayDoRatio: 95,
      goal: 'Integrate auth service',
      goalMet: true,
    },
    {
      id: 's-11',
      name: 'Sprint 11',
      teamId: 'team-1',
      status: 'active',
      startDate: '2026-03-15',
      endDate: '2026-03-28',
      committedPoints: 42,
      completedPoints: 12, // In progress
      sayDoRatio: 85,
      goal: 'Onboard Beta users',
      goalMet: null,
      riskScore: 72,
    },
  ];

  const qualityMetrics = {
    defectEscapeRate: 12,
    defectDensity: 0.4,
    mttrDefect: 3.2, // days
    reopenedRatio: 5,
  };

  const doraMetrics = {
    deploymentFrequency: 12, // per week
    leadTimeForChanges: 1.5, // days
    changeFailureRate: 8, // %
    timeToRestore: 0.8, // hours
  };

  const flowMetrics = {
    velocity: 45,
    time: 5.2,
    efficiency: 42,
    load: 18,
    distribution: {
      features: 60,
      defects: 20,
      risks: 10,
      debt: 10,
    },
  };

  return {
    portfolio,
    teams,
    sprints,
    qualityMetrics,
    doraMetrics,
    flowMetrics,
  };
};

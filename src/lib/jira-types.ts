export interface Team {
  id: string;
  name: string;
  size: number;
}

export interface Portfolio {
  id: string;
  name: string;
  predictability: number;
  doraBanding: 'Elite' | 'High' | 'Medium' | 'Low';
}

export interface Sprint {
  id: string;
  name: string;
  teamId: string;
  status: 'completed' | 'active' | 'future';
  startDate: string;
  endDate: string;
  committedPoints: number;
  completedPoints: number;
  sayDoRatio: number;
  goal: string;
  goalMet: boolean | null;
  riskScore?: number;
}

export interface Issue {
  id: string;
  type: 'Story' | 'Bug' | 'Spike' | 'Task';
  title: string;
  status: string;
  priority: string;
  points?: number;
}

export interface JiraData {
  portfolio: Portfolio;
  teams: Team[];
  sprints: Sprint[];
  qualityMetrics: {
    defectEscapeRate: number;
    defectDensity: number;
    mttrDefect: number;
    reopenedRatio: number;
  };
  doraMetrics: {
    deploymentFrequency: number;
    leadTimeForChanges: number;
    changeFailureRate: number;
    timeToRestore: number;
  };
  flowMetrics: {
    velocity: number;
    time: number;
    efficiency: number;
    load: number;
    distribution: {
      features: number;
      defects: number;
      risks: number;
      debt: number;
    };
  };
}

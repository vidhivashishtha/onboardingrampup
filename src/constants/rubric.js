export const DAILY_TARGETS = {
  Math: { xp: 25, minutes: 25 },
  Reading: { xp: 25, minutes: 25 },
  Language: { xp: 25, minutes: 25 },
  Science: { xp: 12.5, minutes: 12.5 },
};

export const XP_THRESHOLD = 0.8; // Time is only an issue if XP < 80% of target

export const RUBRIC_RULES = {
  noBlame: {
    id: 'noBlame',
    name: 'The "No Blame" Rule',
    description:
      'Every issue traces back to an adult or a system. Never accept an analysis that blames the student\'s character.',
  },
  scalability: {
    id: 'scalability',
    name: 'Scalability Check',
    description:
      'Reject interventions requiring 1-on-1 human coaching. Guides do not teach content. The fix must be a system, placement, or curriculum change.',
  },
  quantifyWaste: {
    id: 'quantifyWaste',
    name: 'Quantify Waste',
    description:
      'If they claim "waste," force them to estimate the percentage of time wasted based on target vs. actual minutes.',
  },
  dailyTargets: {
    id: 'dailyTargets',
    name: 'Daily Targets',
    description:
      'Math/Reading/Language = 25 XP & 25 min; Science = 12.5 XP & 12.5 min. "Time" is only an issue if XP is below 80% of the target.',
  },
  evidenceGuardrail: {
    id: 'evidenceGuardrail',
    name: 'Evidence Guardrail',
    description:
      'Do not let them infer placement (too easy/hard) or gaming from the Min/XP ratio alone. Force them to cite corroborating data (e.g., accuracy, retakes).',
  },
};

export const BLAME_KEYWORDS = [
  'lazy',
  'doesn\'t care',
  'doesn\'t try',
  'unmotivated',
  'not interested',
  'won\'t listen',
  'refuses',
  'stubborn',
  'bad attitude',
  'not smart enough',
  'slow learner',
  'just doesn\'t get it',
  'chooses not to',
  'doesn\'t want to',
];

export const SCALABILITY_KEYWORDS = [
  'sit with',
  'work with them one-on-one',
  'tutor them',
  'teach them',
  'guide should explain',
  'guide should teach',
  'have the guide help them',
  'personal tutoring',
  'one-on-one instruction',
  'individually teach',
];

export const COMPLETION_SCRIPT = `Excellent work. You have officially completed the student deep dive analysis. Here are your next steps:

1. Familiarise yourself with the current automation landscape and escalation pathways
2. Start putting your work and process notes into your Brainlift using the standard template.
3. Reach out to Himanshi and Kathryn to understand your campus assignments and start your coaching certifications.
4. If you do not hear back from Himanshi or Kathryn within 48 hours, escalate directly to your manager.
5. While you wait, read other team members' Brainlifts or explore the QuickSight dashboards.`;

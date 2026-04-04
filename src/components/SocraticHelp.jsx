import { useState } from 'react';
import { DAILY_TARGETS } from '../constants/rubric';

const METRIC_DEFINITIONS = {
  xp_per_day: 'XP per School Day measures the average experience points earned per day. It indicates how much curriculum content a student completes daily.',
  minutes_per_day: 'Minutes per School Day measures the average time spent on a subject daily. Compare against the daily target for context.',
  minutes_per_xp: 'Minutes per XP is the ratio of time spent to XP earned. A very low ratio could indicate content is too easy or the student is rushing. A very high ratio could indicate struggle or content that is too hard. However, this metric alone is not sufficient to diagnose — always corroborate with other data.',
  lowest_growth_x: 'Lowest Growth X is the minimum growth multiplier across test windows. Values below 1.0 indicate negative growth (the student scored lower on a later test). A value of 2.0 means the student grew at twice the expected rate.',
  predicted_growth_bucket: 'The Predicted Growth Bucket is the expected growth category based on the student\'s starting RIT score and historical data. Students with lower starting scores typically have higher expected growth.',
  retook_test: 'Indicates whether the student retook the MAP test after the initial administration. Retakes may reveal testing pattern issues.',
  achieved_on_retakes: 'Whether the student achieved the growth target on subsequent retake attempts.',
};

const RESOURCES = [
  {
    category: 'Investigate the Student',
    items: [
      {
        name: 'TimeBack Dash',
        url: 'https://alpha.timeback.com/login',
        description: 'Impersonate the student to see their learning experience, app order, enrollments, and daily activity.',
      },
      {
        name: 'StudyReel',
        url: 'https://prod.recordings.mysignally.com/',
        description: 'Watch recordings of the student\'s actual learning sessions to spot anti-patterns (rushing, skipping, idling).',
      },
      {
        name: 'AlphaTest',
        url: 'https://admin.alphatest.alpha.school/sign-in',
        description: 'Check test history, scores, number of attempts, and whether retakes were administered.',
      },
    ],
  },
  {
    category: 'Dashboards & Data',
    items: [
      {
        name: 'Student Deep Dives Dashboard',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/accounts/646253092271/dashboards/9f436e86-3c34-4ca2-8bcd-ebf2e049c6cb?directory_alias=df-quicksight-jira',
        description: 'The primary dashboard for deep dive analysis — view growth data, XP, minutes, and subject-level breakdowns.',
      },
      {
        name: 'Student Progress Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/account/df-quicksight-jira/accounts/646253092271/dashboards/5f7cf337-f46e-4ad1-a4c9-a5390f1cd446?directory_alias=df-quicksight-jira',
        description: 'Track student progress across subjects, grade levels, and time periods.',
      },
      {
        name: 'Missing Assignment Detection',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/account/df-quicksight-jira/accounts/646253092271/dashboards/3d2cabc1-33eb-4eeb-8e31-ca8d6256f97e?directory_alias=df-quicksight-jira',
        description: 'Identify students with missing enrollments, plans, or test assignments that could explain low growth.',
      },
      {
        name: 'System Failure Tracker',
        url: 'https://us-east-1.quicksight.aws.amazon.com/sn/account/df-quicksight-jira/accounts/646253092271/dashboards/3d2cabc1-33eb-4eeb-8e31-ca8d6256f97e?directory_alias=df-quicksight-jira#',
        description: 'Check if automation failures (rostering, plan generation) may have impacted the student.',
      },
    ],
  },
  {
    category: 'Reference Material',
    items: [
      {
        name: 'TimeBack Dash Guide',
        url: 'https://docs.google.com/document/d/1UvxFlJ0oEhMH-BaXaenE3o1Ne0mYTIQEqXyoefDIcR0/edit',
        description: 'How to read and navigate the TimeBack Dashboard — explains each metric and view.',
      },
      {
        name: 'APP Playbook (K-8)',
        url: 'https://docs.google.com/document/d/1ARDYN2h6imQUlILGw_Ad0Qr5hmPHydmtFoCm0Nu-LMM/edit',
        description: 'The Academic Placement & Progression playbook — placement rules, hole-filling protocols, and grade advancement criteria.',
      },
      {
        name: 'Hundred for Hundred Dashboard',
        url: 'https://hundredforhundred.com/',
        description: 'Track 100-for-100 hole-filling progress for students working through content gaps.',
      },
    ],
  },
];

export default function SocraticHelp({ student }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('metrics');
  const [selectedMetric, setSelectedMetric] = useState(null);

  const targets = DAILY_TARGETS[student.subject];

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 hover:bg-blue-100 hover:border-blue-300 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
          <span>Help & Resources</span>
          <span className="text-xs font-normal text-blue-500">Metric definitions, dashboards & source links</span>
        </div>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          {/* Tabs */}
          <div className="flex gap-1 mb-4 border-b border-gray-200 -mx-4 px-4">
            <button
              onClick={() => setTab('metrics')}
              className={`text-xs px-3 py-2 border-b-2 cursor-pointer transition-colors ${
                tab === 'metrics'
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Metric Definitions
            </button>
            <button
              onClick={() => setTab('resources')}
              className={`text-xs px-3 py-2 border-b-2 cursor-pointer transition-colors ${
                tab === 'resources'
                  ? 'border-blue-500 text-blue-600 font-medium'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Sources & Dashboards
            </button>
          </div>

          {/* Metrics tab */}
          {tab === 'metrics' && (
            <>
              <p className="text-xs text-gray-500 mb-3">
                Select a metric to see its definition. We will not diagnose the student for you — use the data to form your own analysis.
              </p>

              <div className="mb-3 p-3 rounded border border-blue-100 bg-blue-50">
                <p className="text-xs font-medium text-blue-700 mb-1">Daily Targets for {student.subject}</p>
                <p className="text-xs text-blue-600">
                  XP: {targets.xp} / day &nbsp;|&nbsp; Minutes: {targets.minutes} / day
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Time is only flagged if XP is below 80% of target ({targets.xp * 0.8}).
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {Object.keys(METRIC_DEFINITIONS).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetric(selectedMetric === key ? null : key)}
                    className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                      selectedMetric === key
                        ? 'bg-blue-100 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {key.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>

              {selectedMetric && (
                <div className="p-3 rounded border border-gray-200 bg-white">
                  <p className="text-xs font-medium text-gray-700 mb-1">
                    {selectedMetric.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-600">{METRIC_DEFINITIONS[selectedMetric]}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    This student&apos;s value: <span className="font-medium">{student[selectedMetric]}</span>
                  </p>
                </div>
              )}
            </>
          )}

          {/* Resources tab */}
          {tab === 'resources' && (
            <>
              <p className="text-xs text-gray-500 mb-4">
                Use these sources to investigate the student. Cross-reference multiple data points before forming your diagnosis.
              </p>
              <div className="space-y-4">
                {RESOURCES.map((group) => (
                  <div key={group.category}>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      {group.category}
                    </p>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <a
                          key={item.name}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded border border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-colors group"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-xs font-medium text-gray-900 group-hover:text-blue-700">
                              {item.name}
                            </span>
                            <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

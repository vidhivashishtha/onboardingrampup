import { DAILY_TARGETS } from '../constants/rubric';

function MetricCard({ label, value, target, unit, warning }) {
  return (
    <div className={`rounded-lg border p-3 ${warning ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-gray-900">
        {value}
        {unit && <span className="text-sm font-normal text-gray-500"> {unit}</span>}
      </p>
      {target && (
        <p className="text-xs text-gray-400 mt-0.5">Target: {target}</p>
      )}
    </div>
  );
}

export default function MetricGrid({ student }) {
  const targets = DAILY_TARGETS[student.subject];
  const xp = parseFloat(student.xp_per_day);
  const mins = parseFloat(student.minutes_per_day);
  const xpWarning = xp < targets.xp * 0.8;
  const minWarning = mins < targets.minutes && xpWarning;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <MetricCard label="Campus" value={student.campus} />
      <MetricCard label="Level" value={student.level} />
      <MetricCard label="Subject" value={student.subject} />
      <MetricCard label="Predicted Growth" value={student.predicted_growth_bucket} />
      <MetricCard
        label="Lowest Growth X"
        value={student.lowest_growth_x}
        unit="x"
      />
      <MetricCard
        label="Highest Winter RIT"
        value={student.highest_winter_rit}
      />
      <MetricCard
        label="XP / School Day"
        value={student.xp_per_day}
        target={`${targets.xp} XP`}
        warning={xpWarning}
      />
      <MetricCard
        label="Minutes / School Day"
        value={student.minutes_per_day}
        target={`${targets.minutes} min`}
        unit="min"
        warning={minWarning}
      />
      <MetricCard
        label="Minutes / XP"
        value={student.minutes_per_xp}
      />
      <MetricCard
        label="Retook Test?"
        value={student.retook_test}
      />
      {student.retook_test === 'Yes' && (
        <MetricCard
          label="Achieved on Retakes?"
          value={student.achieved_on_retakes || 'N/A'}
        />
      )}
    </div>
  );
}

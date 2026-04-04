import { useState } from 'react';

const FIELDS = [
  {
    id: 'diagnosis',
    label: 'Diagnosis',
    placeholder:
      'What is going wrong for this student? Identify the root cause(s). Remember: trace issues back to adult decisions or system failures, not the student.',
  },
  {
    id: 'intervention',
    label: 'Academic Intervention',
    placeholder:
      'What system, placement, or curriculum change should be made? The fix must be scalable — no 1-on-1 tutoring.',
  },
  {
    id: 'motivation',
    label: 'Motivational Strategy',
    placeholder:
      'What motivational approach would you use? Think about what drives this student and what rewards or structures would help.',
  },
];

export default function AnalysisForm({ onSubmit, disabled }) {
  const [values, setValues] = useState({
    diagnosis: '',
    intervention: '',
    motivation: '',
  });

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const allFilled = values.diagnosis.trim() && values.intervention.trim() && values.motivation.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {FIELDS.map((field) => (
        <div key={field.id}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
          </label>
          <textarea
            value={values[field.id]}
            onChange={(e) => handleChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500 resize-y"
          />
        </div>
      ))}
      <button
        type="submit"
        disabled={disabled || !allFilled}
        className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        Submit Analysis
      </button>
    </form>
  );
}

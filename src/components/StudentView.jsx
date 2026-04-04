import { useState } from 'react';
import MetricGrid from './MetricGrid';
import AnalysisForm from './AnalysisForm';
import RubricRejection from './RubricRejection';
import RevealPanel from './RevealPanel';
import SocraticHelp from './SocraticHelp';
import { validateSubmission } from '../utils/rubricChecks';

export default function StudentView({ student, isCompleted, onComplete, onNext, isLast }) {
  const [phase, setPhase] = useState(isCompleted ? 'revealed' : 'analysis');
  const [rejection, setRejection] = useState(null);
  const [submission, setSubmission] = useState(null);

  const handleSubmit = (values) => {
    setRejection(null);
    const result = validateSubmission(
      values.diagnosis,
      values.intervention,
      values.motivation,
      student
    );

    if (!result.passed) {
      setRejection(result);
      return;
    }

    setSubmission(values);
    setPhase('revealed');
    onComplete();
  };

  const handleNext = () => {
    onNext();
    // Reset for next student
    setPhase('analysis');
    setRejection(null);
    setSubmission(null);
  };

  return (
    <div className="space-y-6">
      {/* Student header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-xl font-semibold text-gray-900">{student.student_name}</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {student.student_id}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          {student.campus} · {student.level} · {student.subject}
        </p>
      </div>

      {/* Metrics */}
      <MetricGrid student={student} />

      {/* Help */}
      <SocraticHelp student={student} />

      {/* Analysis or Reveal */}
      {phase === 'analysis' && (
        <>
          {rejection && (
            <RubricRejection result={rejection} onDismiss={() => setRejection(null)} />
          )}
          <AnalysisForm onSubmit={handleSubmit} disabled={false} />
        </>
      )}

      {phase === 'revealed' && (
        <>
          <RevealPanel student={student} submission={submission || { diagnosis: '(completed previously)', intervention: '(completed previously)', motivation: '(completed previously)' }} />
          {!isLast && (
            <button
              onClick={handleNext}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Next Student
            </button>
          )}
        </>
      )}
    </div>
  );
}

import {
  BLAME_KEYWORDS,
  SCALABILITY_KEYWORDS,
  DAILY_TARGETS,
  XP_THRESHOLD,
  RUBRIC_RULES,
} from '../constants/rubric';

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.find((kw) => lower.includes(kw.toLowerCase()));
}

export function checkNoBlame(diagnosis) {
  const match = containsAny(diagnosis, BLAME_KEYWORDS);
  if (match) {
    return {
      passed: false,
      rule: RUBRIC_RULES.noBlame,
      detail: `Your diagnosis contains "${match}". Every issue must trace back to an adult or a system, not the student's character. Reframe: what system or adult decision led to this outcome?`,
    };
  }
  return { passed: true };
}

export function checkScalability(intervention) {
  const match = containsAny(intervention, SCALABILITY_KEYWORDS);
  if (match) {
    return {
      passed: false,
      rule: RUBRIC_RULES.scalability,
      detail: `Your intervention includes "${match}". Guides do not teach content. The fix must be a system, placement, or curriculum change that works without dedicated 1-on-1 instruction.`,
    };
  }
  return { passed: true };
}

export function checkQuantifyWaste(diagnosis, intervention, motivation) {
  const combined = `${diagnosis} ${intervention} ${motivation}`;
  const lower = combined.toLowerCase();
  const mentionsWaste =
    lower.includes('waste') ||
    lower.includes('wasting') ||
    lower.includes('wasted');

  if (mentionsWaste) {
    // Check if they included a percentage
    const hasPercent = /%/.test(combined) || /\d+\s*percent/i.test(combined);
    if (!hasPercent) {
      return {
        passed: false,
        rule: RUBRIC_RULES.quantifyWaste,
        detail:
          'You mentioned time waste but did not quantify it. Estimate the percentage of time wasted based on target vs. actual minutes.',
      };
    }
  }
  return { passed: true };
}

export function checkDailyTargets(diagnosis, student) {
  const lower = diagnosis.toLowerCase();
  const mentionsTime =
    lower.includes('too little time') ||
    lower.includes('not enough time') ||
    lower.includes('low minutes') ||
    lower.includes('below the time') ||
    lower.includes('insufficient time') ||
    lower.includes('time is too low') ||
    lower.includes('not meeting time');

  if (mentionsTime) {
    const targets = DAILY_TARGETS[student.subject];
    const xpPerDay = parseFloat(student.xp_per_day);
    const threshold = targets.xp * XP_THRESHOLD;

    if (xpPerDay >= threshold) {
      return {
        passed: false,
        rule: RUBRIC_RULES.dailyTargets,
        detail: `You flagged time as an issue, but ${student.student_name}'s XP is ${xpPerDay}/day (target: ${targets.xp}). Time is only a concern if XP is below 80% of the target (${threshold}). Re-examine the data.`,
      };
    }
  }
  return { passed: true };
}

export function checkEvidenceGuardrail(diagnosis) {
  const lower = diagnosis.toLowerCase();
  const infersMisplacement =
    (lower.includes('too easy') || lower.includes('too hard') || lower.includes('misplaced') || lower.includes('wrong level')) &&
    !lower.includes('accuracy') &&
    !lower.includes('retake') &&
    !lower.includes('test score') &&
    !lower.includes('placement test') &&
    !lower.includes('attempts');

  const infersGaming =
    (lower.includes('gaming') || lower.includes('cheating') || lower.includes('manipulating')) &&
    !lower.includes('accuracy') &&
    !lower.includes('retake') &&
    !lower.includes('test score');

  if (infersMisplacement) {
    return {
      passed: false,
      rule: RUBRIC_RULES.evidenceGuardrail,
      detail:
        'You inferred placement issues without citing corroborating evidence. What does the accuracy, retake history, or test data tell you? Use specific data points.',
    };
  }

  if (infersGaming) {
    return {
      passed: false,
      rule: RUBRIC_RULES.evidenceGuardrail,
      detail:
        'You inferred gaming from the Min/XP ratio alone. Cite corroborating data such as accuracy rates, retake patterns, or test scores.',
    };
  }

  return { passed: true };
}

export function validateSubmission(diagnosis, intervention, motivation, student) {
  // Check all fields are filled
  if (!diagnosis.trim() || !intervention.trim() || !motivation.trim()) {
    return {
      passed: false,
      rule: { name: 'Complete Submission', id: 'incomplete' },
      detail: 'All three fields (Diagnosis, Academic Intervention, Motivational Strategy) must be filled in.',
    };
  }

  // Run each rubric check in order
  const checks = [
    checkNoBlame(diagnosis),
    checkScalability(intervention),
    checkQuantifyWaste(diagnosis, intervention, motivation),
    checkDailyTargets(diagnosis, student),
    checkEvidenceGuardrail(diagnosis),
  ];

  for (const result of checks) {
    if (!result.passed) return result;
  }

  return { passed: true };
}

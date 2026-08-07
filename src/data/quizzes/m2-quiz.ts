import type { Quiz } from '@/types'

// ============================================================================
// MODULE 2 QUIZZES — BA Foundations & Core Concepts
// One practice quiz per lesson (f1, f2, f3). Each quiz mixes mcq / truefalse /
// short questions and is grounded strictly in that lesson's content in
// module2-foundations.ts. passingScore 60; every question worth 1 point.
// ============================================================================

export const quizzesM2: Record<string, Quiz> = {
  // ------------------------------------------------------------------- F1
  // What Is Business Analysis? The BA Role
  f1: {
    id: 'quiz-f1',
    passingScore: 60,
    questions: [
      {
        id: 'f1-q1',
        type: 'mcq',
        prompt: 'Per BABOK v3, business analysis is best defined as the practice of...',
        points: 1,
        options: [
          'Writing detailed documents and meeting notes for a project',
          'Enabling change in an enterprise by defining needs and recommending solutions that deliver value to stakeholders',
          'Managing the schedule, budget, and scope of a project',
          'Building software that meets a technical specification',
        ],
        correctIndex: 1,
        explanation:
          'BABOK v3 defines business analysis as enabling change in an enterprise by defining needs and recommending solutions that deliver value to stakeholders.',
      },
      {
        id: 'f1-q2',
        type: 'mcq',
        prompt: 'According to the lesson, projects most often fail because the team...',
        points: 1,
        options: [
          'could not write the code fast enough',
          'built the wrong software — a beautiful solution to a poorly understood problem',
          'chose the wrong programming language',
          'had too many stakeholders in the room',
        ],
        correctIndex: 1,
        explanation:
          'Projects rarely fail because the team could not build the software; they fail by solving the wrong problem, and reducing that risk is the BA\'s value.',
      },
      {
        id: 'f1-q3',
        type: 'mcq',
        prompt: 'In the BA mental model, what is the correct order of the chain?',
        points: 1,
        options: [
          'Solution -> Requirement -> Need',
          'Requirement -> Need -> Solution',
          'Need -> Requirement -> Solution',
          'Need -> Solution -> Requirement',
        ],
        correctIndex: 2,
        explanation:
          'A need (problem or opportunity) leads to a requirement (what the solution must do), which leads to the solution you deliver.',
      },
      {
        id: 'f1-q4',
        type: 'mcq',
        prompt: 'A requirement is best described as...',
        points: 1,
        options: [
          'the problem or opportunity to be addressed',
          'a statement of what a solution must do to satisfy a need',
          'the thing you actually build or change',
          'the worth something delivers to a stakeholder',
        ],
        correctIndex: 1,
        explanation:
          'A requirement states what a solution must do to satisfy a need; the need is the problem and the solution is what you deliver.',
      },
      {
        id: 'f1-q5',
        type: 'mcq',
        prompt: 'Which role primarily owns the product backlog and orders it by value?',
        points: 1,
        options: ['Business Analyst', 'Project Manager', 'Product Owner', 'Solution Architect'],
        correctIndex: 2,
        explanation:
          'The Product Owner owns the product backlog and its value ordering; the BA owns requirements and analysis, and the PM owns the plan and delivery.',
      },
      {
        id: 'f1-q6',
        type: 'mcq',
        prompt: 'The core question a Business Analyst answers is...',
        points: 1,
        options: [
          'When and how do we deliver it?',
          'What do we need, and why?',
          'Is it the right product, ordered by value?',
          'How much will the project cost?',
        ],
        correctIndex: 1,
        explanation:
          'The BA focuses on what is needed and why; the PM asks when/how to deliver, and the PO asks whether it is the right product ordered by value.',
      },
      {
        id: 'f1-q7',
        type: 'mcq',
        prompt: 'When a stakeholder hands you a solution (for example, "add an Export to Excel button"), the single most valuable BA habit is to...',
        points: 1,
        options: [
          'build exactly what was asked as quickly as possible',
          'ask "why?" until you reach the underlying need',
          'escalate the request straight to the project manager',
          'reject the request because it names a solution',
        ],
        correctIndex: 1,
        explanation:
          'The problem-first mindset unwraps a requested solution by asking why until the real need is visible, then confirms the solution actually solves it.',
      },
      {
        id: 'f1-q8',
        type: 'truefalse',
        prompt: 'A Business Analyst is essentially "the person who writes the documents."',
        points: 1,
        correctBool: false,
        explanation:
          'A BA is the person who makes sure the organization builds the right thing for the right reason — not merely a document writer.',
      },
      {
        id: 'f1-q9',
        type: 'truefalse',
        prompt: 'A solution with no need behind it is considered waste.',
        points: 1,
        correctBool: true,
        explanation:
          'The Need -> Requirement -> Solution arrows run one way for a reason: a solution that cannot be traced back to a need is waste.',
      },
      {
        id: 'f1-q10',
        type: 'truefalse',
        prompt: 'Deciding whether the project can absorb a two-week schedule slip is primarily the Business Analyst\'s call.',
        points: 1,
        correctBool: false,
        explanation:
          'Schedule, scope, and risk trade-offs belong to the Project Manager; the BA owns needs, requirements, and solution fit.',
      },
      {
        id: 'f1-q11',
        type: 'short',
        prompt: 'In your own words, define business analysis, naming at least two of the ideas BABOK emphasises.',
        points: 1,
        keywords: ['change', 'need', 'solution', 'value', 'stakeholder', 'enabl'],
        sampleAnswer:
          'Enabling change in an enterprise by defining needs and recommending solutions that deliver value to stakeholders.',
        explanation:
          'The BABOK definition weaves together the core concepts of change, need, solution, value, and stakeholder.',
      },
      {
        id: 'f1-q12',
        type: 'short',
        prompt: 'Name the three common domains, or flavours, where BAs work.',
        points: 1,
        keywords: ['it', 'system', 'process', 'data', 'analytic'],
        sampleAnswer:
          'IT/systems BA (bridges business and engineering), business-process BA (improves how work flows), and data/analytics BA (turns questions into metrics and dashboards).',
        explanation:
          'Business analysis is a mindset applied across IT/systems, business process, and data/analytics work.',
      },
      {
        id: 'f1-q13',
        type: 'short',
        prompt: 'A warehouse manager asks you to "add a print button to the stock screen." State the single reflex question a problem-first BA asks first, and why.',
        points: 1,
        keywords: ['why', 'need', 'problem', 'what', 'purpose'],
        sampleAnswer:
          'Ask "why?" — for example, what do you do with the printout and what problem does it solve — so you unwrap the guessed solution back to the underlying need before building anything.',
        explanation:
          'Stakeholders are experts in their problem; the BA starts with the need, never the button.',
      },
    ],
  },

  // ------------------------------------------------------------------- F2
  // The Business Analysis Core Concept Model (BACCM)
  f2: {
    id: 'quiz-f2',
    passingScore: 60,
    questions: [
      {
        id: 'f2-q1',
        type: 'mcq',
        prompt: 'How many core concepts make up the BACCM?',
        points: 1,
        options: ['Four', 'Five', 'Six', 'Seven'],
        correctIndex: 2,
        explanation:
          'The BACCM is made up of six core concepts that are always present and always interconnected.',
      },
      {
        id: 'f2-q2',
        type: 'mcq',
        prompt: 'In BACCM, "Change" is defined as...',
        points: 1,
        options: [
          'a problem or opportunity to be addressed',
          'the act of transformation in response to a need — moving from a current state to a better future state',
          'the worth or usefulness of something to a stakeholder',
          'the circumstances that surround the initiative',
        ],
        correctIndex: 1,
        explanation:
          'Change is the act of transformation in response to a need, moving from a current state to a better future state.',
      },
      {
        id: 'f2-q3',
        type: 'mcq',
        prompt: 'Which BACCM concept means "the worth, importance, or usefulness of something to a stakeholder in a context"?',
        points: 1,
        options: ['Need', 'Value', 'Solution', 'Change'],
        correctIndex: 1,
        explanation:
          'Value is the worth, importance, or usefulness of something to a stakeholder in a context.',
      },
      {
        id: 'f2-q4',
        type: 'mcq',
        prompt: 'Which of the following is NOT one of the six BACCM core concepts?',
        points: 1,
        options: ['Stakeholder', 'Context', 'Requirement', 'Value'],
        correctIndex: 2,
        explanation:
          'The six concepts are Change, Need, Solution, Stakeholder, Value, and Context. "Requirement" is a key term but not one of the six.',
      },
      {
        id: 'f2-q5',
        type: 'mcq',
        prompt: '"Context" in BACCM refers to...',
        points: 1,
        options: [
          'a specific way of satisfying a need',
          'the circumstances that influence, are influenced by, and provide understanding of the change',
          'the individual or group with a relationship to the change',
          'a statement of what the solution must do',
        ],
        correctIndex: 1,
        explanation:
          'Context is the circumstances that influence, are influenced by, and provide understanding of the change — for example the software in use, the fiscal calendar, or regulations.',
      },
      {
        id: 'f2-q6',
        type: 'mcq',
        prompt: 'A project charter says: "We will build a mobile app because our competitor has one." Which BACCM concept is clearly missing?',
        points: 1,
        options: ['Context', 'Need', 'Stakeholder', 'Value'],
        correctIndex: 1,
        explanation:
          'The Need is missing — "because a competitor has one" is not a problem or opportunity for our own stakeholders.',
      },
      {
        id: 'f2-q7',
        type: 'mcq',
        prompt: 'Which statement best captures how the six concepts relate to one another?',
        points: 1,
        options: [
          'They are a strict sequence performed one after another',
          'They are an interconnected web — you cannot fully understand one without the others',
          'They are independent and can each be analysed in isolation',
          'Only Need and Solution matter; the rest are optional',
        ],
        correctIndex: 1,
        explanation:
          'The concepts form a web: a solution only makes sense against a need, value is only meaningful to a stakeholder, and every one sits inside a context.',
      },
      {
        id: 'f2-q8',
        type: 'truefalse',
        prompt: 'The six BACCM concepts are independent and can each be fully understood in isolation.',
        points: 1,
        correctBool: false,
        explanation:
          'They are a web, not a list — change one concept and the others shift, so no single one can be fully understood alone.',
      },
      {
        id: 'f2-q9',
        type: 'truefalse',
        prompt: 'Value is only meaningful in relation to a stakeholder.',
        points: 1,
        correctBool: true,
        explanation:
          'Value is the worth of something to a stakeholder in a context, so it always requires a stakeholder to be meaningful.',
      },
      {
        id: 'f2-q10',
        type: 'truefalse',
        prompt: 'BACCM is meant primarily as paperwork to complete rather than as a thinking tool.',
        points: 1,
        correctBool: false,
        explanation:
          'BACCM is a thinking and framing tool; when a project feels off it is usually because one concept was skipped.',
      },
      {
        id: 'f2-q11',
        type: 'short',
        prompt: 'Name all six BACCM core concepts.',
        points: 1,
        keywords: ['change', 'need', 'solution', 'stakeholder', 'value', 'context'],
        sampleAnswer: 'Change, Need, Solution, Stakeholder, Value, and Context.',
        explanation:
          'A useful memory hook is Change, Need, Solution, Stakeholder, Value, Context.',
      },
      {
        id: 'f2-q12',
        type: 'short',
        prompt: 'Define "Stakeholder" as it is used in BACCM.',
        points: 1,
        keywords: ['group', 'individual', 'relationship', 'change', 'need', 'solution'],
        sampleAnswer:
          'A group or individual with a relationship to the change, the need, or the solution.',
        explanation:
          'Stakeholders include anyone with a relationship to the change, the need, or the solution — for example the finance manager, clerks, the director, or IT.',
      },
      {
        id: 'f2-q13',
        type: 'short',
        prompt: 'Give one example of how changing the Context of an initiative can change another BACCM concept.',
        points: 1,
        keywords: ['regulation', 'need', 'deadline', 'change', 'stakeholder', 'value', 'constrain'],
        sampleAnswer:
          'A new regulation (context) can change the need; a year-end deadline (context) can force a phased, parallel-run change instead of a big-bang cut-over.',
        explanation:
          'That interdependence is the whole point: shift the context and the need, change, or definition of value can move with it.',
      },
    ],
  },

  // ------------------------------------------------------------------- F3
  // Requirements Classification & Key Terms
  f3: {
    id: 'quiz-f3',
    passingScore: 60,
    questions: [
      {
        id: 'f3-q1',
        type: 'mcq',
        prompt: 'Which of these is an example of a BUSINESS requirement?',
        points: 1,
        options: [
          '"Accountants need to see which invoices are overdue."',
          '"Reduce late payments by 20% this year."',
          '"The system shall flag an invoice as Overdue when it passes its due date."',
          '"Migrate 3 years of historical invoices into the new system."',
        ],
        correctIndex: 1,
        explanation:
          'A business requirement is a high-level goal or outcome of the enterprise, such as reducing late payments by 20%.',
      },
      {
        id: 'f3-q2',
        type: 'mcq',
        prompt: 'Which of these is a NON-FUNCTIONAL requirement?',
        points: 1,
        options: [
          '"The system shall email a receipt after payment."',
          '"The overdue list must load in under 2 seconds."',
          '"The clerk needs to search invoices by customer name."',
          '"Migrate historical invoices before go-live."',
        ],
        correctIndex: 1,
        explanation:
          'Non-functional requirements describe a quality attribute — here, performance (how well the solution performs).',
      },
      {
        id: 'f3-q3',
        type: 'mcq',
        prompt: 'A requirement to "migrate 3 years of historical invoices into the new system" is which type?',
        points: 1,
        options: ['Functional', 'Non-functional', 'Transition', 'Business'],
        correctIndex: 2,
        explanation:
          'Transition requirements are temporary capabilities needed only to move from the old state to the new; data migration is a classic example.',
      },
      {
        id: 'f3-q4',
        type: 'mcq',
        prompt: 'A handy test: if you can put the word "shall" in front of it and it describes an action, the requirement is usually...',
        points: 1,
        options: ['non-functional', 'functional', 'a business requirement', 'a design'],
        correctIndex: 1,
        explanation:
          'If it describes an action ("the system shall..."), it is usually functional; if it describes a quality or constraint, it is non-functional.',
      },
      {
        id: 'f3-q5',
        type: 'mcq',
        prompt: 'What distinguishes a requirement from a design?',
        points: 1,
        options: [
          'A requirement is a "how"; a design is a "what"',
          'A requirement focuses on the need (what must be true); a design focuses on a solution (a specific how to meet it)',
          'They are identical and interchangeable',
          'A design must always be written before the requirement',
        ],
        correctIndex: 1,
        explanation:
          'BABOK draws the line by intent: a requirement is a what, independent of solution; a design is a specific how to meet it.',
      },
      {
        id: 'f3-q6',
        type: 'mcq',
        prompt: 'Why is "The system should be fast" a poor requirement?',
        points: 1,
        options: [
          'It is too long to fit on one line',
          'It is not unambiguous or testable — "fast" is left undefined',
          'It uses the word "system"',
          'It is actually a transition requirement',
        ],
        correctIndex: 1,
        explanation:
          '"Fast" is a wish, not a requirement: it is ambiguous and untestable. "Loads in under 2 seconds for 1,000 invoices" can be verified.',
      },
      {
        id: 'f3-q7',
        type: 'mcq',
        prompt: 'Which of these is an example of a STAKEHOLDER requirement?',
        points: 1,
        options: [
          '"Reduce days-sales-outstanding from 45 to 35."',
          '"The finance manager needs to approve any invoice over the threshold before it is paid."',
          '"The approval decision must be recorded in the audit log within 1 second."',
          '"Run the old and new approval steps in parallel for one month."',
        ],
        correctIndex: 1,
        explanation:
          'A stakeholder requirement states what a specific stakeholder group needs from the solution.',
      },
      {
        id: 'f3-q8',
        type: 'truefalse',
        prompt: 'Transition requirements are permanent capabilities that remain in the solution long after go-live.',
        points: 1,
        correctBool: false,
        explanation:
          'Transition requirements are temporary — data migration, parallel running, or one-off training exist only during the switch-over and then retire.',
      },
      {
        id: 'f3-q9',
        type: 'truefalse',
        prompt: '"The report screen should be fast and user-friendly" is a well-formed, testable requirement.',
        points: 1,
        correctBool: false,
        explanation:
          '"Fast" and "user-friendly" are undefined, so the statement fails the unambiguous and testable qualities of a good requirement.',
      },
      {
        id: 'f3-q10',
        type: 'truefalse',
        prompt: 'A requirement focuses on WHAT must be true, while a design focuses on a specific HOW to achieve it.',
        points: 1,
        correctBool: true,
        explanation:
          'A requirement stays with the need (the what); a design commits to a particular solution (the how).',
      },
      {
        id: 'f3-q11',
        type: 'short',
        prompt: 'List the five BABOK requirement types.',
        points: 1,
        keywords: ['business', 'stakeholder', 'functional', 'non-functional', 'transition'],
        sampleAnswer:
          'Business, stakeholder, solution-functional, solution-non-functional, and transition requirements.',
        explanation:
          'The schema nests: business (why), stakeholder (who needs what), solution functional and non-functional (what the system does and how well), and transition (temporary move).',
      },
      {
        id: 'f3-q12',
        type: 'short',
        prompt: 'Name three characteristics of a good requirement.',
        points: 1,
        keywords: ['atomic', 'complete', 'consistent', 'unambiguous', 'testable', 'verifiable', 'feasible', 'prioritis', 'prioritiz'],
        sampleAnswer:
          'For example: atomic, unambiguous, and testable — also complete, consistent, feasible, and prioritised.',
        explanation:
          'BABOK (echoing ISO/IEC/IEEE 29148) lists atomic, complete, consistent, unambiguous, testable, feasible, and prioritised.',
      },
      {
        id: 'f3-q13',
        type: 'short',
        prompt: 'In one sentence, state the difference between a functional and a non-functional requirement.',
        points: 1,
        keywords: ['what', 'does', 'how well', 'quality', 'behaviour', 'behavior', 'performance'],
        sampleAnswer:
          'Functional describes what the solution does (a behaviour or feature); non-functional describes how well it does it (a quality such as performance, security, or usability).',
        explanation:
          'Functional = what it does; non-functional = how well it does it.',
      },
    ],
  },
}

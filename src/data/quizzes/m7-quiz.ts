import type { Quiz } from '@/types'

// ============================================================================
// MODULE 7 QUIZZES — Requirements Analysis & Design Definition (RADD)
// Practice quizzes keyed by lesson id (ra1–ra4). Each quiz mixes mcq /
// truefalse / short questions and is graded against passingScore.
// Content mirrors src/data/modules/module7-radd.ts.
// ============================================================================

export const quizzesM7: Record<string, Quiz> = {
  // ------------------------------------------------------------------ RA1
  'ra1': {
    id: 'quiz-ra1',
    passingScore: 60,
    questions: [
      { id: 'ra1-q1', type: 'mcq', prompt: 'Which template correctly frames a user story?', points: 1,
        options: [
          'I want <goal> using <system>, then <role>',
          'As a <role>, I want <goal>, so that <benefit>',
          'Given <role>, When <goal>, Then <benefit>',
          'Build <feature> for <role> by <date>',
        ],
        correctIndex: 1,
        explanation: 'A user story states the role, the goal, and the value: "As a <role>, I want <goal>, so that <benefit>."' },

      { id: 'ra1-q2', type: 'mcq', prompt: 'In INVEST, which letter means you can prove the story is done?', points: 1,
        options: ['Independent', 'Negotiable', 'Testable', 'Estimable'],
        correctIndex: 2,
        explanation: 'Testable means the story has acceptance criteria so you can prove it is done.' },

      { id: 'ra1-q3', type: 'mcq', prompt: 'Which three keywords structure a Gherkin acceptance-criteria scenario?', points: 1,
        options: ['Role / Goal / Benefit', 'Given / When / Then', 'Start / Do / End', 'Actor / Flow / Exception'],
        correctIndex: 1,
        explanation: 'Gherkin makes "done" testable with Given (context), When (action), Then (outcome).' },

      { id: 'ra1-q4', type: 'mcq', prompt: 'What is the correct top-down decomposition of a large need?', points: 1,
        options: ['Story → Feature → Epic', 'Feature → Epic → Story', 'Epic → Feature → Story', 'Epic → Story → Feature'],
        correctIndex: 2,
        explanation: 'A big need decomposes from Epic (large body of work) to Feature (coherent slice) to Story (one INVEST-sized increment).' },

      { id: 'ra1-q5', type: 'mcq', prompt: 'When is a use case the better tool than a user story?', points: 1,
        options: [
          'When you want the smallest possible negotiable increment',
          'When the interaction is procedural and branch-heavy, with a main flow plus alternate/exception flows',
          'When you only care about the benefit, not the steps',
          'When the team refuses to write acceptance criteria',
        ],
        correctIndex: 1,
        explanation: 'A use case describes an actor pursuing a goal via a main flow plus alternate/exception flows — ideal when the interaction is procedural and branch-heavy.' },

      { id: 'ra1-q6', type: 'mcq', prompt: 'The story "Build an approval button" most clearly fails which INVEST criterion?', points: 1,
        options: ['Independent', 'Estimable', 'Small', 'Valuable'],
        correctIndex: 3,
        explanation: 'It names a UI control but no role or benefit, so it fails Valuable (and arguably Testable and Negotiable).' },

      { id: 'ra1-q7', type: 'mcq', prompt: 'A use case is built around which core element pursuing a goal?', points: 1,
        options: ['A gateway', 'An actor', 'A primary key', 'A swimlane'],
        correctIndex: 1,
        explanation: 'A use case describes an actor achieving a goal through a main flow and alternate flows.' },

      { id: 'ra1-q8', type: 'truefalse', prompt: 'A good user story states the value/benefit, not just the feature.', points: 1,
        correctBool: true,
        explanation: 'The "so that <benefit>" clause captures the value; a story without it fails Valuable.' },

      { id: 'ra1-q9', type: 'truefalse', prompt: 'User stories and use cases are rivals — using one means you can never use the other.', points: 1,
        correctBool: false,
        explanation: 'They are not rivals. An epic can be a use case, and its steps and exceptions become the individual stories.' },

      { id: 'ra1-q10', type: 'truefalse', prompt: 'The "S" in INVEST means a story should be Small enough to fit in a sprint.', points: 1,
        correctBool: true,
        explanation: 'Small means it fits in a sprint and can be split if it is too big.' },

      { id: 'ra1-q11', type: 'short', prompt: 'Write out the standard user story template.', points: 1,
        keywords: ['as a', 'role', 'want', 'goal', 'so that', 'benefit'],
        sampleAnswer: 'As a <role>, I want <goal>, so that <benefit>.',
        explanation: 'The template names the role, the goal, and the benefit/value.' },

      { id: 'ra1-q12', type: 'short', prompt: 'What does the acronym INVEST stand for?', points: 1,
        keywords: ['independent', 'negotiable', 'valuable', 'estimable', 'small', 'testable'],
        sampleAnswer: 'Independent, Negotiable, Valuable, Estimable, Small, Testable.',
        explanation: 'INVEST is the checklist for judging user story quality.' },

      { id: 'ra1-q13', type: 'short', prompt: 'In one sentence, when should you reach for a use case instead of a user story?', points: 1,
        keywords: ['branch', 'alternate', 'flow', 'procedural', 'step', 'exception', 'many'],
        sampleAnswer: 'When the interaction is procedural and branch-heavy — a main flow with many alternate/exception flows, like approvals or multi-step wizards.',
        explanation: 'Use cases suit branch-heavy, procedural interactions; stories suit small negotiable value increments.' },
    ],
  },

  // ------------------------------------------------------------------ RA2
  'ra2': {
    id: 'quiz-ra2',
    passingScore: 60,
    questions: [
      { id: 'ra2-q1', type: 'mcq', prompt: 'In BPMN, what does a diamond represent?', points: 1,
        options: ['An activity', 'A gateway (decision or branch/merge)', 'A start event', 'A swimlane'],
        correctIndex: 1,
        explanation: 'A diamond is a gateway — a decision or branch/merge in the flow.' },

      { id: 'ra2-q2', type: 'mcq', prompt: 'A rounded rectangle in BPMN represents…', points: 1,
        options: ['A decision', 'A participant', 'An activity or task (a unit of work)', 'The end of the process'],
        correctIndex: 2,
        explanation: 'A rounded rectangle is an activity/task — a unit of work someone performs.' },

      { id: 'ra2-q3', type: 'mcq', prompt: 'A thin circle in BPMN marks…', points: 1,
        options: ['A gateway', 'A start or end event', 'A sequence flow', 'A data object'],
        correctIndex: 1,
        explanation: 'A thin circle is a start or end event — where the process begins and finishes.' },

      { id: 'ra2-q4', type: 'mcq', prompt: 'What is the relationship between a pool and a lane in BPMN?', points: 1,
        options: [
          'A pool is a decision; a lane is an activity',
          'A pool is a participant; the lanes inside it are its roles',
          'A pool is a role; a lane is a participant',
          'They are two words for the same thing',
        ],
        correctIndex: 1,
        explanation: 'A pool is a participant (e.g. the company); lanes inside it are the roles such as Employee, Manager, Accountant.' },

      { id: 'ra2-q5', type: 'mcq', prompt: 'An As-Is process model shows…', points: 1,
        options: [
          'The improved future process after your changes',
          'The process as it works today, including its delays and rework loops',
          'Only the automated steps',
          'The data entities and their keys',
        ],
        correctIndex: 1,
        explanation: 'As-Is is the current process, warts and all, modelled to find delays, rework loops and manual hand-offs.' },

      { id: 'ra2-q6', type: 'mcq', prompt: 'A To-Be process model represents…', points: 1,
        options: [
          'The current manual process',
          'The improved future process after your recommended changes',
          'A list of stakeholders',
          'The database schema',
        ],
        correctIndex: 1,
        explanation: 'To-Be is the improved future state after automation, removed steps and straight-through flow.' },

      { id: 'ra2-q7', type: 'mcq', prompt: 'The gap between the As-Is and To-Be models is essentially…', points: 1,
        options: [
          'A modelling error to be removed',
          'Your improvement recommendation, made visible',
          'The list of BPMN symbols used',
          'The set of primary keys',
        ],
        correctIndex: 1,
        explanation: 'The difference between the two models is the improvement recommendation shown visually.' },

      { id: 'ra2-q8', type: 'truefalse', prompt: 'A gateway in BPMN represents a decision or a branch/merge in the flow.', points: 1,
        correctBool: true,
        explanation: 'The diamond-shaped gateway is where the flow branches or merges on a decision.' },

      { id: 'ra2-q9', type: 'truefalse', prompt: 'It is best practice to design the To-Be model first and skip the As-Is model.', points: 1,
        correctBool: false,
        explanation: 'Never jump straight to To-Be. An honest As-Is model earns trust and reveals which steps to eliminate.' },

      { id: 'ra2-q10', type: 'truefalse', prompt: 'Swimlanes make responsibility explicit by showing which role performs each activity.', points: 1,
        correctBool: true,
        explanation: 'Placing each activity in a lane makes hand-offs and bottlenecks obvious.' },

      { id: 'ra2-q11', type: 'short', prompt: 'Name the BPMN symbol used to show a decision or branch in the flow.', points: 1,
        keywords: ['gateway', 'diamond'],
        sampleAnswer: 'A gateway, drawn as a diamond.',
        explanation: 'The diamond gateway marks a decision or branch/merge.' },

      { id: 'ra2-q12', type: 'short', prompt: 'In one sentence, explain the difference between an As-Is and a To-Be model.', points: 1,
        keywords: ['current', 'today', 'future', 'improved', 'as-is', 'to-be'],
        sampleAnswer: 'As-Is is the process as it works today; To-Be is the improved future process after your recommended changes.',
        explanation: 'As-Is = current state; To-Be = improved future state.' },

      { id: 'ra2-q13', type: 'short', prompt: 'Give one reason to model the As-Is process before designing the To-Be.', points: 1,
        keywords: ['delay', 'rework', 'hand-off', 'trust', 'baseline', 'waste', 'pain'],
        sampleAnswer: 'It surfaces the real delays, rework loops and hand-offs, builds stakeholder trust, and gives a baseline to measure the To-Be against.',
        explanation: 'An honest As-Is targets real pain and provides a measurable baseline.' },
    ],
  },

  // ------------------------------------------------------------------ RA3
  'ra3': {
    id: 'quiz-ra3',
    passingScore: 60,
    questions: [
      { id: 'ra3-q1', type: 'mcq', prompt: 'In an entity-relationship diagram, an entity is…', points: 1,
        options: [
          'A property of a thing, like a name or date',
          'A thing the business stores data about, such as Customer or Invoice',
          'A connection between two tables',
          'The order in which steps happen',
        ],
        correctIndex: 1,
        explanation: 'An entity is a thing we store data about; its properties are attributes.' },

      { id: 'ra3-q2', type: 'mcq', prompt: 'A primary key (PK) is…', points: 1,
        options: [
          'A copy of another entity\'s key used to link entities',
          'A value that uniquely identifies each row of an entity',
          'A many-to-many relationship',
          'An attribute that can repeat freely',
        ],
        correctIndex: 1,
        explanation: 'A primary key uniquely identifies each row of an entity, e.g. CustomerID.' },

      { id: 'ra3-q3', type: 'mcq', prompt: 'A foreign key (FK) is…', points: 1,
        options: [
          'A primary key copied into another entity to link them',
          'An attribute with no purpose',
          'A gateway between two processes',
          'A synonym for entity',
        ],
        correctIndex: 0,
        explanation: 'A foreign key is a PK copied into another entity to link them, e.g. Invoice.CustomerID points back to Customer.' },

      { id: 'ra3-q4', type: 'mcq', prompt: 'One Customer can have many Invoices. What cardinality is this?', points: 1,
        options: ['1:1 (one-to-one)', '1:M (one-to-many)', 'M:N (many-to-many)', 'None'],
        correctIndex: 1,
        explanation: 'One customer relates to many invoices — a one-to-many (1:M) relationship.' },

      { id: 'ra3-q5', type: 'mcq', prompt: 'Before adding a link entity, the relationship between Invoice and Product is…', points: 1,
        options: ['1:1', '1:M', 'M:N (many-to-many)', 'There is no relationship'],
        correctIndex: 2,
        explanation: 'An invoice can list many products and a product can appear on many invoices — a many-to-many relationship.' },

      { id: 'ra3-q6', type: 'mcq', prompt: 'How is a many-to-many relationship typically resolved in an ERD?', points: 1,
        options: [
          'By deleting one of the entities',
          'By adding a link/junction entity between them',
          'By making both keys foreign',
          'By converting it to one-to-one',
        ],
        correctIndex: 1,
        explanation: 'A many-to-many is resolved with a link/junction entity, such as InvoiceLineItem.' },

      { id: 'ra3-q7', type: 'mcq', prompt: 'Which question does verifying a requirement ask?', points: 1,
        options: [
          'Are we building the right thing?',
          'Are we building it right?',
          'Who is the sponsor?',
          'How much will it cost?',
        ],
        correctIndex: 1,
        explanation: 'Verification asks "Are we building it right?" — checking the quality of the requirement itself.' },

      { id: 'ra3-q8', type: 'mcq', prompt: 'Which question does validating a requirement ask?', points: 1,
        options: [
          'Are we building the right thing?',
          'Is the wording free of typos?',
          'Is the diagram colourful?',
          'Is the key unique?',
        ],
        correctIndex: 0,
        explanation: 'Validation asks "Are we building the right thing?" — checking fit with the business need and value.' },

      { id: 'ra3-q9', type: 'truefalse', prompt: 'A foreign key is what uniquely identifies each row of its own entity.', points: 1,
        correctBool: false,
        explanation: 'A primary key uniquely identifies a row; a foreign key links to another entity\'s primary key.' },

      { id: 'ra3-q10', type: 'truefalse', prompt: 'Verification checks the quality of the requirement itself — clear, complete, consistent, testable and unambiguous.', points: 1,
        correctBool: true,
        explanation: 'Verification focuses on the quality of the requirement, not its business fit.' },

      { id: 'ra3-q11', type: 'truefalse', prompt: 'A perfectly well-written (verified) requirement is guaranteed to be the right thing to build.', points: 1,
        correctBool: false,
        explanation: 'A requirement can be verified yet still fail validation — a tidy model of the wrong domain. You need both.' },

      { id: 'ra3-q12', type: 'short', prompt: 'In one sentence, distinguish verifying a requirement from validating it.', points: 1,
        keywords: ['right', 'quality', 'value', 'business', 'building it right', 'right thing'],
        sampleAnswer: 'Verify asks "are we building it right?" (quality of the requirement); validate asks "are we building the right thing?" (fit with business need and value).',
        explanation: 'Verify = quality of the requirement; validate = business fit and value.' },

      { id: 'ra3-q13', type: 'short', prompt: 'Name the three core building blocks of an entity-relationship diagram.', points: 1,
        keywords: ['entity', 'attribute', 'relationship'],
        sampleAnswer: 'Entities, attributes and relationships.',
        explanation: 'An ERD captures entities (things), their attributes (properties), and the relationships between them.' },

      { id: 'ra3-q14', type: 'short', prompt: 'State the cardinality between one Invoice and its Invoice Line Items, and why.', points: 1,
        keywords: ['1:m', 'one-to-many', 'many', 'line item'],
        sampleAnswer: '1:M (one-to-many) — one invoice contains many line items, but each line item belongs to a single invoice.',
        explanation: 'One invoice has many line items, so the relationship is one-to-many.' },
    ],
  },

  // ------------------------------------------------------------------ RA4
  'ra4': {
    id: 'quiz-ra4',
    passingScore: 60,
    questions: [
      { id: 'ra4-q1', type: 'mcq', prompt: 'Requirements architecture is best described as…', points: 1,
        options: [
          'A single user story with acceptance criteria',
          'The structure showing how all requirements fit together and support the business objectives',
          'The physical database design',
          'A list of stakeholders and their contact details',
        ],
        correctIndex: 1,
        explanation: 'Requirements architecture is the structure showing how stories, models and rules fit together as a coherent whole supporting business objectives.' },

      { id: 'ra4-q2', type: 'mcq', prompt: 'Which set describes the qualities of a good requirements architecture?', points: 1,
        options: [
          'Fast, cheap, colourful',
          'Complete, consistent, traceable',
          'Independent, negotiable, testable',
          'Start, activity, end',
        ],
        correctIndex: 1,
        explanation: 'A good architecture is complete (no gaps), consistent (no contradictions) and traceable (links to goals and design).' },

      { id: 'ra4-q3', type: 'mcq', prompt: 'A design option is…', points: 1,
        options: [
          'A stakeholder complaint',
          'A concrete way to satisfy the requirements',
          'The colour scheme of a report',
          'A primary key',
        ],
        correctIndex: 1,
        explanation: 'A design option is a concrete way to satisfy the requirements — and there is almost always more than one.' },

      { id: 'ra4-q4', type: 'mcq', prompt: 'Which of these is a typical design option for a reporting need?', points: 1,
        options: [
          'Ignore the requirement',
          'Buy/configure an off-the-shelf product',
          'Delete the existing ERP',
          'Reduce the passing score',
        ],
        correctIndex: 1,
        explanation: 'Typical options are: build custom, buy/configure off-the-shelf, or extend an existing system such as the ERP.' },

      { id: 'ra4-q5', type: 'mcq', prompt: 'What is the main advantage of buying an off-the-shelf product?', points: 1,
        options: [
          'Maximum fit and full control',
          'Faster and cheaper to start, and maintained by the vendor',
          'No need to adapt to how it works',
          'It always fits every requirement exactly',
        ],
        correctIndex: 1,
        explanation: 'Buying is faster and cheaper to start and is vendor-maintained, but you adapt to its way of working.' },

      { id: 'ra4-q6', type: 'mcq', prompt: 'What is the main drawback of building a custom solution?', points: 1,
        options: [
          'It never fits the requirements',
          'Higher cost, longer time, and an ongoing maintenance burden you own',
          'You cannot control it',
          'It is always vendor-maintained',
        ],
        correctIndex: 1,
        explanation: 'Building gives maximum fit and control but costs more, takes longer and leaves you owning the maintenance.' },

      { id: 'ra4-q7', type: 'mcq', prompt: 'How should candidate design options be compared before recommending one?', points: 1,
        options: [
          'By picking the cheapest without analysis',
          'By scoring each against weighted criteria to produce a weighted score',
          'By whoever shouts loudest',
          'By counting the number of requirements',
        ],
        correctIndex: 1,
        explanation: 'You score each option against weighted criteria (fit, cost, time, maintainability, risk) and turn the ratings into a weighted score.' },

      { id: 'ra4-q8', type: 'truefalse', prompt: 'There is usually only one valid design option for a set of requirements.', points: 1,
        correctBool: false,
        explanation: 'There is almost always more than one option — build, buy or extend, among others.' },

      { id: 'ra4-q9', type: 'truefalse', prompt: 'Making the weights and scores explicit lets stakeholders debate the criteria rather than just your conclusion.', points: 1,
        correctBool: true,
        explanation: 'A recommendation is only as trustworthy as its criteria, so make the weights and scores visible.' },

      { id: 'ra4-q10', type: 'short', prompt: 'Name the three qualities of a good requirements architecture.', points: 1,
        keywords: ['complete', 'consistent', 'traceable'],
        sampleAnswer: 'Complete, consistent and traceable.',
        explanation: 'Complete = no gaps; consistent = no contradictions; traceable = links to goals and design.' },

      { id: 'ra4-q11', type: 'short', prompt: 'In one sentence, state the core make-versus-buy trade-off.', points: 1,
        keywords: ['make', 'build', 'buy', 'fit', 'control', 'cost', 'faster', 'maintain', 'vendor'],
        sampleAnswer: 'Make (build) gives the best fit and full control but higher cost, longer time and ongoing maintenance; buy is faster, cheaper and vendor-maintained but you adapt to its way of working.',
        explanation: 'Build = fit and control at higher cost; buy = speed and vendor support at the cost of adapting to the product.' },

      { id: 'ra4-q12', type: 'short', prompt: 'List three weighted criteria you might use to evaluate design options.', points: 1,
        keywords: ['fit', 'cost', 'time', 'maintainability', 'risk'],
        sampleAnswer: 'For example: fit to requirements, cost to build and run, time to deliver, maintainability, and risk.',
        explanation: 'Common weighted criteria are fit, cost, time to deliver, maintainability and risk.' },
    ],
  },
}

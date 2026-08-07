import type { Module } from '@/types'

// ============================================================================
// MODULE 4 — Elicitation & Collaboration
// BABOK v3 Knowledge Area 2. Authored to the same contract as the Module 1
// exemplar (module1-powerbi.ts): lessons carry NO quiz field; the assessment
// lives in the module exam (m4-elicitation-exam.ts).
// ============================================================================

export const module4Elicitation: Module = {
  id: 'm4-elicitation',
  code: 'M4',
  title: 'Elicitation & Collaboration',
  description:
    'BABOK Knowledge Area 2: prepare for and conduct elicitation, confirm results, communicate BA information, and manage stakeholder collaboration.',
  icon: '🎤',
  accent: 'from-cyan-500 to-teal-500',
  lessons: [
    // ----------------------------------------------------------------- EL1
    {
      id: 'el1',
      code: 'EL1',
      title: 'Prepare for & Conduct Elicitation',
      summary:
        'Choose the right elicitation technique, prepare properly, and run a session that actually surfaces the real requirements.',
      moduleId: 'm4-elicitation',
      objectives: [
        'Name the core elicitation techniques and when each is appropriate',
        'Prepare for elicitation: scope, stakeholders, logistics, and supporting materials',
        'Conduct an elicitation session and capture results without losing detail',
        'Select a technique to fit the stakeholder, the information, and the constraints',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['pm3'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Elicitation & Collaboration (KA 2)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The IIBA reference for this knowledge area.' },
        { type: 'reading', title: 'Elicitation techniques overview (Modern Analyst)', url: 'https://www.modernanalyst.com/', description: 'Practical rundown of interviews, workshops, observation and more.' },
        { type: 'video', title: 'Requirements elicitation techniques explained', url: 'https://www.iiba.org/', meta: '15 min', description: 'A tour of when to use which technique.' },
      ],
      content: `## Elicitation in BABOK

**Elicitation** is how a Business Analyst draws information out of stakeholders and other sources. The word matters: it is *not* "requirements gathering." Requirements rarely sit ready to be picked up like apples. Stakeholders frequently cannot fully articulate what they do or what they need — so you must actively **draw it out**.

BABOK splits this work into three tasks:

\`\`\`mermaid
flowchart LR
  A[Prepare for<br/>Elicitation] --> B[Conduct<br/>Elicitation]
  B --> C[Confirm<br/>Results]
  C -.->|gaps found| B
\`\`\`

This lesson covers **Prepare** and **Conduct**. Confirming results is the focus of EL2.

## Core elicitation techniques

There is no single "best" technique — you pick based on the stakeholder, the kind of information, and your constraints (time, distance, access).

| Technique | Best when... |
|-----------|--------------|
| **Interviews** | You need depth from one or a few people; the topic is nuanced or sensitive. |
| **Workshops** | You need many stakeholders to align quickly and build shared understanding. |
| **Observation / job-shadowing** | The stakeholder does the work but can't fully *explain* it (tacit knowledge). |
| **Surveys / questionnaires** | You need input from many people, cheaply, on well-understood questions. |
| **Document analysis** | Existing procedures, reports, or system specs already hold the answers. |
| **Prototyping** | Requirements are unclear until people can *see and react* to something concrete. |
| **Brainstorming** | You need a wide range of ideas or options before narrowing down. |

## Preparing for elicitation

Preparation is where amateurs and professionals diverge. Before any session:

- **Define the scope & goal** — what specifically do you need to learn from *this* activity?
- **Identify the stakeholders** — who has the knowledge, and who has authority?
- **Choose the technique(s)** — fit the technique to the information and the people.
- **Prepare supporting materials** — question lists, a current-state diagram, sample documents.
- **Arrange logistics** — invite the right people, book the room/call, set an agenda and time-box.
- **Set expectations** — tell participants the purpose and what you'll do with the results.

## Conducting elicitation

During the session your job is to draw out and *capture* information:

- **Ask open questions first** ("Walk me through how you close the month"), then close in on specifics.
- **Listen more than you talk** — silence invites detail.
- **Probe the "why"** behind each step; that is where hidden rules and pain points live.
- **Capture accurately** — take notes, sketch the process, and read key points back to confirm.
- **Watch for tacit knowledge** — steps people do automatically and forget to mention.

## How to choose a technique

Ask yourself:

1. **How many people?** One or two → interview. Many → workshop or survey.
2. **Is the knowledge explicit or tacit?** Explicit and written → document analysis. Tacit and hands-on → observation.
3. **Is the need clear?** Fuzzy → prototyping or brainstorming to make it concrete.
4. **What are the constraints?** Remote, low budget, or wide audience → survey.

Most real projects **combine** techniques: document analysis to learn the basics, interviews to go deep, then a workshop to align everyone.

> **BA takeaway:** Elicitation is active, not passive. If a stakeholder could hand you a perfect requirements list, they wouldn't need a BA. Your value is drawing out what they can't easily say.`,
      realWorldExample: `**From your world (accounting/ERP):**

A senior accountant runs the month-end close in MISA, but every time you ask "what are the steps?" you get a vague answer: *"I just... do the reconciliation and then post the entries."* She has done it for years — the process is **tacit knowledge**, so real it's invisible to her.

An interview alone keeps failing. So you switch techniques and **observe / job-shadow**:

1. You sit beside her at the real month-end and watch her work in MISA.
2. You notice she exports a trial balance to Excel, cross-checks three accounts against bank statements, and *manually* adjusts a rounding difference — a step she never mentioned.
3. You sketch the actual sequence as she goes and read it back: *"So after the trial balance export, you reconcile these three accounts, and this rounding fix happens every month?"*
4. She corrects one detail and confirms the rest.

In 90 minutes of observation you captured a process that weeks of interviews never surfaced — including the hidden rounding rule that any future automation must handle. That is the power of matching the technique to the stakeholder.`,
      exercises: [
        {
          id: 'el1-e1',
          title: 'Pick the technique',
          prompt: 'For each situation, name the most appropriate elicitation technique and why: (a) 40 branch staff must give input on a proposed expense-claim form; (b) a warehouse clerk performs a stock-count process they struggle to explain; (c) the finance director wants a say in the reporting scope but only has 30 minutes.',
          hint: 'Match number of people + explicit vs. tacit knowledge + constraints.',
          sampleSolution: '(a) Survey / questionnaire — many people, well-understood questions, cheap to distribute. (b) Observation / job-shadowing — the knowledge is tacit and hands-on, so watch it happen. (c) Interview — one senior person, limited time, needs a focused, structured conversation.',
        },
        {
          id: 'el1-e2',
          title: 'Prepare the session',
          prompt: 'You are about to interview an accountant to understand the accounts-receivable follow-up process. List five things you would do to PREPARE before the interview.',
          sampleSolution: '1) Define the goal: understand how overdue invoices are chased and escalated. 2) Confirm the accountant is the right person (has the knowledge/authority). 3) Prepare an open-to-specific question list. 4) Review existing materials first (the current AR report / SOP) so you don\'t waste time on basics. 5) Arrange logistics: book a 45-min slot, share the purpose in advance, and prepare to sketch the process live and read it back.',
        },
      ],
      assignment: {
        id: 'el1-assignment',
        title: 'Write an Elicitation Plan + Interview Questions',
        brief:
          'You have been assigned to understand and improve the month-end close process for a small business using an accounting system (e.g., MISA). Produce an elicitation plan and a set of interview questions you would use with the accountant and the finance manager.',
        deliverable:
          'A one-to-two page document containing: (1) the elicitation goal and scope; (2) the stakeholders to involve and why; (3) the technique(s) chosen with justification; (4) logistics/agenda; and (5) at least 8 interview questions ordered from open (context) to specific (detail), including at least two "why/what-if" probing questions.',
        rubric: [
          'States a clear, scoped elicitation goal',
          'Identifies the right stakeholders and their relevance',
          'Justifies the technique(s) chosen against the situation',
          'Questions progress from open/context to specific/detail',
          'Includes probing questions that surface tacit knowledge and hidden rules',
        ],
      },
      deliverables: ['An elicitation plan for the month-end close process', 'A structured interview question set (open → specific)'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Complete both exercises and submit the elicitation-plan assignment'],
      portfolioArtifact: {
        type: 'Requirement Doc',
        title: 'Elicitation Plan & Interview Guide',
        description: 'A stakeholder-specific elicitation plan and interview guide demonstrating technique selection and preparation for a real accounting process.',
      },
    },

    // ----------------------------------------------------------------- EL2
    {
      id: 'el2',
      code: 'EL2',
      title: 'Confirm Results & Communicate BA Information',
      summary:
        'Validate that what you elicited is accurate and complete, then package and communicate it in the format each audience actually needs.',
      moduleId: 'm4-elicitation',
      objectives: [
        'Confirm elicitation results for accuracy and completeness (no gaps or contradictions)',
        'Distinguish "confirming results" (still elicitation) from formal requirements validation',
        'Communicate business analysis information clearly to different audiences',
        'Tailor the format and level of detail of BA information to the audience',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['el1'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Confirm Elicitation Results', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The task definition and its inputs/outputs.' },
        { type: 'reading', title: 'Communicating requirements to stakeholders', url: 'https://www.modernanalyst.com/', description: 'Formats and tailoring for different audiences.' },
      ],
      content: `## Why confirm elicitation results?

You captured a lot in EL1 — but notes taken at speed are full of **misunderstandings, gaps, and contradictions**. Confirming results means checking your captured information back **with the stakeholders and against other sources** before you build anything on top of it.

Two things to check:

- **Accuracy** — does the information match what the stakeholder actually meant? (Did you mishear "net" as "gross"? Did you record the rule backwards?)
- **Completeness** — are there gaps or steps that were skipped? Do two stakeholders contradict each other?

> **Nuance:** "Confirm elicitation results" is *still part of elicitation* — a lightweight, collaborative check. It is **not** the same as the formal **Requirements Validation** task (a later, more rigorous sign-off that requirements deliver value). Don't confuse the two.

Common ways to confirm:

- **Read-back / walkthrough** — replay the process or rules to the stakeholder and watch for corrections.
- **Cross-reference** — compare what one person said against documents or another person's account.
- **Review sessions** — circulate notes/diagrams and ask for confirmation or edits.

## Communicating BA information

Elicited information is worthless if the right people can't understand it. **Communicate Business Analysis Information** is its own BABOK task: you deliver the right information, to the right stakeholders, in the right form, so they can *act* on it.

Good BA communication is:

- **Clear** — plain language, no unexplained jargon.
- **Purposeful** — the audience knows what decision or action it supports.
- **Appropriately detailed** — enough to be useful, not so much it buries the point.
- **Two-way** — you invite questions and confirm understanding, not just "send and pray."

## Tailor format and detail to the audience

The same requirement is communicated very differently depending on who is receiving it:

| Audience | Format they need | Detail level |
|----------|------------------|--------------|
| **Executive sponsor** | One-page summary, goals, cost/benefit | Low — outcomes and decisions |
| **Business/finance stakeholder** | Process diagrams, plain-language rules, examples | Medium — the "what" and "why" |
| **Developers / QA** | Detailed requirements, acceptance criteria, data rules | High — precise, testable specifics |
| **Whole project group** | Workshop, walkthrough, shared diagram | Medium — enough to align everyone |

**Rule of thumb:** match the *form* to how the audience consumes information and the *detail* to what they must decide or build. A developer needs the exact rounding rule; the sponsor only needs to know the close will be faster and less error-prone.

> **BA takeaway:** Confirming closes the loop on *what you learned*; communicating opens the loop to *everyone who needs it*. Both are collaboration skills, not paperwork.`,
      realWorldExample: `**From your world (accounting/ERP):**

After eliciting the bank-reconciliation requirements, you drafted a summary: *"The system flags any invoice where the bank-statement amount differs from the ledger amount by more than 1,000 VND."*

You **confirm** this with the finance stakeholders in a 20-minute walkthrough:

1. You read the rule back and show a small worked example on screen.
2. The chief accountant stops you: it's actually a *tolerance of 1,000 VND OR 0.5%, whichever is larger* — you had only captured the fixed amount. **Gap found.**
3. A second accountant adds that foreign-currency invoices are reconciled differently. **Contradiction/scope gap surfaced.**

You update the notes and read them back again until everyone agrees. Then you **communicate** the confirmed rule two ways: a plain-language one-liner plus a worked example for the finance manager, and a precise, testable acceptance criterion ("tolerance = MAX(1000 VND, 0.5% of ledger amount); FX invoices excluded — see rule R-12") for the developers. Same requirement, two audiences, two formats.`,
      exercises: [
        {
          id: 'el2-e1',
          title: 'Confirm and find the gap',
          prompt: 'You wrote: "Overdue invoices are escalated to the finance manager after 30 days." Describe how you would CONFIRM this with stakeholders and give one example of a gap or contradiction this check might reveal.',
          hint: 'Think read-back plus cross-referencing a second stakeholder or a document.',
          sampleSolution: 'Read the rule back to the accountant and cross-check it against the AR procedure document and a second stakeholder. A likely gap: escalation is actually 30 days for normal customers but 15 days for high-risk accounts, or the "30 days" is from invoice date for some and from due date for others — a contradiction the read-back exposes.',
        },
        {
          id: 'el2-e2',
          title: 'Tailor the message',
          prompt: 'A confirmed requirement is: "Automate the monthly reconciliation, cutting close time from 3 days to 1." Write how you would communicate this to (a) the executive sponsor and (b) the development team.',
          sampleSolution: '(a) Sponsor: one-line outcome + benefit — "Automating reconciliation cuts month-end close from 3 days to 1, freeing the finance team and reducing errors." No technical detail. (b) Developers: precise, testable spec — the exact matching/tolerance rules, data sources (bank statement + ledger), edge cases (FX, rounding), and acceptance criteria so it can be built and tested.',
        },
      ],
      deliverables: ['A confirmed, gap-checked set of requirements notes', 'The same requirement communicated in two audience-appropriate formats'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Complete both exercises'],
    },

    // ----------------------------------------------------------------- EL3
    {
      id: 'el3',
      code: 'EL3',
      title: 'Manage Stakeholder Collaboration',
      summary:
        'Build and sustain the stakeholder relationships that make elicitation work — including managing conflict and reaching real agreement across the project lifecycle.',
      moduleId: 'm4-elicitation',
      objectives: [
        'Build and maintain productive working relationships with stakeholders',
        'Manage stakeholder conflicts and competing needs constructively',
        'Facilitate agreements and record commitments so they stick',
        'Sustain engagement across the whole project lifecycle, not just at the start',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['el2'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Manage Stakeholder Collaboration', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The task, its purpose, and techniques.' },
        { type: 'reading', title: 'Stakeholder engagement & conflict resolution', url: 'https://www.modernanalyst.com/', description: 'Practical collaboration and negotiation guidance.' },
      ],
      content: `## Collaboration is the job under the job

Every technique in EL1 and EL2 depends on one thing: **stakeholders who are willing to work with you.** Manage Stakeholder Collaboration is the ongoing BABOK task of building trust, keeping people engaged, and resolving the friction that inevitably appears.

## Build and maintain relationships

Stakeholders cooperate when they trust you and see value in participating.

- **Be reliable** — do what you said, follow up, close loops.
- **Show you listened** — reflect their input back in your artifacts; credit their ideas.
- **Respect their time** — come prepared, keep sessions focused, share outcomes quickly.
- **Communicate honestly** about progress, trade-offs, and constraints.

## Manage conflict and competing needs

Different stakeholders want different, sometimes contradictory things. Conflict is normal — mishandled conflict is the danger.

| When you see... | Do this |
|-----------------|---------|
| **Competing priorities** | Surface the underlying *interests* behind each position, not just the demands. |
| **A factual disagreement** | Get data or a shared example on the table; let evidence, not volume, decide. |
| **A power imbalance** | Make sure quieter stakeholders are heard; document their concerns. |
| **A genuine trade-off** | Escalate the decision to the right authority with clear options and impacts. |

The goal is not to "win" but to reach a decision the group can **commit to**.

## Reach and record agreements

An agreement that lives only in people's memories will be re-litigated next week.

- **Confirm the decision explicitly** in the room ("So we've agreed X — yes?").
- **Write it down** — the decision, the rationale, who agreed, and any conditions.
- **Make trade-offs visible** so no one feels ambushed later.

## Engage across the whole lifecycle

Collaboration is not a kickoff event. Stakeholder engagement must be sustained:

\`\`\`mermaid
flowchart LR
  A[Initiate<br/>build rapport] --> B[Elicit<br/>active input]
  B --> C[Confirm & decide<br/>reach agreement]
  C --> D[Deliver & change<br/>keep informed]
  D --> A
\`\`\`

Stakeholders who feel ignored mid-project stop giving good information. Keep them informed, keep asking, and keep showing how their input shaped the result.

> **BA takeaway:** You can master every technique and still fail if the people won't engage. Collaboration is the relationship layer that makes elicitation and requirements work possible.`,
      realWorldExample: `**From your world (accounting/ERP):**

You're specifying a new expense-approval workflow. The **accounting department** wants strict, multi-step approvals so every claim is fully documented before payment. The **audit department** wants an immutable log and mandatory receipts on *every* line, no exceptions. Each side treats its need as non-negotiable, and meetings are turning tense.

Managing the collaboration:

1. **Separate positions from interests.** Accounting's real interest is *control and speed of payment*; audit's is *traceability and compliance*. Stated that way, they're not actually opposed.
2. **Put a shared example on the table** — a real expense claim — and walk both sides through it, so the debate is about facts, not egos.
3. **Find the overlap:** a workflow with tiered approvals (fast-track for small, well-documented claims) plus a complete, immutable audit log satisfies both interests.
4. **Record the agreement:** the tiered thresholds, the mandatory-receipt rule above a limit, who signed off, and the rationale — so nobody reopens it next sprint.
5. **Keep both engaged** through build and testing, showing each that the delivered workflow honours their concern.

You didn't pick a winner; you found the solution both departments could commit to — the essence of stakeholder collaboration.`,
      exercises: [
        {
          id: 'el3-e1',
          title: 'Positions vs. interests',
          prompt: 'Two stakeholders clash: Sales wants invoices editable after issue "to fix mistakes fast"; Finance wants them locked "for audit integrity." Identify the underlying interest behind each position and propose one agreement that could satisfy both.',
          hint: 'Ask what each side is really trying to protect.',
          sampleSolution: 'Sales\' interest is correcting genuine errors quickly; Finance\'s interest is an auditable, tamper-proof record. Both are met by: invoices are locked once issued, but a controlled "credit note / corrected invoice" flow lets Sales fix mistakes fast while Finance keeps a full, traceable history. Record the rule and who approved it.',
        },
        {
          id: 'el3-e2',
          title: 'Make the agreement stick',
          prompt: 'After a heated workshop the group verbally agrees on an approval threshold. List three things you would capture so the decision is not re-litigated next week.',
          sampleSolution: '1) The exact decision (e.g., claims under 2,000,000 VND are single-approval, above are dual-approval). 2) The rationale and the trade-off accepted. 3) Who agreed / signed off and any conditions or review date — captured in writing and shared back to all participants.',
        },
      ],
      deliverables: ['A short conflict-resolution write-up (positions, interests, agreement)', 'A recorded decision log entry for one agreed requirement'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Complete both exercises'],
    },
  ],
}

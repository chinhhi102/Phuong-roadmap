import type { Module } from '@/types'

// ============================================================================
// MODULE 3 — BA Planning & Monitoring
// BABOK v3 Knowledge Area 1: plan the BA approach, plan stakeholder
// engagement, govern BA work, manage information, and improve BA performance.
// Authored to the module1-powerbi exemplar shape (minus the per-lesson quiz —
// the module exam m3-planning-exam.ts is the assessment for this module).
// ============================================================================

export const module3Planning: Module = {
  id: 'm3-planning',
  code: 'M3',
  title: 'BA Planning & Monitoring',
  description:
    'BABOK Knowledge Area 1: plan the BA approach, plan stakeholder engagement, govern BA work, manage information, and improve BA performance.',
  icon: '🗓️',
  accent: 'from-sky-500 to-blue-500',
  lessons: [
    // ---------------------------------------------------------------- PM1
    {
      id: 'pm1',
      code: 'PM1',
      title: 'Plan the Business Analysis Approach',
      summary:
        'Decide how you will do the analysis before you do it: predictive vs adaptive, the activities and deliverables, and how complexity and risk shape the plan.',
      moduleId: 'm3-planning',
      objectives: [
        'Contrast predictive and adaptive (Agile) business analysis approaches',
        'Plan the BA activities, deliverables, and timing for an initiative',
        'Select an approach by weighing complexity, uncertainty, and risk',
        'Explain how the chosen approach shapes how requirements are documented and prioritized',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['f3'],
      resources: [
        { type: 'reading', title: 'IIBA — BABOK Guide & the BA planning knowledge area', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The BABOK source for Business Analysis Planning & Monitoring.' },
        { type: 'reading', title: 'Bridging the Gap — Plan your business analysis approach', url: 'https://www.bridging-the-gap.com/business-analysis-planning/', description: 'Practical, BA-centric planning walkthrough.' },
        { type: 'reading', title: 'Atlassian — What is Agile?', url: 'https://www.atlassian.com/agile', description: 'Grounding on the adaptive (Agile) delivery mindset.' },
      ],
      content: `## Why you plan the approach first

Before you elicit a single requirement, you decide **how** the analysis work will happen — the *Plan the Business Analysis Approach* task. The output is a plan (formal or a few bullet points) covering:

- **Which BA activities** you will do (elicitation, modelling, validation…)
- **Which deliverables** you will produce (a \`BRD\`, user stories, a process model)
- **The timing** — up front, or continuously as work flows
- **The level of formality** — heavy documentation vs. lightweight, just-in-time

Get this right and everything downstream is smoother; get it wrong and you either drown a fast-moving team in paperwork or leave a compliance-heavy programme dangerously under-documented.

## Predictive vs. adaptive

The single biggest decision is *how much you decide up front*. Two ends of a spectrum:

| Aspect | Predictive (plan-driven / Waterfall) | Adaptive (change-driven / Agile) |
|--------|--------------------------------------|----------------------------------|
| Requirements | Defined up front and **baselined** | **Emerge** and evolve each iteration |
| Documentation | Formal and detailed (\`BRD\` / \`SRS\`) | Lightweight (user stories, a backlog) |
| Change | Controlled via formal change requests | Expected and welcomed each sprint |
| Delivery | One or a few large releases | Frequent small increments |
| Best when | Requirements are stable; cost of change is high; compliance/audit needs | Requirements are uncertain; fast feedback is valuable |
| BA focus | Produce baselined specs, manage the baseline | Facilitate the backlog, clarify stories just-in-time |

Most real initiatives are a **hybrid** — for example, a fixed, baselined scope contract on the outside, but Agile iterations for the build inside it.

\`\`\`mermaid
flowchart TD
  A[New initiative] --> B{Requirements stable?}
  B -- Yes, and change is costly --> C[Lean predictive]
  B -- No, fast feedback helps --> D[Lean adaptive]
  C --> E[Baselined BRD, formal change control]
  D --> F[Backlog, just-in-time stories]
\`\`\`

## Planning activities, deliverables & timing

Whatever the style, you plan three things:

1. **Activities** — the BA tasks you'll perform and roughly in what order.
2. **Deliverables** — the concrete outputs, and who signs each off.
3. **Timing** — up-front analysis (predictive) or a continuous flow (adaptive).

## Factoring complexity & risk

Turn the dials toward **more formality** when: the initiative is large or highly interconnected, many stakeholders or geographies are involved, the regulatory/compliance stakes are high, or the cost of a wrong requirement is severe. Turn toward **less formality and more iteration** when: the problem is poorly understood, the team is small and co-located, and quick feedback beats a perfect document.

> **BA takeaway:** The approach is a *deliberate design choice*, not a habit. Name the drivers — stability, risk, compliance, team — and let them pick the level of formality for you.`,
      realWorldExample: `**From your world (accounting / ERP):** A mid-sized company is replacing its patchwork of spreadsheets with a full ERP (finance, inventory, and payroll) built on \`MISA\`. You're asked to pick the BA approach.

The **core finance and compliance requirements** — chart of accounts, tax rules, statutory reports — are stable and legally mandated, so you handle them **predictively**: a baselined requirements document, formal sign-off from the finance controller, and change control on anything that touches the ledger.

The **inventory and internal reporting** parts are fuzzier — nobody is quite sure how they want stock reconciliation to work — so you run those **adaptively**: short iterations, a prioritized backlog, and a demo every two weeks so warehouse staff can react to something real.

You write a one-page approach memo that says: *predictive for the regulated ledger, adaptive for operational reporting, hybrid overall*. That single decision determines how much you document, how you handle change, and how often stakeholders see progress — which is exactly why it comes first.`,
      exercises: [
        {
          id: 'pm1-e1',
          title: 'Choose an approach',
          prompt: 'A finance team needs a statutory tax-reporting module where the rules are fixed by law and audited. Predictive or adaptive? Give two reasons.',
          hint: 'Think about requirement stability and the cost of getting it wrong.',
          sampleSolution: 'Predictive. (1) The rules are stable and externally mandated, so requirements can be defined and baselined up front. (2) The compliance/audit stakes are high, so formal documentation and change control reduce risk — a wrong requirement is expensive and possibly illegal.',
        },
        {
          id: 'pm1-e2',
          title: 'Plan the deliverables',
          prompt: 'For an adaptive reporting project, list three BA deliverables you would plan and the rough timing of each.',
          sampleSolution: 'A prioritized product backlog (created early, continuously refined); user stories with acceptance criteria (elaborated just-in-time, one or two sprints ahead); and a lightweight process/context sketch (drafted up front, updated as understanding grows). Timing is continuous rather than one big up-front handover.',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A one-page BA approach memo (predictive vs adaptive choice + rationale)',
        'A planned list of BA activities, deliverables, and timing',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Pass the M3 module exam (≥ 70%)',
      ],
    },

    // ---------------------------------------------------------------- PM2
    {
      id: 'pm2',
      code: 'PM2',
      title: 'Plan Stakeholder Engagement',
      summary:
        'Identify and analyze stakeholders, place them on a Power/Interest grid, assign RACI roles, and plan how you will collaborate with each.',
      moduleId: 'm3-planning',
      objectives: [
        'Identify stakeholders and analyze their influence, interest, and attitude',
        'Place stakeholders on a Power/Interest grid and pick an engagement strategy per quadrant',
        'Build a RACI matrix to clarify Responsible, Accountable, Consulted, and Informed',
        'Plan collaboration, communication cadence, and elicitation logistics',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['pm1'],
      resources: [
        { type: 'reading', title: 'MindTools — Stakeholder Analysis (Power/Interest Grid)', url: 'https://www.mindtools.com/aoiu8nu/stakeholder-analysis', description: 'The classic power/interest grid and strategies.' },
        { type: 'reading', title: 'Atlassian — RACI charts explained', url: 'https://www.atlassian.com/work-management/project-management/raci-chart', description: 'How to build and use a RACI matrix.' },
        { type: 'reading', title: 'Bridging the Gap — What is a stakeholder analysis?', url: 'https://www.bridging-the-gap.com/what-is-a-stakeholder-analysis/', description: 'A BA-focused take on finding and analyzing stakeholders.' },
      ],
      content: `## Identify the stakeholders

A **stakeholder** is anyone affected by, or who can affect, the change. Miss one and requirements gaps or late objections follow. Cast a wide net: sponsors, end users, subject-matter experts, operations/support, suppliers, regulators, and *anyone whose work the change touches*.

Capture each in a small **stakeholder register**: name/role, their interest in the change, their influence, and their attitude (champion, neutral, sceptic).

## The Power/Interest grid

Once identified, analyze each stakeholder along two axes — how much **power** (influence) they have, and how much **interest** they have in the outcome. That gives four quadrants, each with a distinct engagement strategy:

| Quadrant | Power / Interest | Engagement strategy |
|----------|------------------|---------------------|
| **Key players** | High power, High interest | **Manage closely** — engage fully, collaborate, co-design, prioritize their input |
| **Keep satisfied** | High power, Low interest | Give enough to keep them **onside**; don't overload them — but never surprise them |
| **Keep informed** | Low power, High interest | Communicate regularly; they are often **advocates** and useful hands-on helpers |
| **Monitor** | Low power, Low interest | **Minimal effort** — watch for changes in power or interest over time |

\`\`\`mermaid
quadrantChart
  title Power vs Interest
  x-axis Low Interest --> High Interest
  y-axis Low Power --> High Power
  quadrant-1 Manage closely
  quadrant-2 Keep satisfied
  quadrant-3 Monitor
  quadrant-4 Keep informed
\`\`\`

## RACI — who does what on each decision

A **RACI matrix** removes "I thought *you* owned that." For every key activity or deliverable, assign exactly one letter per stakeholder:

- **R — Responsible:** does the work.
- **A — Accountable:** owns the outcome and the sign-off. **Exactly one A per row.**
- **C — Consulted:** gives input, two-way conversation *before* the work is done.
- **I — Informed:** told the result, one-way, *after* the fact.

The classic failure is having zero or two people accountable — decisions then stall or clash.

## Plan the collaboration

Engagement isn't only *who* — it's *how and how often*. Plan the communication cadence (weekly demo, fortnightly steering), the elicitation logistics (workshops, interviews, surveys), the tools (a shared requirements space), and how you'll handle disagreement.

> **BA takeaway:** Stakeholder engagement is planned, not improvised. The grid tells you *how much energy* each person deserves; RACI tells you *who decides*; the cadence tells you *when they hear from you*.`,
      realWorldExample: `**From your world (payroll upgrade):** A company is upgrading its payroll system inside its \`MISA\`-based finance suite. You map the stakeholders:

- **CFO** — high power, high interest → **Key player**: manage closely, co-design the approval flow, weekly check-in.
- **Payroll manager** — high power, high interest → **Key player**: the primary SME; workshops and daily access.
- **IT infrastructure lead** — high power, low interest (cares about uptime, not payroll rules) → **Keep satisfied**: brief on cutover and data migration only.
- **Employees / end users** — low power, high interest (they want correct, on-time pay) → **Keep informed**: rollout comms, a preview of the new payslip.
- **External auditor** — high power, low day-to-day interest → **Keep satisfied**: confirm the audit trail meets requirements, no surprises at year-end.

Then a RACI for "Approve payroll calculation rules": Payroll manager **R**, CFO **A**, Auditor **C**, Employees **I**. Everyone now knows their part — and you've prevented the classic "who signs off the tax rules?" stall before it happens.`,
      exercises: [
        {
          id: 'pm2-e1',
          title: 'Place them on the grid',
          prompt: 'A regulator has strong power over your project but little day-to-day interest in the build. Which quadrant and strategy?',
          hint: 'High power, low interest.',
          sampleSolution: 'Keep satisfied. They have high power but low ongoing interest, so give them enough to stay onside (e.g., confirm compliance and the audit trail) without overloading them — and never let them be surprised.',
        },
        {
          id: 'pm2-e2',
          title: 'Fix the RACI',
          prompt: 'On a row for "Approve new payslip layout", two people are marked Accountable and nobody is Responsible. What is wrong and how do you fix it?',
          sampleSolution: 'A RACI row must have exactly one Accountable (the single owner of the sign-off) and at least one Responsible (who does the work). Two Accountables means the decision can stall or clash, and no Responsible means nobody actually produces it. Fix: demote one Accountable to Consulted (or Responsible), keep one clear Accountable, and name the person Responsible for producing the layout.',
        },
      ],
      assignment: {
        id: 'pm2-assignment',
        title: 'Build a stakeholder map + RACI',
        brief:
          'Take a real (or realistic) initiative — a payroll or ERP upgrade works well. Identify at least six stakeholders, analyze them, and plan how you will engage each.',
        deliverable:
          'A deliverable with two parts: (1) a Power/Interest grid placing every stakeholder in a quadrant with its engagement strategy, and (2) a RACI matrix covering at least four key activities/deliverables, with exactly one Accountable per row.',
        rubric: [
          'At least six distinct stakeholders identified (incl. non-obvious ones)',
          'Every stakeholder placed in a Power/Interest quadrant with a strategy',
          'RACI covers ≥ 4 activities with exactly one Accountable per row',
          'Includes a planned communication cadence per stakeholder group',
          'Engagement strategy is justified, not just labelled',
        ],
      },
      deliverables: [
        'A stakeholder register with power/interest ratings',
        'A RACI matrix for the initiative',
      ],
      completionCriteria: [
        'Complete both exercises and submit the stakeholder-map assignment',
        'Pass the M3 module exam (≥ 70%)',
      ],
      portfolioArtifact: {
        type: 'Case Study',
        title: 'Stakeholder Analysis — Payroll Upgrade',
        description: 'A stakeholder map (power/interest) and RACI for a real initiative.',
      },
    },

    // ---------------------------------------------------------------- PM3
    {
      id: 'pm3',
      code: 'PM3',
      title: 'Govern BA Work, Manage Information & Performance',
      summary:
        'Set up decision and approval governance, control requirements change, manage and store BA information, and define metrics to improve BA performance.',
      moduleId: 'm3-planning',
      objectives: [
        'Design decision-making and approval governance for BA work',
        'Run a requirements change-control process (raise, assess, decide, trace)',
        'Manage, store, and make BA information accessible and reusable',
        'Define metrics and measure improvements in BA performance',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['pm2'],
      resources: [
        { type: 'reading', title: 'Bridging the Gap — Managing changing requirements', url: 'https://www.bridging-the-gap.com/managing-changing-requirements/', description: 'A practical change-control approach for BAs.' },
        { type: 'reading', title: 'MindTools — Key Performance Indicators (KPIs)', url: 'https://www.mindtools.com/ap3vu9d/key-performance-indicators-kpis', description: 'How to define metrics that actually drive improvement.' },
      ],
      content: `## Governance — how BA work gets approved

**Governance** answers a simple question with big consequences: *who decides, and how?* Before requirements pile up, you define:

- **Decision-making roles** — who can approve a requirement, resolve a conflict, or accept a deliverable.
- **Approval steps** — the path a requirement takes from draft to approved.
- **Prioritization authority** — who ranks what gets built first when everything is "urgent."

A short **governance / approval matrix** written up front prevents the "we thought Finance had approved that" surprise later.

## Requirements change control

Requirements change — the discipline is *managing* the change, not preventing it. A lightweight change-control loop:

\`\`\`mermaid
flowchart LR
  A[Change raised] --> B[Assess impact<br/>cost, scope, risk]
  B --> C{Decision}
  C -- Approve --> D[Update baseline + trace]
  C -- Reject --> E[Log & communicate]
\`\`\`

Every change is **raised**, **impact-assessed** (what does it touch — cost, timeline, other requirements?), **decided** by the right authority, and then **traced** so you can see why the baseline changed. Traceability is what lets you answer "why is this requirement here?" months later.

## Managing BA information

The requirements you produce are an asset — treat them like one:

| Element | Question it answers | Example artifact |
|---------|---------------------|------------------|
| **Governance** | Who decides and approves? | Approval / decision matrix |
| **Change control** | How are changes assessed and approved? | Change request log |
| **Information management** | Where does it live and who can see it? | Requirements repository + traceability matrix |
| **Performance** | Are we getting better at this? | BA metrics / retrospective actions |

Decide **where** requirements are stored (a shared tool, not someone's laptop), **how** they're organized and versioned, **who** has access, and **how long** they're retained. Reusable, findable information saves the next project from starting cold.

## Measuring & improving BA performance

You can't improve what you don't measure. Define a few honest metrics — for example: rework caused by missed requirements, number of post-baseline changes, stakeholder satisfaction with clarity, or elapsed time from elicitation to sign-off. Then **hold retrospectives**, agree concrete actions, and check next time whether the metric moved.

> **BA takeaway:** Governance, change control, information management, and performance are the "monitoring" half of Planning & Monitoring — they keep the analysis honest, traceable, and continuously improving.`,
      realWorldExample: `**From your world (reconciliation project):** You're leading the requirements for an automated bank-reconciliation feature in the company's \`MISA\` finance system, where the ledger must always tie out to the bank statement.

**Governance:** the Finance Controller is Accountable for approving any rule that affects how transactions are matched; nothing goes to the baseline without that sign-off. **Change control:** when Operations later asks to auto-match partial payments, you don't just add it — you raise it, assess the impact on the matching logic and the audit trail, take it to the Controller, and record the decision with a trace back to the original requirement. **Information management:** every reconciliation rule lives in a shared, versioned requirements repository with a traceability matrix, not in email threads. **Performance:** you track "reconciliation exceptions requiring manual fix" and "post-baseline change requests" across releases; when the exception rate drops after a rule clarification, you have evidence the analysis is genuinely improving — the reconciliation now ties out with far less manual chasing.`,
      exercises: [
        {
          id: 'pm3-e1',
          title: 'Design the change loop',
          prompt: 'Mid-project, a stakeholder emails "just add a new approval level to the reconciliation flow." List the change-control steps before it can enter the baseline.',
          hint: 'Raise → assess → decide → trace.',
          sampleSolution: '1) Raise it as a formal change request (not just an email). 2) Assess the impact — effect on the matching logic, timeline, cost, other requirements, and the audit trail. 3) Route it to the decision authority (e.g., the Finance Controller) for approve/reject. 4) If approved, update the baseline and trace the change back to the affected requirements; if rejected, log and communicate the reason.',
        },
        {
          id: 'pm3-e2',
          title: 'Pick a BA metric',
          prompt: 'Propose one metric that would show whether your requirements work on the reconciliation project is improving, and say what would make it go the right way.',
          sampleSolution: 'Metric: number of post-baseline change requests per release (or reconciliation exceptions requiring manual fix). It improves (goes down) when requirements are elicited and clarified more completely up front, reducing rework — evidence that stakeholder analysis and validation are getting better.',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A one-page BA governance plan (approvals + change control)',
        'A short BA performance metric definition (what, how measured, target direction)',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Pass the M3 module exam (≥ 70%)',
      ],
    },
  ],
}

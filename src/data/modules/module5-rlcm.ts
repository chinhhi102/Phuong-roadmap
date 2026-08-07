import type { Module } from '@/types'

// ============================================================================
// MODULE 5 — Requirements Life Cycle Management (BABOK v3 Knowledge Area 3)
// Trace, maintain, prioritize, assess changes to, and approve requirements
// from inception through retirement. Follows the Module 1 authoring exemplar.
// ============================================================================

export const module5Rlcm: Module = {
  id: 'm5-rlcm',
  code: 'M5',
  title: 'Requirements Life Cycle Management',
  description:
    'BABOK Knowledge Area 3: trace, maintain, prioritize, assess changes to, and approve requirements across their life cycle.',
  icon: '🔄',
  accent: 'from-teal-500 to-emerald-500',
  lessons: [
    // ---------------------------------------------------------------- RL1
    {
      id: 'rl1',
      code: 'RL1',
      title: 'Trace & Maintain Requirements',
      summary:
        'Link every requirement to its origin and its outcome with a Requirements Traceability Matrix, then keep those requirements accurate and reusable over time.',
      moduleId: 'm5-rlcm',
      objectives: [
        'Explain requirements traceability and why a BA maintains it',
        'Build and read a Requirements Traceability Matrix (RTM)',
        'Identify traceability relationships: derive, depends, satisfy, validate',
        'Maintain and reuse requirements so they stay accurate and portable',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['el3'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Trace Requirements (KA 3.1)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The IIBA task definition for traceability.' },
        { type: 'reading', title: 'Requirements Traceability Matrix — overview', url: 'https://en.wikipedia.org/wiki/Requirements_traceability', description: 'What an RTM is and how it is used.' },
        { type: 'video', title: 'Traceability in practice (concepts)', url: 'https://www.youtube.com/results?search_query=requirements+traceability+matrix', meta: '12 min', description: 'A walkthrough of building and using an RTM.' },
      ],
      content: `## What is traceability?

**Requirements traceability** is the ability to follow the life of a requirement in both directions: *backward* to the business need that justifies it, and *forward* to the designs, code, and tests that deliver it. If you can answer "why does this requirement exist?" and "where is it satisfied and proven?", you have traceability.

Traceability lets a BA:

- Show **coverage** — every business goal has requirements, and every requirement has a test.
- Do **impact analysis** — when one item changes, see everything it touches.
- Prevent **scope creep and gold-plating** — orphan requirements (no goal above them) get challenged.
- Support **audit and compliance** — prove that what was approved is what was built and tested.

## The traceability chain

The classic chain flows from business intent all the way down to proof of delivery:

\`\`\`mermaid
flowchart TB
  G[Business Goal<br/>reduce late payments] --> R[Requirement<br/>flag overdue invoices]
  R --> D[Design<br/>Overdue rule + badge]
  D --> T[Test Case<br/>invoice past due date shows Overdue]
\`\`\`

Reading **top-down** answers "is this goal covered?" Reading **bottom-up** answers "why does this test / this feature exist?"

## Traceability relationships

BABOK names four relationship types you record between requirements (and related items):

| Relationship | Meaning | Example |
|--------------|---------|---------|
| **Derive** | A requirement is derived from another (usually a lower-level one from a higher-level one). | "Show an Overdue badge" derives from "Flag overdue invoices". |
| **Depends** | A requirement needs another to be met first (necessity or effort dependency). | "Send dunning email" depends on "Detect overdue status". |
| **Satisfy** | A design/solution component satisfies a requirement. | The Overdue rule *satisfies* "Flag overdue invoices". |
| **Validate** | A test or check validates that a requirement is met. | Test case TC-07 *validates* the overdue rule. |

## The Requirements Traceability Matrix (RTM)

An **RTM** is a grid that records these links so nothing falls through the cracks:

| Req ID | Requirement | Source (Goal) | Priority | Design | Test Case | Status |
|--------|-------------|---------------|----------|--------|-----------|--------|
| REQ-01 | Flag invoices past their due date | G1 Reduce late payments | Must | Overdue rule | TC-07 | Verified |
| REQ-02 | Show an "Overdue" badge on the invoice list | G1 | Should | Badge component | TC-08 | In test |
| REQ-03 | Email a reminder when an invoice becomes overdue | G1 | Could | Dunning job | TC-09 | Designed |

## Maintain and reuse requirements

Requirements are not frozen once approved — the BA **maintains** them so they stay correct and useful:

- **Keep them current** — update wording, attributes, and links as the solution and context change.
- **Retain the right attributes** — id, source, owner, priority, status — so a requirement stays understandable on its own.
- **Reuse** long-lived requirements — a well-written rule like "an invoice is overdue when today > due date" can be reused across projects, products, and releases. Store reusable requirements in a shared repository, decoupled from any single project.

> **Key idea:** Traceability is not paperwork for its own sake — it is the BA's insurance policy. It proves coverage, powers impact analysis, and turns requirements into reusable organizational assets.`,
      realWorldExample: `**From your world (accounting/ERP):** The finance team asks for an *overdue invoices* feature in a MISA-style accounting system. You build a small RTM to keep the work honest:

| Trace | Value |
|-------|-------|
| **Business goal (G1)** | Reduce late customer payments by 20% this year. |
| **Requirement (REQ-01)** | The system flags an invoice as *Overdue* when today's date is past the due date and the balance is greater than zero. |
| **Design** | A daily rule recomputes \`Status = Overdue\` and the invoice list shows a red badge. |
| **Test case (TC-07)** | Create an invoice due yesterday with an outstanding balance → it appears as *Overdue*; pay it → the badge clears. |

Six weeks later the CFO asks "why do we email reminders?" You trace **REQ-03 → G1** in one click: the reminder exists to serve the same goal. And when someone proposes removing the badge, the RTM shows it is the *only* thing validating REQ-01 in the UI — so you keep it. That single matrix answers "why", "is it covered", and "what breaks if we change it".`,
      exercises: [
        {
          id: 'rl1-e1',
          title: 'Build a mini RTM',
          prompt: 'For the goal "Speed up month-end reconciliation", write two requirements and, for each, give a Req ID, its source goal, one design idea, and one test case in RTM row form.',
          hint: 'Columns: Req ID | Requirement | Source (Goal) | Design | Test Case.',
          sampleSolution: 'REQ-10 | Auto-match bank lines to ledger entries by amount + date | G: Speed up reconciliation | Matching engine with tolerance | TC-10: import a statement, matched lines are pre-linked. REQ-11 | Flag unmatched lines for review | G: Speed up reconciliation | Exceptions queue | TC-11: an unmatched line appears in the review queue.',
        },
        {
          id: 'rl1-e2',
          title: 'Name the relationship',
          prompt: 'Label each pair with derive, depends, satisfy, or validate: (a) "Send dunning email" needs "Detect overdue status" first; (b) Test TC-07 proves "Flag overdue invoices"; (c) "Show Overdue badge" comes from "Flag overdue invoices"; (d) the Overdue rule component fulfills "Flag overdue invoices".',
          sampleSolution: '(a) depends. (b) validate. (c) derive. (d) satisfy.',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A Requirements Traceability Matrix (goal → requirement → design → test) for one feature',
        'A short note listing each traceability relationship used and why',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Produce an RTM that traces at least two requirements from a business goal to a test case',
      ],
      portfolioArtifact: {
        type: 'Requirement Doc',
        title: 'Requirements Traceability Matrix',
        description: 'An RTM tracing business goals to requirements and tests.',
      },
    },

    // ---------------------------------------------------------------- RL2
    {
      id: 'rl2',
      code: 'RL2',
      title: 'Prioritize Requirements & Assess Changes',
      summary:
        'Rank requirements with MoSCoW and other bases, then assess the impact of a change request before it is accepted or rejected.',
      moduleId: 'm5-rlcm',
      objectives: [
        'Prioritize requirements using MoSCoW',
        'Apply the common prioritization bases: value, risk, cost, dependencies',
        'Assess the impact of a proposed requirement change on scope, cost, and other requirements',
        'Recommend accept, reject, or defer for a change request with a clear rationale',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['rl1'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Prioritize Requirements (KA 3.2)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The IIBA task definition for prioritization.' },
        { type: 'reading', title: 'MoSCoW prioritization method', url: 'https://en.wikipedia.org/wiki/MoSCoW_method', description: 'Must / Should / Could / Won\'t explained.' },
        { type: 'reading', title: 'BABOK v3 — Assess Requirements Changes (KA 3.4)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'How to evaluate a proposed change.' },
      ],
      content: `## Why prioritize?

You almost never have the time, money, or people to build everything at once. **Prioritization** ranks requirements so the most important work is delivered first, and so trade-off conversations are explicit rather than accidental. Priority is *relative* and *revisited* — it changes as value, risk, and constraints change.

## MoSCoW

The most common shared language for priority is **MoSCoW**:

| Category | Meaning | Test to apply |
|----------|---------|---------------|
| **Must** | Non-negotiable for this release; without it the solution fails or is illegal/unsafe. | "Is the release worthless without it?" |
| **Should** | Important and painful to omit, but there is a workaround. | "Would we ship without it under pressure?" |
| **Could** | Desirable, low-cost, nice-to-have; first to be dropped. | "Is this the first thing to cut if we slip?" |
| **Won't** (this time) | Agreed out of scope for now; may return later. | "Are we explicitly parking it?" |

A healthy backlog is **not** all Musts. If everything is a Must, nothing is — you have lost the ability to trade off.

## Other bases for prioritization

MoSCoW is a summary; underneath it, BAs weigh several **bases**:

- **Business value** — how much the requirement advances the goals (revenue, savings, compliance, satisfaction).
- **Risk** — build risky/uncertain items early to fail fast, or defer them to protect a release.
- **Cost / effort** — cheap high-value items rise; expensive low-value items sink.
- **Dependencies** — a requirement that unblocks many others earns priority even if its own value is modest.
- **Regulatory / time constraints** — deadlines and legal mandates can force a Must.

A simple heuristic many BAs use is **value vs. effort**: do high-value / low-effort first ("quick wins"), schedule high-value / high-effort, and question low-value / high-effort.

## Assessing requirement changes

Requirements change — the BA's job is to make the change **informed, not chaotic**. When a change request arrives, assess it before anyone says yes:

1. **Understand the change** — what exactly is being added, removed, or altered, and why.
2. **Trace the impact** — use the RTM to find every requirement, design, and test the change touches (this is where Lesson RL1 pays off).
3. **Estimate cost & effort** — rework, retesting, delay to other items.
4. **Weigh benefit vs. cost & risk** — does the value justify the disruption?
5. **Recommend** — accept, reject, or defer, with a written rationale, and route it through the agreed change/approval process.

> **Key idea:** Prioritization decides *order*; change assessment decides *whether and when to re-order*. Both depend on traceability to see consequences before you commit.`,
      realWorldExample: `**From your world (ERP enhancement release):** You have a backlog of ERP enhancements and a fixed release date. You run a MoSCoW session with finance:

- **Must:** VAT report matches the new tax rule (legal deadline).
- **Must:** Bank reconciliation import (the release's headline value).
- **Should:** One-click dunning emails (there is a manual workaround today).
- **Could:** Dark-mode invoice list (nice, cheap, easily dropped).
- **Won't (this time):** Multi-currency consolidation (big, and not needed until next fiscal year).

Mid-project, a stakeholder raises a **change request**: "Also auto-post reconciled lines to the general ledger." You assess it with the RTM: it touches the reconciliation requirement (REQ-10), the matching design, three test cases, and creates a new *audit* requirement (posting must be reversible). Effort: ~2 weeks; it would push the VAT Must past its legal deadline. Your recommendation: **defer to the next release** — high value, but the cost endangers a non-negotiable Must. Because you traced the impact and weighed value against risk, the decision is defensible, not a gut call.`,
      exercises: [
        {
          id: 'rl2-e1',
          title: 'Run a MoSCoW pass',
          prompt: 'Classify these four ERP items as Must, Should, Could, or Won\'t-this-time and justify each in a few words: (a) legally-required VAT report change, (b) faster invoice search, (c) custom color themes, (d) multi-currency consolidation not needed until next year.',
          hint: 'Ask "is the release worthless without it?" and "what is the workaround?".',
          sampleSolution: '(a) Must — legal deadline, no option to skip. (b) Should — real pain but a workaround exists. (c) Could — nice, cheap, first to cut. (d) Won\'t (this time) — explicitly parked until next fiscal year.',
        },
        {
          id: 'rl2-e2',
          title: 'Assess a change request',
          prompt: 'A stakeholder wants to add "auto-post reconciled lines to the ledger" mid-project. List the four things you would evaluate before recommending accept, reject, or defer.',
          hint: 'Think impact via the RTM, cost/effort, benefit, and risk to committed Musts.',
          sampleSolution: '1) Impact — which requirements, designs, and tests it touches (trace via RTM). 2) Cost/effort — rework and retest time. 3) Benefit — business value of auto-posting. 4) Risk — does the added work endanger a committed Must or the deadline? Then recommend accept/reject/defer with rationale.',
        },
      ],
      deliverables: [
        'A MoSCoW-prioritized backlog for one release with a one-line rationale per item',
        'A one-page change-impact assessment ending in an accept / reject / defer recommendation',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Prioritize a set of requirements using MoSCoW and name at least two bases behind the ranking',
      ],
    },

    // ---------------------------------------------------------------- RL3
    {
      id: 'rl3',
      code: 'RL3',
      title: 'Approve Requirements',
      summary:
        'Secure formal sign-off, build consensus among stakeholders, resolve conflicts, and record who approved what and when.',
      moduleId: 'm5-rlcm',
      objectives: [
        'Explain what requirement approval and sign-off mean and who provides them',
        'Build consensus and manage disagreement among stakeholders',
        'Resolve requirement conflicts fairly and transparently',
        'Track approval decisions with clear, auditable records',
      ],
      durationMinutes: 40,
      difficulty: 'Intermediate',
      prerequisites: ['rl2'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Approve Requirements (KA 3.5)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The IIBA task definition for approval.' },
        { type: 'reading', title: 'RACI responsibility matrix', url: 'https://en.wikipedia.org/wiki/Responsibility_assignment_matrix', description: 'Clarifying who approves vs. who is consulted.' },
      ],
      content: `## What approval means

**Approval** is the agreement — by the stakeholders who have the authority — that a set of requirements is correct, complete enough, and ready to be acted on. **Sign-off** is the recorded evidence of that agreement. Approval is a *gate*: it converts "proposed" requirements into a baseline the team can build against and be held to.

Approval matters because it:

- Establishes a **shared, committed understanding** of what will be delivered.
- Creates a **baseline** — later changes must go through change assessment (Lesson RL2), not the back door.
- Provides **accountability and audit evidence** — who agreed, to what, and when.

## Who approves?

The right approvers are the stakeholders with **authority and accountability** for the affected area — not simply whoever shows up. A **RACI** table keeps this clear:

| Role | On requirements they are… |
|------|---------------------------|
| **Responsible** | The BA — drafts, refines, and presents the requirements. |
| **Accountable** | The sponsor / product owner — the single person who signs off. |
| **Consulted** | SMEs, finance, audit, compliance — give input before approval. |
| **Informed** | Downstream teams — told once it is approved. |

## Building consensus

Approval goes smoothly when consensus is built *before* the sign-off meeting, not during it:

- **Walk through requirements** with each stakeholder group and capture concerns early.
- **Make trade-offs visible** — show priorities and the reasons behind them.
- **Seek "disagree and commit"** where perfect agreement is impossible: everyone is heard, a decision is made, and the group commits.

## Managing conflict

Stakeholders will disagree — finance wants control, operations wants speed. To resolve conflict fairly:

1. **Surface it** — name the disagreement explicitly instead of letting it fester.
2. **Return to the goal** — evaluate options against the business objective, not personalities.
3. **Use objective criteria** — value, risk, cost, compliance — the same bases you prioritize with.
4. **Escalate cleanly** — if peers cannot agree, take a crisp decision to the accountable approver.

## Tracking approval decisions

Every approval decision must be **recorded** so it is auditable and so changes can be governed later:

| Req set | Decision | Approver (role) | Date | Notes |
|---------|----------|-----------------|------|-------|
| Reconciliation reqs v1.0 | Approved | CFO (Accountable) | 2026-08-01 | Audit's reversibility condition added first |
| Dunning email reqs | Approved w/ conditions | Finance Mgr | 2026-08-02 | Template must be reviewed by Legal |

> **Key idea:** Approval is where analysis becomes commitment. Do the consensus work up front, decide against objective criteria, and record every sign-off — so "who agreed to this?" always has an answer.`,
      realWorldExample: `**From your world (finance + audit sign-off):** You need approval on the requirements for a new *bank reconciliation* feature. Two groups care and they do not fully agree:

- **Finance** wants reconciled lines auto-posted to the ledger to save time.
- **Audit** insists any automatic posting must be *reversible* and fully logged, or they will not approve.

You build consensus before the sign-off meeting: you meet audit first, add REQ "every auto-post is reversible and written to an immutable audit log", and show finance that this protects them too. In the meeting you present the requirements with a RACI — the **CFO is Accountable** (signs off), **audit and finance are Consulted**. The CFO approves *version 1.0 with the audit condition included*. You record the decision in the approval log: requirement set, "Approved", CFO, the date, and the audit condition. When an auditor later asks "who agreed to auto-posting and under what safeguards?", the log answers in one line — and any change from here must go through change assessment, not a hallway conversation.`,
      exercises: [
        {
          id: 'rl3-e1',
          title: 'Assign the RACI',
          prompt: 'For approving the reconciliation requirements, assign R, A, C, and I to: the BA, the CFO, the internal auditor, and the downstream IT support team.',
          hint: 'Only one role should be Accountable (the sign-off authority).',
          sampleSolution: 'BA = Responsible (drafts/presents). CFO = Accountable (signs off). Internal auditor = Consulted (input before approval). IT support = Informed (told once approved).',
        },
        {
          id: 'rl3-e2',
          title: 'Resolve the conflict and record it',
          prompt: 'Finance wants auto-posting; audit will not approve without reversibility. Describe how you would reach a decision and what you would write in the approval log.',
          hint: 'Return to the goal, use objective criteria, then capture the decision, approver, date, and any condition.',
          sampleSolution: 'Surface the disagreement, add a reversibility + audit-log requirement so both goals are met, and present it to the accountable approver (CFO). Log: "Reconciliation reqs v1.0 — Approved with condition (auto-posts must be reversible and logged) — CFO — 2026-08-01".',
        },
      ],
      assignment: {
        id: 'rl3-assignment',
        title: 'Run a requirements approval (package + log)',
        brief:
          'Take a small set of requirements (e.g., the reconciliation feature) through approval. Prepare the sign-off package, decide who approves, resolve one conflict, and record the outcome.',
        deliverable:
          'An approval package containing: (1) the requirement set to be approved, (2) a RACI naming approvers and consulted parties, (3) one documented conflict and how you resolved it, and (4) a filled-in approval log row (decision, approver, date, conditions).',
        rubric: [
          'Requirement set is clear and baselined for approval',
          'RACI names exactly one Accountable approver',
          'At least one conflict is surfaced and resolved against objective criteria',
          'Approval log records decision, approver, date, and any conditions',
          'Explains how post-approval changes will be governed',
        ],
      },
      deliverables: [
        'A stakeholder approval / sign-off package with a RACI',
        'An approval decision log recording who approved what, when, and under which conditions',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Produce an approval log entry that names the decision, the accountable approver, and the date',
      ],
      portfolioArtifact: {
        type: 'Requirement Doc',
        title: 'Requirements Approval Package & Sign-off Log',
        description: 'A sign-off package with a RACI and an auditable approval decision log.',
      },
    },
  ],
}

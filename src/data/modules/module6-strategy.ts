import type { Module } from '@/types'

// ============================================================================
// MODULE 6 — Strategy Analysis
// BABOK v3 Knowledge Area 4: analyze the current state, define the future
// state, assess risks, and define the change strategy — the BA's "why before
// what". Authored to the Module 1 exemplar's shape and tone.
// ============================================================================

export const module6Strategy: Module = {
  id: 'm6-strategy',
  code: 'M6',
  title: 'Strategy Analysis',
  description:
    'BABOK Knowledge Area 4: analyze the current state, define the future state, assess risks, and define the change strategy.',
  icon: '♟️',
  accent: 'from-emerald-500 to-green-500',
  lessons: [
    // ---------------------------------------------------------------- SA1
    {
      id: 'sa1',
      code: 'SA1',
      title: 'Analyze the Current State',
      summary:
        'Understand the current state and the real business need, dig to root causes with 5 Whys and fishbone, and frame the situation with SWOT.',
      moduleId: 'm6-strategy',
      objectives: [
        'Describe the current state and articulate the underlying business need behind a requested change',
        'Separate symptoms from root causes when framing a problem',
        'Run a root-cause analysis using the 5 Whys and a fishbone (Ishikawa) diagram',
        'Assess the situation with a SWOT (Strengths, Weaknesses, Opportunities, Threats)',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['rl3'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Strategy Analysis (overview)', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The IIBA knowledge area this module maps to.' },
        { type: 'reading', title: 'The 5 Whys — root cause analysis', url: 'https://www.mindtools.com/a3mi00v/5-whys', description: 'How to drill from symptom to cause.' },
        { type: 'video', title: 'SWOT analysis explained', url: 'https://www.mindtools.com/amtbj63/swot-analysis', meta: '8 min', description: 'Internal vs. external factors, with examples.' },
      ],
      content: `## Strategy Analysis: why before what

Before anyone builds a report, writes a requirement, or configures accounting software, a Business Analyst answers one question: **why does this change need to happen at all?** That is the job of **Strategy Analysis** — BABOK Knowledge Area 4. It has four parts, done in order:

1. **Analyze the current state** — where we are, and what hurts.
2. **Define the future state** — where we want to be.
3. **Assess risks** — what could derail the journey.
4. **Define the change strategy** — how we get there.

This lesson is the first part.

## The current state and the business need

The **current state** is how things work *today* — the people, processes, data, and tools already in place. The **business need** is the problem or opportunity that justifies changing it. A classic BA mistake is to accept the stakeholder's *requested solution* as the need. "We need a new dashboard" is a solution; the need might be "we can't close the books on time."

> **Rule:** state the need as a problem to solve, not a solution to build. Solutions come later, in Requirements and Solution Design.

## Root cause: symptom vs. cause

A **symptom** is what people feel ("the report is always wrong"). A **root cause** is why it happens ("two teams key the same invoice into different modules"). Fix a symptom and it returns; fix the root cause and it stays fixed. Two tools help you get there.

### 5 Whys

Ask "why?" repeatedly — usually about five times — until you reach a cause you can actually act on.

| Step | Question | Answer |
|------|----------|--------|
| Why 1 | Why is month-end close late? | Reconciliation isn't finished on time. |
| Why 2 | Why isn't reconciliation finished? | The team matches bank lines to invoices by hand. |
| Why 3 | Why match by hand? | Bank and ledger exports don't share a common key. |
| Why 4 | Why no common key? | Invoice numbers are typed differently in each system. |
| Why 5 | Why typed differently? | There is no agreed numbering standard — **root cause**. |

### Fishbone (Ishikawa)

A fishbone groups possible causes into categories — commonly **People, Process, System, Data, Policy, Environment** — all pointing at one effect. It stops you from blaming a single scapegoat and surfaces causes across the whole operation:

\`\`\`mermaid
flowchart LR
  P[People:<br/>manual keying, no owner] --> E{{Month-end close<br/>is 5 days late}}
  Q[Process:<br/>no reconciliation SOP] --> E
  S[System:<br/>exports not matched] --> E
  D[Data:<br/>duplicate / mistyped invoices] --> E
\`\`\`

## SWOT — frame the situation

**SWOT** summarizes where the organization stands. **Strengths** and **Weaknesses** are *internal* (things you control); **Opportunities** and **Threats** are *external* (things in the market or environment):

| | Helpful | Harmful |
|--------|---------|---------|
| **Internal** | Strengths — clean chart of accounts, skilled finance team | Weaknesses — manual reconciliation, no automation |
| **External** | Opportunities — new ERP/API integrations, automation tools | Threats — audit deadlines, staff turnover, new tax rules |

> **BA takeaway:** current-state analysis produces a *shared, evidence-based* picture of the problem. Everything downstream — future state, risk, change strategy — builds on it.`,
      realWorldExample: `**From your world (accounting/ERP):**

A finance manager tells you: *"We need a new report to speed up month-end."* You resist building anything yet and analyze the **current state** of their MISA-based close.

You watch the actual process: every month two staff export bank statements and the sales ledger from MISA, print both, and tick off matching lines with a highlighter. It takes five days and always slips.

- **5 Whys** leads you past the symptom ("close is late") to the root cause: *there is no shared invoice-number standard, so nothing matches automatically.*
- A quick **fishbone** confirms causes across People (manual keying), Process (no SOP), System (unmatched exports), and Data (duplicate invoices).
- A **SWOT** shows a real strength (a disciplined finance team) and a fixable weakness (100% manual reconciliation).

You reframe the request: the need isn't "a new report," it's *"reduce month-end reconciliation from 5 days to under 1, with no manual matching."* That single sentence — grounded in evidence — is worth more than any report you could have rushed to build.`,
      exercises: [
        {
          id: 'sa1-e1',
          title: 'Run a 5 Whys',
          prompt: 'A stakeholder complains: "Our aged-receivables report is never trusted." Write a 5 Whys chain that could reach an actionable root cause.',
          hint: 'Each answer becomes the subject of the next "why". Stop at a cause you can act on.',
          sampleSolution: 'Why 1: Why isn\'t it trusted? Numbers disagree with the ledger. Why 2: Why do they disagree? Some payments aren\'t posted before the report runs. Why 3: Why aren\'t they posted? Bank imports happen weekly, not daily. Why 4: Why weekly? No one owns the daily import. Why 5: Why no owner? The task was never assigned when the process changed — root cause: unassigned ownership of daily bank posting.',
        },
        {
          id: 'sa1-e2',
          title: 'Sort a SWOT',
          prompt: 'Classify each into a SWOT quadrant: (a) skilled in-house finance team, (b) reconciliation done by hand, (c) new bank-feed API available, (d) tighter statutory audit deadline.',
          sampleSolution: '(a) Strength (internal, helpful). (b) Weakness (internal, harmful). (c) Opportunity (external, helpful). (d) Threat (external, harmful).',
        },
      ],
      assignment: undefined,
      deliverables: ['A 5 Whys chain that reaches an actionable root cause', 'A one-page SWOT of the current state'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Complete both exercises'],
    },

    // ---------------------------------------------------------------- SA2
    {
      id: 'sa2',
      code: 'SA2',
      title: 'Define the Future State & Assess Risks',
      summary:
        'Describe the desired future state, make it measurable with SMART goals, size the gap between now and then, and assess the risks of getting there.',
      moduleId: 'm6-strategy',
      objectives: [
        'Describe a future state — the capabilities, processes, data, and technology needed to meet the business need',
        'Write SMART goals and objectives that make the future state measurable',
        'Perform a gap analysis comparing the current state to the future state',
        'Assess risks by likelihood and impact and choose a response (avoid, mitigate, transfer, accept)',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['sa1'],
      resources: [
        { type: 'reading', title: 'SMART goals — how to write them', url: 'https://www.mindtools.com/a4wo118/smart-goals', description: 'Specific, Measurable, Achievable, Relevant, Time-bound.' },
        { type: 'reading', title: 'Gap analysis — closing the distance', url: 'https://www.mindtools.com/a4qxfaw/gap-analysis', description: 'Current vs. future, and the actions between.' },
        { type: 'video', title: 'Risk assessment basics (likelihood × impact)', url: 'https://www.mindtools.com/asv3ehc/risk-analysis-and-risk-management', meta: '10 min', description: 'Scoring and responding to risk.' },
      ],
      content: `## The future state

The **future state** describes how things *should* work once the business need is met — not the software you'll buy, but the **capabilities** the organization must have. Describe it across the same dimensions you studied in the current state: people, process, data, and technology.

A good future-state description is concrete enough that everyone pictures the same thing: *"At month-end, bank lines are matched to ledger entries automatically; staff review only exceptions; close completes in under one day."*

## SMART goals and objectives

A future state is only useful if you can tell when you've reached it. Make each objective **SMART**:

- **S**pecific — one clear outcome
- **M**easurable — a number you can check
- **A**chievable — realistic with the resources you have
- **R**elevant — tied to the business need
- **T**ime-bound — has a deadline

*Vague:* "make month-end faster." *SMART:* "cut month-end reconciliation from 5 days to under 1 day by Q4, with zero manual line-matching."

## Gap analysis

A **gap analysis** puts current and future side by side and names the **gap** — the work that closes the distance. The gaps become the scope of the change.

| Dimension | Current state | Future state | Gap to close |
|-----------|---------------|--------------|--------------|
| Process | Manual highlighter matching | Auto-match, review exceptions only | Design an exception-based reconciliation SOP |
| Data | Invoice numbers typed per system | One shared numbering standard | Define and enforce a numbering rule |
| Technology | Exports from MISA to paper | Automated bank-feed / API matching | Configure or build the matching integration |
| People | 2 staff × 5 days | 1 reviewer × <1 day | Train reviewers; reassign freed capacity |
| Metric | Close in 5 days | Close in <1 day | Instrument and track close-time |

## Assess the risks

Every change carries risk. Score each risk on **likelihood × impact**, then choose a **response**:

- **Avoid** — change the plan so the risk can't occur.
- **Mitigate** — reduce its likelihood or impact.
- **Transfer** — shift it to someone else (insurance, vendor SLA).
- **Accept** — acknowledge it and monitor, if it's small.

| Risk | Likelihood | Impact | Response |
|------|-----------|--------|----------|
| Historical invoice numbers can't be standardized | Medium | High | Mitigate — map old numbers once, enforce the new rule going forward |
| Staff resist the new SOP | Medium | Medium | Mitigate — involve them early, train, show time saved |
| Bank-feed API changes format | Low | High | Transfer — vendor SLA + validation checks on import |
| A few edge cases still need manual review | High | Low | Accept — route exceptions to a reviewer queue |

> **BA takeaway:** future state without SMART measures is a wish; a gap analysis without risk assessment is a plan that ignores reality. Together they turn "why" into a defensible target.`,
      realWorldExample: `**From your world (accounting/ERP):**

Building on the reconciliation problem from SA1, you define the **future state**: bank statement lines are imported daily and matched to MISA ledger entries automatically against a shared invoice-number key; staff touch only the unmatched exceptions; month-end close completes in under one day.

You make it **SMART**: *"Reduce month-end reconciliation effort from ~10 person-days to under 2, and close from 5 days to under 1, by the end of Q4."*

Your **gap analysis** shows the real work isn't the software at all — it's agreeing one invoice-numbering standard and designing an exception-based SOP. Then you **assess risks**: the biggest is that years of historical invoices use inconsistent numbers (High impact) — you *mitigate* by mapping them once and enforcing the standard from now on. Staff resistance is *mitigated* by involving the two reconcilers in designing the new flow. The rare edge case you simply *accept* and route to a review queue. Now the change has a measurable target and its risks are on the table before a single line is configured.`,
      exercises: [
        {
          id: 'sa2-e1',
          title: 'Make it SMART',
          prompt: 'Rewrite this weak objective into a SMART one: "We want faster invoice approvals." Assume today an invoice takes about 3 days to approve.',
          hint: 'Add a number, a baseline, and a deadline tied to the business need.',
          sampleSolution: 'Reduce average invoice-approval time from 3 days to under 8 business hours by end of Q3, without increasing approval errors — measured from receipt to posted approval in the ERP.',
        },
        {
          id: 'sa2-e2',
          title: 'Score and respond to a risk',
          prompt: 'A new automated bank-feed occasionally mis-matches a payment to the wrong invoice. Estimate likelihood and impact, then choose and justify a response.',
          sampleSolution: 'Likelihood: Medium (fuzzy matching sometimes errs); Impact: High (wrong reconciliation corrupts the ledger). Response: Mitigate — require a confidence threshold, auto-match only high-confidence lines, and route anything below it to a human review queue; add a reversible posting so any bad match can be undone.',
        },
      ],
      assignment: undefined,
      deliverables: ['A gap-analysis table (current vs. future with gaps)', 'A risk register of at least four risks scored and with responses'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Complete both exercises'],
      portfolioArtifact: {
        type: 'Case Study',
        title: 'Current-vs-Future State & Gap Analysis',
        description: 'A strategy analysis: current state, future state, and the gap to close.',
      },
    },

    // ---------------------------------------------------------------- SA3
    {
      id: 'sa3',
      code: 'SA3',
      title: 'Define the Change Strategy',
      summary:
        'Choose how to get from current to future state through transition states, and justify it with a lightweight business case of costs, benefits, and ROI.',
      moduleId: 'm6-strategy',
      objectives: [
        'Define a change strategy and the approach for moving from current to future state',
        'Model transition states as intermediate steps between now and the future',
        'Build a lightweight business case with costs, benefits, and ROI',
        'Recommend and justify a change approach to stakeholders',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['sa2'],
      resources: [
        { type: 'reading', title: 'BABOK — Define Change Strategy', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The task this lesson maps to.' },
        { type: 'reading', title: 'How to write a business case', url: 'https://www.mindtools.com/aqz2fnf/how-to-write-a-business-case', description: 'Costs, benefits, and the recommendation.' },
        { type: 'video', title: 'ROI and payback, explained simply', url: 'https://www.investopedia.com/terms/r/returnoninvestment.asp', meta: '6 min', description: 'The core investment maths a BA needs.' },
      ],
      content: `## What is a change strategy?

A **change strategy** is your *chosen approach* for moving from the current state to the future state. Rarely is "flip a switch overnight" the right answer. The strategy names how you'll sequence the work, who's affected, and how you'll manage the transition — then a **business case** justifies the investment.

## Transition states

You seldom jump straight to the future state. **Transition states** are stable, intermediate stages the organization passes through — each delivering some value while reducing risk:

\`\`\`mermaid
flowchart LR
  C[Current<br/>100% manual] --> T1[Transition 1<br/>auto-import, manual match]
  T1 --> T2[Transition 2<br/>auto-match high-confidence,<br/>review exceptions]
  T2 --> F[Future<br/>touchless close < 1 day]
\`\`\`

A **phased** strategy (through transition states) lowers risk and lets you prove value early; a **big-bang** strategy is faster but riskier. Choosing between them is a real BA judgement call.

| Approach | Pros | Cons | Use when |
|----------|------|------|----------|
| **Phased** (transition states) | Lower risk, early wins, easy rollback | Slower, temporary "two-system" overhead | Process is critical (e.g., finance close) |
| **Big-bang** | Fast, no dual running | High risk, hard to reverse | Change is small or low-risk |
| **Pilot then scale** | Learn on a small group first | Delays full benefit | Uncertain adoption |

## A lightweight business case

A business case answers: *is this change worth it?* Keep it simple — costs vs. benefits over a period, expressed as **ROI** and **payback**:

- **Costs:** software/licence, integration/build effort, training, temporary dual-running.
- **Benefits:** hours saved, errors avoided, faster close, freed capacity (quantify in money where you can).
- **ROI** = (Total Benefits − Total Costs) ÷ Total Costs, over the period.
- **Payback period** = how long until cumulative benefits cover the cost.

*Worked example:* the reconciliation change costs **60,000,000₫** (config + training) and saves about **8 person-days/month**. At ~**1,250,000₫/person-day**, that's **10,000,000₫/month** saved → **120,000,000₫/year**.

- ROI (year 1) = (120,000,000 − 60,000,000) ÷ 60,000,000 = **100%**.
- Payback = 60,000,000 ÷ 10,000,000 = **6 months**.

> **BA takeaway:** a change strategy tells stakeholders *how* you'll change; the business case tells them *why it's worth it* in numbers they trust. Together they close out Strategy Analysis and hand a justified, sequenced plan to the delivery team.`,
      realWorldExample: `**From your world (accounting/ERP):**

For the automated reconciliation change, you recommend a **phased** strategy over three **transition states** rather than a risky big-bang cutover on a live finance system:

1. **Transition 1** — automate the daily bank import into MISA, but keep manual matching. Low risk, immediate time saved on data entry.
2. **Transition 2** — enable auto-matching for high-confidence lines only; staff review the exception queue. Value grows, control stays.
3. **Future** — near-touchless month-end close in under a day, staff reassigned to analysis.

You back it with a **lightweight business case**: config and training cost about 60,000,000₫; the change frees ~8 person-days a month (~10,000,000₫), so it pays back in **6 months** with a **100% first-year ROI**, plus a faster, more auditable close. The finance director doesn't approve because you're enthusiastic — she approves because the phasing de-risks her month-end and the numbers work. That recommendation, sequenced and justified, is the deliverable Strategy Analysis exists to produce.`,
      exercises: [
        {
          id: 'sa3-e1',
          title: 'Phased or big-bang?',
          prompt: 'You must replace the reconciliation process on a live finance system used for statutory reporting. Recommend phased or big-bang, and give two reasons.',
          hint: 'Weigh reversibility and the cost of an error against speed.',
          sampleSolution: 'Phased (via transition states). Reasons: (1) finance close is business-critical and errors are costly, so early transition states let you prove accuracy and roll back safely; (2) running old and new in parallel builds trust and surfaces edge cases before full cutover, avoiding a high-risk overnight switch.',
        },
        {
          id: 'sa3-e2',
          title: 'Compute ROI and payback',
          prompt: 'A change costs 40,000,000₫ and saves 5,000,000₫ per month. Compute the first-year ROI and the payback period.',
          hint: 'Annual benefit = monthly saving × 12. ROI = (benefit − cost) ÷ cost. Payback = cost ÷ monthly saving.',
          sampleSolution: 'Annual benefit = 5,000,000 × 12 = 60,000,000₫. ROI (year 1) = (60,000,000 − 40,000,000) ÷ 40,000,000 = 50%. Payback = 40,000,000 ÷ 5,000,000 = 8 months.',
        },
      ],
      assignment: {
        id: 'sa3-assignment',
        title: 'Write a Mini Business Case',
        brief:
          'Take a real or realistic improvement to an accounting/ERP process (e.g., automating reconciliation, faster invoice approvals, or a new reporting integration). Write a one-page business case that a finance decision-maker could approve or reject.',
        deliverable:
          'A one-page business case that includes: (1) the business need in one sentence, (2) the recommended change strategy and any transition states, (3) estimated costs, (4) quantified benefits, (5) ROI and payback period, and (6) a clear recommendation.',
        rubric: [
          'States the business need as a problem, not a pre-chosen solution',
          'Recommends a change strategy (phased / big-bang / pilot) and justifies it',
          'Lists concrete costs and quantified benefits (in money where possible)',
          'Computes ROI and payback correctly from those numbers',
          'Ends with an unambiguous recommendation a decision-maker can act on',
        ],
      },
      deliverables: ['A transition-state roadmap from current to future', 'A one-page business case with ROI and payback'],
      completionCriteria: ['Score ≥ 70% on the module exam', 'Submit the mini business case assignment'],
    },
  ],
}

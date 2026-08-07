import type { Module } from '@/types'

// ============================================================================
// MODULE 2 — BA Foundations & Core Concepts
// Grounds the learner in what business analysis actually is (per IIBA BABOK v3):
// the BA role and value, the Business Analysis Core Concept Model (BACCM), and
// how requirements are classified. Authored to match the Module 1 exemplar shape.
// ============================================================================

export const module2Foundations: Module = {
  id: 'm2-foundations',
  code: 'M2',
  title: 'BA Foundations & Core Concepts',
  description:
    'What business analysis is, the BABOK Business Analysis Core Concept Model (BACCM), key terms, and how requirements are classified.',
  icon: '🧭',
  accent: 'from-blue-500 to-indigo-500',
  lessons: [
    // ------------------------------------------------------------------- F1
    {
      id: 'f1',
      code: 'F1',
      title: 'What Is Business Analysis? The BA Role',
      summary:
        'Define business analysis the BABOK way, tell the BA apart from the PM and Product Owner, and adopt a problem-first mindset.',
      moduleId: 'm2-foundations',
      objectives: [
        'Define business analysis and articulate the value it delivers (per BABOK v3)',
        'Distinguish the BA role from the Project Manager and the Product Owner',
        'Identify where BAs work: IT/systems, business process, and data/analytics',
        'Apply a problem-first (problem-vs-solution) mindset to a stakeholder request',
      ],
      durationMinutes: 45,
      difficulty: 'Beginner',
      prerequisites: ['pbi-4'],
      resources: [
        { type: 'reading', title: 'IIBA — What Is Business Analysis?', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/what-is-business-analysis/', description: 'The official IIBA definition and scope of the profession.' },
        { type: 'reading', title: 'A Guide to the Business Analysis Body of Knowledge (BABOK v3)', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'The global standard this whole course is framed around.' },
        { type: 'video', title: 'The Business Analyst role explained', url: 'https://www.iiba.org/career-resources/', meta: '12 min', description: 'A short tour of what a BA does day to day.' },
      ],
      content: `## What is business analysis?

The IIBA's **BABOK v3** gives the canonical definition:

> **Business analysis** is the practice of enabling change in an enterprise by *defining needs* and *recommending solutions* that deliver *value* to stakeholders.

Read that slowly — every emphasised idea is a core concept you'll meet again (need, solution, value, stakeholder, change). A Business Analyst is not "the person who writes documents." A BA is the person who makes sure the organization builds the **right thing** for the **right reason**.

## The value a BA delivers

Projects rarely fail because the team couldn't build the software. They fail because the team built the *wrong* software — a beautiful solution to a poorly understood problem. The BA's value is **reducing that risk**:

- Turning vague asks into clear, testable **requirements**.
- Making sure a proposed **solution** actually addresses the underlying **need**.
- Keeping **stakeholders** aligned so there are no surprises at delivery.

## Need → Requirement → Solution

The BA's mental model is a short chain. You never jump straight to a solution — you trace it back to the need first.

\`\`\`mermaid
flowchart LR
  N[Need<br/>the problem / opportunity] --> R[Requirement<br/>what the solution must do]
  R --> S[Solution<br/>what we build or change]
  S -. delivers .-> V[Value]
\`\`\`

A **need** is a problem or opportunity. A **requirement** is a statement of what a solution must do to satisfy that need. A **solution** is the thing you actually deliver. The arrows only run one way for a reason: a solution with no need behind it is waste.

## BA vs Project Manager vs Product Owner

Three roles often get confused. They collaborate closely but answer different questions:

| | Business Analyst (BA) | Project Manager (PM) | Product Owner (PO) |
|---|---|---|---|
| Core question | **What** do we need, and why? | **When / how** do we deliver it? | Is it the **right product**, ordered by value? |
| Focus | Needs, requirements, solution fit | Scope, schedule, budget, risk | Product vision & backlog priority |
| Owns | Requirements & analysis | The plan & delivery | The product backlog |
| Optimises for | Building the *right thing* | Building the thing *right, on time* | Maximising product *value* |
| Typical artifacts | BRD, user stories, process models | Plan, RAID log, status report | Prioritised backlog, roadmap |

In small teams one person may wear several hats — a PO who also does BA work, or a BA who helps manage a plan. Knowing the *hats* keeps you clear on which question you're answering right now.

## Where BAs work

Business analysis is a mindset applied across domains. Three common flavours:

- **IT / systems BA** — bridges business and a software/engineering team (requirements, user stories, acceptance criteria).
- **Business-process BA** — analyses and improves how work flows (process maps, bottlenecks, hand-offs).
- **Data / analytics BA** — turns business questions into metrics, reports, and dashboards (this is where Module 1's Power BI skills live).

## The problem-first mindset

The single most valuable BA habit: **when a stakeholder hands you a solution, ask "why?" until you reach the need.** Requests arrive dressed as solutions ("add a button", "buy this tool"). Your job is to gently unwrap the request until the real problem is visible — then confirm the solution actually solves it.

> **Key idea:** Stakeholders are experts in their *problem*. You are the expert in *defining* it precisely and matching it to a solution. Start with the need, never the button.`,
      realWorldExample: `**From your world (accounting / ERP):**

A finance client using **MISA** accounting software emails you one line: *"Please add an **Export to Excel** button to the invoices screen."*

The junior instinct is to write a ticket: "Build an Export-to-Excel button." The BA instinct is to ask **why**:

1. *Why do you need the export?* → "To build our monthly revenue report."
2. *What do you do with it in Excel?* → "Copy it into a template, sum by customer, and email it to the director every month."
3. *How long does that take, and how often is it wrong?* → "About half a day, and totals get miscopied sometimes."

Now the **need** is clear: *a reliable monthly revenue report, produced with little manual effort.* The Excel button was just one guessed **solution**. Better solutions might be a scheduled report inside MISA, or a refreshable Power BI dashboard fed from the accounting data — no copy-paste, no half-day, no miscopied totals.

By tracing **Need → Requirement → Solution** instead of building the first button asked for, you delivered the outcome the client actually wanted. That "ask why" reflex is business analysis in a single move.`,
      exercises: [
        {
          id: 'f1-e1',
          title: 'Unwrap the request',
          prompt: 'A warehouse manager asks you to "add a print button to the stock screen." Write two "why" questions you would ask, then state the underlying need you expect to find.',
          hint: 'Follow the request back up the Need → Requirement → Solution chain — the button is a guessed solution, not the need.',
          sampleSolution: 'Q1: "What do you do with the printout once you have it?" Q2: "Who reads it, and how often?" Likely need: staff need an up-to-date list of low-stock items so they can reorder on time — which a scheduled low-stock report or dashboard might serve better than a print button.',
        },
        {
          id: 'f1-e2',
          title: 'Whose hat is it?',
          prompt: 'For each decision, name the primary role (BA, PM, or PO): (a) deciding which features ship first, (b) writing the acceptance criteria for a feature, (c) deciding whether the project can absorb a two-week slip.',
          sampleSolution: '(a) Product Owner — backlog priority / value ordering. (b) Business Analyst — defining what the solution must do. (c) Project Manager — schedule, scope, and risk trade-offs.',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A one-paragraph, in-your-own-words definition of business analysis',
        'A short "5 whys" note that traces one real request back to its underlying need',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Correctly separate the BA, PM, and PO responsibilities in your own words',
      ],
    },

    // ------------------------------------------------------------------- F2
    {
      id: 'f2',
      code: 'F2',
      title: 'The Business Analysis Core Concept Model (BACCM)',
      summary:
        'Learn the six BABOK core concepts — Change, Need, Solution, Stakeholder, Value, Context — and use them to frame any initiative.',
      moduleId: 'm2-foundations',
      objectives: [
        'Name and define the six BACCM core concepts',
        'Explain how the six concepts interrelate and depend on one another',
        'Use BACCM as a checklist to frame any change initiative',
        'Spot when a project has ignored one of the six concepts',
      ],
      durationMinutes: 50,
      difficulty: 'Beginner',
      prerequisites: ['f1'],
      resources: [
        { type: 'reading', title: 'IIBA — The BACCM (Business Analysis Core Concept Model)', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'The BABOK v3 chapter that defines the six core concepts.' },
        { type: 'reading', title: 'BABOK v3 Guide — key terms & concepts', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/', description: 'Foundational vocabulary every BA shares.' },
        { type: 'video', title: 'BACCM in six concepts (overview)', url: 'https://www.iiba.org/career-resources/', meta: '10 min', description: 'A quick walkthrough of the model and how the pieces relate.' },
      ],
      content: `## Why a model of concepts?

Business analysts across every industry share one conceptual vocabulary so they can reason about *any* initiative consistently. BABOK v3 packages it as the **Business Analysis Core Concept Model (BACCM)** — **six** ideas that are always present and always interconnected.

## The six core concepts

| Concept | Definition (BABOK v3, plain English) | Example |
|---------|--------------------------------------|---------|
| **Change** | The act of transformation in response to a need — moving from a current state to a better future state. | Replacing manual monthly reports with an automated dashboard. |
| **Need** | A problem or opportunity to be addressed. Needs motivate change. | "Month-end reporting takes half a day and is error-prone." |
| **Solution** | A specific way of satisfying one or more needs in a context. | A scheduled report, or a Power BI dashboard on the accounting data. |
| **Stakeholder** | A group or individual with a relationship to the change, the need, or the solution. | Finance manager, accountants, the director, the IT admin. |
| **Value** | The worth, importance, or usefulness of something to a stakeholder in a context. | Half a day saved each month; fewer reporting errors; faster decisions. |
| **Context** | The circumstances that influence, are influenced by, and provide understanding of the change. | The accounting software in use, the fiscal calendar, team size, regulations. |

A useful memory hook: **C**hange, **N**eed, **S**olution, **S**takeholder, **V**alue, **C**ontext.

## How they interrelate

The concepts are not a list — they are a **web**. You cannot fully understand one without the others: a *solution* only makes sense against a *need*; *value* is only meaningful to a *stakeholder*; every one of them sits inside a *context*.

\`\`\`mermaid
flowchart TB
  Need --- Change
  Change --- Solution
  Solution --- Value
  Value --- Stakeholder
  Stakeholder --- Need
  Change --- Value
  Need --- Solution
  Context -. surrounds everything .- Change
  Context -. surrounds everything .- Solution
\`\`\`

Change one node's shape here and the others shift: change the **context** (a new regulation) and the **need** may change; change the **stakeholders** and the definition of **value** may change. That interdependence is the whole point.

## BACCM as a framing checklist

Before diving into any initiative, a BA can run the six concepts as questions:

1. **Need** — what problem or opportunity are we really addressing?
2. **Stakeholder** — who is affected, and who decides?
3. **Value** — what will make this worthwhile, and to whom?
4. **Solution** — what options could satisfy the need?
5. **Change** — how do we get from today's state to the future state?
6. **Context** — what constraints and circumstances shape all of the above?

If you cannot answer one of the six, you have found your next analysis task.

> **Key idea:** BACCM is a *thinking tool*, not paperwork. When a project feels off, it's usually because one concept was skipped — a solution with no clear need, or value defined for the wrong stakeholder.`,
      realWorldExample: `**From your world:** A mid-sized company is **rolling out new accounting software** (say, migrating from spreadsheets to MISA). Frame it with BACCM:

- **Need** — spreadsheet-based accounting no longer scales; month-end is slow and error-prone, and audits are painful.
- **Stakeholder** — the chief accountant, the AP/AR clerks, the finance director, the external auditor, and IT.
- **Value** — a faster, auditable close; fewer manual errors; compliance with tax reporting; time freed for analysis instead of data entry.
- **Solution** — adopt and configure the accounting package, migrate historical data, set the chart of accounts, and train staff.
- **Change** — a phased migration: pilot one month in parallel, reconcile against the old spreadsheets, then cut over.
- **Context** — the fiscal calendar, local tax regulations, the volume of transactions, the clerks' current skill level, and the go-live deadline before year-end.

Notice how one concept constrains another: the **context** (year-end deadline) shapes the **change** (parallel run, not big-bang); the **stakeholders** (the auditor) shape the **value** (auditability). Miss any one concept — for example, forget the auditor as a stakeholder — and the rollout satisfies a need nobody actually prioritised. BACCM keeps every angle on the table.`,
      exercises: [
        {
          id: 'f2-e1',
          title: 'Map an initiative to BACCM',
          prompt: 'Your team is introducing an online customer portal for viewing invoices. Write one sentence for each of the six BACCM concepts (Change, Need, Solution, Stakeholder, Value, Context) for this initiative.',
          hint: 'Answer the six framing questions in order: Need, Stakeholder, Value, Solution, Change, Context.',
          sampleSolution: 'Need: customers call in constantly to ask about invoice status. Stakeholder: customers, the accounts-receivable team, support staff, IT. Value: fewer support calls and faster payment. Solution: a self-service web portal showing each customer their invoices and balances. Change: build/integrate the portal and migrate customers to it in phases. Context: the existing accounting system, data-privacy rules, and customers with varying tech comfort.',
        },
        {
          id: 'f2-e2',
          title: 'Find the missing concept',
          prompt: 'A project charter says: "We will build a mobile app because our competitor has one." Which BACCM concept is clearly missing, and what question would you ask to fill the gap?',
          sampleSolution: 'The Need is missing — "because a competitor has one" is not a problem or opportunity for our own stakeholders. Ask: "What specific problem would the app solve for our customers or staff, and what value would that create?"',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A one-page BACCM canvas mapping a chosen initiative across all six concepts',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Correctly name and define all six core concepts without notes',
      ],
    },

    // ------------------------------------------------------------------- F3
    {
      id: 'f3',
      code: 'F3',
      title: 'Requirements Classification & Key Terms',
      summary:
        'Master the BABOK requirements classification schema, tell requirements apart from designs, and recognise what makes a requirement "good".',
      moduleId: 'm2-foundations',
      objectives: [
        'Classify requirements as business, stakeholder, solution (functional/non-functional), or transition',
        'Explain the difference between a requirement and a design',
        'List and apply the characteristics of a good requirement',
        'Write examples of each requirement type for a real feature',
      ],
      durationMinutes: 45,
      difficulty: 'Beginner',
      prerequisites: ['f2'],
      resources: [
        { type: 'reading', title: 'BABOK v3 — Requirements Classification Schema', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'The five requirement types and how BABOK defines them.' },
        { type: 'reading', title: 'ISO/IEC/IEEE 29148 — characteristics of good requirements', url: 'https://www.iiba.org/career-resources/', description: 'Industry criteria for well-formed requirements.' },
        { type: 'download', title: 'Requirement-type worksheet (template)', url: 'blob:requirement-types-worksheet', description: 'A one-page grid to sort a feature into the five requirement types.' },
      ],
      content: `## The requirements classification schema

BABOK v3 sorts every requirement into one of a few **levels**. The point isn't bureaucracy — it's knowing *which altitude* you're speaking at, so business goals don't get muddled with screen details.

| Type | What it describes | Whose view | Example (invoicing) |
|------|-------------------|------------|---------------------|
| **Business requirement** | High-level goals/outcomes of the enterprise | The organisation | "Reduce late payments by 20% this year." |
| **Stakeholder requirement** | What a specific stakeholder group needs from the solution | A stakeholder group | "Accountants need to see which invoices are overdue." |
| **Solution — Functional** | What the solution must *do* (behaviour, features) | The solution | "The system shall flag an invoice as Overdue when it passes its due date." |
| **Solution — Non-functional** | *Quality* attributes: how well the solution performs | The solution | "The overdue list must load in under 2 seconds." |
| **Transition requirement** | Temporary capabilities needed only to *move* from old to new | The change itself | "Migrate 3 years of historical invoices into the new system." |

Two things to notice. First, they nest: business requirements set the *why*, stakeholder requirements the *who needs what*, and solution requirements the *what the system does*. Second, **transition requirements are temporary** — data migration, parallel running, or one-off training exist only during the switch-over and then retire.

### Functional vs non-functional

- **Functional** = *what it does* — a behaviour or feature ("the system shall email a receipt").
- **Non-functional** = *how well it does it* — a quality: performance, security, usability, availability ("receipts send within 30 seconds, 99.9% of the time").

A handy test: if you can put the word **"shall"** in front and describe an action, it's usually functional; if it describes a *quality or constraint*, it's non-functional.

## Requirements vs designs

This trips up most new BAs. BABOK draws the line by *intent*:

- A **requirement** focuses on the **need** — *what* must be true, independent of any particular solution. ("Users must be able to retrieve an invoice quickly.")
- A **design** focuses on the **solution** — a *how*, a specific way to meet the requirement. ("A search box at the top-right that queries by invoice number.")

The boundary is relative, not absolute: one person's design detail is the next team's requirement. The skill is staying aware of which one you're writing, so you don't lock in a "how" before the "what" is agreed.

## Characteristics of a good requirement

BABOK (echoing ISO/IEC/IEEE 29148) lists the qualities of well-written requirements. A memorable shortlist:

- **Atomic** — one requirement, one idea (not five bundled together).
- **Complete** — enough detail to act on, nothing critical missing.
- **Consistent** — doesn't contradict another requirement.
- **Unambiguous** — one possible interpretation, not "fast" or "user-friendly" left undefined.
- **Testable / Verifiable** — you can prove it was met (measurable acceptance criteria).
- **Feasible** — achievable within the constraints/context.
- **Prioritised** — its relative importance is known.

> **Key idea:** "The system should be fast" is a *wish*, not a requirement — it's not testable or unambiguous. "The overdue list loads in under 2 seconds for 1,000 invoices" is a requirement you can verify.`,
      realWorldExample: `**From your world:** The finance team wants an **invoice-approval** feature — invoices above a threshold must be approved by a manager before payment. Here's one requirement of *each* type:

- **Business requirement:** "Reduce unauthorised payments to zero and pass the annual audit with no findings on approvals."
- **Stakeholder requirement:** "The finance manager needs to review and approve or reject any invoice over 10,000,000 VND before it is paid."
- **Solution — functional:** "The system shall route every invoice with an amount above the approval threshold to the assigned manager's approval queue, and shall block payment until it is approved."
- **Solution — non-functional:** "An approval decision must be recorded in an immutable audit log within 1 second, and the queue must be available 99.9% of business hours."
- **Transition requirement:** "During go-live, migrate all currently pending invoices into the new approval queue and run the old and new approval steps in parallel for one month before retiring the manual process."

Now contrast a **requirement** with a **design**. Requirement: *"A manager must be able to approve an invoice."* Design: *"A green Approve button in the top-right of the invoice detail screen, with a confirmation dialog."* The requirement survives even if you later choose a different screen layout — which is exactly why you keep the two separated until the "what" is signed off.`,
      exercises: [
        {
          id: 'f3-e1',
          title: 'Classify the requirement',
          prompt: 'Label each as business, stakeholder, functional, non-functional, or transition: (a) "The clerk needs to search invoices by customer name." (b) "The search must return results in under 1 second." (c) "Import last year\'s invoices before go-live." (d) "Cut days-sales-outstanding from 45 to 35."',
          hint: 'Ask: is it an enterprise goal, a stakeholder\'s need, a behaviour, a quality, or a one-time move?',
          sampleSolution: '(a) Stakeholder requirement. (b) Non-functional (performance). (c) Transition requirement. (d) Business requirement.',
        },
        {
          id: 'f3-e2',
          title: 'Fix the bad requirement',
          prompt: 'Rewrite "The report screen should be fast and user-friendly" into a good, testable requirement. Name which quality it was failing.',
          sampleSolution: 'It fails unambiguous and testable ("fast" and "user-friendly" are undefined). Rewrite: "The report screen shall display the current month\'s figures within 2 seconds for up to 5,000 records, and a first-time user shall complete the run-report task without help in under 1 minute."',
        },
      ],
      assignment: {
        id: 'f3-assignment',
        title: 'Requirement-type breakdown for a feature',
        brief:
          'Choose a small finance/accounting feature (e.g., invoice approval, expense claims, or a monthly report export). Produce a one-page document that breaks the feature down into the five requirement types and separates two requirements from their designs.',
        deliverable:
          'A one-page requirement document containing: (1) at least one business, one stakeholder, one functional, one non-functional, and one transition requirement for the feature; (2) two requirement-vs-design pairs; (3) a short note on how each requirement is testable.',
        rubric: [
          'Includes a correct example of all five requirement types',
          'Functional vs non-functional are clearly distinguished',
          'Each requirement is atomic, unambiguous, and testable',
          'Two requirement/design pairs correctly separate "what" from "how"',
          'The transition requirement is genuinely temporary (retires after go-live)',
        ],
      },
      deliverables: [
        'A one-page requirement document covering all five requirement types for a chosen feature',
        'Two requirement-vs-design pairs for the same feature',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Submit the requirement-type breakdown assignment',
      ],
      portfolioArtifact: {
        type: 'Requirement Doc',
        title: 'Requirement Classification Breakdown',
        description:
          'A one-page document classifying a real feature into business, stakeholder, functional, non-functional, and transition requirements, with requirement-vs-design pairs — demonstrating command of the BABOK requirements schema.',
      },
    },
  ],
}

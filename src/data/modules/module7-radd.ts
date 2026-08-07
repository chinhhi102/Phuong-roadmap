import type { Module } from '@/types'

// ============================================================================
// MODULE 7 — Requirements Analysis & Design Definition (RADD)
// BABOK v3 Knowledge Area 5: specify & model requirements, verify & validate,
// define & evaluate design options. Follows the Module 1 authoring exemplar.
// ============================================================================

export const module7Radd: Module = {
  id: 'm7-radd',
  code: 'M7',
  title: 'Requirements Analysis & Design Definition',
  description:
    'BABOK Knowledge Area 5: specify and model requirements (user stories, use cases, BPMN, data models), verify and validate them, and define & evaluate design options.',
  icon: '📐',
  accent: 'from-violet-500 to-purple-500',
  lessons: [
    // ---------------------------------------------------------------- RA1
    {
      id: 'ra1',
      code: 'RA1',
      title: 'Specify & Model Requirements: User Stories & Use Cases',
      summary: 'Write INVEST user stories with Gherkin acceptance criteria, and know when a use case is the better tool.',
      moduleId: 'm7-radd',
      objectives: [
        'Write user stories in the "As a <role>, I want <goal>, so that <benefit>" format',
        'Apply the INVEST criteria to judge story quality',
        'Decompose an epic into features and stories, and add Given/When/Then acceptance criteria',
        'Explain when to use a use case (actors, main and alternate flows) instead of a user story',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['sa3'],
      resources: [
        { type: 'reading', title: 'User Stories — Bridging the Gap', url: 'https://www.bridging-the-gap.com/user-stories/', description: 'A BA-friendly walkthrough of writing and splitting user stories.' },
        { type: 'reading', title: 'Use Case Diagrams — UML', url: 'https://www.uml-diagrams.org/use-case-diagrams.html', description: 'Actors, use cases and relationships explained with UML notation.' },
        { type: 'reading', title: 'Requirements Analysis & Design Definition — IIBA', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'BABOK Knowledge Area overview for specifying and modelling requirements.' },
      ],
      content: `## Two ways to specify a requirement

Once you have gathered raw needs, you must *specify and model* them so a team can build the right thing. Two workhorse formats:

- **User story** — a short, negotiable promise of value, ideal for agile delivery.
- **Use case** — a step-by-step description of an actor achieving a goal, ideal when the interaction has many branches.

## The user story template

Always write the value, not just the feature:

\`\`\`
As a <role>, I want <goal>, so that <benefit>.
\`\`\`

Example: *As an employee, I want to submit an expense claim online, so that I get reimbursed without paper forms.*

## INVEST — is this a good story?

| Letter | Means | Quick check |
|--------|-------|-------------|
| **I**ndependent | Can be delivered on its own | No hard ordering with other stories? |
| **N**egotiable | A conversation, not a contract | Room to discuss the "how"? |
| **V**aluable | Delivers value to a user/customer | Names a real benefit? |
| **E**stimable | Team can size it | Enough clarity to estimate? |
| **S**mall | Fits in a sprint | Splittable if too big? |
| **T**estable | You can prove it's done | Has acceptance criteria? |

## Epics → Features → Stories

Big needs are decomposed top-down:

- **Epic** — a large body of work (e.g. "Expense management").
- **Feature** — a coherent slice (e.g. "Submit a claim").
- **Story** — one INVEST-sized increment (e.g. "Attach a receipt to a claim").

## Acceptance criteria in Gherkin

Gherkin makes "done" testable with **Given / When / Then**:

\`\`\`gherkin
Feature: Submit expense claim

  Scenario: Claim under the approval threshold
    Given I am a logged-in employee
    And my claim total is 400,000 VND
    When I submit the claim with a receipt attached
    Then the claim status becomes "Pending Approval"
    And my line manager is notified

  Scenario: Claim missing a receipt
    Given I am a logged-in employee
    When I submit a claim with no receipt attached
    Then I see the error "A receipt is required"
    And the claim is not submitted
\`\`\`

## When to reach for a use case

A **use case** describes an **actor** pursuing a goal through a **main flow** plus **alternate/exception flows**. Prefer it when the interaction is procedural and branch-heavy (approvals, multi-step wizards, system-to-system exchanges). Prefer a user story when you want small, negotiable, value-first increments.

> **BA takeaway:** stories and use cases are not rivals — an epic can be a use case, and its steps and exceptions become the individual stories with Gherkin acceptance criteria.`,
      realWorldExample: `**From your world (accounting/ERP, MISA):**

A finance team using MISA wants to replace paper expense forms. As a BA you frame the epic and split it:

- **Epic:** Online expense claims.
- **Story:** *As an employee, I want to submit an expense claim with a receipt photo, so that I am reimbursed faster.*
- **Story:** *As a line manager, I want to approve or reject a claim, so that only valid spend is reimbursed.*
- **Story:** *As an accountant, I want approved claims to post to the correct expense account, so that the ledger stays accurate.*

Acceptance criteria for the first story in Gherkin:

\`\`\`gherkin
Scenario: Employee submits a valid claim
  Given I am an employee with an open claim
  When I attach a receipt and submit
  Then the claim total is validated against policy
  And the claim is routed to my line manager for approval
\`\`\`

Each story is Independent, Valuable and Testable — exactly what the MISA delivery team needs to estimate and build.`,
      exercises: [
        {
          id: 'ra1-e1',
          title: 'Fix the weak story',
          prompt: 'Rewrite this into a proper INVEST story: "Build an approval button." State which INVEST letters it originally failed.',
          hint: 'Add role, goal and benefit; make the value explicit.',
          sampleSolution: 'Rewrite: "As a line manager, I want to approve an expense claim, so that valid spend is reimbursed quickly." The original failed Valuable (no benefit named) and Testable (no acceptance criteria/role), and arguably Negotiable (it dictated a UI control instead of a need).',
        },
        {
          id: 'ra1-e2',
          title: 'Write Gherkin acceptance criteria',
          prompt: 'For the story "As an employee, I want to submit a claim, so that I am reimbursed", write one Given/When/Then scenario for a claim that exceeds the auto-approval limit.',
          sampleSolution: 'Given I am a logged-in employee\nAnd my claim total is above the auto-approval limit\nWhen I submit the claim\nThen the claim status becomes "Pending Manager Approval"\nAnd my line manager receives a notification.',
        },
      ],
      assignment: {
        id: 'ra1-assignment',
        title: 'Expense Claims — Epic, Stories & Gherkin',
        brief:
          'Take the "Online expense claims" need for an accounting client and specify it as agile-ready requirements.',
        deliverable:
          'One epic, exactly three INVEST user stories that decompose it, and at least one Given/When/Then Gherkin scenario per story.',
        rubric: [
          'Epic is a clear, large-but-coherent body of work',
          'All three stories use the "As a / I want / so that" format',
          'Each story satisfies the INVEST criteria (especially Valuable and Testable)',
          'Every story has at least one Given/When/Then acceptance scenario',
          'Stories are genuinely small and independent, not one story split in name only',
        ],
      },
      deliverables: ['An epic decomposed into three INVEST user stories', 'Gherkin acceptance criteria for each story'],
      completionCriteria: ['Complete both exercises', 'Submit the expense-claims epic and stories assignment'],
      portfolioArtifact: {
        type: 'User Stories',
        title: 'Expense Claims — Epic & User Stories',
        description: 'INVEST user stories with Gherkin acceptance criteria.',
      },
    },

    // ---------------------------------------------------------------- RA2
    {
      id: 'ra2',
      code: 'RA2',
      title: 'Process Modeling with BPMN',
      summary: 'Model business processes with BPMN symbols and swimlanes, and contrast the As-Is with a streamlined To-Be.',
      moduleId: 'm7-radd',
      objectives: [
        'Identify the core BPMN symbols: events, activities, gateways, sequence flows, and pools/lanes',
        'Read and construct a process model using swimlanes to show responsibility',
        'Distinguish an As-Is (current) model from a To-Be (future) model',
        'Use a To-Be model to communicate a streamlined, improved process',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['ra1'],
      resources: [
        { type: 'reading', title: 'BPMN Specification & Poster — bpmn.org', url: 'https://www.bpmn.org/', description: 'The official home of BPMN with the notation quick-reference poster.' },
        { type: 'reading', title: 'Business Process Modeling — Bridging the Gap', url: 'https://www.bridging-the-gap.com/what-is-a-business-process/', description: 'How BAs model As-Is and To-Be business processes.' },
        { type: 'reading', title: 'Activity Diagrams — UML', url: 'https://www.uml-diagrams.org/activity-diagrams.html', description: 'A related flow notation useful for comparing with BPMN.' },
      ],
      content: `## Why model a process?

A **process model** shows *who* does *what*, in *what order*, and *where the decisions are*. BPMN (Business Process Model and Notation) is the shared language BAs, business people and developers all read.

## Core BPMN symbols

| Symbol | Category | Meaning |
|--------|----------|---------|
| Thin circle | **Start / End event** | Where the process begins and finishes |
| Rounded rectangle | **Activity / task** | A unit of work someone performs |
| Diamond | **Gateway** | A decision or branch/merge in the flow |
| Solid arrow | **Sequence flow** | The order in which steps happen |
| Box containing lanes | **Pool / lane** | A participant (pool) and its roles (swimlanes) |

## Swimlanes = responsibility

A **pool** is a participant (e.g. the company); **lanes** inside it are roles (Employee, Manager, Accountant). Placing each activity in a lane makes hand-offs and bottlenecks obvious.

## A simple model with a gateway

\`\`\`mermaid
flowchart LR
  S((Start)) --> A[Submit reconciliation]
  A --> G{Balances match?}
  G -- Yes --> P[Post to ledger]
  G -- No --> I[Investigate difference]
  I --> A
  P --> E((End))
\`\`\`

## As-Is vs To-Be

- **As-Is** — the process *as it works today*, warts and all. You model it to find delays, rework loops and manual hand-offs.
- **To-Be** — the *improved future* process after your recommended changes (automation, removed steps, straight-through flow).

The gap between the two models *is* your improvement recommendation, made visible.

> **BA takeaway:** never jump straight to To-Be. An honest As-Is model earns stakeholder trust and reveals exactly which steps to eliminate.`,
      realWorldExample: `**From your world (accounting/ERP, MISA):**

A client reconciles the bank statement against the ledger every month.

**As-Is:** the accountant exports transactions to Excel, matches them by hand, emails discrepancies to a colleague, waits for a reply, then re-checks — a loop that can take three days.

\`\`\`mermaid
flowchart LR
  S((Start)) --> X[Export to Excel]
  X --> M[Match by hand]
  M --> G{Discrepancy?}
  G -- Yes --> Q[Email colleague and wait]
  Q --> M
  G -- No --> C[Close reconciliation]
  C --> E((End))
\`\`\`

**To-Be:** MISA auto-imports the bank feed and auto-matches; only true exceptions surface to a review queue, so the accountant handles a handful of cases instead of hundreds. The wait-and-email loop disappears and close time drops to hours. Showing both models side by side makes the value of the change undeniable.`,
      exercises: [
        {
          id: 'ra2-e1',
          title: 'Name the symbols',
          prompt: 'In a BPMN model you see a diamond, a rounded rectangle, a thin circle, and horizontal bands. Name what each represents.',
          hint: 'Think decision, work, boundary, responsibility.',
          sampleSolution: 'Diamond = gateway (decision/branch). Rounded rectangle = activity/task. Thin circle = start or end event. Horizontal bands = swimlanes/lanes (the roles inside a pool).',
        },
        {
          id: 'ra2-e2',
          title: 'As-Is vs To-Be',
          prompt: 'A manager asks "why model the current process — just design the new one?" Give a two-sentence justification for producing an As-Is model first.',
          sampleSolution: 'The As-Is model surfaces the real delays, rework loops and hand-offs so improvements target actual pain rather than assumptions. It also builds stakeholder trust and gives a baseline to measure the To-Be against.',
        },
      ],
      assignment: {
        id: 'ra2-assignment',
        title: 'Reconciliation — As-Is & To-Be Models',
        brief:
          'Model the monthly bank reconciliation process for an accounting client, then design a streamlined future state.',
        deliverable:
          'A BPMN As-Is model of the current manual process and a To-Be model of the improved process, each using events, activities, at least one gateway, and swimlanes for the roles involved.',
        rubric: [
          'As-Is model reflects the real current process, including its rework loop',
          'Correct BPMN symbols used for events, activities and gateways',
          'Swimlanes clearly assign each activity to a role',
          'To-Be model removes or automates identifiable waste',
          'The improvement (the gap between the two) is explained in a sentence or two',
        ],
      },
      deliverables: ['A BPMN As-Is model of the current process', 'A BPMN To-Be model of the streamlined process'],
      completionCriteria: ['Complete both exercises', 'Submit the reconciliation As-Is and To-Be models'],
      portfolioArtifact: {
        type: 'BPMN Diagram',
        title: 'Reconciliation — As-Is & To-Be',
        description: 'BPMN process models showing a streamlined future state.',
      },
    },

    // ---------------------------------------------------------------- RA3
    {
      id: 'ra3',
      code: 'RA3',
      title: 'Data Modeling & Verify/Validate Requirements',
      summary: 'Build an ERD with entities, keys and cardinality, and tell verifying requirements apart from validating them.',
      moduleId: 'm7-radd',
      objectives: [
        'Model entities, attributes and relationships in an entity-relationship diagram (ERD)',
        'Distinguish primary keys from foreign keys and use them to connect entities',
        'Read and assign cardinality: one-to-one, one-to-many, and many-to-many',
        'Explain the difference between verifying a requirement and validating it',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['ra2'],
      resources: [
        { type: 'reading', title: 'Entity-Relationship Diagrams — UML', url: 'https://www.uml-diagrams.org/class-diagrams-overview.html', description: 'Class/ER modelling concepts: entities, attributes and relationships.' },
        { type: 'reading', title: 'Data Modeling for BAs — Bridging the Gap', url: 'https://www.bridging-the-gap.com/data-modeling/', description: 'A practical intro to entities, attributes and relationships.' },
        { type: 'reading', title: 'Verification vs Validation — IIBA / BABOK', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'BABOK tasks: verify requirements and validate requirements.' },
      ],
      content: `## What a data model captures

A **data model** describes the *things the business cares about* and how they relate. An **entity-relationship diagram (ERD)** is the classic notation.

- **Entity** — a thing we store data about (Customer, Invoice).
- **Attribute** — a property of an entity (Customer.Name, Invoice.Date).
- **Relationship** — how two entities connect (a Customer *has* Invoices).

## Keys tie it together

- **Primary key (PK)** — uniquely identifies each row of an entity (e.g. \`CustomerID\`).
- **Foreign key (FK)** — a PK copied into another entity to link them (e.g. \`Invoice.CustomerID\` points back to Customer).

## Cardinality — how many relate to how many

| Cardinality | Reads as | Example |
|-------------|----------|---------|
| **1:1** | one-to-one | one Employee has one login Account |
| **1:M** | one-to-many | one Customer has many Invoices |
| **M:N** | many-to-many | many Invoices reference many Products (resolved with a link entity) |

## An invoicing ERD

\`\`\`mermaid
erDiagram
  Customer ||--o{ Invoice : places
  Invoice ||--o{ InvoiceLineItem : contains
  Customer {
    int CustomerID PK
    string Name
    string TaxCode
  }
  Invoice {
    int InvoiceID PK
    int CustomerID FK
    date IssuedDate
    decimal Total
  }
  InvoiceLineItem {
    int LineItemID PK
    int InvoiceID FK
    string Description
    decimal Amount
  }
\`\`\`

## Verify vs Validate — not the same word twice

| | Verify | Validate |
|---|--------|----------|
| Question | "Are we building it **right**?" | "Are we building the **right thing**?" |
| Focus | Quality of the requirement itself | Fit with business need/value |
| Checks | Clear, complete, consistent, testable, unambiguous | Traces to a business objective, delivers value |
| Example | Is the story testable and free of ambiguity? | Does this story actually help the client get paid faster? |

> **BA takeaway:** a requirement can be perfectly well-written (verified) and still be the wrong thing to build (fails validation). You need both.`,
      realWorldExample: `**From your world (accounting/ERP, MISA):**

A client's invoicing module stores three core entities: **Customer**, **Invoice** and **Invoice Line Item**.

- A **Customer** (PK \`CustomerID\`) can place **many** Invoices — a **1:M** relationship.
- An **Invoice** (PK \`InvoiceID\`, FK \`CustomerID\`) contains **many** line items — another **1:M**.
- Each **Invoice Line Item** (PK \`LineItemID\`, FK \`InvoiceID\`) holds one product/description and its amount.

**Verify** the model: are the keys unique, the relationships consistent, and every attribute defined? **Validate** it: does this structure actually support the business need — for example, can the client report revenue per customer per month and reconcile totals against the ledger? If verification passes but validation fails, you have a tidy model of the wrong domain.`,
      exercises: [
        {
          id: 'ra3-e1',
          title: 'Assign the cardinality',
          prompt: 'State the cardinality (1:1, 1:M, or M:N) for each: (a) Customer to Invoice, (b) Invoice to Invoice Line Item, (c) Invoice to Product (before adding a link entity).',
          hint: 'Ask "how many of B can one A have, and vice versa?"',
          sampleSolution: '(a) 1:M — one customer has many invoices. (b) 1:M — one invoice has many line items. (c) M:N — an invoice can list many products and a product can appear on many invoices; you resolve it with a link/junction entity such as InvoiceLineItem.',
        },
        {
          id: 'ra3-e2',
          title: 'Verify or validate?',
          prompt: 'Label each activity as verification or validation: (a) checking a user story is unambiguous and testable, (b) confirming the story traces to the goal "get paid faster".',
          sampleSolution: '(a) Verification — it checks the quality of the requirement itself (clear, testable, unambiguous). (b) Validation — it confirms the requirement delivers real business value and is the right thing to build.',
        },
      ],
      deliverables: ['An ERD for a customer-invoicing domain with keys and cardinality'],
      completionCriteria: ['Complete both exercises', 'Produce a verified and validated invoicing ERD'],
      portfolioArtifact: {
        type: 'Data Model',
        title: 'Invoicing ERD',
        description: 'An entity-relationship model for a customer invoicing domain.',
      },
    },

    // ---------------------------------------------------------------- RA4
    {
      id: 'ra4',
      code: 'RA4',
      title: 'Requirements Architecture & Assess Design Options',
      summary: 'See how requirements fit together, then define, evaluate and recommend a design option — including make-vs-buy.',
      moduleId: 'm7-radd',
      objectives: [
        'Explain requirements architecture and why requirements must fit together as a coherent whole',
        'Define candidate design options that satisfy a set of requirements',
        'Evaluate options against weighted criteria and recommend one',
        'Frame a make-versus-buy decision and justify the recommendation',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['ra3'],
      resources: [
        { type: 'reading', title: 'Requirements Architecture & Design — IIBA / BABOK', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'BABOK tasks: define requirements architecture and design options.' },
        { type: 'reading', title: 'Recommending a Solution — Bridging the Gap', url: 'https://www.bridging-the-gap.com/business-analysis-solution/', description: 'How BAs evaluate options and recommend a way forward.' },
      ],
      content: `## Requirements architecture

Individual requirements are not an island. **Requirements architecture** is the structure that shows how all your requirements — stories, process models, data models, rules — *fit together* and support the business objectives.

A good architecture is:

- **Complete** — no missing pieces for the scope.
- **Consistent** — no requirement contradicts another.
- **Traceable** — each requirement links up to a business goal and down to a design element.

It's the "map" that keeps a big change coherent as pieces are delivered.

## From requirements to design options

A **design option** is a concrete way to satisfy the requirements. There is almost always more than one. Typical options for a reporting need:

- Build a custom in-house solution.
- Buy/configure an off-the-shelf product.
- Extend an existing system (e.g. add reporting to the current ERP).

## Evaluate against criteria

Score each option against **weighted criteria** and recommend the best fit:

| Criterion | Weight | Build custom | Buy off-the-shelf | Extend ERP |
|-----------|--------|--------------|-------------------|------------|
| Fit to requirements | 30% | High | Medium | Medium |
| Cost (build + run) | 25% | Low | Medium | High |
| Time to deliver | 20% | Low | High | Medium |
| Maintainability | 15% | Low | High | High |
| Risk | 10% | High | Low | Medium |

You turn the ratings into a weighted score, then **recommend** the option — with the trade-offs stated, not hidden.

## Make vs Buy

A special, common case of evaluating options:

- **Make (build):** maximum fit and control, but higher cost, longer time, and ongoing maintenance burden.
- **Buy (off-the-shelf):** faster and cheaper to start, proven and maintained by a vendor, but you adapt to *its* way of working.

> **BA takeaway:** the recommendation is only as trustworthy as the criteria behind it. Make the weights and scores explicit so stakeholders debate the criteria, not your conclusion.`,
      realWorldExample: `**From your world (accounting/ERP, MISA):**

A client needs monthly management reporting on their accounting data and asks you: should we **build** a custom reporting tool or **buy/adopt** a ready-made reporting solution?

You define the options and score them against weighted criteria:

- **Build custom:** highest fit to their exact reports, but months of development, high cost, and the client owns all future maintenance.
- **Buy/adopt (e.g. connect Power BI to the MISA data):** fast to stand up, low cost, vendor-maintained, and it covers 90% of the reports out of the box — the client just adapts a few report layouts.

With fit, cost, time, maintainability and risk weighted, the **buy/adopt** option scores highest. You recommend it, and you state the one trade-off honestly: a couple of bespoke reports will need workarounds. That transparent, criteria-based recommendation is the design-definition half of business analysis.`,
      exercises: [
        {
          id: 'ra4-e1',
          title: 'Design an evaluation',
          prompt: 'A client must choose between building custom software and buying an off-the-shelf product. List four weighted criteria you would score each option against.',
          hint: 'Think fit, cost, time, maintenance, risk.',
          sampleSolution: 'Example criteria with weights: Fit to requirements (30%), Total cost to build and run (25%), Time to deliver (20%), Maintainability/vendor support (15%), and Risk (10%). Each option is rated per criterion, then combined into a weighted score.',
        },
        {
          id: 'ra4-e2',
          title: 'Make vs Buy trade-off',
          prompt: 'In two sentences, give the main advantage of buying off-the-shelf and the main advantage of building custom.',
          sampleSolution: 'Buying off-the-shelf is faster and cheaper to start and is maintained by the vendor, but you adapt to its way of working. Building custom gives the best fit and full control, at the cost of longer delivery, higher cost, and an ongoing maintenance burden you own.',
        },
      ],
      deliverables: ['A weighted option-evaluation matrix with a recommended design option'],
      completionCriteria: ['Complete both exercises', 'Recommend an option with explicit, weighted criteria'],
    },
  ],
}

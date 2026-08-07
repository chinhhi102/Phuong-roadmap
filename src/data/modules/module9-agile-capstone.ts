import type { Module } from '@/types'

// ============================================================================
// MODULE 9 — Agile, Tools & Capstone
// Agile Scrum for BAs, the essential tools (SQL, Excel, Jira/Confluence),
// and an end-to-end capstone with ECBA/CBAP and interview prep.
// Authored to the same contract as the Module 1 exemplar (no per-lesson quiz).
// ============================================================================

export const module9AgileCapstone: Module = {
  id: 'm9-agile-capstone',
  code: 'M9',
  title: 'Agile, Tools & Capstone',
  description:
    'Agile Scrum for BAs, the essential tools (SQL, Excel, Jira/Confluence), and an end-to-end capstone with ECBA/CBAP and interview prep.',
  icon: '🚀',
  accent: 'from-pink-500 to-rose-500',
  lessons: [
    // ---------------------------------------------------------------- AC1
    {
      id: 'ac1',
      code: 'AC1',
      title: 'Agile & Scrum for Business Analysts',
      summary: 'Learn the Scrum roles, artifacts and ceremonies, and exactly where a BA adds value across a sprint — using Jira and Confluence.',
      moduleId: 'm9-agile-capstone',
      objectives: [
        'Describe the three Scrum roles (Product Owner, Scrum Master, Development Team) and how each relates to business analysis',
        'Explain the Scrum artifacts (Product Backlog, Sprint Backlog, Increment) and the four ceremonies (Planning, Daily, Review, Retrospective)',
        'Contribute to backlog refinement by writing, slicing and prioritising user stories',
        'Use Jira to manage a backlog and Confluence to document requirements and decisions',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['se2'],
      resources: [
        { type: 'reading', title: 'The Scrum Guide', url: 'https://scrum.org/resources/scrum-guide', description: 'The definitive 13-page definition of Scrum — roles, events, artifacts.' },
        { type: 'reading', title: 'Atlassian Agile Coach — Scrum', url: 'https://www.atlassian.com/agile/scrum', description: 'Practical explanations of ceremonies, roles and the sprint loop.' },
        { type: 'reading', title: 'Jira & Confluence for teams', url: 'https://www.atlassian.com/software/jira/guides/getting-started/introduction', meta: '15 min', description: 'How backlogs, boards and docs fit together for a delivery team.' },
      ],
      content: `## Why Scrum matters to a BA

Most modern software is built in **Agile**, and the most common Agile framework is **Scrum**. Scrum delivers work in short, fixed cycles called **sprints** (usually 1–2 weeks), producing a usable **Increment** each time. As a Business Analyst you rarely have a "Business Analyst" job title inside Scrum — instead you power the parts of the process where *requirements* live.

## The three Scrum roles

| Role | Owns | BA overlap |
|------|------|------------|
| **Product Owner (PO)** | The Product Backlog, priorities, and the *"what/why"* | Huge — the PO is the business-facing requirements role; many BAs act as PO or PO-proxy |
| **Scrum Master** | The process, removing blockers, coaching the team | Some — facilitation and stakeholder communication skills transfer directly |
| **Development Team** | Building the Increment, the *"how"* | Support — the BA clarifies stories and answers questions during the sprint |

## The three artifacts

- **Product Backlog** — the single, ordered list of everything the product might need (epics, user stories, bugs). The BA continuously refines it.
- **Sprint Backlog** — the slice of the Product Backlog the team commits to this sprint, plus a plan to deliver it.
- **Increment** — the working, "Done" output at the end of the sprint.

## The four ceremonies and the BA's contribution

| Ceremony | Purpose | BA contribution |
|----------|---------|-----------------|
| **Sprint Planning** | Decide what to build this sprint and how | Present refined, ready stories with clear acceptance criteria |
| **Daily Scrum** | 15-min sync: progress and blockers | Answer requirement questions; unblock the team on business rules |
| **Sprint Review** | Demo the Increment to stakeholders | Gather feedback, validate against acceptance criteria, capture new needs |
| **Sprint Retrospective** | Improve how the team works | Contribute process feedback (e.g., "stories arrived under-refined") |

## The sprint loop

\`\`\`mermaid
flowchart LR
  PB[Product Backlog] --> REF[Backlog Refinement]
  REF --> SP[Sprint Planning]
  SP --> SB[Sprint Backlog]
  SB --> DEV[Sprint: build + Daily Scrum]
  DEV --> INC[Increment 'Done']
  INC --> REV[Sprint Review]
  REV --> RETRO[Retrospective]
  RETRO --> PB
\`\`\`

## Backlog refinement — where the BA lives

**Refinement** (a.k.a. grooming) is the ongoing work of keeping the top of the backlog *ready*: writing user stories in the \`As a <role>, I want <goal>, so that <benefit>\` form, adding **acceptance criteria**, splitting large stories into thin vertical slices, and helping the team estimate. A story is **Ready** when it is clear, valuable, estimable and small enough to finish in a sprint (the "INVEST" heuristic).

## The tools: Jira + Confluence

- **Jira** — where the backlog lives as issues (Epic → Story → Sub-task), organised on a board that moves cards \`To Do → In Progress → Done\`.
- **Confluence** — the team wiki where the BA writes the deeper docs: the BRD, process diagrams, meeting notes and decision logs — then links them from the Jira stories.

> **BA takeaway:** In Scrum you are the bridge between "what the business needs" and "what the team builds." You keep the backlog refined, the stories clear, and every ceremony grounded in real requirements.`,
      realWorldExample: `**From your world (accounting software):** You are the BA on a team building a new *Bank Reconciliation* module for an accounting product like MISA.

- **Before the sprint:** In a refinement session you split the epic "Reconcile bank statements" into stories such as \`As an accountant, I want to import a bank statement CSV, so that I can match it against ledger entries\`, each with acceptance criteria ("supports comma and semicolon delimiters", "rejects rows with invalid dates"). You log them in **Jira** and link the detailed rules to a **Confluence** page.
- **Sprint Planning:** You present the three top stories; the team pulls them into the Sprint Backlog.
- **Daily Scrum:** A developer asks, "What happens if a statement line matches two ledger entries?" You already documented the tie-break rule — you answer in seconds.
- **Sprint Review:** The team demos the import + auto-match. The finance stakeholder notices foreign-currency lines aren't handled; you capture a new backlog item on the spot.
- **Retro:** The team agrees stories should include sample data next time — a process improvement you action.

That single sprint shows the BA powering every event without ever "coding" — clarifying, documenting, and protecting the value being delivered.`,
      exercises: [
        {
          id: 'ac1-e1',
          title: 'Map the contribution',
          prompt: 'For each ceremony — Sprint Planning, Daily Scrum, Sprint Review, Retrospective — state in one line what a BA contributes.',
          hint: 'Think requirements in, feedback out, process improvement.',
          sampleSolution: 'Planning: bring refined, Ready stories with acceptance criteria. Daily Scrum: answer requirement/business-rule questions and unblock the team. Review: gather stakeholder feedback and validate the Increment against acceptance criteria. Retrospective: give process feedback (e.g., stories need sample data / better refinement).',
        },
        {
          id: 'ac1-e2',
          title: 'Refine an epic into stories',
          prompt: 'Split the epic "Export financial reports" into two user stories in the As a / I want / so that format, and give one acceptance criterion for each.',
          sampleSolution: 'Story 1: As an accountant, I want to export the trial balance to Excel, so that I can share it with the auditor. AC: the export includes account code, name, debit and credit columns and downloads as .xlsx. Story 2: As a finance manager, I want to export a PDF profit-and-loss statement for a chosen month, so that I can attach it to the board pack. AC: the PDF header shows the selected period and the totals reconcile to the on-screen report.',
        },
      ],
      assignment: undefined,
      deliverables: ['A ceremony-to-BA-contribution table for a real sprint', 'One epic refined into at least two Ready user stories with acceptance criteria'],
      completionCriteria: ['Complete both exercises', 'Correctly explain the three roles, three artifacts and four ceremonies of Scrum'],
    },

    // ---------------------------------------------------------------- AC2
    {
      id: 'ac2',
      code: 'AC2',
      title: 'SQL & Excel for Business Analysts',
      summary: 'Read data yourself: write core SQL (SELECT, JOIN, GROUP BY) and use Excel analytics (PivotTables, XLOOKUP) to answer business questions.',
      moduleId: 'm9-agile-capstone',
      objectives: [
        'Write core SQL queries using SELECT, WHERE, ORDER BY and INNER JOIN',
        'Aggregate data with GROUP BY and SUM, COUNT and AVG',
        'Explain why data-literacy in SQL makes a BA more effective and independent',
        'Use Excel PivotTables and VLOOKUP/XLOOKUP to summarise and combine datasets',
      ],
      durationMinutes: 60,
      difficulty: 'Intermediate',
      prerequisites: ['ac1'],
      resources: [
        { type: 'reading', title: 'SQLBolt — Interactive SQL lessons', url: 'https://sqlbolt.com/', description: 'Hands-on SELECT, WHERE, JOIN and GROUP BY exercises in the browser.' },
        { type: 'reading', title: 'Atlassian — Analytics for teams', url: 'https://www.atlassian.com/data/sql', meta: '12 min', description: 'A practical primer on SQL for non-engineers.' },
      ],
      content: `## Why a BA writes SQL

A BA who can query the database doesn't have to wait for a developer to answer "how many overdue invoices do we have?" You can validate requirements against real data, profile sources before a Power BI build, and check whether an assumption is even true. SQL is the language relational databases speak, and the handful of clauses below cover the majority of the questions a BA asks.

## The core SELECT clauses

| Clause | Job | Example |
|--------|-----|---------|
| \`SELECT\` | Choose the columns to return | \`SELECT CustomerName, Amount\` |
| \`FROM\` | The table to read from | \`FROM Invoices\` |
| \`WHERE\` | Filter the rows | \`WHERE Status = 'Overdue'\` |
| \`ORDER BY\` | Sort the result | \`ORDER BY Amount DESC\` |
| \`INNER JOIN\` | Combine rows from two tables on a key | \`JOIN Customers ON ...\` |
| \`GROUP BY\` | Collapse rows into groups to aggregate | \`GROUP BY CustomerName\` |

## Reading rows: SELECT, WHERE, ORDER BY

\`\`\`sql
SELECT InvoiceNo, CustomerName, Amount, Status
FROM Invoices
WHERE Status = 'Overdue'
ORDER BY Amount DESC;
\`\`\`

Read it as: *return these columns, from this table, keeping only overdue rows, sorted biggest amount first.*

## Combining tables: INNER JOIN

Real data is split across tables (a star schema, just like Power BI). An **INNER JOIN** stitches them together on a shared key and keeps only rows that match on both sides.

\`\`\`sql
SELECT c.CustomerName, i.InvoiceNo, i.Amount
FROM Invoices AS i
INNER JOIN Customers AS c
  ON i.CustomerID = c.CustomerID
WHERE i.Status = 'Overdue';
\`\`\`

## Summarising: GROUP BY with SUM / COUNT / AVG

Aggregate functions collapse many rows into one number *per group*. Every non-aggregated column in the \`SELECT\` must appear in \`GROUP BY\`.

\`\`\`sql
SELECT c.CustomerName,
       COUNT(*)      AS InvoiceCount,
       SUM(i.Amount) AS TotalBilled,
       AVG(i.Amount) AS AverageInvoice
FROM Invoices AS i
INNER JOIN Customers AS c
  ON i.CustomerID = c.CustomerID
GROUP BY c.CustomerName
ORDER BY TotalBilled DESC;
\`\`\`

- **\`COUNT(*)\`** — how many rows (invoices) per customer
- **\`SUM(i.Amount)\`** — total billed per customer
- **\`AVG(i.Amount)\`** — average invoice size per customer

## The Excel half: PivotTables and lookups

Not everything lives in a database — BAs still get spreadsheet extracts. Two Excel skills carry most of the load:

- **PivotTables** — drag-and-drop aggregation. Put \`CustomerName\` in Rows and \`Sum of Amount\` in Values and you've reproduced the GROUP BY above in ten seconds — great for quick exploration.
- **VLOOKUP / XLOOKUP** — join two sheets on a key. \`XLOOKUP\` is the modern, safer version: \`=XLOOKUP(A2, Customers!A:A, Customers!B:B)\` looks up the CustomerID in \`A2\` and returns the matching name, with no fragile column-index counting.

> **BA takeaway:** SQL answers "what does the data actually say?" and Excel lets you slice an extract fast. Together they make you self-sufficient — you validate requirements with evidence instead of assumptions.`,
      realWorldExample: `**From your world (accounting/ERP):** The finance manager asks, *"What is the total invoice amount per customer this month?"* Instead of raising a ticket and waiting a day, you write it yourself:

\`\`\`sql
SELECT c.CustomerName,
       SUM(i.Amount) AS TotalThisMonth
FROM Invoices AS i
INNER JOIN Customers AS c
  ON i.CustomerID = c.CustomerID
WHERE i.InvoiceDate >= '2026-08-01'
  AND i.InvoiceDate <  '2026-09-01'
  AND i.Status <> 'Draft'
GROUP BY c.CustomerName
ORDER BY TotalThisMonth DESC;
\`\`\`

You join \`Invoices\` to \`Customers\`, filter to August using a date range (the reliable way — no fragile \`MONTH()\` guesswork), exclude drafts, then sum per customer and sort. If someone prefers Excel, you'd export the invoice table and build a PivotTable with \`CustomerName\` in Rows and \`Sum of Amount\` in Values — same answer, same afternoon. Being able to produce that number on demand is what turns a BA from a message-passer into a trusted analyst.`,
      exercises: [
        {
          id: 'ac2-e1',
          title: 'Write the aggregation query',
          prompt: 'Write a SQL query that returns each product category and the number of orders and total revenue, from an Orders table (columns: OrderID, Category, Amount), highest revenue first.',
          hint: 'GROUP BY the category; use COUNT and SUM; ORDER BY the total.',
          sampleSolution: "SELECT Category, COUNT(*) AS OrderCount, SUM(Amount) AS TotalRevenue FROM Orders GROUP BY Category ORDER BY TotalRevenue DESC;",
        },
        {
          id: 'ac2-e2',
          title: 'SQL vs. Excel, and JOIN reasoning',
          prompt: 'You have an Invoices table (with CustomerID but no customer name) and a Customers table. (a) Which SQL clause combines them and on what column? (b) Which Excel function would do the same thing on two sheets?',
          sampleSolution: '(a) An INNER JOIN on the shared key CustomerID: FROM Invoices i INNER JOIN Customers c ON i.CustomerID = c.CustomerID. (b) XLOOKUP (or VLOOKUP) matching the CustomerID to pull in the CustomerName from the Customers sheet.',
        },
      ],
      assignment: undefined,
      deliverables: ['A working GROUP BY query answering a real business question', 'A short note stating when you would use SQL vs. an Excel PivotTable'],
      completionCriteria: ['Complete both exercises', 'Correctly write a query that joins two tables and aggregates with GROUP BY'],
    },

    // ---------------------------------------------------------------- AC3
    {
      id: 'ac3',
      code: 'AC3',
      title: 'The BRD & Requirements Package',
      summary: 'Assemble a complete Business Requirements Document — from Purpose and Scope to Functional Requirements, Assumptions, Constraints and Success Metrics.',
      moduleId: 'm9-agile-capstone',
      objectives: [
        'Identify every standard section of a Business Requirements Document and its purpose',
        'Distinguish business requirements from functional requirements, assumptions and constraints',
        'Write clear, testable functional requirements and measurable success metrics',
        'Assemble a complete requirements package that links the BRD to stories, models and stakeholders',
      ],
      durationMinutes: 60,
      difficulty: 'Advanced',
      prerequisites: ['ac2'],
      resources: [
        { type: 'reading', title: 'IIBA — BABOK & requirements guidance', url: 'https://www.iiba.org/career-resources/a-business-analysis-professionals-foundation-for-success/babok/', description: 'The industry knowledge base for requirements and their classification.' },
        { type: 'reading', title: 'Atlassian — Requirements & product docs', url: 'https://www.atlassian.com/agile/product-management/requirements', meta: '12 min', description: 'How requirements docs and user stories coexist on a delivery team.' },
        { type: 'reading', title: 'Confluence documentation templates', url: 'https://www.atlassian.com/software/confluence/templates', description: 'Reusable templates for requirements and decision docs.' },
      ],
      content: `## What a BRD is (and isn't)

A **Business Requirements Document (BRD)** is the agreed, written description of *what* a project must deliver and *why* — the shared source of truth that stakeholders sign off and the team builds against. It answers "what does the business need?" It is **not** a technical design (that's the *how*) and it is not a to-do list; it is the contract of intent.

## The standard BRD sections

| Section | Purpose |
|---------|---------|
| **Purpose / Business Objective** | Why the project exists and the problem it solves |
| **Scope — In** | What this project *will* deliver |
| **Scope — Out** | What it explicitly *will not* cover (prevents scope creep) |
| **Stakeholders** | Who is involved, their roles and their interests |
| **Business Requirements** | High-level needs and goals in business terms |
| **Functional Requirements** | Specific, testable things the solution must *do* |
| **Assumptions** | What we treat as true but haven't verified |
| **Constraints** | Fixed limits — budget, deadline, technology, regulation |
| **Success Metrics** | How we will measure whether it worked |

## Business vs. functional requirements

- **Business requirement (the goal):** "Reduce the monthly bank-reconciliation effort so the finance team closes the books faster."
- **Functional requirement (what the system must do):** "The system shall auto-match statement lines to ledger entries where amount and date are equal, and flag unmatched lines for manual review."

A good functional requirement is **testable** — you can write a pass/fail check for it. Use "shall" and avoid vague words like "fast", "user-friendly" or "etc."

## Assumptions vs. constraints

- **Assumption:** believed true, not yet confirmed ("the bank provides statements in CSV"). If wrong, it becomes a risk.
- **Constraint:** a hard, non-negotiable limit ("must ship before the fiscal year-end", "must run on the existing SQL Server").

## Success metrics make it measurable

Every objective needs a metric with a target: "cut reconciliation time from 3 days to half a day", "95% of statement lines auto-matched". Metrics turn opinions into acceptance.

## The requirements package

The BRD rarely travels alone. A complete **requirements package** bundles the artifacts that together tell the whole story:

- the **BRD** (this document),
- **process models** (As-Is / To-Be),
- the **user-story backlog** with acceptance criteria,
- **wireframes** or mock-ups,
- a **data model** or field dictionary,
- a **traceability** link from each requirement to the story that delivers it.

> **BA takeaway:** The BRD is where fuzzy requests become an agreed, testable, measurable definition of done. Master its sections and you can walk into any project and impose clarity.`,
      realWorldExample: `**From your world (accounting/ERP):** You're kicking off a **Bank Reconciliation & Reporting** project for a company running an ERP like MISA. Your BRD opens like this:

- **Purpose:** Month-end reconciliation currently takes the finance team ~3 days of manual matching in spreadsheets; the goal is to cut this to under half a day and remove copy-paste errors.
- **Scope — In:** import bank statement CSVs, auto-match to ledger entries, a review screen for exceptions, and a monthly reconciliation report.
- **Scope — Out:** multi-currency reconciliation and direct bank API feeds (future phase).
- **Stakeholders:** Chief Accountant (approver), finance clerks (daily users), IT (integration), external auditor (consumer of the report).
- **Business Requirement:** faster, error-free month-end close.
- **Functional Requirements:** "The system shall match a statement line to a ledger entry when date and amount are equal"; "The system shall list unmatched lines for manual reconciliation."
- **Assumptions:** the bank exports statements as CSV; ledger data is in the existing SQL database.
- **Constraints:** must run on the current SQL Server; must be live before the year-end close.
- **Success Metrics:** reconciliation time reduced to ≤ 0.5 day; ≥ 95% of lines auto-matched; zero posting errors in the first closed month.

That single document lets the Chief Accountant sign off on exactly what they'll get — and gives the dev team an unambiguous target. It becomes the backbone of your portfolio artifact.`,
      exercises: [
        {
          id: 'ac3-e1',
          title: 'Classify the statement',
          prompt: 'Label each as Business Requirement, Functional Requirement, Assumption, or Constraint: (a) "Close the books two days faster." (b) "The system shall email a reminder when an invoice is 7 days overdue." (c) "The bank will keep providing CSV statements." (d) "Must be delivered within the €20,000 budget."',
          hint: 'Goal vs. specific behaviour vs. believed-true vs. hard limit.',
          sampleSolution: '(a) Business Requirement (a high-level goal). (b) Functional Requirement (a specific, testable behaviour). (c) Assumption (believed true, not yet verified). (d) Constraint (a fixed, non-negotiable limit).',
        },
        {
          id: 'ac3-e2',
          title: 'Rewrite as testable requirements',
          prompt: 'Rewrite this vague request into one clear functional requirement and one measurable success metric: "The reconciliation feature should be fast and accurate."',
          sampleSolution: 'Functional requirement: "The system shall auto-match statement lines to ledger entries where date and amount are equal, completing a 1,000-line statement in under 10 seconds." Success metric: "≥ 95% of statement lines are auto-matched and month-end reconciliation time is reduced from 3 days to ≤ 0.5 day."',
        },
      ],
      assignment: {
        id: 'ac3-assignment',
        title: 'Draft a complete BRD',
        brief:
          'Choose an accounting/ERP problem you understand (e.g., bank reconciliation, invoice approval, or month-end reporting). Write a full Business Requirements Document covering every standard section.',
        deliverable:
          'A BRD document that includes: Purpose/Objective, Scope (in and out), Stakeholders, Business Requirements, at least 5 testable Functional Requirements, Assumptions, Constraints, and measurable Success Metrics.',
        rubric: [
          'All nine standard sections are present and correctly used',
          'Functional requirements are specific and testable (use "shall"; no vague words)',
          'Scope-out is explicit enough to prevent scope creep',
          'At least three success metrics have concrete targets',
          'Business vs. functional requirements are clearly distinguished',
        ],
      },
      deliverables: ['A complete Business Requirements Document', 'A one-page requirements-package index linking the BRD to stories, models and stakeholders'],
      completionCriteria: ['Complete both exercises', 'Submit a BRD containing all standard sections with testable functional requirements'],
      portfolioArtifact: {
        type: 'BRD',
        title: 'Reconciliation & Reporting — BRD',
        description: 'A complete Business Requirements Document.',
      },
    },

    // ---------------------------------------------------------------- AC4
    {
      id: 'ac4',
      code: 'AC4',
      title: 'Capstone Project + ECBA/CBAP & Interview Prep',
      summary: 'Assemble and present the end-to-end BA capstone, plan your IIBA certification path (ECBA → CCBA → CBAP), and prepare for BA interviews with the STAR method.',
      moduleId: 'm9-agile-capstone',
      objectives: [
        'Assemble an end-to-end capstone: vision → stakeholders → As-Is/To-Be → BRD → backlog → wireframes → Power BI dashboard',
        'Present the capstone as a coherent story that traces every artifact back to a business need',
        'Choose the right IIBA certification (ECBA, CCBA, CBAP) and build a realistic study plan',
        'Prepare for BA interviews using the STAR method, a scenario framework and a targeted resume',
      ],
      durationMinutes: 120,
      difficulty: 'Advanced',
      prerequisites: ['ac3'],
      resources: [
        { type: 'reading', title: 'IIBA — Certifications (ECBA, CCBA, CBAP)', url: 'https://www.iiba.org/business-analysis-certifications/', description: 'Eligibility, exam structure and the certification ladder.' },
        { type: 'reading', title: 'Atlassian — How to run a great demo/review', url: 'https://www.atlassian.com/agile/scrum/sprint-reviews', meta: '10 min', description: 'Presenting work to stakeholders — directly reusable for capstone demos.' },
        { type: 'reading', title: 'Scrum.org — Professional resources & assessments', url: 'https://www.scrum.org/professional-scrum-certifications', description: 'Complementary agile credentials to pair with an IIBA path.' },
      ],
      content: `## The capstone: prove the whole workflow

Your capstone is a single, coherent project that walks a real business problem through **every** stage of the BA workflow. It's the artifact that gets you hired, because it shows you can do the *whole* job, not just one technique. The pieces connect like this:

\`\`\`mermaid
flowchart TB
  V[1. Vision & Business Case] --> S[2. Stakeholder Analysis]
  S --> A[3. As-Is Process Model]
  A --> T[4. To-Be Process Model]
  T --> B[5. BRD + Requirements]
  B --> BL[6. User-Story Backlog in Jira]
  BL --> W[7. Wireframes]
  W --> D[8. Power BI Dashboard]
  D --> P[9. Presentation & Demo]
\`\`\`

Each arrow is **traceability**: the dashboard exists because a story asked for it, the story exists because the BRD required it, the requirement exists because a stakeholder had a need, and that need traces to the vision. If any artifact can't trace back, cut it.

## Capstone assembly checklist

- [ ] **Vision / business case** — the problem, the goal, the value
- [ ] **Stakeholder analysis** — a RACI or power/interest grid
- [ ] **As-Is model** — how the process works today (BPMN or flowchart)
- [ ] **To-Be model** — the improved future process
- [ ] **BRD** — full requirements package (from AC3)
- [ ] **Backlog** — epics and user stories with acceptance criteria in Jira
- [ ] **Wireframes** — low-fi screens for the key stories
- [ ] **Dashboard** — a Power BI report answering the stakeholder's questions
- [ ] **Presentation** — a 10-minute story that ties it all together

## Presenting it

Tell it as a **narrative**, not a folder of files: *"The finance team lost 3 days a month to manual reconciliation (problem) → here's who's affected (stakeholders) → here's today's painful process (As-Is) → here's the streamlined future (To-Be) → here's exactly what we'll build (BRD + backlog + wireframes) → and here's the dashboard that proves the result."* Practise a tight 10-minute version — most interviews and reviews give you no more.

## The IIBA certification ladder

The **International Institute of Business Analysis (IIBA)** offers a tiered path based on your experience:

| Certification | Level | Typical experience | Best for |
|---------------|-------|---------------------|----------|
| **ECBA** (Entry Certificate in BA) | Entry | No BA experience required | Career-changers proving foundational knowledge |
| **CCBA** (Certification of Capability in BA) | Mid | ~3,750 hours of BA work | Practising BAs with a few years in |
| **CBAP** (Certified Business Analysis Professional) | Senior | ~7,500 hours of BA work | Experienced BAs / leads |

All three are grounded in the **BABOK Guide** (the Business Analysis Body of Knowledge). Start where your experience fits — for most people transitioning in, that's **ECBA**.

## Interview prep: the STAR method

Behavioural questions ("Tell me about a time you handled a difficult stakeholder") are best answered with **STAR**:

- **S**ituation — set the context briefly
- **T**ask — what you were responsible for
- **A**ction — what *you* specifically did
- **R**esult — the measurable outcome

Prepare 5–6 STAR stories in advance (a conflict, a requirements challenge, a tight deadline, a data-driven decision) and you can adapt them to almost any question.

## Interview prep: the scenario framework and resume

- **Scenario questions** ("How would you gather requirements for X?"): answer with a repeatable framework — *understand the goal → identify stakeholders → elicit → analyse/model → document → validate → prioritise.*
- **Resume:** lead each bullet with an action verb and a metric ("Reduced month-end reconciliation from 3 days to 0.5 by defining and delivering an auto-match feature"). Link your capstone and portfolio artifacts.

> **BA takeaway:** The capstone proves you can do the work, the certification proves you know the discipline, and STAR proves you can talk about both. Together they turn a learner into a hireable Business Analyst.`,
      realWorldExample: `**From your world (accounting/ERP → your first BA role):** You build one capstone around the **Bank Reconciliation & Reporting** project you already scoped in AC3.

- **Vision:** cut month-end close time and eliminate reconciliation errors for a company on an ERP like MISA.
- **Stakeholders:** Chief Accountant, finance clerks, IT, auditor — mapped on a power/interest grid.
- **As-Is:** a BPMN diagram of today's manual, spreadsheet-driven matching. **To-Be:** the streamlined auto-match flow.
- **BRD:** your AC3 document. **Backlog:** the epic split into Jira stories with acceptance criteria. **Wireframes:** the import screen and the exceptions-review screen. **Dashboard:** a Power BI report showing reconciliation status, unmatched value and close-time trend.
- **Presentation:** a 10-minute narrated demo you publish to your portfolio.

**Your concrete ECBA plan (MISA/ERP background, ~8 weeks):** you already understand accounting processes, so lean into that domain advantage. Weeks 1–2: read the BABOK knowledge areas and map each to something you did in this project. Weeks 3–5: work through ECBA practice questions on requirements analysis and elicitation. Weeks 6–7: full timed mock exams. Week 8: review weak areas and book the exam. Your accounting/ERP domain knowledge becomes the vivid, real examples that make both the exam concepts and your interview answers stick.`,
      exercises: [
        {
          id: 'ac4-e1',
          title: 'Trace an artifact to its need',
          prompt: 'Pick one capstone artifact (e.g., a Power BI dashboard) and trace it backwards through the workflow to the original business need. Show at least three links in the chain.',
          hint: 'Dashboard ← story ← requirement ← stakeholder need ← vision.',
          sampleSolution: 'The "Reconciliation Status" dashboard exists because a user story asked for month-end visibility; that story exists because a BRD functional requirement demanded a monthly reconciliation report; that requirement exists because the Chief Accountant (stakeholder) needed to close the books faster and error-free; and that need traces to the project vision of cutting close time from 3 days to half a day. Every artifact is justified by the one before it.',
        },
        {
          id: 'ac4-e2',
          title: 'Choose the certification and answer with STAR',
          prompt: '(a) Someone changing careers with no formal BA hours asks which IIBA certification to start with — which one and why? (b) Give a one-line STAR skeleton for the question "Tell me about a time you handled a difficult stakeholder."',
          sampleSolution: '(a) ECBA — it is the entry-level certification with no BA-experience requirement, designed for career-changers proving foundational BABOK knowledge (CCBA and CBAP need thousands of logged BA hours). (b) Situation: a stakeholder kept changing scope mid-sprint. Task: I had to protect the sprint goal while keeping them heard. Action: I logged each request as a backlog item, walked them through prioritisation, and agreed a change process. Result: scope stabilised and we delivered on time, and the stakeholder felt their needs were tracked.',
        },
      ],
      assignment: {
        id: 'ac4-assignment',
        title: 'Assemble & publish the capstone',
        brief:
          'Bring together every artifact from this course into a single end-to-end capstone for one accounting/ERP problem, and prepare to present it.',
        deliverable:
          'A published capstone package containing: vision/business case, stakeholder analysis, As-Is and To-Be process models, the BRD, a Jira-style user-story backlog with acceptance criteria, wireframes, a Power BI dashboard spec, and a 10-minute presentation outline. Include a one-page traceability matrix.',
        rubric: [
          'All nine capstone pieces are present and clearly labelled',
          'Every artifact traces back to a stakeholder need (traceability matrix included)',
          'The BRD and backlog are consistent with each other',
          'The presentation tells a coherent problem-to-result story in ~10 minutes',
          'The package is published/linked as a portfolio-ready artifact',
        ],
      },
      deliverables: ['A published end-to-end capstone package', 'A personal ECBA/CBAP study plan and a set of 5 STAR interview stories'],
      completionCriteria: ['Complete both exercises', 'Submit a complete, traceable capstone package with a presentation outline'],
      portfolioArtifact: {
        type: 'Capstone',
        title: 'End-to-End BA Capstone',
        description: 'A complete requirements package demonstrating the full BA workflow.',
      },
    },
  ],
}

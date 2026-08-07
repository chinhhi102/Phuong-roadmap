import type { Module } from '@/types'

// ============================================================================
// MODULE 1 — Power BI & Data Analysis for Business Analysts
// Placed first because the learner is actively studying Power BI now.
// This module doubles as the authoring "exemplar" for the other modules.
// ============================================================================

export const module1Powerbi: Module = {
  id: 'm1-powerbi',
  code: 'M1',
  title: 'Power BI & Data Visualization',
  description:
    'Turn raw business data into decision-ready dashboards (Microsoft PL-300 skills): Get Data, shape it in Power Query, model it, write DAX, and tell a story with visuals — the modern BA superpower.',
  icon: '📊',
  accent: 'from-amber-500 to-orange-500',
  lessons: [
    // ---------------------------------------------------------------- PBI1
    {
      id: 'pbi-1',
      code: 'PBI1',
      title: 'Power BI Essentials: Get Data & Power Query',
      summary: 'Connect to data sources and clean/shape data with Power Query — the foundation of every report.',
      moduleId: 'm1-powerbi',
      objectives: [
        'Explain the Power BI workflow: Get Data → Transform → Model → Visualize → Share',
        'Connect to Excel, CSV, and database sources',
        'Perform core Power Query transforms: remove columns, change types, filter, split, group',
        'Understand why data shaping happens before modelling',
      ],
      durationMinutes: 60,
      difficulty: 'Beginner',
      prerequisites: [],
      resources: [
        { type: 'reading', title: 'Microsoft Learn — Get data in Power BI', url: 'https://learn.microsoft.com/power-bi/connect-data/', description: 'Official docs on connecting to sources.' },
        { type: 'video', title: 'Power BI in ~20 minutes (overview)', url: 'https://learn.microsoft.com/power-bi/fundamentals/', meta: '20 min', description: 'End-to-end tour of Power BI Desktop.' },
        { type: 'reading', title: 'Power Query documentation', url: 'https://learn.microsoft.com/power-query/', description: 'Reference for the transform engine.' },
      ],
      content: `## The Power BI workflow

Power BI turns messy source data into interactive dashboards. Almost everything you'll ever build follows the same five steps:

\`\`\`mermaid
flowchart LR
  A[Get Data] --> B[Transform<br/>Power Query]
  B --> C[Model<br/>relationships + DAX]
  C --> D[Visualize<br/>report canvas]
  D --> E[Share<br/>Power BI Service]
\`\`\`

As a Business Analyst, you live mostly in **Get Data → Transform → Model**, because that's where *requirements about data* become real.

## Get Data

Power BI connects to 100+ sources. The three you'll use constantly:

| Source | When you use it |
|--------|-----------------|
| **Excel / CSV** | Ad-hoc exports (e.g., an export from an accounting system). |
| **SQL database** | The "single source of truth" for an organization. |
| **Web / API** | Public data, or SaaS tools with an API. |

## Power Query — shape before you model

**Power Query** is the transform engine. The golden rule: **clean the data here, once, and every refresh re-applies your steps automatically.** You never hand-edit rows.

Core transforms you'll use daily:

- **Remove columns** you don't need (smaller, faster model)
- **Change type** (text → date, text → decimal) — wrong types break everything downstream
- **Filter rows** (e.g., remove blanks, keep this fiscal year)
- **Split / Merge columns** (e.g., split "2024-Q1" into Year and Quarter)
- **Group By** (summarize, e.g., total amount per customer)
- **Replace values** and **Remove duplicates**

Each action becomes a step in **Applied Steps** — a repeatable, auditable recipe. This is exactly the mindset a BA needs: *transparent, reproducible* data handling.

> **Key idea:** Power Query is "ETL for analysts" — Extract, Transform, Load — without writing code.`,
      realWorldExample: `**From your world (accounting/ERP):**

Your client exports a *Sales Invoices* report from their accounting system as a CSV. It has 30 columns, dates stored as text like \`03/08/2026\`, and a few totally blank rows at the bottom.

A BA using Power Query would:
1. **Remove** the 22 columns nobody asked about, keeping InvoiceNo, CustomerName, Date, Amount, Status.
2. **Change type** of \`Date\` from Text → Date and \`Amount\` → Decimal.
3. **Filter** out the blank rows and any \`Status = "Draft"\`.
4. **Group By** CustomerName to sanity-check totals.

Now every month the client drops in a fresh export, clicks **Refresh**, and the whole report rebuilds — no manual re-typing. That single automation is often the "why" behind a real reporting requirement.`,
      exercises: [
        {
          id: 'pbi-1-e1',
          title: 'Plan your Applied Steps',
          prompt: 'You receive a CSV of expense claims with columns you don\'t need, text dates, and blank rows. List the ordered Power Query steps you would apply.',
          hint: 'Think: remove → change type → filter → (optional) group.',
          sampleSolution: '1) Remove unused columns. 2) Change Date to Date type and Amount to Decimal. 3) Filter out blank/null rows. 4) Remove duplicates on ClaimID. 5) (optional) Group By Employee to validate totals.',
        },
        {
          id: 'pbi-1-e2',
          title: 'Source selection',
          prompt: 'A stakeholder wants a dashboard that is always up to date with last night\'s transactions. Should you connect to their monthly Excel export or the SQL database? Justify in 2 sentences.',
          sampleSolution: 'The SQL database — it holds current data and can refresh on a schedule, so the dashboard reflects last night\'s transactions. A monthly Excel export would always be stale and require manual replacement.',
        },
      ],
      assignment: undefined,
      quiz: {
        id: 'pbi-1-quiz',
        passingScore: 70,
        questions: [
          {
            id: 'pbi-1-q1',
            type: 'mcq',
            prompt: 'What is the correct high-level Power BI workflow order?',
            points: 1,
            options: [
              'Visualize → Model → Transform → Get Data',
              'Get Data → Transform → Model → Visualize → Share',
              'Model → Get Data → Share → Visualize',
              'Transform → Share → Get Data → Model',
            ],
            correctIndex: 1,
            explanation: 'You always acquire data first, shape it, model it, then visualize and share.',
          },
          {
            id: 'pbi-1-q2',
            type: 'truefalse',
            prompt: 'In Power Query, you should fix data problems by manually editing the wrong cells.',
            points: 1,
            correctBool: false,
            explanation: 'You apply transform *steps* that re-run on every refresh. Manual cell edits are not repeatable.',
          },
          {
            id: 'pbi-1-q3',
            type: 'mcq',
            prompt: 'A date column imported as text is breaking your time-based visuals. What is the fix?',
            points: 1,
            options: [
              'Delete the column',
              'Change its data type to Date',
              'Sort the column',
              'Rename the column',
            ],
            correctIndex: 1,
            explanation: 'Correct data types are essential; text dates can\'t be used on a proper time axis.',
          },
          {
            id: 'pbi-1-q4',
            type: 'short',
            prompt: 'In one sentence, why does a BA prefer Power Query steps over editing the spreadsheet by hand?',
            points: 1,
            keywords: ['repeat', 'refresh', 'automat', 'reproduc', 'auditable'],
            sampleAnswer: 'Because the steps are repeatable and auditable — they re-apply automatically on every refresh, so no manual rework.',
            explanation: 'Reproducibility and auditability are the core benefits.',
          },
        ],
      },
      deliverables: ['A list of Applied Steps for a real CSV export', 'A one-paragraph rationale for source choice'],
      completionCriteria: ['Score ≥ 70% on the quiz', 'Complete both exercises'],
    },

    // ---------------------------------------------------------------- PBI2
    {
      id: 'pbi-2',
      code: 'PBI2',
      title: 'Data Modeling & Relationships (Star Schema)',
      summary: 'Model facts and dimensions, build relationships, and understand why the star schema is the analyst\'s default.',
      moduleId: 'm1-powerbi',
      objectives: [
        'Distinguish fact tables from dimension tables',
        'Design a star schema and explain why it beats one flat table',
        'Create and configure relationships (cardinality, filter direction)',
        'Recognize and avoid many-to-many and ambiguous relationships',
      ],
      durationMinutes: 55,
      difficulty: 'Intermediate',
      prerequisites: ['pbi-1'],
      resources: [
        { type: 'reading', title: 'Star schema guidance for Power BI', url: 'https://learn.microsoft.com/power-bi/guidance/star-schema', description: 'The definitive modelling guide.' },
        { type: 'video', title: 'Understand relationships in Power BI', url: 'https://learn.microsoft.com/power-bi/transform-model/desktop-relationships-understand', meta: '15 min' },
      ],
      content: `## Facts vs. Dimensions

A good data model splits data into two kinds of tables:

- **Fact tables** — the *events / measurements*: invoices, sales, payments. Many rows, numeric columns you aggregate (Amount, Quantity).
- **Dimension tables** — the *context / who-what-when-where*: Customer, Product, Date, Employee. Fewer rows, descriptive columns you slice by.

## The Star Schema

Connect one central fact table to surrounding dimension tables → it looks like a star:

\`\`\`mermaid
flowchart TB
  D1[Dim Customer] --> F[(Fact Sales)]
  D2[Dim Date] --> F
  D3[Dim Product] --> F
  D4[Dim Employee] --> F
\`\`\`

**Why not one big flat table?** A star schema is:

| Benefit | Why it matters |
|---------|----------------|
| Faster | Smaller tables, efficient filtering |
| Reusable | One Date table filters *every* fact |
| Cleaner DAX | Measures are simpler and less error-prone |
| Understandable | Stakeholders grasp "Sales by Customer by Month" instantly |

## Relationships

A relationship links a **dimension key** to a **fact key** (e.g., \`Customer[CustomerID]\` → \`Sales[CustomerID]\`).

- **Cardinality:** usually **one-to-many** (one customer → many sales).
- **Filter direction:** normally **single** (dimension filters fact). Avoid "both" unless you truly need it — it creates ambiguity.
- **Many-to-many:** a red flag; usually means you need a proper dimension (a "bridge" table).

> **BA takeaway:** When you gather reporting requirements, you're really discovering the *facts* (what to measure) and the *dimensions* (how to slice it). Modelling is requirements made concrete.`,
      realWorldExample: `**From your world:** The client wants "total invoice amount by customer, by month, by salesperson."

- **Fact:** \`Invoices\` (InvoiceID, Date, CustomerID, SalespersonID, Amount).
- **Dimensions:** \`Customer\`, \`Date\`, \`Salesperson\`.

Build a star: each dimension has a one-to-many relationship to \`Invoices\`. Now a single visual can show Amount sliced by any combination — and adding "by product" later is just one more dimension, not a rebuild. That flexibility is exactly what makes stakeholders say "yes, that's what I meant."`,
      exercises: [
        {
          id: 'pbi-2-e1',
          title: 'Classify the tables',
          prompt: 'Given tables: Payments, Customer, Date, ProductCategory, Employee — label each as Fact or Dimension.',
          sampleSolution: 'Fact: Payments. Dimensions: Customer, Date, ProductCategory, Employee.',
        },
        {
          id: 'pbi-2-e2',
          title: 'Spot the modelling smell',
          prompt: 'A colleague built one giant table with 60 columns mixing customers, products and sales. Give two concrete problems this causes.',
          hint: 'Think refresh size, repeated data, and DAX complexity.',
          sampleSolution: 'Repeated/duplicated dimension data bloats the model and risks inconsistency; time-intelligence and reuse are hard because there is no dedicated Date table; measures become complex and error-prone.',
        },
      ],
      quiz: {
        id: 'pbi-2-quiz',
        passingScore: 70,
        questions: [
          {
            id: 'pbi-2-q1',
            type: 'mcq',
            prompt: 'Which table is a FACT table?',
            points: 1,
            options: ['Customer', 'Date', 'SalesTransactions', 'ProductCategory'],
            correctIndex: 2,
            explanation: 'Facts store the measurable events (transactions); the others provide context (dimensions).',
          },
          {
            id: 'pbi-2-q2',
            type: 'mcq',
            prompt: 'The typical cardinality between a dimension and a fact table is:',
            points: 1,
            options: ['many-to-many', 'one-to-one', 'one-to-many', 'none'],
            correctIndex: 2,
            explanation: 'One dimension row (one customer) relates to many fact rows (many sales).',
          },
          {
            id: 'pbi-2-q3',
            type: 'truefalse',
            prompt: 'A star schema generally performs better and is easier to understand than one giant flat table.',
            points: 1,
            correctBool: true,
            explanation: 'Star schemas are the recommended default for Power BI models.',
          },
          {
            id: 'pbi-2-q4',
            type: 'short',
            prompt: 'Name the two categories every table in a star schema falls into.',
            points: 1,
            keywords: ['fact', 'dimension'],
            sampleAnswer: 'Fact tables and dimension tables.',
            explanation: 'Facts = events/measures; dimensions = descriptive context.',
          },
        ],
      },
      deliverables: ['A star-schema sketch for an invoicing scenario'],
      completionCriteria: ['Score ≥ 70% on the quiz', 'Complete both exercises'],
    },

    // ---------------------------------------------------------------- PBI3
    {
      id: 'pbi-3',
      code: 'PBI3',
      title: 'DAX Fundamentals: Measures & Calculated Columns',
      summary: 'Write your first measures with SUM, CALCULATE and time intelligence, and know when to use a measure vs. a calculated column.',
      moduleId: 'm1-powerbi',
      objectives: [
        'Explain the difference between a measure and a calculated column',
        'Write basic measures using SUM, AVERAGE, COUNTROWS',
        'Use CALCULATE to change filter context',
        'Apply a simple time-intelligence pattern (e.g., YTD)',
      ],
      durationMinutes: 65,
      difficulty: 'Intermediate',
      prerequisites: ['pbi-2'],
      resources: [
        { type: 'reading', title: 'DAX basics in Power BI Desktop', url: 'https://learn.microsoft.com/power-bi/transform-model/desktop-quickstart-learn-dax-basics', description: 'Great first DAX walkthrough.' },
        { type: 'reading', title: 'CALCULATE function (DAX)', url: 'https://learn.microsoft.com/dax/calculate-function-dax', description: 'The most important DAX function.' },
        { type: 'video', title: 'Measures vs calculated columns', url: 'https://learn.microsoft.com/power-bi/transform-model/desktop-measures', meta: '10 min' },
      ],
      content: `## Measure vs. calculated column

| | Calculated Column | Measure |
|---|---|---|
| Computed | Row by row, at refresh | On the fly, per visual |
| Stored | In the model (uses memory) | Not stored |
| Use for | Row-level attributes (e.g., "Margin %" per row, categorize) | Aggregations (Total Sales, % of total) |

**Rule of thumb:** if you're aggregating (sum, average, ratio across rows), use a **measure**. Measures respond to the filters on the visual — that's their magic.

## Your first measures

\`\`\`
Total Sales = SUM('Sales'[Amount])

Invoice Count = COUNTROWS('Sales')

Average Invoice = AVERAGE('Sales'[Amount])
\`\`\`

## CALCULATE — change the filter context

\`CALCULATE\` evaluates an expression under *modified* filters:

\`\`\`
Sales (Paid) = CALCULATE( [Total Sales], 'Sales'[Status] = "Paid" )
\`\`\`

This is the single most powerful DAX function — most advanced measures are CALCULATE plus a filter idea.

## Time intelligence (needs a Date dimension)

\`\`\`
Sales YTD = TOTALYTD( [Total Sales], 'Date'[Date] )
\`\`\`

> **BA takeaway:** Measures are where *KPIs* are born. "Month-end close time," "% invoices paid on time," "revenue YTD" — each stakeholder KPI becomes a measure. Defining measures precisely *is* requirements work.`,
      realWorldExample: `**From your world:** The finance manager wants three KPIs on a dashboard: Total Revenue, % Paid, and Revenue YTD.

- \`Total Revenue = SUM('Invoices'[Amount])\`
- \`% Paid = DIVIDE( CALCULATE([Total Revenue], 'Invoices'[Status]="Paid"), [Total Revenue] )\`
- \`Revenue YTD = TOTALYTD([Total Revenue], 'Date'[Date])\`

When the manager clicks "March" on a slicer, all three recalculate automatically because measures obey the visual's filter context. You just translated three business questions into three measures — that's the analytical half of business analysis.`,
      exercises: [
        {
          id: 'pbi-3-e1',
          title: 'Measure or column?',
          prompt: 'For each, choose measure or calculated column: (a) Total Revenue, (b) a per-row flag "IsHighValue" when Amount > 1000, (c) Average Days to Pay.',
          sampleSolution: '(a) Measure (aggregation). (b) Calculated column (row-level attribute). (c) Measure (aggregation).',
        },
        {
          id: 'pbi-3-e2',
          title: 'Write the measure',
          prompt: 'Write a DAX measure for "% of invoices that are Overdue" (Status column has value "Overdue").',
          hint: 'Use DIVIDE and CALCULATE.',
          sampleSolution: '% Overdue = DIVIDE( CALCULATE(COUNTROWS(\'Invoices\'), \'Invoices\'[Status]="Overdue"), COUNTROWS(\'Invoices\') )',
        },
      ],
      quiz: {
        id: 'pbi-3-quiz',
        passingScore: 70,
        questions: [
          {
            id: 'pbi-3-q1',
            type: 'mcq',
            prompt: 'Which is best implemented as a MEASURE?',
            points: 1,
            options: ['A row-level "TaxCategory" label', 'Total Sales across the current filter', 'A concatenated FullName column', 'A per-row age bucket'],
            correctIndex: 1,
            explanation: 'Aggregations that respond to filters are measures; the others are row-level (columns).',
          },
          {
            id: 'pbi-3-q2',
            type: 'mcq',
            prompt: 'Which DAX function changes the filter context of a calculation?',
            points: 1,
            options: ['SUM', 'CALCULATE', 'FORMAT', 'RELATED'],
            correctIndex: 1,
            explanation: 'CALCULATE evaluates an expression under modified filters — the cornerstone of DAX.',
          },
          {
            id: 'pbi-3-q3',
            type: 'truefalse',
            prompt: 'Measures are stored row-by-row in the model like calculated columns.',
            points: 1,
            correctBool: false,
            explanation: 'Measures are computed on the fly per visual; they aren\'t stored per row.',
          },
        ],
      },
      deliverables: ['Three working KPI measures written in DAX'],
      completionCriteria: ['Score ≥ 70% on the quiz', 'Complete both exercises'],
    },

    // ---------------------------------------------------------------- PBI4
    {
      id: 'pbi-4',
      code: 'PBI4',
      title: 'Designing BA Dashboards & Reports',
      summary: 'Choose the right visuals, design for the decision, and tell a clear data story stakeholders trust.',
      moduleId: 'm1-powerbi',
      objectives: [
        'Match a visual to the question (comparison, trend, part-to-whole, distribution)',
        'Design a report layout that answers the top stakeholder questions first',
        'Apply KPI cards, slicers, and drill-through effectively',
        'Avoid common dashboard anti-patterns (chart junk, 3D pies, no context)',
      ],
      durationMinutes: 70,
      difficulty: 'Intermediate',
      prerequisites: ['pbi-3'],
      resources: [
        { type: 'reading', title: 'Report design tips (Power BI)', url: 'https://learn.microsoft.com/power-bi/create-reports/', description: 'Layout, visuals and interactivity.' },
        { type: 'reading', title: 'Visualization types in Power BI', url: 'https://learn.microsoft.com/power-bi/visuals/power-bi-visualization-types-for-reports-and-q-and-a', description: 'When to use which visual.' },
        { type: 'video', title: 'Storytelling with data (concepts)', url: 'https://learn.microsoft.com/power-bi/create-reports/desktop-storytelling', meta: '18 min' },
      ],
      content: `## Pick the visual for the question

| Stakeholder question | Best visual |
|----------------------|-------------|
| "How do categories compare?" | Bar / column chart |
| "How is it trending over time?" | Line chart |
| "What's the part-to-whole?" | Stacked bar / donut (few slices) |
| "What's the single number vs. target?" | KPI card / gauge |
| "Where are the outliers?" | Scatter / table with conditional formatting |

## Design for the decision

A dashboard is not a data dump — it answers **the top 3 questions a decision-maker has**, in order, top-left to bottom-right (we read Z-shaped):

1. **KPI cards** across the top: the headline numbers.
2. **Trend** and **breakdown** charts in the middle.
3. **Detail table** and **slicers** for exploration.

## Interactivity that earns trust

- **Slicers** (date, region) let users self-serve.
- **Drill-through** to a detail page ("show me the invoices behind this bar").
- **Tooltips** add context without clutter.

## Anti-patterns to avoid

- 3D charts and exploding pies (distort perception)
- Too many colors / "chart junk"
- Numbers with no comparison ("$2M" — good or bad? vs. target?)
- Everything on one page at equal weight (no hierarchy)

> **BA takeaway:** A great dashboard is a *requirements artifact*. Every visual should trace back to a stakeholder question. If you can't name the question a chart answers, delete the chart.`,
      realWorldExample: `**From your world:** The business owner asks for "a dashboard to see how the business is doing each month."

You clarify the real questions: *Are we hitting revenue targets? Who owes us money? Which customers are growing?* Then you design:
- **Top row KPI cards:** Revenue (vs target), % Paid, Overdue Amount.
- **Middle:** a line chart of Revenue by Month, a bar chart of Top 10 Customers.
- **Bottom:** a table of overdue invoices with drill-through to invoice detail; a Date slicer.

You just converted a vague request into a focused, decision-oriented report — the essence of BA work applied to Power BI.`,
      exercises: [
        {
          id: 'pbi-4-e1',
          title: 'Match visual to question',
          prompt: 'Pick the best visual for each: (a) revenue trend over 12 months, (b) revenue share by product category, (c) this month\'s revenue vs. target.',
          sampleSolution: '(a) Line chart. (b) Stacked bar / donut (few slices). (c) KPI card or gauge with a target.',
        },
        {
          id: 'pbi-4-e2',
          title: 'Kill the chart junk',
          prompt: 'A dashboard has a 3D exploding pie with 12 slices and a lone "$2M" card. Give two specific fixes.',
          hint: 'Think perception accuracy and context.',
          sampleSolution: 'Replace the 3D pie with a sorted bar chart (or group small slices into "Other"); add a comparison/target to the $2M card so the number is interpretable.',
        },
      ],
      assignment: {
        id: 'pbi-4-assignment',
        title: 'Design a Finance Dashboard (spec + sketch)',
        brief:
          'A small business owner wants a monthly finance dashboard from their invoicing data. Produce a one-page dashboard specification and a low-fi sketch/wireframe (describe layout in text or attach an image link).',
        deliverable:
          'A dashboard spec that lists: (1) the top 3 stakeholder questions, (2) the KPIs/measures needed, (3) the visuals chosen and why, (4) the layout (top/middle/bottom), (5) any slicers/drill-through.',
        rubric: [
          'Names at least 3 concrete stakeholder questions',
          'Maps each visual to a specific question',
          'Includes at least 3 KPI measures (with DAX idea)',
          'Layout follows a clear visual hierarchy',
          'Avoids the listed anti-patterns',
        ],
      },
      quiz: {
        id: 'pbi-4-quiz',
        passingScore: 70,
        questions: [
          {
            id: 'pbi-4-q1',
            type: 'mcq',
            prompt: 'You want to show a trend over 12 months. Best visual?',
            points: 1,
            options: ['Pie chart', 'Line chart', '3D column', 'Card'],
            correctIndex: 1,
            explanation: 'Line charts are the standard for trends over time.',
          },
          {
            id: 'pbi-4-q2',
            type: 'truefalse',
            prompt: 'A single big number like "$2M" with no target or comparison is good dashboard design.',
            points: 1,
            correctBool: false,
            explanation: 'Numbers need context (vs. target, vs. last period) to support a decision.',
          },
          {
            id: 'pbi-4-q3',
            type: 'short',
            prompt: 'Complete the BA principle: every chart on a dashboard should trace back to a stakeholder ____.',
            points: 1,
            keywords: ['question', 'need', 'decision', 'requirement'],
            sampleAnswer: 'question (or decision/need).',
            explanation: 'If a chart answers no question, it shouldn\'t be there.',
          },
        ],
      },
      deliverables: ['A one-page finance dashboard specification', 'A low-fidelity dashboard sketch'],
      completionCriteria: ['Score ≥ 70% on the quiz', 'Submit the dashboard assignment'],
      portfolioArtifact: {
        type: 'Dashboard',
        title: 'Monthly Finance Dashboard (spec + design)',
        description: 'A stakeholder-driven Power BI dashboard specification demonstrating data storytelling and KPI design.',
      },
    },
  ],
}

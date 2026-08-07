import type { Module } from '@/types'

// ============================================================================
// MODULE 8 — Solution Evaluation
// BABOK v3 Knowledge Area 6: measure and analyze solution performance, assess
// enterprise and solution limitations, and recommend actions to increase the
// value a delivered solution actually creates.
// ============================================================================

export const module8Solution: Module = {
  id: 'm8-solution',
  code: 'M8',
  title: 'Solution Evaluation',
  description:
    'BABOK Knowledge Area 6: measure and analyze solution performance, assess enterprise and solution limitations, and recommend actions to increase delivered value.',
  icon: '✅',
  accent: 'from-fuchsia-500 to-pink-500',
  lessons: [
    // ---------------------------------------------------------------- SE1
    {
      id: 'se1',
      code: 'SE1',
      title: 'Measure & Analyze Solution Performance',
      summary:
        'Define performance measures and KPIs (leading vs. lagging), collect the data, and analyze actual results against the value that was expected.',
      moduleId: 'm8-solution',
      objectives: [
        'Define solution performance measures and KPIs that trace back to business objectives',
        'Distinguish leading from lagging indicators and choose both',
        'Plan how to collect performance data: source, baseline, frequency, and owner',
        'Analyze actual results against expected value and interpret the variance',
      ],
      durationMinutes: 50,
      difficulty: 'Intermediate',
      prerequisites: ['ra4'],
      resources: [
        { type: 'reading', title: 'IIBA — Solution Evaluation (BABOK Knowledge Area)', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'Overview of the Solution Evaluation knowledge area and its tasks.' },
        { type: 'reading', title: 'Leading vs. lagging indicators', url: 'https://www.investopedia.com/terms/l/leadingindicator.asp', description: 'Predictive versus confirmatory measures explained.' },
        { type: 'video', title: 'KPI visuals and targets in Power BI', url: 'https://learn.microsoft.com/power-bi/create-reports/service-kpi-visuals', meta: '10 min', description: 'How a KPI is shown against a target on a dashboard.' },
      ],
      content: `## Why measure a solution at all?

A solution that shipped is not the same as a solution that *works*. **Solution Evaluation** (BABOK Knowledge Area 6) is about proving — with evidence — whether the delivered solution actually creates the value the business signed up for, and what to do if it does not.

The first two tasks are:

1. **Measure Solution Performance** — decide *what* "good" looks like and capture the numbers.
2. **Analyze Performance Measures** — compare those numbers against the *expected* value and interpret the gap.

## Defining performance measures & KPIs

A **metric** is anything you can count. A **KPI (Key Performance Indicator)** is the small set of metrics that actually tell you whether the solution meets its objectives. Good KPIs are **SMART** — Specific, Measurable, Achievable, Relevant, Time-bound — and every KPI traces back to a business objective.

### Leading vs. lagging indicators

| | Leading indicator | Lagging indicator |
|---|---|---|
| Looks at | What is *about to* happen | What *already* happened |
| Timing | Predictive, early | Confirmatory, after the fact |
| Example | % of invoices auto-matched today | Month-end close time this quarter |
| Use it to | Steer while you still can | Confirm the outcome / report results |

You want **both**: lagging KPIs tell you if you hit the target; leading KPIs give you time to react before you miss it.

## KPI examples for an accounting solution

| Business objective | KPI | Type | Target |
|---|---|---|---|
| Faster month-end close | Days to close the books | Lagging | ≤ 3 days |
| Fewer manual matches | % transactions auto-reconciled | Leading | ≥ 90% |
| Data quality | % journal entries reposted / corrected | Lagging | ≤ 2% |
| Adoption | % of users logging in weekly | Leading | ≥ 95% |
| Timeliness | Avg. days from invoice receipt to posting | Leading | ≤ 1 day |

## Collecting performance data

Decide, per KPI: the **source** (ERP tables, system logs, a manual timesheet), the **frequency** (real-time, daily, monthly), the **owner**, and the **baseline** (the pre-solution number you will compare against). Without a baseline you can prove nothing.

- **Quantitative** data: system-generated counts, durations, error rates — cheap and objective.
- **Qualitative** data: user surveys and interviews — captures satisfaction the logs cannot.

> **No baseline, no evaluation.** Capture the "before" number *before* go-live, or you lose the comparison forever.

## Analyzing results against expected value

Measuring is not analyzing. Analysis compares **actual** vs. **expected (target)** and explains the variance:

- **Meets / exceeds target** → confirm the value; consider raising the bar.
- **Below target** → is it the *solution*, the *process around it*, or the *measure* that is wrong?
- **Trend matters** — one bad month is noise; three is a signal.

> **BA takeaway:** A KPI without a target is trivia. Evaluation lives in the *gap* between actual and expected — that gap is what you report and act on.`,
      realWorldExample: `**From your world (accounting/ERP go-live):**

Before the new reconciliation module went live, the finance team's **bank reconciliation cycle** took an average of **6 days** each month (the baseline, captured from three prior closes). The business case promised to cut it to **≤ 2 days**.

You define the KPIs:
- **Lagging:** \`Reconciliation cycle time\` = days from period-end to "reconciled" sign-off (target ≤ 2 days).
- **Leading:** \`% transactions auto-matched\` on day 1 (target ≥ 90%) — if this dips, you *know* the cycle will slip before the month even ends.

You pull both numbers from the ERP's audit log at each close. After three months: cycle time settled at **2.5 days** and auto-match at **88%** — better, but *just short* of both targets. That variance is the story: the solution delivered roughly 60% of the promised time saving, and the leading indicator points squarely at the match rules as the thing to tune.

To make this repeatable, you feed both KPIs into a **Power BI dashboard** (Module 1): a KPI card for cycle time vs. the 2-day target, and a line chart of auto-match % by month. Now the finance manager watches the trend live instead of waiting for a quarterly report — measurement becomes a habit, not a one-off event.`,
      exercises: [
        {
          id: 'se1-e1',
          title: 'Leading or lagging?',
          prompt: 'Label each as a leading or lagging indicator for an accounting solution: (a) days to close the books, (b) % of invoices auto-matched on day 1, (c) number of restated journal entries last quarter, (d) weekly active users.',
          hint: 'Leading = predicts a future outcome; lagging = confirms a past one.',
          sampleSolution: '(a) Lagging — it reports an outcome after the close is done. (b) Leading — it predicts whether the close will finish on time. (c) Lagging — a past-quarter result. (d) Leading — an early adoption signal that predicts future value.',
        },
        {
          id: 'se1-e2',
          title: 'Turn an objective into a KPI',
          prompt: 'The business wants "faster invoice processing." Turn that into one usable KPI: give its precise definition, data source, baseline, and target.',
          hint: 'Make it SMART and name exactly where the number comes from.',
          sampleSolution: 'KPI: Average days from invoice receipt to posting. Definition: mean of (posting date minus receipt date) across all supplier invoices in the month. Source: ERP invoice register / audit log. Baseline: 4.0 days (from the last three months pre-go-live). Target: ≤ 1.0 day within three months of go-live. Owner: AP team lead; frequency: monthly.',
        },
      ],
      assignment: undefined,
      deliverables: [
        'A performance-measurement plan mapping objectives to KPIs (leading and lagging) with baselines and targets',
        'A short actual-vs-expected analysis for at least one KPI, with an interpretation of the variance',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Produce a measurement plan with at least one leading and one lagging KPI, each with a baseline and a target',
      ],
      portfolioArtifact: {
        type: 'Requirement Doc',
        title: 'Solution Performance Measurement Plan',
        description: 'A plan mapping business objectives to leading and lagging KPIs with data sources, baselines, and targets — the evidence base for evaluating a delivered solution.',
      },
    },

    // ---------------------------------------------------------------- SE2
    {
      id: 'se2',
      code: 'SE2',
      title: 'Assess Limitations & Recommend Actions',
      summary:
        'Trace a value gap to its cause by separating enterprise from solution limitations, then recommend the right action — adjust, replace, retire, or do nothing.',
      moduleId: 'm8-solution',
      objectives: [
        'Distinguish solution limitations from enterprise limitations',
        'Trace a value gap to its underlying limitation using KPI evidence',
        'Select an appropriate recommendation: do nothing, adjust, replace, retire, or invest',
        'Write a concise, decision-focused solution-evaluation memo',
      ],
      durationMinutes: 45,
      difficulty: 'Intermediate',
      prerequisites: ['se1'],
      resources: [
        { type: 'reading', title: 'IIBA — Assess Enterprise & Solution Limitations', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'Where solution value is lost, inside and outside the software.' },
        { type: 'reading', title: 'Recommend Actions to Increase Solution Value (BABOK)', url: 'https://www.iiba.org/standards-and-resources/babok/', description: 'The menu of recommendations: adjust, replace, retire, do nothing, invest.' },
        { type: 'reading', title: 'How to write a one-page decision memo', url: 'https://asana.com/resources/executive-summary-examples', description: 'Structure for a concise, decision-focused recommendation.' },
      ],
      content: `## The value gap

Lesson SE1 measured performance and found a gap between actual and expected value. This lesson answers the next question: **why is value being lost, and what should we do about it?** BABOK splits the causes into two places.

## Enterprise vs. solution limitations

| | Solution limitation | Enterprise limitation |
|---|---|---|
| Lives in | The solution itself | The organization *around* the solution |
| Examples | A bug, a missing feature, a slow report, poor UX, wrong config | Untrained users, a broken upstream process, policy or culture, org structure, weak data governance |
| Fix by | Changing the solution | Changing the organization |

The classic trap: teams blame the **solution** for what are really **enterprise** limitations. If reconciliation is still slow because staff were never trained or the upstream data is dirty, buying a new module will not help — the constraint sits outside the software.

## Recommending actions to increase value

Once you know *where* value is lost, BABOK offers a menu of recommendations:

| Recommendation | When to use it | Example |
|---|---|---|
| **Do nothing** | Value is acceptable, or the cost / risk of change outweighs the gain | Cycle time is 2.5 vs. 2.0 days — close enough for now |
| **Adjust / organizational change** | The limitation is fixable by tuning the solution or the surrounding process and people | Retune the auto-match rules; train the AP team |
| **Replace the solution** | The solution cannot meet the need and cannot be economically adjusted | Swap a spreadsheet workaround for a proper ERP module |
| **Retire the solution** | The need is gone, or the solution costs more than the value it delivers | Decommission a legacy report nobody uses |
| **Increase investment** | Extra investment would unlock disproportionate value | Fund an integration that removes a manual re-key |

> A recommendation is only credible when it names the **limitation type** (solution vs. enterprise), the **evidence** (the KPI gap), the **option**, and the **expected value** of acting.

## From analysis to a recommendation memo

The output of Solution Evaluation is usually a short **solution-evaluation memo** to the sponsor: here is what we measured, here is the gap, here is *why*, here is what we recommend and what it is worth. Keep it decision-focused — the sponsor wants an action, not a data dump.

> **BA takeaway:** "The number is bad" is not a recommendation. "The number is bad *because* of an enterprise limitation we can fix with training, worth about 4 days per month of finance time" is.`,
      realWorldExample: `**From your world (after the accounting go-live):**

Three months post-go-live, your KPIs (from SE1) show reconciliation cycle time at **2.5 days** (target ≤ 2) and auto-match at **88%** (target ≥ 90%). The value is *mostly* there but not fully. You investigate the gap:

- **Solution limitation:** the auto-match rules ignore one supplier reference format, so roughly 5% of invoices fall through to manual matching.
- **Enterprise limitation:** two AP clerks never attended the training and still export to Excel out of habit, adding about a day.

Your recommendation is a mix, not a single lever:
1. **Adjust the solution** — add the missing match rule (a small config change, low risk, closes most of the auto-match gap).
2. **Organizational change** — run a one-hour refresher and retire the parallel Excel process (this addresses the enterprise limitation).
3. **Do nothing** on the reporting module — it is already meeting its target, so no spend there.

You explicitly *reject* "replace the solution": the shortfall is a config gap plus training, not a product failure. You write it up as a one-page memo so the sponsor can approve the two low-cost actions — expected to recover about four finance-hours per close.`,
      exercises: [
        {
          id: 'se2-e1',
          title: 'Solution or enterprise limitation?',
          prompt: 'For each problem observed after go-live, label it a SOLUTION limitation or an ENTERPRISE limitation: (a) the invoice-approval screen crashes on files over 10 MB, (b) users still keep a parallel Excel tracker because nobody told them to stop, (c) upstream master data has duplicate supplier records, (d) a required tax field is missing from the posting form.',
          hint: 'Ask: would changing the software fix it, or would changing the organization fix it?',
          sampleSolution: '(a) Solution limitation — a defect in the software. (b) Enterprise limitation — a people and process habit, not the software. (c) Enterprise limitation — a data-governance problem upstream of the solution. (d) Solution limitation — missing functionality or configuration in the solution.',
        },
        {
          id: 'se2-e2',
          title: 'Pick the recommendation',
          prompt: 'Recommend one action (do nothing / adjust / replace / retire / increase investment) with a one-line justification: (a) a KPI is 1% off target and any change is costly, (b) a legacy report duplicated by the new dashboard still runs nightly, (c) the tool can never scale to the transaction volume and fixing it costs more than a new one.',
          sampleSolution: '(a) Do nothing — the gap is trivial and the cost / risk of change outweighs the benefit. (b) Retire — the need is served elsewhere, so decommission the duplicate report. (c) Replace — it cannot meet the need and cannot be economically adjusted.',
        },
      ],
      assignment: {
        id: 'se2-assignment',
        title: 'Write a Solution-Evaluation Memo',
        brief:
          'Using a real or realistic solution you know (ideally the accounting/ERP go-live from earlier modules), write a one-page solution-evaluation memo to the sponsor. Base it on the KPIs and value gap you measured in SE1.',
        deliverable:
          'A one-page memo containing: (1) the objective and its KPI(s) with actual vs. expected value, (2) the identified limitations labelled solution vs. enterprise, (3) a clear recommendation from the menu (do nothing / adjust / replace / retire / invest), and (4) the expected value of acting plus the next step.',
        rubric: [
          'States the objective and at least one KPI with actual vs. expected value',
          'Correctly labels each limitation as solution or enterprise',
          'Makes a specific recommendation from the BABOK menu',
          'Quantifies (or credibly estimates) the expected value of acting',
          'Fits on one page and ends with a clear next step for the sponsor',
        ],
      },
      deliverables: [
        'A one-page solution-evaluation memo with a clear, evidence-based recommendation',
        'A limitation log labelling each issue as solution vs. enterprise',
      ],
      completionCriteria: [
        'Complete both exercises',
        'Submit a solution-evaluation memo that names the limitation type, the evidence, the recommendation, and the expected value',
      ],
      portfolioArtifact: {
        type: 'Case Study',
        title: 'Solution Evaluation Memo & Recommendation',
        description: 'A decision-focused memo that turns KPI evidence into a limitation diagnosis and a recommended value-increasing action for a sponsor.',
      },
    },
  ],
}

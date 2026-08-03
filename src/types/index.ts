// ============================================================================
// Domain types — the single source of truth for the whole app.
// The curriculum data, stores, and UI all speak these shapes.
// ============================================================================

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced'

export type ResourceType = 'reading' | 'video' | 'download'

export interface Resource {
  type: ResourceType
  title: string
  /** External URL, or a data/blob reference for downloadables. */
  url: string
  description?: string
  /** Optional duration label for videos, e.g. "12 min". */
  meta?: string
}

export type QuestionType = 'mcq' | 'truefalse' | 'short'

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  points: number
  /** Shown after grading to teach the concept. */
  explanation: string
  // mcq
  options?: string[]
  correctIndex?: number
  // truefalse
  correctBool?: boolean
  // short answer (auto-graded by keyword match; sample shown for self-check)
  keywords?: string[]
  sampleAnswer?: string
}

export interface Quiz {
  id: string
  /** Percentage required to "pass" the quiz (0–100). */
  passingScore: number
  questions: Question[]
}

/** A module-level exam (20–30 questions) — the focused assessment per module. */
export interface Exam {
  id: string
  moduleId: string
  title: string
  description: string
  passingScore: number
  questions: Question[]
}

export interface Exercise {
  id: string
  title: string
  prompt: string
  hint?: string
  sampleSolution?: string
}

export interface Assignment {
  id: string
  title: string
  brief: string
  /** What the learner must produce. */
  deliverable: string
  /** Self/instructor grading checklist. */
  rubric: string[]
}

export type PortfolioArtifactType =
  | 'BRD'
  | 'User Stories'
  | 'Process Model'
  | 'BPMN Diagram'
  | 'Wireframe'
  | 'Data Model'
  | 'Dashboard'
  | 'Requirement Doc'
  | 'Case Study'
  | 'Capstone'

export interface PortfolioArtifactSpec {
  type: PortfolioArtifactType
  title: string
  description: string
}

export interface Lesson {
  id: string
  /** Short code shown in the roadmap, e.g. "L1" or "PBI2". */
  code: string
  title: string
  summary: string
  moduleId: string
  objectives: string[]
  durationMinutes: number
  difficulty: Difficulty
  /** Lesson ids that must be completed before this unlocks. */
  prerequisites: string[]
  resources: Resource[]
  /** Main teaching content as Markdown (supports GFM + ```mermaid blocks). */
  content: string
  /** A concrete, domain-flavoured worked example (Markdown). */
  realWorldExample: string
  exercises: Exercise[]
  assignment?: Assignment
  quiz?: Quiz
  deliverables: string[]
  completionCriteria: string[]
  /** If set, completing this lesson contributes an artifact to the portfolio. */
  portfolioArtifact?: PortfolioArtifactSpec
}

export interface Module {
  id: string
  code: string
  title: string
  description: string
  /** Emoji used as the module glyph in the roadmap. */
  icon: string
  /** Tailwind gradient utility pair, e.g. "from-blue-500 to-indigo-500". */
  accent: string
  lessons: Lesson[]
}

export type Curriculum = Module[]

// ---------------------------------------------------------------------------
// Learner state (persisted)
// ---------------------------------------------------------------------------

export type LessonStatus = 'not_started' | 'in_progress' | 'completed'

export interface QuizAttempt {
  answers: Record<string, number | boolean | string>
  /** Instructor overrides of per-question correctness (questionId -> correct?). */
  overrides: Record<string, boolean>
  /** Score from pure auto-grading (before instructor overrides). */
  autoScore: number
  /** Final score after instructor overrides. */
  score: number // 0–100
  takenAt: string // ISO
}

export interface ExamAttempt {
  moduleId: string
  answers: Record<string, number | boolean | string>
  /** Instructor overrides of per-question correctness (questionId -> correct?). */
  overrides: Record<string, boolean>
  /** Score from pure auto-grading (before any instructor override). */
  autoScore: number
  /** Final score after instructor overrides applied. */
  score: number
  submittedAt: string // ISO
}

export interface AssignmentSubmission {
  text: string
  submittedAt: string // ISO
  /** 0–100; set via self-review rubric or instructor review. */
  score?: number
  approved?: boolean
}

export type Author = 'learner' | 'instructor'

export interface Comment {
  id: string
  author: Author
  text: string
  createdAt: string // ISO
}

export interface LessonProgress {
  lessonId: string
  status: LessonStatus
  completed: boolean
  completedExerciseIds: string[]
  quiz?: QuizAttempt
  submission?: AssignmentSubmission
  comments: Comment[]
  /** Instructor sign-off. */
  approved: boolean
  timeSpentMin: number
  lastVisited?: string // ISO
}

export interface ActivityEntry {
  id: string
  date: string // ISO
  lessonId: string
  kind: 'viewed' | 'completed' | 'quiz' | 'assignment' | 'note'
  label: string
}

// ---------------------------------------------------------------------------
// Derived scoring shapes
// ---------------------------------------------------------------------------

export interface LessonScore {
  /** Component percentages; null when the component doesn't apply. */
  quiz: number | null
  exercise: number | null
  assignment: number | null
  completion: number
  /** Weighted overall for the lesson (0–100). */
  total: number
}

export interface ModuleScore {
  moduleId: string
  completedLessons: number
  totalLessons: number
  /** Blended score: lesson work + module exam (0–100). */
  score: number
  /** 0–100 completion of the module. */
  completion: number
  /** Module exam score if taken, else null. */
  examScore: number | null
}

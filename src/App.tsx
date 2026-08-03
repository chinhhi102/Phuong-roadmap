import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'

// Route-level code splitting keeps the initial bundle small; each page
// (and heavy deps like charts) loads on demand.
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'))
const RoadmapPage = lazy(() => import('@/features/roadmap/RoadmapPage'))
const LessonPage = lazy(() => import('@/features/lessons/LessonPage'))
const NotesPage = lazy(() => import('@/features/notes/NotesPage'))
const ExamsPage = lazy(() => import('@/features/exams/ExamsPage'))
const ExamPage = lazy(() => import('@/features/exams/ExamPage'))
const PortfolioPage = lazy(() => import('@/features/portfolio/PortfolioPage'))
const CertificatePage = lazy(() => import('@/features/certificate/CertificatePage'))
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage'))

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/exam/:moduleId" element={<ExamPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

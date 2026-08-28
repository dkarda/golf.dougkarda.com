import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import Bag from './pages/Bag.tsx'
import CourseDetail from './pages/CourseDetail.tsx'
import Courses from './pages/Courses.tsx'
import Home from './pages/Home.tsx'
import Links from './pages/Links.tsx'
import NoteDetail from './pages/NoteDetail.tsx'
import Notes from './pages/Notes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="bag" element={<Bag />} />
          <Route path="notes" element={<Notes />} />
          <Route path="notes/:slug" element={<NoteDetail />} />
          <Route path="links" element={<Links />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

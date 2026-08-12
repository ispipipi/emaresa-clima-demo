import { HashRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { DivisionDetailPage } from './pages/DivisionDetailPage'
import { CorporatePage } from './pages/CorporatePage'

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gestion-corporativa" element={<CorporatePage />} />
        <Route path="/unidad/:nombre/division/:division" element={<DivisionDetailPage />} />
        <Route path="/unidad/:nombre" element={<UnitDetailPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </HashRouter>
  )
}

export default App

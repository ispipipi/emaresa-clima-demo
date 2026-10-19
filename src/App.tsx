import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ScrollToTop } from './components/ScrollToTop'
import { HomePage } from './pages/HomePage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { DivisionDetailPage } from './pages/DivisionDetailPage'
import { CorporatePage } from './pages/CorporatePage'
import { OrganizationPage } from './pages/OrganizationPage'
import { ManualPage } from './pages/ManualPage'

// AppShell es un layout compartido: el sidebar, Mentat y su conversación sobreviven al cambiar de ruta.
function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/gestion-corporativa" element={<CorporatePage />} />
          <Route path="/organizacion" element={<OrganizationPage />} />
          <Route path="/manual" element={<ManualPage />} />
          <Route path="/unidad/:nombre/division/:division" element={<DivisionDetailPage />} />
          <Route path="/unidad/:nombre" element={<UnitDetailPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App

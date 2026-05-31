import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Portfolio from './pages/Portfolio'
import Reports from './pages/Reports'

export default function App() {
  const navClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-md text-sm transition-colors ${
      isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
    }`

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <header className="border-b border-gray-800 px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <h1 className="text-xl font-semibold tracking-tight">Crypto Portfolio</h1>
            <nav className="flex gap-1">
              <NavLink to="/" end className={navClass}>Portfolio</NavLink>
              <NavLink to="/reports" className={navClass}>Reports</NavLink>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-8">
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

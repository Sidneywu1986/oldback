import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ChatSupport from './components/ChatSupport'
import { ThemeProvider } from './context/ThemeContext'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ContactPage from './pages/ContactPage'
import NewsPage from './pages/NewsPage'
import CasesPage from './pages/CasesPage'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/cases" element={<CasesPage />} />
          </Routes>
        </main>
        <Footer />
        <ChatSupport />
      </div>
    </ThemeProvider>
  )
}

export default App

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Recycle } from 'lucide-react'

const navItems = [
  { label: '首页', path: '/' },
  { label: '关于我们', path: '/about' },
  { label: '服务项目', path: '/services' },
  { label: '新闻资讯', path: '/news' },
  { label: '成功案例', path: '/cases' },
  { label: '联系我们', path: '/contact' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[rgba(0,0,0,0.1)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[rgba(0,0,0,0.95)] hidden sm:block">飞玖回收</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-primary-red'
                    : 'text-[#615d59] hover:text-[rgba(0,0,0,0.95)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/contact')}
              className="bg-primary-red hover:bg-primary-red-dark text-white px-5 py-2.5 rounded-xs font-medium text-sm transition-all duration-200 hover:shadow-notion-card"
            >
              立即咨询
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[rgba(0,0,0,0.95)]"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden animate-slide-in-right">
            <nav className="flex flex-col py-4 border-t border-[rgba(0,0,0,0.1)]">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path)
                    setIsMenuOpen(false)
                  }}
                  className={`px-4 py-3 text-left text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-red bg-[rgba(196,30,58,0.05)]'
                      : 'text-[#615d59] hover:text-[rgba(0,0,0,0.95)] hover:bg-[rgba(0,0,0,0.02)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  navigate('/contact')
                  setIsMenuOpen(false)
                }}
                className="mt-4 mx-4 bg-primary-red hover:bg-primary-red-dark text-white px-5 py-3 rounded-xs font-medium text-sm text-center"
              >
                立即咨询
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

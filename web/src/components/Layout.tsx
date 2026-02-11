import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  Map,
  Plus,
  LayoutDashboard,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Coins,
  User,
  ChevronDown,
} from 'lucide-react'

export function Layout() {
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + '/')

  const navLinks = user
    ? [
        { to: '/create', label: 'Create', icon: Plus },
        { to: '/dashboard', label: 'My Posters', icon: LayoutDashboard },
        { to: '/pricing', label: 'Pricing', icon: CreditCard },
      ]
    : [
        { to: '/pricing', label: 'Pricing', icon: CreditCard },
      ]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sand-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <Map className="w-7 h-7 text-terra-600" />
              <span className="text-lg font-semibold text-sand-900 tracking-tight">
                MapToPoster
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                    isActive(to)
                      ? 'bg-terra-50 text-terra-700'
                      : 'text-sand-600 hover:text-sand-900 hover:bg-sand-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user && profile ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-terra-50 text-terra-700 text-sm font-medium">
                    <Coins className="w-4 h-4" />
                    <span>{profile.credit_balance}</span>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-sand-100 transition-colors cursor-pointer bg-transparent border-none text-sm"
                    >
                      <div className="w-7 h-7 rounded-full bg-terra-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-terra-600" />
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-sand-500" />
                    </button>

                    {dropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setDropdownOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white rounded-lg shadow-lg border border-sand-200 py-1">
                          <div className="px-3 py-2 border-b border-sand-100">
                            <p className="text-sm font-medium text-sand-900 truncate">
                              {profile.display_name || profile.email}
                            </p>
                            <p className="text-xs text-sand-500 truncate">{profile.email}</p>
                          </div>
                          {profile.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-sand-700 hover:bg-sand-50 no-underline transition-colors"
                            >
                              <Settings className="w-4 h-4" />
                              Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => { setDropdownOpen(false); handleSignOut() }}
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-sand-700 hover:bg-sand-50 bg-transparent border-none cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-sand-700 hover:text-sand-900 no-underline transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-terra-600 hover:bg-terra-700 rounded-lg no-underline transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-sand-100 bg-transparent border-none cursor-pointer"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-sand-700" />
              ) : (
                <Menu className="w-5 h-5 text-sand-700" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-sand-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                    isActive(to)
                      ? 'bg-terra-50 text-terra-700'
                      : 'text-sand-600 hover:bg-sand-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {user && profile ? (
                <>
                  <div className="border-t border-sand-100 mt-2 pt-2">
                    <div className="flex items-center gap-2 px-3 py-2 text-sm text-sand-500">
                      <Coins className="w-4 h-4" />
                      {profile.credit_balance} credits
                    </div>
                    {profile.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-sand-600 hover:bg-sand-100 no-underline transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => { setMobileOpen(false); handleSignOut() }}
                      className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sand-600 hover:bg-sand-100 bg-transparent border-none cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-sand-100 mt-2 pt-2 flex flex-col gap-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-sand-600 hover:bg-sand-100 no-underline transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-center text-white bg-terra-600 hover:bg-terra-700 no-underline transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-sand-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Map className="w-5 h-5 text-terra-600" />
              <span className="text-sm font-medium text-sand-700">MapToPoster</span>
            </div>
            <p className="text-sm text-sand-500">
              Map data from OpenStreetMap contributors
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

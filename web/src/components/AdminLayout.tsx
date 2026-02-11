import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Package,
  Palette,
  Ruler,
  FileImage,
  Settings,
} from 'lucide-react'

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/pricing', label: 'Pricing', icon: DollarSign, end: false },
  { to: '/admin/packages', label: 'Credit Packages', icon: Package, end: false },
  { to: '/admin/themes', label: 'Themes', icon: Palette, end: false },
  { to: '/admin/resolutions', label: 'Resolutions', icon: Ruler, end: false },
  { to: '/admin/jobs', label: 'Jobs', icon: FileImage, end: false },
  { to: '/admin/settings', label: 'Settings', icon: Settings, end: false },
]

export function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-sand-900 mb-6">Admin Panel</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav className="lg:w-56 shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap no-underline transition-colors ${
                    isActive
                      ? 'bg-terra-50 text-terra-700'
                      : 'text-sand-600 hover:text-sand-800 hover:bg-sand-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Theme } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export function AdminThemes() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('themes')
        .select('*')
        .order('sort_order')
      setThemes(data ?? [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-900 mb-4">Themes</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="bg-white rounded-xl border border-sand-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[2/1] relative" style={{ backgroundColor: theme.colors.bg }}>
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <line x1="20" y1="5" x2="20" y2="45" stroke={theme.colors.road_primary} strokeWidth="1" />
                <line x1="50" y1="5" x2="50" y2="45" stroke={theme.colors.road_motorway} strokeWidth="1.5" />
                <line x1="80" y1="5" x2="80" y2="45" stroke={theme.colors.road_residential} strokeWidth="0.8" />
                <line x1="5" y1="25" x2="95" y2="25" stroke={theme.colors.road_secondary} strokeWidth="1" />
                <circle cx="75" cy="12" r="5" fill={theme.colors.water} opacity="0.6" />
                <rect x="10" y="32" width="12" height="8" rx="1" fill={theme.colors.parks} opacity="0.6" />
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sand-900">{theme.display_name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  theme.is_active ? 'bg-success-50 text-success-700' : 'bg-sand-100 text-sand-600'
                }`}>
                  {theme.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-sand-600 mt-1">{theme.description}</p>
              <div className="flex gap-1 mt-3">
                {[theme.colors.bg, theme.colors.road_motorway, theme.colors.road_primary, theme.colors.water, theme.colors.parks].map((color, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 rounded-sm border border-sand-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

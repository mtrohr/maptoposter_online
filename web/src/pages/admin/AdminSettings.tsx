import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { SystemSetting } from '@/lib/types'
import { Loader2 } from 'lucide-react'

const SETTING_LABELS: Record<string, string> = {
  max_concurrent_jobs: 'Max Concurrent Jobs',
  maintenance_mode: 'Maintenance Mode',
  max_dimension_inches: 'Max Dimension (inches)',
  default_distance: 'Default Distance (meters)',
  welcome_credits: 'Welcome Credits (new signups)',
  max_jobs_per_user_concurrent: 'Max Jobs Per User (concurrent)',
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('system_settings')
        .select('*')
        .order('key')
      setSettings(data ?? [])
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
      <h2 className="text-lg font-semibold text-sand-900 mb-4">System Settings</h2>
      <div className="bg-white rounded-xl border border-sand-200 divide-y divide-sand-100">
        {settings.map((setting) => (
          <div key={setting.key} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-sand-900">{SETTING_LABELS[setting.key] ?? setting.key}</p>
              <p className="text-xs text-sand-500 mt-0.5">{setting.key}</p>
            </div>
            <input
              type="text"
              value={JSON.stringify(setting.value)}
              readOnly
              className="w-28 px-3 py-2 rounded-lg border border-sand-300 bg-sand-50 text-sand-900 text-sm text-right"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-sand-500 mt-3">
        Editing will be enabled in a future update.
      </p>
    </div>
  )
}

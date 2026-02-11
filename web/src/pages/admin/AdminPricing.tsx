import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PricingConfig } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export function AdminPricing() {
  const [config, setConfig] = useState<PricingConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('pricing_config')
        .select('*')
        .eq('key', 'default')
        .maybeSingle()
      setConfig(data)
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
      <h2 className="text-lg font-semibold text-sand-900 mb-4">Pricing Configuration</h2>
      <div className="bg-white rounded-xl border border-sand-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-sand-700 mb-1.5">Base Credits Per Job</label>
          <input
            type="number"
            value={config?.base_credits_per_job ?? 1}
            readOnly
            className="w-40 px-3 py-2.5 rounded-lg border border-sand-300 bg-sand-50 text-sand-900 text-sm"
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-sand-700 mb-2">Format Multipliers</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(config?.format_multipliers ?? {}).map(([fmt, mult]) => (
              <div key={fmt} className="flex items-center gap-2">
                <span className="text-sm text-sand-600 uppercase w-10">{fmt}</span>
                <input
                  type="number"
                  value={mult}
                  readOnly
                  className="w-20 px-3 py-2 rounded-lg border border-sand-300 bg-sand-50 text-sand-900 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-sand-700 mb-2">Resolution Multipliers</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(config?.resolution_multipliers ?? {}).map(([tier, mult]) => (
              <div key={tier} className="flex items-center gap-2">
                <span className="text-sm text-sand-600 capitalize w-16">{tier}</span>
                <input
                  type="number"
                  value={mult}
                  readOnly
                  className="w-20 px-3 py-2 rounded-lg border border-sand-300 bg-sand-50 text-sand-900 text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-sand-500">
          Editing will be enabled in a future update.
        </p>
      </div>
    </div>
  )
}

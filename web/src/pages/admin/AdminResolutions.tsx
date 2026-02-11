import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ResolutionPreset } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export function AdminResolutions() {
  const [presets, setPresets] = useState<ResolutionPreset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('resolution_presets')
        .select('*')
        .order('sort_order')
      setPresets(data ?? [])
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
      <h2 className="text-lg font-semibold text-sand-900 mb-4">Resolution Presets</h2>
      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50">
                <th className="text-left px-4 py-3 font-medium text-sand-600">Label</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Dimensions</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Pixels</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {presets.map((p) => (
                <tr key={p.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-sand-900">{p.label}</td>
                  <td className="px-4 py-3 text-sand-700">{p.width_inches}" x {p.height_inches}"</td>
                  <td className="px-4 py-3 text-sand-700">{p.pixel_width} x {p.pixel_height}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-sand-600">{p.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.is_active ? 'bg-success-50 text-success-700' : 'bg-sand-100 text-sand-600'
                    }`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

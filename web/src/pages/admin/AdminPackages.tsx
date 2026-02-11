import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { CreditPackage } from '@/lib/types'
import { Loader2 } from 'lucide-react'

export function AdminPackages() {
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('credit_packages')
        .select('*')
        .order('sort_order')
      setPackages(data ?? [])
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
      <h2 className="text-lg font-semibold text-sand-900 mb-4">Credit Packages</h2>
      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50">
                <th className="text-left px-4 py-3 font-medium text-sand-600">Name</th>
                <th className="text-right px-4 py-3 font-medium text-sand-600">Credits</th>
                <th className="text-right px-4 py-3 font-medium text-sand-600">Price</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-sand-900">{pkg.name}</p>
                    <p className="text-xs text-sand-500">{pkg.description}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-sand-900">{pkg.credits_amount}</td>
                  <td className="px-4 py-3 text-right font-medium text-sand-900">
                    ${(pkg.price_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      pkg.is_active ? 'bg-success-50 text-success-700' : 'bg-sand-100 text-sand-600'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
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

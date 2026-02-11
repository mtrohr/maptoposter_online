import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { CreditPackage } from '@/lib/types'
import { Loader2, Check } from 'lucide-react'

export function Pricing() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPackages() {
      const { data } = await supabase
        .from('credit_packages')
        .select('*')
        .order('sort_order')
      setPackages(data ?? [])
      setLoading(false)
    }
    fetchPackages()
  }, [])

  const bestValue = packages.reduce<CreditPackage | null>((best, pkg) => {
    const ppc = pkg.price_cents / pkg.credits_amount
    if (!best || ppc < best.price_cents / best.credits_amount) return pkg
    return best
  }, null)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-sand-900">Simple Credit Pricing</h1>
        <p className="mt-3 text-sand-600 max-w-lg mx-auto">
          Buy credits and use them to generate beautiful city map posters. No subscriptions required.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {packages.map((pkg) => {
          const isBest = pkg.id === bestValue?.id
          return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl border p-6 transition-shadow ${
                isBest
                  ? 'border-terra-600 shadow-lg shadow-terra-600/10'
                  : 'border-sand-200 hover:shadow-md'
              }`}
            >
              {isBest && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-terra-600 text-white text-xs font-semibold rounded-full">
                  Best Value
                </span>
              )}
              <h3 className="text-lg font-bold text-sand-900">{pkg.name}</h3>
              <p className="text-sm text-sand-600 mt-1">{pkg.description}</p>
              <div className="mt-4">
                <span className="text-3xl font-bold text-sand-900">
                  ${(pkg.price_cents / 100).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-sand-500 mt-1">
                {pkg.credits_amount} credits &middot; ${(pkg.price_cents / pkg.credits_amount / 100).toFixed(2)}/credit
              </p>
              <ul className="mt-5 space-y-2 text-sm text-sand-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-500 shrink-0" />
                  {pkg.credits_amount} poster credits
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-500 shrink-0" />
                  All themes included
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success-500 shrink-0" />
                  PNG, SVG, and PDF
                </li>
              </ul>
              <button
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer border-none ${
                  isBest
                    ? 'bg-terra-600 text-white hover:bg-terra-700'
                    : 'bg-sand-100 text-sand-800 hover:bg-sand-200'
                }`}
              >
                {user ? 'Buy Credits' : 'Sign Up to Buy'}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-16 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-sand-900 mb-4 text-center">How Credits Work</h2>
        <div className="bg-white rounded-xl border border-sand-200 divide-y divide-sand-100">
          <div className="flex justify-between px-5 py-3 text-sm">
            <span className="text-sand-600">Standard PNG poster</span>
            <span className="font-semibold text-sand-900">1 credit</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm">
            <span className="text-sand-600">Vector format (SVG/PDF)</span>
            <span className="font-semibold text-sand-900">2 credits</span>
          </div>
          <div className="flex justify-between px-5 py-3 text-sm">
            <span className="text-sand-600">4K resolution or larger</span>
            <span className="font-semibold text-sand-900">2 credits</span>
          </div>
        </div>
      </div>
    </div>
  )
}

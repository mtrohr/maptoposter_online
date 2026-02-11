import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, FileImage, Coins, Loader2 } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalJobs: number
  completedJobs: number
  totalCreditsInCirculation: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      const [usersRes, jobsRes, completedRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('poster_jobs').select('id', { count: 'exact', head: true }),
        supabase.from('poster_jobs').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      ])
      setStats({
        totalUsers: usersRes.count ?? 0,
        totalJobs: jobsRes.count ?? 0,
        completedJobs: completedRes.count ?? 0,
        totalCreditsInCirculation: 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
      </div>
    )
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users },
    { label: 'Total Jobs', value: stats?.totalJobs ?? 0, icon: FileImage },
    { label: 'Completed', value: stats?.completedJobs ?? 0, icon: FileImage },
    { label: 'Credits in Circulation', value: stats?.totalCreditsInCirculation ?? 0, icon: Coins },
  ]

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-900 mb-4">Overview</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-xl border border-sand-200 p-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-terra-50 flex items-center justify-center">
                <Icon className="w-4.5 h-4.5 text-terra-600" />
              </div>
              <div>
                <p className="text-sm text-sand-600">{label}</p>
                <p className="text-xl font-bold text-sand-900">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

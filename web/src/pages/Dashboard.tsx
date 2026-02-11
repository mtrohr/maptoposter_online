import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import type { PosterJob } from '@/lib/types'
import { Plus, Coins, Image, Loader2 } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-sand-100 text-sand-700',
  processing: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700',
  failed: 'bg-error-50 text-error-700',
}

export function Dashboard() {
  const { profile } = useAuth()
  const [jobs, setJobs] = useState<PosterJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('poster_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)
      setJobs(data ?? [])
      setLoading(false)
    }
    fetchJobs()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-sand-900">
            {profile?.display_name ? `Welcome, ${profile.display_name}` : 'My Posters'}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sand-600">
            <Coins className="w-4 h-4 text-terra-600" />
            <span className="text-sm font-medium">{profile?.credit_balance ?? 0} credits available</span>
            <Link to="/pricing" className="text-sm text-terra-600 hover:text-terra-700 no-underline ml-2">
              Buy more
            </Link>
          </div>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-terra-600 hover:bg-terra-700 no-underline transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Poster
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-sand-200">
          <Image className="w-12 h-12 text-sand-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-sand-900 mb-2">No posters yet</h2>
          <p className="text-sm text-sand-600 mb-6">Create your first city map poster to get started.</p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-terra-600 hover:bg-terra-700 no-underline transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Poster
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              to={`/poster/${job.id}`}
              className="group bg-white rounded-xl border border-sand-200 overflow-hidden hover:shadow-md transition-shadow no-underline"
            >
              <div
                className="aspect-[3/4] flex items-center justify-center"
                style={{ backgroundColor: '#f0ede8' }}
              >
                {job.thumbnail_path ? (
                  <img
                    src={job.thumbnail_path}
                    alt={`${job.city} poster`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-10 h-10 text-sand-300" />
                )}
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-sand-900 truncate">
                    {job.city}, {job.country}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_STYLES[job.status]}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-sand-500 mt-1">{job.theme_slug} &middot; {job.output_format.toUpperCase()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

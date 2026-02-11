import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { PosterJob } from '@/lib/types'
import { Loader2 } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-sand-100 text-sand-700',
  processing: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700',
  failed: 'bg-error-50 text-error-700',
}

export function AdminJobs() {
  const [jobs, setJobs] = useState<PosterJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('poster_jobs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      setJobs(data ?? [])
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
      <h2 className="text-lg font-semibold text-sand-900 mb-4">All Jobs</h2>
      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sand-200 bg-sand-50">
                <th className="text-left px-4 py-3 font-medium text-sand-600">City</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Theme</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Format</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-sand-600">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-sand-900">{job.city}, {job.country}</td>
                  <td className="px-4 py-3 text-sand-700">{job.theme_slug}</td>
                  <td className="px-4 py-3 text-sand-700 uppercase">{job.output_format}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sand-600">{new Date(job.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {jobs.length === 0 && (
          <div className="text-center py-8 text-sm text-sand-500">No jobs yet.</div>
        )}
      </div>
    </div>
  )
}

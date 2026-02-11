import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { PosterJob } from '@/lib/types'
import { Loader2, ArrowLeft, Download, RefreshCw, Image } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  queued: 'bg-sand-100 text-sand-700',
  processing: 'bg-warning-50 text-warning-700',
  completed: 'bg-success-50 text-success-700',
  failed: 'bg-error-50 text-error-700',
}

export function PosterDetail() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<PosterJob | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function fetchJob() {
      const { data } = await supabase
        .from('poster_jobs')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      setJob(data)
      setLoading(false)
    }
    fetchJob()

    const channel = supabase
      .channel(`job-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'poster_jobs', filter: `id=eq.${id}` }, (payload) => {
        setJob(payload.new as PosterJob)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-xl font-semibold text-sand-900 mb-2">Poster not found</h1>
        <Link to="/dashboard" className="text-terra-600 hover:text-terra-700 no-underline text-sm">
          Back to dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-sand-600 hover:text-sand-800 no-underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to posters
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div
          className="aspect-[3/4] rounded-xl bg-sand-100 flex items-center justify-center overflow-hidden border border-sand-200"
        >
          {job.status === 'completed' && job.thumbnail_path ? (
            <img src={job.thumbnail_path} alt={`${job.city} poster`} className="w-full h-full object-cover" />
          ) : job.status === 'processing' || job.status === 'queued' ? (
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-terra-400 mx-auto mb-3" />
              <p className="text-sm text-sand-600">{job.status === 'queued' ? 'Queued...' : 'Generating...'}</p>
            </div>
          ) : (
            <Image className="w-12 h-12 text-sand-300" />
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-sand-900">
                {job.display_city || job.city}
              </h1>
              <p className="text-sand-600 mt-0.5">
                {job.display_country || job.country}
              </p>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[job.status]}`}>
              {job.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-sand-100">
              <span className="text-sand-600">Theme</span>
              <span className="font-medium text-sand-900">{job.theme_slug}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-sand-100">
              <span className="text-sand-600">Format</span>
              <span className="font-medium text-sand-900">{job.output_format.toUpperCase()}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-sand-100">
              <span className="text-sand-600">Size</span>
              <span className="font-medium text-sand-900">
                {Math.round(job.width_inches * 300)}x{Math.round(job.height_inches * 300)}px
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-sand-100">
              <span className="text-sand-600">Map Radius</span>
              <span className="font-medium text-sand-900">{(job.distance / 1000).toFixed(0)}km</span>
            </div>
            <div className="flex justify-between py-2 border-b border-sand-100">
              <span className="text-sand-600">Credits</span>
              <span className="font-medium text-sand-900">{job.credits_cost}</span>
            </div>
            {job.created_at && (
              <div className="flex justify-between py-2 border-b border-sand-100">
                <span className="text-sand-600">Created</span>
                <span className="font-medium text-sand-900">{new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {job.status === 'failed' && job.error_message && (
            <div className="mt-4 p-3 rounded-lg bg-error-50 text-error-700 text-sm">
              {job.error_message}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {job.status === 'completed' && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-terra-600 hover:bg-terra-700 transition-colors cursor-pointer border-none">
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            <Link
              to="/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-sand-700 bg-white border border-sand-200 hover:bg-sand-50 transition-colors no-underline"
            >
              <RefreshCw className="w-4 h-4" />
              Create Another
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

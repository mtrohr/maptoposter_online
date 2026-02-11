import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Map, Loader2 } from 'lucide-react'

export function Signup() {
  const { user, signUp } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: err } = await signUp(email, password, displayName)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Map className="w-10 h-10 text-terra-600 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-sand-900">Create your account</h1>
          <p className="text-sm text-sand-600 mt-1">Start creating beautiful map posters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-error-50 text-error-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-sand-700 mb-1.5">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
              placeholder="Your name (optional)"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sand-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sand-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-sand-300 bg-white text-sand-900 text-sm placeholder:text-sand-400 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all"
              placeholder="At least 6 characters"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-terra-600 hover:bg-terra-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer border-none flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-sand-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-terra-600 hover:text-terra-700 font-medium no-underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

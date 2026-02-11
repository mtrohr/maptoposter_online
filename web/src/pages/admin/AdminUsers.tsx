import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'
import { Loader2, Search } from 'lucide-react'

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      setUsers(data ?? [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.display_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-sand-900">Users</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2 rounded-lg border border-sand-300 bg-white text-sm text-sand-900 outline-none focus:border-terra-500 focus:ring-2 focus:ring-terra-500/20 transition-all w-60"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-terra-600" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50">
                  <th className="text-left px-4 py-3 font-medium text-sand-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-sand-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-sand-600">Role</th>
                  <th className="text-right px-4 py-3 font-medium text-sand-600">Credits</th>
                  <th className="text-left px-4 py-3 font-medium text-sand-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-sand-50 transition-colors">
                    <td className="px-4 py-3 text-sand-900">{u.email}</td>
                    <td className="px-4 py-3 text-sand-700">{u.display_name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-terra-50 text-terra-700' : 'bg-sand-100 text-sand-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-sand-900">{u.credit_balance}</td>
                    <td className="px-4 py-3 text-sand-600">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-8 text-sm text-sand-500">No users found.</div>
          )}
        </div>
      )}
    </div>
  )
}

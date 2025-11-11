import { useEffect, useState } from 'react'

export default function Feed({ user }) {
  const [games, setGames] = useState([])
  const [sport, setSport] = useState('')
  const [loading, setLoading] = useState(true)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    const qs = new URLSearchParams()
    if (sport) qs.set('sport', sport)
    const res = await fetch(`${baseUrl}/games?${qs.toString()}`)
    const data = await res.json()
    setGames(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [sport])

  const join = async (gameId) => {
    await fetch(`${baseUrl}/games/${gameId}/join?user_id=${user.user_id}`, { method: 'POST' })
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <select value={sport} onChange={e=>setSport(e.target.value)} className="border rounded p-2">
          <option value="">All Sports</option>
          <option>Cricket</option>
          <option>Football</option>
          <option>Badminton</option>
          <option>Basketball</option>
          <option>Tennis</option>
        </select>
        <button onClick={load} className="px-3 py-2 bg-gray-100 rounded">Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {games.map(g => (
            <div key={g.id} className="bg-white/70 backdrop-blur p-4 rounded-xl shadow space-y-2">
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold">{g.sport}</h4>
                <span className="text-xs px-2 py-1 rounded bg-gray-800 text-white">{g.status}</span>
              </div>
              <p className="text-sm text-gray-700">{new Date(g.date_time).toLocaleString()}</p>
              <p className="text-sm text-gray-700">{g.location?.address || 'TBD'}</p>
              <p className="text-sm text-gray-700">Players: {g.participants?.length || 0} / {g.players_needed}</p>
              <p className="text-sm text-gray-700">Fee: {g.entry_fee > 0 ? `₹${g.entry_fee}` : 'Free'}</p>
              <div className="flex gap-2">
                <button onClick={() => join(g.id)} className="px-3 py-2 bg-blue-600 text-white rounded">Join</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

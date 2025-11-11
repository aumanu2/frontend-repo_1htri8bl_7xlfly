import { useState } from 'react'

export default function HostGame({ user, onHosted }) {
  const [sport, setSport] = useState('Cricket')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [address, setAddress] = useState('')
  const [players, setPlayers] = useState(8)
  const [fee, setFee] = useState(0)
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const dateTime = new Date(`${date}T${time}:00`)
      const res = await fetch(`${baseUrl}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host_id: user.user_id,
          sport,
          date_time: dateTime.toISOString(),
          location: { address },
          players_needed: Number(players),
          entry_fee: Number(fee),
          description,
          rules
        })
      })
      if (!res.ok) throw new Error('Failed to host game')
      const data = await res.json()
      onHosted(data.game_id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white/70 backdrop-blur rounded-xl p-6 shadow space-y-3">
      <h3 className="text-xl font-semibold">Host a Game</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Sport</label>
          <select value={sport} onChange={e=>setSport(e.target.value)} className="w-full border rounded p-2">
            <option>Cricket</option>
            <option>Football</option>
            <option>Badminton</option>
            <option>Basketball</option>
            <option>Tennis</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Players Needed</label>
          <input type="number" value={players} onChange={e=>setPlayers(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Time</label>
          <input type="time" value={time} onChange={e=>setTime(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div className="col-span-2">
          <label className="text-sm text-gray-600">Location</label>
          <input placeholder="Address or location" value={address} onChange={e=>setAddress(e.target.value)} className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Entry Fee</label>
          <input type="number" value={fee} onChange={e=>setFee(e.target.value)} className="w-full border rounded p-2" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} className="w-full border rounded p-2" />
      </div>
      <div>
        <label className="text-sm text-gray-600">Rules</label>
        <textarea value={rules} onChange={e=>setRules(e.target.value)} className="w-full border rounded p-2" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded">
        {loading? 'Creating...' : 'Create Game'}
      </button>
    </form>
  )
}

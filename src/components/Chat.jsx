import { useEffect, useState } from 'react'

export default function Chat({ gameId, user }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/games/${gameId}/messages`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 3000)
    return () => clearInterval(id)
  }, [gameId])

  const send = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId, sender_id: user.user_id, content: text })
    })
    setText('')
    load()
  }

  return (
    <div className="bg-white/70 backdrop-blur rounded-xl p-4 shadow h-80 flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.sender_id===user.user_id?'bg-blue-600 text-white ml-auto':'bg-gray-100'}`} style={{ maxWidth: '80%' }}>
            <p className="text-sm">{m.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="mt-2 flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 border rounded p-2" placeholder="Type a message" />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Send</button>
      </form>
    </div>
  )
}

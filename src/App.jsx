import { useEffect, useState } from 'react'
import Auth from './components/Auth'
import HostGame from './components/HostGame'
import Feed from './components/Feed'
import Chat from './components/Chat'

function App() {
  const [user, setUser] = useState(null)
  const [activeGameId, setActiveGameId] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const onLogin = (data) => {
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
  }

  const onHosted = (gameId) => {
    setActiveGameId(gameId)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-sky-100 flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Pickup Sports MVP</h1>
          <p className="text-gray-600 max-w-md">Host local games, join nearby matches, chat with players, and confirm attendance with QR check-in.</p>
          <Auth onLogin={onLogin} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-sky-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Welcome, {user.name || 'Player'}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => { localStorage.removeItem('user'); setUser(null) }} className="px-3 py-2 bg-gray-200 rounded">Logout</button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <HostGame user={user} onHosted={onHosted} />
          </div>
          <div className="md:col-span-2 space-y-6">
            <Feed user={user} />
            {activeGameId && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold">Game Forum</h3>
                <Chat gameId={activeGameId} user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

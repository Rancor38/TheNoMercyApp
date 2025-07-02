import { useState, useEffect } from 'react'
import './App.css'
import noMercyLogo from './assets/no-mercy.png'

function App() {
  const [games, setGames] = useState([])
  const [newGame, setNewGame] = useState({
    date: new Date().toISOString().split('T')[0],
    mercyBanned: false,
    won: false,
    notes: ''
  })

  // Check if we're in Electron environment
  const isElectron = window.electronAPI !== undefined

  // Load games from CSV file via Electron or fallback to localStorage
  useEffect(() => {
    const loadGames = async () => {
      if (isElectron) {
        try {
          const csvData = await window.electronAPI.loadGames()
          if (csvData) {
            setGames(csvData)
          }
        } catch (error) {
          console.error('Error loading games:', error)
        }
      } else {
        // Fallback to localStorage for web version
        const savedGames = localStorage.getItem('overwatchGames')
        if (savedGames) {
          setGames(JSON.parse(savedGames))
        }
      }
    }

    loadGames()
  }, [isElectron])

  // Save games to CSV file via Electron or fallback to localStorage
  useEffect(() => {
    if (games.length === 0) return // Don't save empty array on initial load

    const saveGames = async () => {
      if (isElectron) {
        try {
          await window.electronAPI.saveGames(games)
        } catch (error) {
          console.error('Error saving games:', error)
        }
      } else {
        // Fallback to localStorage for web version
        localStorage.setItem('overwatchGames', JSON.stringify(games))
      }
    }

    saveGames()
  }, [games, isElectron])

  const addGame = () => {
    const gameWithId = {
      ...newGame,
      id: Date.now(),
      timestamp: new Date().toISOString()
    }
    setGames([...games, gameWithId])
    setNewGame({
      date: new Date().toISOString().split('T')[0],
      mercyBanned: false,
      won: false,
      notes: ''
    })
  }

  const deleteGame = (id) => {
    setGames(games.filter(game => game.id !== id))
  }

  const toggleGameResult = (id) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, won: !game.won } : game
    ))
  }

  const toggleMercyBan = (id) => {
    setGames(games.map(game =>
      game.id === id ? { ...game, mercyBanned: !game.mercyBanned } : game
    ))
  }

  // Calculate statistics
  const mercyBannedGames = games.filter(game => game.mercyBanned)
  const mercyNotBannedGames = games.filter(game => !game.mercyBanned)

  const mercyBannedWins = mercyBannedGames.filter(game => game.won)
  const mercyNotBannedWins = mercyNotBannedGames.filter(game => game.won)

  const mercyBannedWinRate = mercyBannedGames.length > 0
    ? (mercyBannedWins.length / mercyBannedGames.length * 100).toFixed(1)
    : 0

  const mercyNotBannedWinRate = mercyNotBannedGames.length > 0
    ? (mercyNotBannedWins.length / mercyNotBannedGames.length * 100).toFixed(1)
    : 0

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <img src={noMercyLogo} alt="No Mercy Logo" className="header-logo" />
          <div className="header-text">
            <h1>No Mercy Tracker</h1>
            <p>Track your Overwatch games and Mercy ban effectiveness</p>
          </div>
        </div>
      </header>

      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card total-games">
            <h3>Total Games</h3>
            <div className="stat-number">{games.length}</div>
          </div>
          <div className="stat-card mercy-banned">
            <h3>Mercy Banned</h3>
            <div className="stat-number">{mercyBannedGames.length}</div>
            <div className="stat-rate">{mercyBannedWinRate}% Win Rate</div>
          </div>
          <div className="stat-card mercy-not-banned">
            <h3>Mercy Not Banned</h3>
            <div className="stat-number">{mercyNotBannedGames.length}</div>
            <div className="stat-rate">{mercyNotBannedWinRate}% Win Rate</div>
          </div>
          <div className="stat-card overall">
            <h3>Overall Win Rate</h3>
            <div className="stat-number">
              {games.length > 0
                ? ((games.filter(g => g.won).length / games.length) * 100).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="add-game-section">
        <h2>Add New Game</h2>
        <div className="add-game-form">
          <input
            type="date"
            value={newGame.date}
            onChange={(e) => setNewGame({ ...newGame, date: e.target.value })}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newGame.mercyBanned}
              onChange={(e) => setNewGame({ ...newGame, mercyBanned: e.target.checked })}
            />
            Voted to ban Mercy
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={newGame.won}
              onChange={(e) => setNewGame({ ...newGame, won: e.target.checked })}
            />
            Won the game
          </label>
          <input
            type="text"
            placeholder="Notes (optional)"
            value={newGame.notes}
            onChange={(e) => setNewGame({ ...newGame, notes: e.target.value })}
          />
          <button onClick={addGame} className="add-button">
            Add Game
          </button>
        </div>
      </div>

      <div className="games-section">
        <h2>Game History ({games.length} games)</h2>
        <div className="games-table">
          <div className="table-header">
            <div>Date</div>
            <div>Mercy Banned</div>
            <div>Result</div>
            <div>Notes</div>
            <div>Actions</div>
          </div>
          {games.slice().reverse().map(game => (
            <div key={game.id} className="table-row">
              <div>{new Date(game.date).toLocaleDateString()}</div>
              <div>
                <button
                  className={`mercy-toggle ${game.mercyBanned ? 'banned' : 'not-banned'}`}
                  onClick={() => toggleMercyBan(game.id)}
                >
                  {game.mercyBanned ? '🚫 Banned' : '✅ Not Banned'}
                </button>
              </div>
              <div>
                <button
                  className={`result-toggle ${game.won ? 'won' : 'lost'}`}
                  onClick={() => toggleGameResult(game.id)}
                >
                  {game.won ? '🏆 Win' : '💀 Loss'}
                </button>
              </div>
              <div className="notes">{game.notes || '-'}</div>
              <div>
                <button
                  className="delete-button"
                  onClick={() => deleteGame(game.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {games.length === 0 && (
            <div className="no-games">
              No games recorded yet. Add your first game above!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

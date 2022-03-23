import './App.css'
import Canvas from './Canvas'
import useGameState from './hooks/useGameState'

function App() {
  const gameStateRef = useGameState()

  return (
    <div className="App">
      <Canvas gameStateRef={gameStateRef} />
    </div>
  )
}

export default App

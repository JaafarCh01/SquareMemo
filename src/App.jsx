import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ChessTrainer from './components/ChessTrainer'

function App() {
  const [count, setCount] = useState(0)

  return (

      <div className="max-w-2xl mx-auto p-4">
      <ChessTrainer />
    </div>

  )
}

export default App

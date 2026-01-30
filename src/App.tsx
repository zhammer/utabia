import { useState } from 'react'
import WavesBackground from './components/WavesBackground'

export default function App() {
  const [entered, setEntered] = useState(false)

  if (!entered) {
    return (
      <div className="entry-screen" onClick={() => setEntered(true)}>
        <div className="entry-text">click to enter</div>
      </div>
    )
  }

  return (
    <div className="app">
      <WavesBackground />
    </div>
  )
}

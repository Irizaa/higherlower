import React from 'react'
import {useNavigate} from 'react-router'
import './Home.css'
import BGVideo from '../../Assets/mall.mp4'

const Home = () => {
  const navigate = useNavigate()
  const gameRedirect = () => {
    navigate('/play')
  }
  return (
    <div className="App">
      <div className = 'overlay'/>
      <video id = 'home-video' src = {BGVideo} autoPlay loop muted/>
      <header className="App-header">
        <h2>
         🥊PRICE FIGHT🥊
        </h2>
        <p>
          choose the item with the higher price - try to beat your personal best.
        </p>
        <button onClick={gameRedirect} class="button-1" role="button">PLAY</button>
      </header>
    </div>
  )
}

export default Home
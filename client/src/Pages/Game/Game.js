import React from 'react'
import './Game.css'
import { useState, useEffect } from 'react';
import axios from 'axios'
const Game = () => {
  const [count, setCount] = useState(0)
  const [showOptions, setShowOptions] = useState(false)
  const [showImages, setShowImages] = useState(false)
  const [score, setScore] = useState(0)
  const [leftItem, setLeftItem] = useState(null)
  const [rightItem, setRightItem] = useState(null)
  const [showGameOver, setShowGameOver] = useState(false)
  let i = 0
  
  // upon user guess, ramp-up right price from 0 to actual value & set button to represent correct/incorrect
  const showPrice = (leftPrice, rightPrice, choice) => {
    let correct
    if((choice === 'higher' && rightPrice >= leftPrice) || (choice === 'lower' && rightPrice <= leftPrice)) {
      correct = true
    } else {
      correct = false
    }
    document.getElementById('right-price').style.fontSize = 'calc(15px + 2vmin)'
    const intervalId = setInterval(() => {
      setCount((count) => count + 1);
      i++
      if(i >= rightItem?.price) {
        document.getElementById('vs-button').style.fontSize = 0
        document.getElementById('vs-button').style.padding = '35px'
        if(correct === true) {
          document.getElementById('vs-button').style.backgroundColor = '#32de84'
        } else {
          document.getElementById('vs-button').style.backgroundColor = '#D2122E'
        }
        clearInterval(intervalId)
        handleButton(correct)
      }
    }, 10);
    return () => {
      clearInterval(intervalId);
    };
  }
  // Return everything back to original state & update variables.
  const handleButton = (correct) => {
    if(correct) setShowImages(false)
    const timer = setTimeout(() => {
      setShowImages(true)
      document.getElementById('options').style.display = 'flex'
      document.getElementById('vs-button').style.backgroundColor = '#fff'
      document.getElementById('vs-button').style.fontSize = '26px'
      document.getElementById('vs-button').style.padding = '20px'
      if(correct) {
        setLeftItem(rightItem)
        axios.get('http://localhost:3001/api/data?limit=1')
        .then(response => {
          setRightItem(response.data[0])
          setCount(0)
          document.getElementById('right-price').style.fontSize = '0'
        })
        .catch(err => console.error(err))
      } else {  
        document.getElementById('vs-button').style.display = 'none'
        document.getElementById('gameover').style.opacity = '1'
      }
    }, 1500);
    return () => clearTimeout(timer);
  }
  // Check if user is correct/incorrect - handle accordingly & update high-score.
  const handleUserClick = (leftPrice, rightPrice, choice) => {
    document.getElementById('options').style.display = 'none'
    leftPrice = parseInt(leftPrice)
    rightPrice = parseInt(rightPrice)
    showPrice(leftPrice, rightPrice, choice)

    if((choice === 'higher' && rightPrice >= leftPrice) || (choice === 'lower' && rightPrice <= leftPrice)) {
      setScore(score + 1)
    } else {
      setShowGameOver(true)
    }
    if(score >= localStorage.getItem('high_score')) localStorage.setItem('high_score', score + 1)
  }
  const resetGame = () => {
    setShowImages(false)
    document.getElementById('gameover').style.opacity = '0'
    document.getElementById('vs-button').style.display = 'inline-block'
    document.getElementById('right-price').style.fontSize = '0'
    gameOverHelper()
  }
  const gameOverHelper = () => {
    const timer = setTimeout(() => {
      axios.get('http://localhost:3001/api/data?limit=2')
    .then(response => {
      setLeftItem(response.data[0])
      setRightItem(response.data[1])
    })
      setShowImages(true)
      setScore(0)
      setCount(0)
      setShowGameOver(false)
    }, 1500)
    return () => clearTimeout(timer);
  }
  const handleMouseEnter = () => {
    setShowOptions(true)
  }
  const handleMouseLeave = (e) => {
    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
      setShowOptions(false);
    }
  }
  useEffect(() => {
    axios.get('http://localhost:3001/api/data?limit=2')
    .then(response => {
      setLeftItem(response.data[0])
      setRightItem(response.data[1])
    })
    .catch(err => console.error(err))
    const timer = setTimeout(() => {
      setShowImages(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="Game"  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

      <p className = 'left-text'>
        {leftItem?.name}<br/>
        {<h3>{`$${Math.trunc(leftItem?.price)}`}</h3>}
      </p>

      <p className = 'right-text'>
        {rightItem?.name}<br/>
        {<h3 id = 'right-price'>{`$${count}`}</h3>}
      </p>

      <div className='container'>

        <div className="item-image">
          <img src= {leftItem?.image} alt="1" className={`image left ${showImages ? 'show' : ''}`} />
        </div>

        <button id="vs-button">VS</button>

        <img src= {rightItem?.image} alt="Image 2" className={`image right ${showImages ? 'show' : ''}`} />
        </div>

        {showOptions && (
        <div id="options">
          <button onClick={() => handleUserClick(leftItem?.price, rightItem?.price, 'higher')}>Higher</button>
          <button onClick = {() => handleUserClick(leftItem?.price, rightItem?.price, 'lower')}>Lower</button>
        </div>
      )}
      {showGameOver && (
        <div id = 'gameover'>
          <h4>{`score: ${score}`}</h4>
          <h4>{`high-score: ${localStorage.getItem('high_score')}`}</h4>
          <h2>YOU LOST</h2>
          <p>... but you can always try again</p>
          <button class = 'button-slide slide-left' onClick = {() => resetGame()}>PLAY AGAIN</button>
        </div>
      )}
      
      <div class="footer">
        <p id = 'footer-left'>{`Score: ${score}`}</p>
        <p id = 'footer-right'>{`High-Score: ${localStorage.getItem('high_score')}`}</p>
      </div>
    </div>
  );
}

export default Game
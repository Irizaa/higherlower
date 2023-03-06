import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Game from './Pages/Game';

function App() {
  if(!localStorage.getItem('high_score')) localStorage.setItem('high_score', 0)
  return (
    <Router>
      <Routes>
        <Route path = '*' element = {<Home/>}/>
        <Route path = '/play' element = {<Game/>}/>
      </Routes>
    </Router>
  );
}

export default App;

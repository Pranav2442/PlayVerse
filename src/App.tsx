import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './components/GameHub';
import GameWrapper from './components/GameWrapper';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/game/:gameId" element={<GameWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
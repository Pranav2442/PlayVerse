import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameHub from './components/GameHub';
import GameWrapper from './components/GameWrapper';
import ClarityAnalytics from './components/ClarityAnalytics';

function App() {
  return (
    <Router>
      <div className="App">
      <ClarityAnalytics clarityProjectId="sa7e97r716" />{" "}
        <Routes>
          <Route path="/" element={<GameHub />} />
          <Route path="/game/:gameId" element={<GameWrapper />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
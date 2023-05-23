import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayerDetail from './PlayerDetail';
import data from './combined_rankings.json';
import './styles.css';
import AdImage1 from './AdImage1.png';
import AdImage2 from './AdImage2.png';


const FlyingRackets = () => {
  const rackets = Array.from({ length: 2 });

  return (
    <div className="flying-rackets">
      {rackets.map((_, index) => {
        const animationDuration = 20;
        const left = Math.random() * 150;
        const top = Math.random() * 150;

        return (
          <div
            key={index}
            className="racket"
            style={{
              animation: `flyAndRotate ${animationDuration}s linear infinite`,
              left: `${left}%`,
              top: `${top}%`,
            }}
          >
            🏸
          </div>
        );
      })}
    </div>
  );
};

const Sidebar = ({ side }) => {
  const adImage = side === 'left' ? AdImage1 : AdImage2;
  return (
    <div className={`sidebar ${side}`}>
      <h3></h3>
      <img src={adImage} alt="Advertisement" />
    </div>
  );
};


const PlayerList = () => {
  const [search, setSearch] = React.useState('');
  const filteredData = data.filter(
    (player) =>
      player.Navn.toLowerCase().includes(search.toLowerCase()) ||
      player.Klubb.toLowerCase().includes(search.toLowerCase())
  );
  const results = filteredData.slice(0, 20);
  const isSearching = search.length > 0; // Check if user is searching

  return (
    <div className="PlayerList">
      <h1>Rankinglista slik den burde være🏸</h1>
      <input
        type="text"
        placeholder="Søk etter spiller eller klubb"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isSearching ? (
        <h2>
        Anne-Elisabeth Hagen... <span className="rotating-emoji">🔍</span>
        </h2>
      ) : (
        <h2>Største tryhards i Norge for øyeblikket 🤩</h2>
      )}
      <div className="player-list">
        {results.map((item) => (
          <div key={item.Rangering} className="player-item">
            <span className="ranking">{item.Rangering}.</span>
            <Link to={`/player/${encodeURIComponent(item.Navn)}`}>
              {item.Navn}
            </Link>
            : {item.Klubb} - {item.Poeng}
          </div>
        ))}
      </div>
      <Changelog />
    </div>
  );
};


const Changelog = () => {
  return (
    <div className="Changelog">
      <h3>Updaaates💪</h3>
      <ul>
        <li>Version 1.0.0 (05/2023): Sammenlagtliste, med spillersøk/klubbsøk. Mer funksjonalitet kommer</li>
      </ul>
    </div>
  );
};

const App = () => (
  <Router>
    <FlyingRackets />
    <Sidebar side="left" />
    <Sidebar side="right" />
    <div className="main-content">
      <Routes>
        <Route path="/" element={<PlayerList />} />
        <Route path="/player/:name" element={<PlayerDetail />} />
      </Routes>
    </div>
  </Router>
);

export default App;
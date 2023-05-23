import React, { useState } from 'react';
import data from './combined_rankings.json';  // import the JSON data
import SearchBar from './Search_Bar';

// Component to display a single player's information
const Player = ({ player }) => (
    <div>
      <h2>{player.Navn}</h2>
      <p>Rank: {player["Plass."]}</p>
      <p>Class: {player.Klasse}</p>
      <p>Points: {player.Poeng}</p>
    </div>
  );


// Component to display the list of players
const Rankings = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const onSearch = (term) => {
      setSearchTerm(term.toLowerCase());
    };

    return (
      <div>
        <SearchBar onSearch={onSearch} />
        {data
          .filter(player => player.Navn.toLowerCase().includes(searchTerm))
          .sort((a, b) => a["Plass."] - b["Plass."])
          .map((player, index) => <Player key={index} player={player} />)}
      </div>
    );
  };


export default Rankings;
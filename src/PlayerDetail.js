import React from 'react';
import { useParams, Link } from 'react-router-dom';
import data from './combined_rankings.json';

const PlayerDetail = () => {
  const { name } = useParams();
  const playerName = decodeURIComponent(name);
  const playerData = data.find((player) => player.Navn === playerName);

  return (
    <div>
      {playerData ? (
        <div>
          <h1>{playerData.Navn}</h1>
          <p>
            {playerData.Navn}, har {playerData.Poeng} rankingpoeng, <b>og er rangert som nummer {playerData.Rangering} i Norge</b>, fordelt på alle klasser
          </p>
          <p>Klubb: <b>{playerData.Klubb}</b></p>
          <Link to="/">Tilbake</Link>
        </div>
      ) : (
        <p>Player not found</p>
      )}
    </div>
  );
};

export default PlayerDetail;
// App.js
import React, { useState } from "react";
import { players, initialResults } from "./data";
import LeagueTable from "./LeagueTable";
import "./App.css"

function App() {
  const initialPlayerStats = players.map((player) => ({
    name: player,
    played: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winPercentage: 0,
  }));

  const [standings, setStandings] = useState(initialPlayerStats);
  const [results, setResults] = useState(initialResults);
  const [datePlayed, setDatePlayed] = useState(""); // New state for date played

  // Initialize the initial selected player for each dropdown
  const initialSelectedPlayer = "Select Player";
  const initialSelectedPlayers = Array.from({ length: 10 }, () => initialSelectedPlayer);
  const [selectedPlayers, setSelectedPlayers] = useState(initialSelectedPlayers);

  const updateStandings = (winners, losers, isDraw) => {
    // Update the statistics for winners (increment wins) and losers (increment losses)
    const updatedStandings = [...standings];

    if (!isDraw) {
      winners.forEach((winner) => {
        const player = updatedStandings.find((p) => p.name === winner);
        if (player) {
          player.wins += 1;
          player.played += 1;
        }
      });

      losers.forEach((loser) => {
        const player = updatedStandings.find((p) => p.name === loser);
        if (player) {
          player.losses += 1;
          player.played += 1;
        }
      });
    } else {
      // If it's a draw, increment draws for all players involved
      winners.concat(losers).forEach((playerName) => {
        const player = updatedStandings.find((p) => p.name === playerName);
        if (player) {
          player.draws += 1;
          player.played += 1;
        }
      });
    }

    // Calculate win percentages and round to 2 decimal places
    updatedStandings.forEach((player) => {
      if (player.played > 0) {
        player.winPercentage = ((player.wins) / (player.wins + player.losses)) * 100;
        player.winPercentage = player.winPercentage.toFixed(2);
      }
    });

    // Sort the standings based on winPercentage (highest to lowest)
    updatedStandings.sort((a, b) => b.winPercentage - a.winPercentage);

    setStandings(updatedStandings);
  };

  const handleMatchResult = () => {
    const winningTeam = [];
    const losingTeam = [];

    // Collect the selected players from the winning team dropdowns
    for (let i = 0; i < 5; i++) {
      const selectedPlayer = selectedPlayers[i];
      if (selectedPlayer !== "Select Player") {
        winningTeam.push(selectedPlayer);
      }
    }

    // Collect the selected players from the losing team dropdowns
    for (let i = 5; i < 10; i++) {
      const selectedPlayer = selectedPlayers[i];
      if (selectedPlayer !== "Select Player") {
        losingTeam.push(selectedPlayer);
      }
    }

    if (winningTeam.length === 5 && losingTeam.length === 5 && datePlayed) {
      updateStandings(winningTeam, losingTeam, false);
      setResults([...results, { winners: winningTeam, losers: losingTeam, datePlayed, isDraw: false }]);
      setDatePlayed(""); // Reset the date played input

      // Reset selected players to "Select Player"
      setSelectedPlayers(initialSelectedPlayers);
    } else {
      alert("Please select 5 players for each team and choose a date.");
    }
  };

  const handleDrawResult = () => {
    const selectedPlayersList = [];
  
    // Collect all selected players
    for (let i = 0; i < 10; i++) {
      const selectedPlayer = selectedPlayers[i];
      if (selectedPlayer !== "Select Player") {
        selectedPlayersList.push(selectedPlayer);
      }
    }
  
    if (selectedPlayersList.length === 10 && datePlayed) {
      // Update standings for all players in the selected draw
      updateStandings(selectedPlayersList, [], true);
      setResults([...results, { winners: selectedPlayersList.slice(0, 5), losers: selectedPlayersList.slice(5), datePlayed, isDraw: true }]);
      setDatePlayed(""); // Reset the date played input
  
      // Reset selected players to "Select Player"
      setSelectedPlayers(initialSelectedPlayers);
    } else {
      alert("Please select 5 players for each team and choose a date.");
    }
  };
  
  

  // Handle changes in dropdown selections
  const handlePlayerSelect = (index, playerName) => {
    const updatedSelectedPlayers = [...selectedPlayers];
    updatedSelectedPlayers[index] = playerName;
    setSelectedPlayers(updatedSelectedPlayers);
  };

  return (
    <div className="App">
      <h1>Five-a-side Football League</h1>
      {/* Sort standings based on winPercentage (highest to lowest) */}
      <LeagueTable standings={standings} />
      {/* Add a form for entering match results */}
      <div className="match-form">
        <h2>Enter Match Result</h2>
        <div>
          <h3>Winning Team</h3>
          {Array.from({ length: 5 }).map((_, index) => (
            <select
              key={index}
              value={selectedPlayers[index]}
              onChange={(e) => handlePlayerSelect(index, e.target.value)}
              name="winner"
            >
              <option disabled value="Select Player">Select Player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div>
          <h3>Losing Team</h3>
          {Array.from({ length: 5 }).map((_, index) => (
            <select
              key={index}
              value={selectedPlayers[index + 5]}
              onChange={(e) => handlePlayerSelect(index + 5, e.target.value)}
              name="loser"
            >
              <option disabled value="Select Player">Select Player</option>
              {players.map((player) => (
                <option key={player} value={player}>
                  {player}
                </option>
              ))}
            </select>
          ))}
        </div>
        {/* Add date picker for date played */}
        <div>
          <h3>Date Played</h3>
          <input
            type="date"
            value={datePlayed}
            onChange={(e) => setDatePlayed(e.target.value)}
          />
        </div>
        <button onClick={handleMatchResult}>Submit Result</button>
        {/* Add Draw button */}
        <button onClick={handleDrawResult}>Draw</button>
      </div>
      {/* Add a Results page */}
      <div className="results">
        <h2>Match Results</h2>
        <ul>
          {results.map((result, index) => (
            <li key={index}>
              {result.isDraw ? (
                `${result.winners.join(", ")} drew with ${result.losers.join(", ")} on ${result.datePlayed}`
              ) : (
                `${result.winners.join(", ")} defeated ${result.losers.join(", ")} on ${result.datePlayed}`
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

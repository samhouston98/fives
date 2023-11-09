// LeagueTable.js
import React from "react";

function LeagueTable({ standings }) {
  return (
    <div className="league-table">
      <h2>League Table</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Played</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((playerData, index) => (
            <tr key={index}>
              <td>{playerData.name}</td>
              <td>{playerData.played}</td>
              <td>{playerData.wins}</td>
              <td>{playerData.losses}</td>
              <td>{playerData.draws}</td>
              <td>{playerData.winPercentage}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeagueTable;

import React from "react";

export default function Scoreboard(props) {
  return (
    <div className="Scoreboard">
      <div className="stats-container">
        <div className="time-best">
          <p>Best time:&nbsp;</p>
          <p className="gradient-text">{props.bestTime / 100}s</p>
        </div>
      </div>
    </div>
  );
}
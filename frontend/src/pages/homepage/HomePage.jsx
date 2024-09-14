import React from "react";
import GameModes from "./GameModes";
import Leaderboard from "./Leaderboard";
import "../../styles/Homepage.css";

const HomePage = () => {
  return (
    <div className="homepage">
      <div className="main-content">
        <GameModes />
        <Leaderboard />
      </div>
    </div>
  );
};

export default HomePage;

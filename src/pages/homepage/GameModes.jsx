import React from "react";
import LoginSignUp from "../homepage/LoginSignUp";
import { useNavigate } from "react-router-dom";
import gameIcon from "../../assets/game_icon.jpg";

const GameModes = () => {
  const navigate = useNavigate();

  const handleGameModeClick = (mode) => {
    navigate(`/game/${mode}`);
  };
  return (
    <div className="game-container">
      <div className="icon">
        <img src={gameIcon} alt="game icon" id="game-icon" />
      </div>
      <div className="game-modes">
        <h1>
          <span>Game</span>
          <span>Modes</span>
        </h1>
        <div className="btn-stack">
          <button
            className="btn"
            onClick={() => handleGameModeClick("beginner")}
          >
            Beginner
          </button>
          <button className="btn" onClick={() => handleGameModeClick("pro")}>
            Pro
          </button>
          <button
            className="btn"
            onClick={() => handleGameModeClick("endless")}
          >
            Endless
          </button>
        </div>
      </div>
      <LoginSignUp />
    </div>
  );
};

export default GameModes;

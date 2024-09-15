import React from "react";

const Scores = ({ score, timer, hiscore }) => {
  return (
    <div className="game-info">
      <p className="score-info">Score: {score}</p>
      {timer === "Congratulations!!!" || timer === "Timed Out!!" ? (
        <p className="timer-info">{timer}</p>
      ) : (
        <p className="timer-info">Time Left: {timer}s</p>
      )}
      <p className="hi-score-info">Hi-Score: {hiscore}</p>
    </div>
  );
};

export default Scores;

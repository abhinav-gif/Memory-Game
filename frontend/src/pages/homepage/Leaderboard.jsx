import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Leaderboard.css";

const Leaderboard = () => {
  
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("https://memory-game-shram.vercel.app/leaderboard");
        setTopUsers(res.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const firstFive = topUsers.slice(0, 5);
  const nextFive = topUsers.slice(5, 10);

  return (
    <div className="leaderboard">
      <h1>Leaderboard</h1>
      <div className="leaderboard-container">
        {/* First column */}
        <div className="leaderboard-column">
          <ol>
            {firstFive.map((user, index) => (
              <li key={index}>
                {index + 1}. {user.name}
                <span className="high-score">High Score: {user.highScore}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Second column */}
        <div className="leaderboard-column">
          <ol>
            {nextFive.map((user, index) => (
              <li key={index + 5}>
                {index + 6}. {user.name}
                <span className="high-score">High Score: {user.highScore}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

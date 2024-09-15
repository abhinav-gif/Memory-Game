import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiEndpoint } from "../../App";
import "../../styles/MemoryGame.css";

// Import images
import apple from "../../assets/apple.jpg";
import avacado from "../../assets/avacado.jpg";
import banana from "../../assets/banana.jpg";
import pineapple from "../../assets/pineapple.jpg";
import pomegranate from "../../assets/pomegranate.jpg";
import watermelon from "../../assets/watermelon.jpg";
import cover from "../../assets/cover.jpg";
import gameIcon from "../../assets/game_icon.jpg";

import Scores from "./Scores";

let images = [apple, avacado, banana, pineapple, pomegranate, watermelon]; // Add images
const generate_pairs = () => {
  const new_images = images.flatMap((img, index) => [
    {
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false,
    },
    {
      id: index,
      image: img,
      isFlipped: false,
      isMatched: false,
    },
  ]);
  return new_images;
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // destructuring to pick two random i,j obj and swapping them
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const pairs = generate_pairs();
const shuffled_arr = shuffleArray(pairs);

const MemoryGame = () => {
  // route param
  const { mode, id } = useParams();

  // use states
  const [cards, setCards] = useState(shuffled_arr);
  const [matchValue, setMatchValue] = useState({
    originIndx: -1,
    prevFlippedIndx: -1,
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [flashed, setFlashed] = useState(false);
  const [countSelected, setCountSelected] = useState(0);
  const [score, setScore] = useState(0);
  const [hiscore, setHiScore] = useState(0);

  const [timer, setTimer] = useState(60);

  const scoreRef = useRef(score);
  const idRef = useRef(id);

  // fetch high score
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`${apiEndpoint}/hiscore`, {
          params: { id: idRef.current },
        });
        setHiScore(res.data);
      } catch (error) {
        console.error("Error fetching Hi Score:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // set timer for the game
  useEffect(() => {
    if (gameStarted && flashed) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      if (timer === 0) {
        clearInterval(timerInterval);
        setTimer("Timed Out!!");
        setGameStarted(false); // Stop the game when the timer reaches 0
      }

      return () => clearInterval(timerInterval);
    }
  }, [gameStarted, timer, flashed]);

  // update refrence variables
  useEffect(() => {
    scoreRef.current = score;
    idRef.current = id;
  }, [score, id]);

  // Flash cards at start
  useEffect(() => {
    if (gameStarted) {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, isFlipped: true }))
      );

      const timer = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) => ({ ...card, isFlipped: false }))
        );
        setFlashed(true);
      }, 3000); // Show images for 3 seconds
      return () => clearTimeout(timer);
    } else {
      setFlashed(false);
      const updateHiscore = async () => {
        try {
          const res = await axios.patch(`${apiEndpoint}/hiscore`, {
            id: idRef.current,
            score: scoreRef.current,
          });
          if (res.data.flag) {
            setHiScore(scoreRef.current);
            setTimer("Congratulations!!!");
          }
        } catch (error) {
          console.error("Error updating Hi Score", error);
        }
      };
      updateHiscore();
    }
  }, [gameStarted]);
  // using ref variables to prevent rendering on every score change

  // img is used as a unique identifier to match cards
  const handleCardClick = (index, img) => {
    if (
      countSelected > 1 ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      !gameStarted
    ) {
      // Prevent clicks if processing or the card is already flipped or matched
      return;
    }
    // flipping on click
    const updated_cards = [...cards];
    updated_cards[index].isFlipped = true;
    setCards(updated_cards);
    setCountSelected(countSelected + 1);

    const match_indx = cards.findIndex((card) => card.image === img);
    if (match_indx === matchValue["originIndx"]) {
      // MATCHED
      const updated_cards = [...cards];
      updated_cards[index].isMatched = true;
      updated_cards[matchValue["prevFlippedIndx"]].isMatched = true;
      setCards(updated_cards);
      setScore(score + 10);

      // Check if all cards are matched
      if (updated_cards.every((card) => card.isMatched)) {
        setTimer("Congratulations!!!");
        setGameStarted(false);
      }

      // reset
      setMatchValue({ originIndx: -1, prevFlippedIndx: -1 });
      setCountSelected(0);
    } else if (matchValue["originIndx"] === -1) {
      // FOR THE 1ST PICK
      setMatchValue({ originIndx: match_indx, prevFlippedIndx: index });
    } else {
      // WRONG MATCH
      setTimeout(() => {
        const updated_cards = [...cards];
        updated_cards[index].isFlipped = false;
        updated_cards[matchValue["prevFlippedIndx"]].isFlipped = false;
        setCards(updated_cards);
        setCountSelected(0);
        setMatchValue({ originIndx: -1, prevFlippedIndx: -1 });
      }, 1000);
    }
  };

  // Handle end of game
  // const handleEndGame = async (message) => {
  //   setTimer(message);
  //   setGameStarted(false);

  //   // Send score to server
  //   try {
  //     const userId = "66e587c7f232b6ac2e271f50";
  //     const response = axios.patch(`/api/user/${userId}/highscore`, {
  //       highScore: score,
  //     });
  //     const result = await response.json();
  //     console.log(result);
  //   } catch (error) {
  //     console.error("Error updating high score:", error);
  //   }
  // };

  const handleStartGame = () => {
    const pairs = generate_pairs();
    const shuffled_arr = shuffleArray(pairs);
    setCards(shuffled_arr);
    setGameStarted(true);
    setScore(0);
    setTimer(60);
  };

  const handleQuitGame = () => {
    setTimer("Timed Out!!");
    setGameStarted(false);
  };

  const navigate = useNavigate();

  return (
    <div className="game">
      <div className="button-row">
        <button onClick={() => navigate(`/`)}>Main Menu</button>
        <img src={gameIcon} alt="game icon" />
        {!gameStarted && <button onClick={handleStartGame}>Start Game</button>}
        {gameStarted && <button onClick={handleQuitGame}>Quit Game</button>}
      </div>
      <Scores score={score} timer={timer} hiscore={hiscore} />
      <div className="grid">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`card ${
              card.isFlipped || card.isMatched ? "flipped" : ""
            }`}
            onClick={() => handleCardClick(index, card["image"])}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="card-inner">
                <div className="card-front">
                  <img src={card.image} alt="card" />
                </div>
              </div>
            ) : (
              <div className="card-back">
                <img src={cover} alt="card cover" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;

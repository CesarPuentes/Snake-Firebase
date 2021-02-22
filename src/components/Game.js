import React, {useRef, useState, useEffect} from 'react'
import { useInterval } from './game_components/useIntervals'
import { useAuth } from "../contexts/AuthContext"
import { db } from "../firebase";
import { Link } from "react-router-dom"

import {CANVAS_SIZE,
    SNAKE_START,
    APPLE_START,
    SCALE,
    SPEED,
    DIRECTIONS} from './game_components/constants'

const Game = () => {
    const canvasRef = useRef();
    const { currentUser, updateScore } = useAuth()
    const [data, setdbData] = useState([]);
    const [snake, setSnake] = useState(SNAKE_START);
    const [apple, setApple] = useState(APPLE_START);
    const [dir, setDir] = useState([0, -1]);
    const [speed, setSpeed] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    let [turn, setTurn] = useState();
    let [score, setScore] = useState(0);
    console.log("Turn: " + turn)

    useInterval(() => gameLoop(), speed);
  
    const endGame = () => {
      setSpeed(null);
      setGameOver(true);
    };
  
    const moveSnake = ({ keyCode }) =>{
      console.log(keyCode)
      if ((keyCode == 37)){
        if(turn=="right")
        {
          //pass
        }
        else
        {
          setDir(DIRECTIONS[keyCode])   
          setTurn("left") 
        }

      }
      else if (keyCode == 38){
        if(turn=="down")
        {
          //pass
        }
        else
        {
          setDir(DIRECTIONS[keyCode])
          setTurn("up")
        }

      }
      else if (keyCode == 39)
      {
        if(turn=="left")
        {
          //pass
        }
        else
        {
          setDir(DIRECTIONS[keyCode])
          setTurn("right")
        }
        
      }
      else if (keyCode == 40){
        if(turn=="up")
        {
          //pass
        }
        else
        {
          setDir(DIRECTIONS[keyCode])
          setTurn("down")
        }

      }
      else{
        console.log("Weird thing happened!")
        //pass
      }
      //keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
    }

      
  
    const createApple = () =>
      apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));
  
    const checkCollision = (piece, snk = snake) => {
      if (
        piece[0] * SCALE >= CANVAS_SIZE[0] ||
        piece[0] < 0 ||
        piece[1] * SCALE >= CANVAS_SIZE[1] ||
        piece[1] < 0
      )
      {
        updateScore(currentUser.email, score);
        return true;
      }
        
  
      for (const segment of snk) {
        if (piece[0] === segment[0] && piece[1] === segment[1]) {
          updateScore(currentUser.email, score);
          return true
        };
      }
      return false;
    };
  
    const checkAppleCollision = newSnake => {
      if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
        let newApple = createApple();
        score = setScore(score + 100);
        while (checkCollision(newApple, newSnake)) {
          newApple = createApple();
        }
        setApple(newApple);
        return true;
      }
      return false;
    };
  
    const gameLoop = () => {
      const snakeCopy = JSON.parse(JSON.stringify(snake));
      const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
      snakeCopy.unshift(newSnakeHead);
      if (checkCollision(newSnakeHead)) endGame();
      if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
      setSnake(snakeCopy);
    };
  
    const startGame = () => {
      setTurn("") 
      score = setScore(0);
      setSnake(SNAKE_START);
      setApple(APPLE_START);
      setDir([0, -1]);
      setSpeed(SPEED);
      setGameOver(false);

    };

    //get data from db
    const getDataFirebase = async (user) => {
      await db.collection("scores").doc(currentUser.email).onSnapshot((querySnapshot) => {
        setdbData(querySnapshot.data());
      });
    };
  
  
    useEffect(() => {
      const context = canvasRef.current.getContext("2d");
      context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "pink";
      snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
      context.fillStyle = "lightblue";
      context.fillRect(apple[0], apple[1], 1, 1);
      getDataFirebase(currentUser.mail)
    }, [snake, apple, gameOver]);
    
  
    return (
      <div role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
        <h1>Previous Score: {data.score} </h1>
        <h1>Score: {score}</h1>
        <canvas
          style={{ border: "1px solid black" }}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
        />
        {gameOver && <div>GAME OVER!</div>}
        <button onClick={startGame}>Start Game</button>
        <button>
          <Link to="/">
            Go back to dahsboard
          </Link>
          </button>
      </div>
    );
  };
  

export default Game;
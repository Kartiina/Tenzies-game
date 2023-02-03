import React from 'react'
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
import Scoreboard from './Scoreboard'

export default function App(){
  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)

  const [bestTime, setBestTime] = React.useState(
    JSON.parse(localStorage.getItem("bestTime")) || 0
  );

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue){
      setTenzies(true)
      setStart(false);
      setRecord();
    }
  }, [dice])

  function setRecord() {
    const timeFloored = Math.floor(time / 10);
    if (!bestTime || timeFloored < bestTime) {
      setBestTime(timeFloored);
    }
  }

  React.useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
  }, [bestTime]);

  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice(){
    const newDice = []
    for(let i = 0; i< 10; i++){
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice(){
    if (!tenzies){
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? 
          die :
          generateNewDie()
      }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
      setStart(true);
      setTime(0);
    }
  }

  function holdDice(id){
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
        {...die, isHeld: !die.isHeld} : 
        die
    }))
  }

  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value } 
      isHeld={die.isHeld} 
      holdDice={() => holdDice(die.id)}
    />
  ))
  // ----------------TIMER-------------------- //
  const [time, setTime] = React.useState(0);
  const [start, setStart] = React.useState(true);

  React.useEffect(() => {
    let interval = null;
    if (start) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [start]);

  return(
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze 
      it at its current value between rolls.</p>
      <div className="stats-container">
          <p>
            Timer: {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
            {("0" + ((time / 10) % 1000)).slice(-2)}
          </p>
          <Scoreboard bestTime={bestTime} />
      </div>
      <div className="dice--container">
        {diceElements}
      </div>
      <button 
        className="roll-dice" 
        onClick={rollDice}
      >
        {tenzies ? "New game" : "Roll"}
      </button>
    </main>
  )
}
import React, { useEffect } from 'react';
import { nanoid } from 'nanoid';
import Confetti from 'react-confetti';
import "./tenzies.css";
import Die from "./components/Die";

export default function App() {
    const [numArray, setNumArray] = React.useState(generateAllNewDice);
    const buttonRef = React.useRef(null);


    const [windowSize, setWindowSize] = React.useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    React.useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const gameWon = numArray.every(die => die.isHeld) && numArray.every(die => die.value === numArray[0].value);

    useEffect(() => {
        if(gameWon) {
            buttonRef.current.focus()
        }
    }, [gameWon])

    function generateAllNewDice() {
        return new Array(10)
            .fill(0)
            .map(() => ({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }));
    }

    function rollDice() {
        if (!gameWon) {
            setNumArray(prevRoll => prevRoll.map((roll) => {
                return roll.isHeld ? roll : { ...roll, value: Math.ceil(Math.random() * 6) };
            }));
        } else {
            setNumArray(generateAllNewDice)
        }
    }

    function hold(id) {
        setNumArray(prevNum => prevNum.map((num) => {
            return num.id === id ? { ...num, isHeld: !num.isHeld } : num;
        }));
    }

    const renderNumArray = numArray.map((dieObj) => (
        <div key={dieObj.id}>
            <Die
                value={dieObj.value}
                isHeld={dieObj.isHeld}
                hold={hold}
                id={dieObj.id}
            />
        </div>
    ));

    return (
        <main>
            {gameWon && <Confetti width={windowSize.width} height={windowSize.height} />}
            <div aria-live="polite" className="sr-only">
                {gameWon && <p>Congratulations! You won! Press "New Game" to start again</p>}
            </div>
            <div className="header-container">
                <h1 className="title">Tenzies</h1>
                <p className="instructions">
                    Roll until all dice are the same.
                    Click each die to freeze it at its current value between rolls.
                </p>
            </div>

            <div className="container">
                {renderNumArray}
            </div>

            <button ref={buttonRef} onClick={rollDice} className="roll-btn">
                {gameWon ? "New Game" : "Roll"}
            </button>

            
        </main>
    );
}

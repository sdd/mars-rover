import React, { useState, useEffect } from 'react';
import { unstable_renderSubtreeIntoContainer } from 'react-dom';
import { Err, None, Result } from 'ts-results';
import './App.css';
import { runGame } from './model/executor';
import { formatRobotState } from './model/formatter';
import type { GameInput, RobotState } from './model/model';
import { GameInputParseError, parseInput, parseRobotInput } from './model/parser';

interface AppProps {}

function App({}: AppProps) {
    const [inputText, setInputText] = useState('');
    const [gameInput, setGameInput] = useState<Result<GameInput, GameInputParseError>>(
        Err(GameInputParseError.GRID_CONFIG),
    );
    const [gameResult, setGameResult] = useState<RobotState[]>([]);

    function handleChangeInput(e: React.FormEvent<HTMLTextAreaElement>) {
        setInputText(e.currentTarget.value);

        const parsedInput = parseInput(e.currentTarget.value);
        setGameInput(parsedInput);
        setGameResult([]);
    }

    function handleClickRun() {
        if (gameInput.ok) {
            const outcome = runGame(gameInput.val);
            setGameResult(outcome);
        }
    }

    const validationText = gameInput.ok ? '✅' : `❌ (${gameInput.val})`;
    const outputText = gameResult.map(formatRobotState).join('\n');

    return (
        <div className="App">
            <header>
                <h1>Martian Robots</h1>
            </header>
            <main>
                <div className="left" />
                <div className="input-output">
                    <h2>Input</h2>
                    <textarea value={inputText} onChange={handleChangeInput} />
                    <div className="input-status">
                        Valid input: {validationText}
                        <button onClick={handleClickRun} disabled={gameInput.err}>
                            Run
                        </button>
                    </div>

                    <h2>Output</h2>
                    <textarea value={outputText} readOnly />
                </div>
                <div className="right" />
            </main>
        </div>
    );
}

export default App;

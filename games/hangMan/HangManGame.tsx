//HangManGame.tsx
import React from 'react';
import { useHangmanLogic } from './HangManLogic';
import { HangmanDrawing } from './HangmanDrawing';
import { HangmanWord } from './HangmanWord';
import { Keyboard } from './Keyboard';

export function HangManGame() {
  const {
    wordToGuess,
    guessedLetters,
    incorrectLetters,
    isLoser,
    isWinner,
    score,
    isGameOver,
    addGuessedLetter,
    restartGame,
  } = useHangmanLogic();

  return (
    <div
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '0 auto',
        alignItems: 'center',
      }}
    >
      <div className='text-2xl font-bold'>Score: {score}</div>

      {isGameOver ? (
        <div className='text-center'>
          <h2 className='text-3xl font-bold mb-4'>Game Over!</h2>
          <p className='text-xl mb-4'>Final Score: {score}</p>
          <button
            onClick={restartGame}
            className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '2rem', textAlign: 'center' }}>
            {isWinner && 'Correct! Next word...'}
          </div>
          <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
          <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
          <div style={{ alignSelf: 'stretch' }}>
            <Keyboard
              disabled={isWinner || isLoser}
              activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
              inactiveLetters={incorrectLetters}
              addGuessedLetter={addGuessedLetter}
            />
          </div>
        </>
      )}
    </div>
  );
}

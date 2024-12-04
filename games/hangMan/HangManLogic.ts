import { useEffect, useState, useCallback } from 'react';

function getWord(): string {
  const words: string[] = require('./wordList.json');
  return words[Math.floor(Math.random() * words.length)];
}

export function useHangmanLogic() {
  const [wordToGuess, setWordToGuess] = useState(getWord);
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));
  const isLoser = incorrectLetters.length >= 6;
  const isWinner = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));

  const saveScore = async () => {
    if (scoreSaved) return;

    try {
      const response = await fetch('/api/scores/hang-man', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score }),
      });

      if (response.ok) {
        setScoreSaved(true);
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  useEffect(() => {
    if (isWinner) {
      setScore((prevScore) => prevScore + 1);
      setGuessedLetters([]);
      setWordToGuess(getWord());
    }
    if (isLoser) {
      setIsGameOver(true);
      saveScore();
    }
  }, [isWinner, isLoser]);

  const restartGame = () => {
    setScore(0);
    setGuessedLetters([]);
    setWordToGuess(getWord());
    setIsGameOver(false);
    setScoreSaved(false);
  };

  const addGuessedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) return;
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    },
    [guessedLetters, isWinner, isLoser]
  );

  return {
    wordToGuess,
    guessedLetters,
    incorrectLetters,
    isLoser,
    isWinner,
    score,
    isGameOver,
    addGuessedLetter,
    restartGame,
  };
}

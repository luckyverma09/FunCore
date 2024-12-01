import { useState, useCallback } from 'react';

const GRID_SIZE = 4;

const initializeGrid = () => {
  const grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(0));
  return addRandomTile(addRandomTile(grid));
};

const addRandomTile = (grid: number[][]) => {
  const emptyTiles = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) emptyTiles.push({ i, j });
    }
  }
  if (emptyTiles.length > 0) {
    const { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
  return grid;
};

const moveGrid = (grid: number[][], direction: 'left' | 'right' | 'up' | 'down') => {
  let score = 0;
  let moved = false;

  const rotateGrid = (grid: number[][]) => {
    const newGrid = grid[0].map((_, i) => grid.map((row) => row[i]));
    return direction === 'up' ? newGrid : newGrid.reverse();
  };

  const moveLeft = (row: number[]) => {
    const newRow = row.filter((tile) => tile !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow.splice(i + 1, 1);
        moved = true;
      }
    }
    while (newRow.length < GRID_SIZE) newRow.push(0);
    return newRow;
  };

  let newGrid = grid;
  if (direction === 'up' || direction === 'down') {
    newGrid = rotateGrid(grid);
  }

  newGrid = newGrid.map((row) => {
    const newRow = moveLeft(direction === 'right' ? row.reverse() : row);
    return direction === 'right' ? newRow.reverse() : newRow;
  });

  if (direction === 'up' || direction === 'down') {
    newGrid = rotateGrid(newGrid);
  }

  if (moved) {
    newGrid = addRandomTile(newGrid);
  }

  return { grid: newGrid, score, moved };
};

const canMove = (grid: number[][]) => {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) return true;
      if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return true;
      if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return true;
    }
  }
  return false;
};

export const useGame2048 = () => {
  const [grid, setGrid] = useState(initializeGrid);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const move = useCallback(
    (direction: 'left' | 'right' | 'up' | 'down') => {
      if (isGameOver) return;

      const { grid: newGrid, score: newScore, moved } = moveGrid(grid, direction);
      if (moved) {
        setGrid(newGrid);
        setScore((prevScore) => prevScore + newScore);
        if (!canMove(newGrid)) {
          setIsGameOver(true);
        }
      }
    },
    [grid, isGameOver]
  );

  const moveLeft = useCallback(() => move('left'), [move]);
  const moveRight = useCallback(() => move('right'), [move]);
  const moveUp = useCallback(() => move('up'), [move]);
  const moveDown = useCallback(() => move('down'), [move]);

  const resetGame = useCallback(() => {
    setGrid(initializeGrid());
    setScore(0);
    setIsGameOver(false);
  }, []);

  return {
    grid,
    score,
    isGameOver,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    resetGame,
  };
};

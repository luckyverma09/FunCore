// export class Game2048 {
//   board: number[][];

//   constructor() {
//     this.board = Array(4)
//       .fill(null)
//       .map(() => Array(4).fill(0));
//     this.spawnTile();
//     this.spawnTile();
//   }

//   spawnTile(): void {
//     const emptyCells: [number, number][] = this.board.flatMap((row, r) =>
//       row
//         .map((cell, c) => (cell === 0 ? ([r, c] as [number, number]) : null))
//         .filter((cell): cell is [number, number] => cell !== null)
//     );
//     if (emptyCells.length === 0) return;
//     const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
//     this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
//   }

//   move(direction: 'left' | 'right' | 'up' | 'down'): void {
//     const slide = (row: number[]): number[] => {
//       let newRow = row.filter((i) => i !== 0);
//       for (let i = 0; i < newRow.length - 1; i++) {
//         if (newRow[i] === newRow[i + 1]) {
//           newRow[i] *= 2;
//           newRow[i + 1] = 0;
//         }
//       }
//       newRow = newRow.filter((i) => i !== 0);
//       return newRow.concat(Array(4 - newRow.length).fill(0));
//     };

//     let rotated = false;
//     if (direction === 'left') {
//       this.board = this.board.map(slide);
//     } else if (direction === 'right') {
//       this.board = this.board.map((row) => slide(row.reverse()).reverse());
//     } else if (direction === 'up') {
//       this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
//       this.board = this.board.map(slide);
//       rotated = true;
//     } else if (direction === 'down') {
//       this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
//       this.board = this.board.map((row) => slide(row.reverse()).reverse());
//       rotated = true;
//     }

//     if (rotated) {
//       this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
//     }

//     this.spawnTile();
//   }

//   isWon(): boolean {
//     return this.board.some((row) => row.includes(2048));
//   }

//   isLost(): boolean {
//     if (this.board.some((row) => row.includes(0))) return false;
//     for (let r = 0; r < 4; r++) {
//       for (let c = 0; c < 4; c++) {
//         if (
//           (r < 3 && this.board[r][c] === this.board[r + 1][c]) ||
//           (c < 3 && this.board[r][c] === this.board[r][c + 1])
//         ) {
//           return false;
//         }
//       }
//     }
//     return true;
//   }
// }

export type Board = number[][];

export const createEmptyBoard = (): Board => {
  return Array.from({ length: 4 }, () => Array(4).fill(0));
};

export const addRandomTile = (board: Board): Board => {
  const emptyPositions: [number, number][] = [];
  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (cell === 0) emptyPositions.push([i, j]);
    })
  );

  if (emptyPositions.length === 0) return board;

  const [x, y] = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
  board[x][y] = Math.random() < 0.9 ? 2 : 4;

  return board;
};

export const slideRow = (row: number[]): number[] => {
  const filteredRow = row.filter((val) => val !== 0);
  const emptyCells = Array(row.length - filteredRow.length).fill(0);
  return [...filteredRow, ...emptyCells];
};

export const combineRow = (row: number[]): number[] => {
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row;
};

export const moveLeft = (board: Board): Board => {
  return board.map((row) => combineRow(slideRow(row)));
};

export const rotateBoard = (board: Board): Board => {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]).reverse());
};

export const moveRight = (board: Board): Board => {
  return board.map((row) => slideRow(combineRow(row.reverse())).reverse());
};

export const moveUp = (board: Board): Board => {
  return rotateBoard(moveLeft(rotateBoard(rotateBoard(rotateBoard(board)))));
};

export const moveDown = (board: Board): Board => {
  return rotateBoard(rotateBoard(rotateBoard(moveLeft(rotateBoard(board)))));
};

export const isGameOver = (board: Board): boolean => {
  const moves = [moveLeft, moveRight, moveUp, moveDown];
  return moves.every((move) => JSON.stringify(board) === JSON.stringify(move([...board])));
};

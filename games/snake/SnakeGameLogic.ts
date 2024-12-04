//SnakeGameLogic.ts
type Position = { x: number; y: number };

export interface SnakeGameLogic {
  gridSize: number;
  snake: Position[];
  food: Position;
  direction: string;
  gameSpeedDelay: number;
  highScore: number;
  generateFood: () => Position;
  moveSnake: () => boolean;
  changeDirection: (newDirection: string) => void;
  checkCollision: () => boolean;
  resetGame: () => void;
  increaseSpeed: () => void;
}

export class SnakeLogic implements SnakeGameLogic {
  gridSize = 20;
  snake: Position[] = [{ x: 10, y: 10 }];
  food: Position = this.generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  highScore = 0;

  generateFood(): Position {
    const x = Math.floor(Math.random() * this.gridSize) + 1;
    const y = Math.floor(Math.random() * this.gridSize) + 1;
    return { x, y };
  }

  moveSnake(): boolean {
    const head = { ...this.snake[0] };
    switch (this.direction) {
      case 'up':
        head.y--;
        break;
      case 'down':
        head.y++;
        break;
      case 'left':
        head.x--;
        break;
      case 'right':
        head.x++;
        break;
    }
    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.food = this.generateFood();
      this.increaseSpeed();
      return true;
    } else {
      this.snake.pop();
    }
    return false;
  }
  private scoreSaved: boolean = false;

  private async saveScore() {
    if (this.scoreSaved) return;

    try {
      const response = await fetch('/api/scores/snake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score: this.snake.length - 1 }),
      });

      if (response.ok) {
        this.scoreSaved = true;
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }

  changeDirection(newDirection: string) {
    const oppositeDirections: Record<string, string> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
    };
    if (oppositeDirections[this.direction] !== newDirection) {
      this.direction = newDirection;
    }
  }

  checkCollision(): boolean {
    const head = this.snake[0];
    if (
      head.x < 1 ||
      head.x > this.gridSize ||
      head.y < 1 ||
      head.y > this.gridSize ||
      this.snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      const currentScore = this.snake.length - 1;
      if (currentScore > this.highScore) {
        this.highScore = currentScore;
      }
      this.saveScore();
      return true;
    }
    return false;
  }

  resetGame() {
    this.snake = [{ x: 10, y: 10 }];
    this.food = this.generateFood();
    this.direction = 'right';
    this.gameSpeedDelay = 200;
    this.scoreSaved = false;
  }

  increaseSpeed() {
    if (this.gameSpeedDelay > 150) this.gameSpeedDelay -= 5;
    else if (this.gameSpeedDelay > 100) this.gameSpeedDelay -= 3;
    else if (this.gameSpeedDelay > 50) this.gameSpeedDelay -= 2;
    else if (this.gameSpeedDelay > 25) this.gameSpeedDelay -= 1;
  }
}

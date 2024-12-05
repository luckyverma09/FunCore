export interface BreakoutGameState {
  isGameStarted?: boolean;
  isGameOver?: boolean;
  score?: number;
  lives?: number;
}

export class BreakoutGameLogic {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private ballRadius: number = 6;
  private x: number = 0;
  private y: number = 0;
  private dx: number = 2;
  private dy: number = -2;
  private paddleHeight: number = 10;
  private paddleWidth: number = 75;
  private paddleX: number = 0;
  private rightPressed: boolean = false;
  private leftPressed: boolean = false;
  private brickRowCount: number = 5;
  private brickColumnCount: number = 4;
  private brickWidth: number = 75;
  private brickHeight: number = 20;
  private brickPadding: number = 10;
  private brickOffsetTop: number = 30;
  private brickOffsetLeft: number = 30;
  private score: number = 0;
  private lives: number = 2;
  private bricks: { x: number; y: number; status: number }[][] = [];
  private gameStarted: boolean = false;
  private gameOver: boolean = false;
  private onStateChange!: (state: Partial<BreakoutGameState>) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onStateChange: (state: Partial<BreakoutGameState>) => void
  ) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d')!;
    this.onStateChange = onStateChange;
  }

  private initializeBricks(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  private resetBallAndPaddle(): void {
    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 30;
    this.dx = 2;
    this.dy = -2;
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
  }

  public keyDownHandler(e: KeyboardEvent): void {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = true;
    }
  }

  public keyUpHandler(e: KeyboardEvent): void {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      this.rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      this.leftPressed = false;
    }
  }

  private collisionDetection(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (
            this.x > b.x &&
            this.x < b.x + this.brickWidth &&
            this.y > b.y &&
            this.y < b.y + this.brickHeight
          ) {
            this.dy = -this.dy;
            b.status = 0;
            this.score++;
            this.onStateChange({ score: this.score });

            if (this.score === this.brickRowCount * this.brickColumnCount) {
              // All bricks cleared
              this.initializeBricks();
              this.resetBallAndPaddle();
            }
          }
        }
      }
    }
  }

  public draw(): void {
    if (!this.gameStarted || this.gameOver) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.collisionDetection();
    if (this.lives === 0) {
      this.gameOver = true;
      this.saveScore(); // Add this line
      this.onStateChange({ isGameOver: true });
      return;
    }

    if (
      this.x + this.dx > this.canvas.width - this.ballRadius ||
      this.x + this.dx < this.ballRadius
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
    } else if (this.y + this.dy > this.canvas.height - this.ballRadius) {
      if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
        this.dy = -this.dy;
      } else {
        this.lives--;
        this.onStateChange({ lives: this.lives });

        if (this.lives === 0) {
          this.gameOver = true;
          this.onStateChange({ isGameOver: true });
          return;
        } else {
          this.resetBallAndPaddle();
        }
      }
    }

    if (this.rightPressed && this.paddleX < this.canvas.width - this.paddleWidth) {
      this.paddleX += 7;
    } else if (this.leftPressed && this.paddleX > 0) {
      this.paddleX -= 7;
    }

    this.x += this.dx;
    this.y += this.dy;
  }

  private drawBall(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawPaddle(): void {
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddleX,
      this.canvas.height - this.paddleHeight,
      this.paddleWidth,
      this.paddleHeight
    );
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();
  }

  private drawBricks(): void {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        if (this.bricks[c][r].status === 1) {
          const brickX = r * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          const brickY = c * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = '#0095DD';
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  public startGame(): void {
    this.gameStarted = true;
    this.gameOver = false;
    this.score = 0;
    this.lives = 2;
    this.scoreSaved = false;
    this.initializeBricks();
    this.resetBallAndPaddle();
    this.onStateChange({
      isGameStarted: true,
      isGameOver: false,
      score: 0,
      lives: 2,
    });
  }

  private scoreSaved: boolean = false;

  private async saveScore(): Promise<void> {
    if (this.scoreSaved) return;

    try {
      const response = await fetch('/api/scores/breakout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score: this.score }),
      });

      if (response.ok) {
        this.scoreSaved = true;
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }
}

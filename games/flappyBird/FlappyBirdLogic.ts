export class FlappyBirdLogic {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private gameLoop: number | null = null;
  private bird: {
    y: number;
    velocity: number;
    x: number; // Added x position for the bird
  };
  private pipes: Array<{
    x: number;
    topHeight: number;
    gap: number;
    scored?: boolean;
  }>;
  private score: number = 0;

  public onScoreUpdate: (score: number) => void = () => {};
  public onGameOver: () => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.pipes = [];
    this.bird = {
      x: canvas.width / 3,
      y: canvas.height / 2,
      velocity: 0,
    };
  }
  private gameId: string = 'flappy-bird';

  private async saveScore() {
    try {
      const response = await fetch('/api/scores/flappy-bird', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score: this.score }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save score');
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }

  public jump(): void {
    this.bird.velocity = -8;
  }

  public stop(): void {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  public restart(): void {
    this.stop();
    this.score = 0;
    this.pipes = [];
    this.bird = {
      x: this.canvas.width / 3,
      y: this.canvas.height / 2,
      velocity: 0,
    };
    this.start();
  }

  private drawBackground(): void {
    // Sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#4EC0CA');
    gradient.addColorStop(1, '#2E8B9A');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Ground
    this.ctx.fillStyle = '#DED895';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);

    // Grass detail
    this.ctx.fillStyle = '#C7B377';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 10);
  }

  private drawBird(): void {
    this.ctx.fillStyle = '#FFD700'; // Gold color for bird
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x, this.bird.y, 20, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private drawPipe(x: number, topHeight: number, gap: number): void {
    const pipeWidth = 80;

    // Top pipe
    this.ctx.fillStyle = '#74BF2E';
    this.ctx.fillRect(x, 0, pipeWidth, topHeight);

    // Pipe cap (top)
    this.ctx.fillStyle = '#8FD94C';
    this.ctx.fillRect(x - 5, topHeight - 30, pipeWidth + 10, 30);

    // Bottom pipe
    const bottomPipeY = topHeight + gap;
    this.ctx.fillStyle = '#74BF2E';
    this.ctx.fillRect(x, bottomPipeY, pipeWidth, this.canvas.height - bottomPipeY);

    // Pipe cap (bottom)
    this.ctx.fillStyle = '#8FD94C';
    this.ctx.fillRect(x - 5, bottomPipeY, pipeWidth + 10, 30);
  }

  private checkCollisions(): boolean {
    // Check ground collision
    if (this.bird.y + 20 > this.canvas.height - 100 || this.bird.y - 20 < 0) {
      return true;
    }

    // Check pipe collisions
    for (const pipe of this.pipes) {
      if (
        this.bird.x + 20 > pipe.x &&
        this.bird.x - 20 < pipe.x + 80 &&
        (this.bird.y - 20 < pipe.topHeight || this.bird.y + 20 > pipe.topHeight + pipe.gap)
      ) {
        return true;
      }
    }
    return false;
  }

  public update(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    // Update bird physics
    this.bird.velocity += 0.5; // Gravity
    this.bird.y += this.bird.velocity;

    // Draw bird
    this.drawBird();

    // Update and draw pipes
    this.pipes.forEach((pipe) => {
      pipe.x -= 2;
      this.drawPipe(pipe.x, pipe.topHeight, pipe.gap);

      // Score update
      if (!pipe.scored && pipe.x + 80 < this.bird.x) {
        pipe.scored = true;
        this.score++;
        this.onScoreUpdate(this.score);
      }
    });

    // Add new pipes
    if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 300) {
      this.pipes.push({
        x: this.canvas.width,
        topHeight: Math.random() * (this.canvas.height - 300) + 50,
        gap: 150,
        scored: false,
      });
    }

    // Remove off-screen pipes
    this.pipes = this.pipes.filter((pipe) => pipe.x > -100);

    // Check for collisions
    if (this.checkCollisions()) {
      this.stop();
      this.saveScore(); // Add this line
      this.onGameOver();
      return;
    }

    // Continue game loop
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }

  public start(): void {
    this.gameLoop = requestAnimationFrame(this.update.bind(this));
  }
}

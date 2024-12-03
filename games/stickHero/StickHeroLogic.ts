export class StickHeroLogic {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private phase: 'waiting' | 'stretching' | 'turning' | 'walking' | 'transitioning' | 'falling' =
    'waiting';
  private lastTimestamp?: number;
  private heroX: number;
  private heroY: number;
  private sceneOffset: number = 0;
  private score: number = 0;
  private platforms: Array<{ x: number; w: number }> = [];
  private sticks: Array<{ x: number; length: number; rotation: number }> = [];

  // Configuration
  private readonly canvasWidth = 375;
  private readonly canvasHeight = 375;
  private readonly platformHeight = 100;
  private readonly heroDistanceFromEdge = 10;
  private readonly perfectAreaSize = 10;
  private readonly stretchingSpeed = 4;
  private readonly turningSpeed = 4;
  private readonly walkingSpeed = 4;
  private readonly fallingSpeed = 2;
  private readonly heroWidth = 17;
  private readonly heroHeight = 30;

  public onScoreUpdate: (score: number) => void = () => {};
  public onGameOver: () => void = () => {};
  public onPerfectScore: () => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.heroX = 0;
    this.heroY = 0;
    this.resetGame();
  }

  public resetGame(): void {
    this.phase = 'waiting';
    this.lastTimestamp = undefined;
    this.sceneOffset = 0;
    this.score = 0;

    this.platforms = [{ x: 50, w: 50 }];
    this.generatePlatform();
    this.generatePlatform();

    this.sticks = [{ x: this.platforms[0].x + this.platforms[0].w, length: 0, rotation: 0 }];

    this.heroX = this.platforms[0].x + this.platforms[0].w - this.heroDistanceFromEdge;
    this.heroY = 0;

    this.draw();
  }

  private generatePlatform(): void {
    const minimumGap = 40;
    const maximumGap = 200;
    const minimumWidth = 20;
    const maximumWidth = 100;

    const lastPlatform = this.platforms[this.platforms.length - 1];
    const furthestX = lastPlatform.x + lastPlatform.w;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const w = minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

    this.platforms.push({ x, w });
  }

  public startStretching(): void {
    if (this.phase === 'waiting') {
      this.phase = 'stretching';
      this.animate();
    }
  }
  private checkStickHitsPlatform(): [{ x: number; w: number } | undefined, boolean] {
    const stick = this.sticks[this.sticks.length - 1];
    if (stick.rotation !== 90) {
      throw Error(`Stick is ${stick.rotation}°`);
    }

    const stickFarX = stick.x + stick.length;

    // Find the platform that the stick might hit
    const platformTheStickHits = this.platforms.find(
      (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    // Check if it's a perfect hit
    if (platformTheStickHits) {
      const perfectHitSpot = platformTheStickHits.x + platformTheStickHits.w / 2;
      const isPerfect = Math.abs(stickFarX - perfectHitSpot) < this.perfectAreaSize / 2;
      return [platformTheStickHits, isPerfect];
    }

    return [undefined, false];
  }

  public stopStretching(): void {
    if (this.phase === 'stretching') {
      this.phase = 'turning';
    }
  }

  private animate(timestamp?: number): void {
    if (!timestamp) {
      requestAnimationFrame((ts) => this.animate(ts));
      return;
    }

    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      requestAnimationFrame((ts) => this.animate(ts));
      return;
    }

    const delta = timestamp - this.lastTimestamp;

    switch (this.phase) {
      case 'stretching':
        this.sticks[this.sticks.length - 1].length += delta / this.stretchingSpeed;
        break;

      case 'turning':
        const currentStick = this.sticks[this.sticks.length - 1];
        currentStick.rotation += delta / this.turningSpeed;

        if (currentStick.rotation >= 90) {
          currentStick.rotation = 90;
          const [nextPlatform, perfectHit] = this.checkStickHitsPlatform();

          if (nextPlatform) {
            this.score += perfectHit ? 2 : 1;
            this.onScoreUpdate(this.score);
            if (perfectHit) this.onPerfectScore();
            this.generatePlatform();
          }
          this.phase = 'walking';
        }
        break;

      case 'walking':
        this.heroX += delta / this.walkingSpeed;
        const [nextPlatform] = this.checkStickHitsPlatform();

        if (nextPlatform) {
          const maxHeroX = nextPlatform.x + nextPlatform.w - this.heroDistanceFromEdge;
          if (this.heroX >= maxHeroX) {
            this.heroX = maxHeroX;
            this.phase = 'waiting';
          }
        } else {
          const maxHeroX =
            this.sticks[this.sticks.length - 1].x +
            this.sticks[this.sticks.length - 1].length +
            this.heroWidth;
          if (this.heroX >= maxHeroX) {
            this.heroX = maxHeroX;
            this.phase = 'falling';
          }
        }
        break;

      case 'falling':
        const lastStick = this.sticks[this.sticks.length - 1];
        if (lastStick.rotation < 180) {
          lastStick.rotation += delta / this.turningSpeed;
        }

        this.heroY += delta / this.fallingSpeed;
        if (this.heroY > this.canvasHeight) {
          this.onGameOver();
        }
        break;
    }
    this.draw();
    this.lastTimestamp = timestamp;
    requestAnimationFrame((ts) => this.animate(ts));
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawPlatforms();
    this.drawSticks();
    this.drawHero();
  }

  private drawPlatforms(): void {
    this.platforms.forEach(({ x, w }) => {
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(x, this.canvasHeight - this.platformHeight, w, this.platformHeight);
    });
  }

  private drawSticks(): void {
    this.sticks.forEach((stick) => {
      this.ctx.save();
      this.ctx.translate(stick.x, this.canvasHeight - this.platformHeight);
      this.ctx.rotate((Math.PI / 180) * stick.rotation);
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, -stick.length);
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  private drawHero(): void {
    this.ctx.save();
    this.ctx.translate(this.heroX, this.canvasHeight - this.platformHeight - this.heroHeight / 2);

    // Draw hero body
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.roundRect(
      -this.heroWidth / 2,
      -this.heroHeight / 2,
      this.heroWidth,
      this.heroHeight,
      5
    );
    this.ctx.fill();

    // Draw eyes
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.beginPath();
    this.ctx.arc(2, -5, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw headband
    this.ctx.fillStyle = '#FF0000';
    this.ctx.fillRect(-this.heroWidth / 2 - 2, -10, this.heroWidth + 4, 4);

    // Draw headband knot
    this.ctx.beginPath();
    this.ctx.moveTo(-8, -12);
    this.ctx.lineTo(-15, -15);
    this.ctx.lineTo(-12, -8);
    this.ctx.fill();

    // Draw legs
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(5, this.heroHeight / 2 - 3, 3, 0, Math.PI * 2);
    this.ctx.arc(-5, this.heroHeight / 2 - 3, 3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }
}

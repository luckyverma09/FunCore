declare global {
  interface Array<T> {
    last(): T | undefined;
  }
}

Array.prototype.last = function <T>(this: T[]): T | undefined {
  return this[this.length - 1];
};

export class StickHeroLogic {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public phase: 'waiting' | 'stretching' | 'turning' | 'walking' | 'transitioning' | 'falling' =
    'waiting';
  public lastTimestamp?: number;
  public heroX: number = 0;
  public heroY: number = 0;
  public sceneOffset: number = 0;
  public platforms: Array<{ x: number; w: number }> = [];
  public sticks: Array<{ x: number; length: number; rotation: number }> = [];
  public trees: Array<{ x: number; color: string }> = [];
  public score: number = 0;
  public scoreSaved: boolean = false;

  // Configuration constants
  public readonly canvasWidth = 375;
  public readonly canvasHeight = 375;
  public readonly platformHeight = 100;
  public readonly heroDistanceFromEdge = 10;

  public readonly perfectAreaSize = 10;
  public readonly stretchingSpeed = 4;
  public readonly turningSpeed = 4;
  public readonly walkingSpeed = 4;
  public readonly fallingSpeed = 2;
  public readonly heroWidth = 17;
  public readonly heroHeight = 30;
  public readonly transitioningSpeed = 2;
  public readonly paddingX = 100;
  public readonly hill1BaseHeight = 100;
  public readonly hill1Amplitude = 10;
  public readonly hill1Stretch = 1;
  public readonly hill2BaseHeight = 70;
  public readonly hill2Amplitude = 20;
  public readonly hill2Stretch = 0.5;
  public readonly backgroundSpeedMultiplier = 0.2;

  public onScoreUpdate: (score: number) => void = () => {};
  public onGameOver: () => void = () => {};
  public onPerfectScore: () => void = () => {};

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resetGame();
  }

  public resetGame(): void {
    this.score = 0;
    this.scoreSaved = false;
    this.platforms = [{ x: 50, w: 50 }];
    this.generatePlatform(); // Generate initial next platform
    this.sticks = [{ x: this.platforms[0].x + this.platforms[0].w, length: 0, rotation: 0 }];
    this.trees = [];
    this.heroX = this.platforms[0].x + this.platforms[0].w - this.heroDistanceFromEdge;
    this.heroY = 0;
    this.sceneOffset = 0; // Reset scene offset
    this.phase = 'waiting';
    this.draw();
  }

  public startStretching(): void {
    if (this.phase === 'waiting') {
      this.phase = 'stretching';
      requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
  }
  public stop(): void {
    if (this.lastTimestamp) {
      cancelAnimationFrame(this.lastTimestamp);
      this.lastTimestamp = undefined;
    }
    this.phase = 'waiting';
  }

  public stopStretching(): void {
    if (this.phase === 'stretching') {
      this.phase = 'turning';
    }
  }

  private async saveScore() {
    if (this.scoreSaved) return; // Early return if already saved

    try {
      const response = await fetch('/api/scores/stick-hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ score: this.score }),
      });

      if (response.ok) {
        this.scoreSaved = true; // Mark as saved only on success
      }
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  }

  public draw(): void {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background with parallax effect
    this.drawBackground();

    // Center and translate the scene
    const scale = Math.min(
      this.canvas.width / this.canvasWidth,
      this.canvas.height / this.canvasHeight
    );

    this.ctx.translate(
      (this.canvas.width - this.canvasWidth * scale) / 2 - this.sceneOffset * scale,
      (this.canvas.height - this.canvasHeight * scale) / 2
    );

    this.ctx.scale(scale, scale);

    this.drawPlatforms();
    this.drawHero();
    this.drawSticks();

    this.ctx.restore();
  }

  public async animate(timestamp: number): Promise<void> {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
      window.requestAnimationFrame(this.animate.bind(this));
      return;
    }

    const delta = timestamp - this.lastTimestamp;

    switch (this.phase) {
      case 'stretching':
        this.sticks.last()!.length += delta / this.stretchingSpeed;
        break;
      case 'turning':
        this.sticks.last()!.rotation += delta / this.turningSpeed;
        if (this.sticks.last()!.rotation > 90) {
          this.sticks.last()!.rotation = 90;
          const [nextPlatform, perfectHit] = this.thePlatformTheStickHits();
          if (nextPlatform) {
            this.score += perfectHit ? 2 : 1;
            this.onScoreUpdate(this.score);
            if (perfectHit) this.onPerfectScore();
            this.generatePlatform();
            this.generateTree();
          }
          this.phase = 'walking';
        }
        break;
      case 'walking': {
        this.heroX += (timestamp - this.lastTimestamp) / this.walkingSpeed;

        const [nextPlatform] = this.thePlatformTheStickHits();
        if (nextPlatform) {
          // If hero will reach another platform then limit it's position at it's edge
          const maxHeroX = nextPlatform.x + nextPlatform.w - this.heroDistanceFromEdge;
          if (this.heroX > maxHeroX) {
            this.heroX = maxHeroX;
            this.phase = 'transitioning';
          }
        } else {
          const lastStick = this.sticks.last();
          const maxHeroX = lastStick ? lastStick.x + lastStick.length + this.heroWidth : 0;
          if (this.heroX > maxHeroX) {
            this.heroX = maxHeroX;
            this.phase = 'falling';
          }
        }
        break;
      }

      case 'transitioning':
        this.sceneOffset += delta / this.transitioningSpeed;
        const [nextTransitionPlatform] = this.thePlatformTheStickHits();
        if (
          nextTransitionPlatform &&
          this.sceneOffset > nextTransitionPlatform.x + nextTransitionPlatform.w - this.paddingX
        ) {
          // Add new stick when reaching new platform
          this.sticks.push({
            x: nextTransitionPlatform.x + nextTransitionPlatform.w,
            length: 0,
            rotation: 0,
          });
          this.phase = 'waiting';
        }
        break;
      case 'falling':
        if (this.sticks.last()!.rotation < 180) {
          this.sticks.last()!.rotation += delta / this.turningSpeed;
        }

        this.heroY += delta / this.fallingSpeed;
        if (this.heroY > this.canvas.height && !this.scoreSaved) {
          await this.saveScore(); // Save score only once
          this.onGameOver();
          return;
        }
        break;
    }

    this.draw();
    this.lastTimestamp = timestamp;
    window.requestAnimationFrame(this.animate.bind(this));
  }

  public thePlatformTheStickHits(): [{ x: number; w: number } | undefined, boolean] {
    const stick = this.sticks.last()!;
    if (stick.rotation != 90) throw Error(`Stick is ${stick.rotation}°`);
    const stickFarX = stick.x + stick.length;

    const platformTheStickHits = this.platforms.find(
      (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
    );

    if (platformTheStickHits) {
      const perfectHit =
        platformTheStickHits.x + platformTheStickHits.w / 2 - this.perfectAreaSize / 2 <
          stickFarX &&
        stickFarX < platformTheStickHits.x + platformTheStickHits.w / 2 + this.perfectAreaSize / 2;
      return [platformTheStickHits, perfectHit];
    }

    return [undefined, false];
  }

  public drawBackground(): void {
    // Draw sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#BBD691');
    gradient.addColorStop(1, '#FEF1E1');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw hills and trees
    this.drawHill(this.hill1BaseHeight, this.hill1Amplitude, this.hill1Stretch, '#95C629');
    this.drawHill(this.hill2BaseHeight, this.hill2Amplitude, this.hill2Stretch, '#659F1C');
    this.trees.forEach((tree) => this.drawTree(tree.x, tree.color));
  }
  public drawHill(baseHeight: number, amplitude: number, stretch: number, color: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvas.height);
    this.ctx.lineTo(0, this.getHillY(0, baseHeight, amplitude, stretch));

    for (let i = 0; i < this.canvas.width; i++) {
      this.ctx.lineTo(i, this.getHillY(i, baseHeight, amplitude, stretch));
    }

    this.ctx.lineTo(this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  public getHillY(windowX: number, baseHeight: number, amplitude: number, stretch: number): number {
    const sineBaseY = this.canvas.height - baseHeight;
    return (
      Math.sin((this.sceneOffset * this.backgroundSpeedMultiplier + windowX) * stretch) *
        amplitude +
      sineBaseY
    );
  }

  public drawRoundedRect(params: {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
  }): void {
    const { x, y, width, height, radius } = params;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + radius);
    this.ctx.lineTo(x, y + height - radius);
    this.ctx.arcTo(x, y + height, x + radius, y + height, radius);
    this.ctx.lineTo(x + width - radius, y + height);
    this.ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
    this.ctx.lineTo(x + width, y + radius);
    this.ctx.arcTo(x + width, y, x + width - radius, y, radius);
    this.ctx.lineTo(x + radius, y);
    this.ctx.arcTo(x, y, x, y + radius, radius);
    this.ctx.fill();
  }
  public getTreeY(x: number, baseHeight: number, amplitude: number): number {
    const sineBaseY = this.canvas.height - baseHeight;
    return Math.sin(x) * amplitude + sineBaseY;
  }

  public drawTree(x: number, color: string): void {
    this.ctx.save();
    this.ctx.translate(
      (-this.sceneOffset * this.backgroundSpeedMultiplier + x) * this.hill1Stretch,
      this.getTreeY(x, this.hill1BaseHeight, this.hill1Amplitude)
    );

    const treeTrunkHeight = 5;
    const treeTrunkWidth = 2;
    const treeCrownHeight = 25;
    const treeCrownWidth = 10;

    // Draw trunk
    this.ctx.fillStyle = '#7D833C';
    this.ctx.fillRect(-treeTrunkWidth / 2, -treeTrunkHeight, treeTrunkWidth, treeTrunkHeight);

    // Draw crown
    this.ctx.beginPath();
    this.ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    this.ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    this.ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
    this.ctx.fillStyle = color;
    this.ctx.fill();

    this.ctx.restore();
  }

  public drawPlatforms(): void {
    this.platforms.forEach(({ x, w }) => {
      // Draw platform
      this.ctx.fillStyle = 'black';
      this.ctx.fillRect(
        x,
        this.canvasHeight - this.platformHeight,
        w,
        this.platformHeight + (this.canvas.height - this.canvasHeight) / 2
      );

      // Draw perfect area only if hero did not yet reach the platform
      if (this.sticks.last() && this.sticks.last()!.x < x) {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(
          x + w / 2 - this.perfectAreaSize / 2,
          this.canvasHeight - this.platformHeight,
          this.perfectAreaSize,
          this.perfectAreaSize
        );
      }
    });
  }

  public drawHero(): void {
    this.ctx.save();
    this.ctx.fillStyle = 'black';
    this.ctx.translate(
      this.heroX - this.heroWidth / 2,
      this.heroY + this.canvasHeight - this.platformHeight - this.heroHeight / 2
    );

    // Body
    this.drawRoundedRect({
      x: -this.heroWidth / 2,
      y: -this.heroHeight / 2,
      width: this.heroWidth,
      height: this.heroHeight - 4,
      radius: 5,
    });

    // Legs
    const legDistance = 5;
    this.ctx.beginPath();
    this.ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
    this.ctx.fill();

    // Headband
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(-this.heroWidth / 2 - 1, -12, this.heroWidth + 2, 4.5);
    this.ctx.restore();
  }

  public drawSticks(): void {
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

  public generatePlatform(): void {
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

  public generateTree(): void {
    const minimumGap = 30;
    const maximumGap = 150;

    const lastTree = this.trees[this.trees.length - 1];
    const furthestX = lastTree ? lastTree.x : 0;

    const x = furthestX + minimumGap + Math.floor(Math.random() * (maximumGap - minimumGap));
    const treeColors = ['#6D8821', '#8FAC34', '#98B333'];
    const color = treeColors[Math.floor(Math.random() * 3)];

    this.trees.push({ x, color });
  }
}

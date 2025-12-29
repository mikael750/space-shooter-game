import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.html',
  styleUrl: './game.css',
})
export class Game implements OnInit {

  @ViewChild('gameCanvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  keys: any = {};

  frameCount = 0;

  player = {
    x: 280,
    y: 350,
    width: 40,
    height: 20,
    speed: 5
  };

  score = 0;
  lives = 3;
  gameOver = false;

  bullets: any[] = [];

  enemies: any[] = [];

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.gameLoop();
  }

  gameLoop(): void {
    this.frameCount++;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  update(): void {
    if (this.gameOver) return;


    // déplacement joueur
    if (this.keys['ArrowLeft']) this.player.x -= this.player.speed;
    if (this.keys['ArrowRight']) this.player.x += this.player.speed;

    // tir (barre espace)
    if (this.keys[' ']) {
      this.shoot();
    }

    // déplacement des balles
    this.bullets.forEach(b => b.y -= b.speed);
    // suppression des balles hors écran
    this.bullets = this.bullets.filter(b => b.y > 0);

    // spawn ennemi toutes les 60 frames (~1s)
    if (this.frameCount % 60 === 0) {
      this.spawnEnemy();
    }

    // déplacement ennemis
    this.enemies.forEach(e => e.y += e.speed);

    this.bullets.forEach((bullet, bIndex) => {
      this.enemies.forEach((enemy, eIndex) => {
        if (this.isColliding(
          { ...bullet, width: 4, height: 10 },
          enemy
        )) {
          // supprimer la balle
          this.bullets.splice(bIndex, 1);

          // supprimer l’ennemi
          this.enemies.splice(eIndex, 1);

          this.score += 10;
        }
      });
    });

    this.enemies.forEach((enemy, eIndex) => {
      if (this.isColliding(this.player, enemy)) {
        // ennemi détruit
        this.enemies.splice(eIndex, 1);

        // joueur touché
        this.lives--;

        if (this.lives <= 0) {
          this.endGame();
        }
      }
    });

    // suppression ennemis hors écran
    this.enemies = this.enemies.filter(e => e.y < 400);
  }

  endGame(): void {
    this.gameOver = true;
    alert('Game Over');
  }

  spawnEnemy(): void {
    this.enemies.push({
      x: Math.random() * 560,
      y: 0,
      width: 30,
      height: 20,
      speed: 2
    });
  }

  shoot(): void {
    //bloquer le tir apres Game Over
    if (this.gameOver) return;

    this.bullets.push({
      x: this.player.x + 18,
      y: this.player.y,
      speed: 7
    });

    // empêche le tir en continu
    this.keys[' '] = false;
  }

  draw(): void {
    this.ctx.clearRect(0, 0, 600, 400);

    // joueur
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // balles
    this.ctx.fillStyle = 'red';
    this.bullets.forEach(b =>
      this.ctx.fillRect(b.x, b.y, 4, 10)
    );
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(e: KeyboardEvent): void {
    this.keys[e.key] = true;
  }

  @HostListener('window:keyup', ['$event'])
  keyUp(e: KeyboardEvent): void {
    this.keys[e.key] = false;
  }

  isColliding(a: any, b: any): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

}

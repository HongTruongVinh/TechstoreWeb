import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
}

@Component({
  selector: 'app-snow',
  standalone: true,
  imports: [],
  templateUrl: './snow.component.html',
  styleUrl: './snow.component.scss'
})
export class SnowComponent implements AfterViewInit {

  @ViewChild('snowCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private snowflakes: Snowflake[] = [];
  private count = 120; // số lượng tuyết

  ngAfterViewInit() {
    this.initCanvas();
    this.createSnow();
    this.animate();

    window.addEventListener('resize', () => {
      this.initCanvas();
    });
  }

  initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.ctx = canvas.getContext('2d')!;
  }

  createSnow() {
    this.snowflakes = [];

    for (let i = 0; i < this.count; i++) {
      this.snowflakes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.3, // rơi chậm
        drift: Math.random() * 0.5
      });
    }
  }

  animate = () => {
    this.ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    this.ctx.fillStyle = 'white';

    for (let flake of this.snowflakes) {

      this.ctx.beginPath();
      this.ctx.arc(
        flake.x,
        flake.y,
        flake.radius,
        0,
        Math.PI * 2
      );
      this.ctx.fill();

      flake.y += flake.speed;
      flake.x += Math.sin(flake.y * 0.01) * flake.drift;

      if (flake.y > window.innerHeight) {
        flake.y = -10;
        flake.x = Math.random() * window.innerWidth;
      }
    }

    requestAnimationFrame(this.animate);
  };
}

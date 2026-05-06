import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

interface Ember{
  x:number;
  y:number;
  radius:number;
  speedY:number;
  drift:number;
  opacity:number;
}

@Component({
  selector: 'app-ember',
  standalone: true,
  templateUrl: './ember.component.html',
  styleUrls: ['./ember.component.scss']
})
export class EmberComponent
implements AfterViewInit, OnDestroy {

  @ViewChild('emberCanvas')
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;

  private particles: Ember[] = [];
  private particleCount = 20; // number of embers

  private animationId = 0;

  private resizeHandler = () =>{
    this.initCanvas();
  }

  ngAfterViewInit(){
    this.initCanvas();
    this.createParticles();
    this.animate();

    window.addEventListener(
      'resize',
      this.resizeHandler
    );
  }

  ngOnDestroy(){
    cancelAnimationFrame(
      this.animationId
    );

    window.removeEventListener(
      'resize',
      this.resizeHandler
    );
  }

  initCanvas(){

    const canvas =
      this.canvasRef.nativeElement;

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    this.ctx=
      canvas.getContext('2d')!;
  }

  createParticles(){

    this.particles=[];

    for(let i=0;i<this.particleCount;i++){

      this.particles.push({
        x:Math.random()*window.innerWidth,

        y:Math.random()*window.innerHeight,

        radius:Math.random()*1.2 + 0.3, // size 

        speedY:Math.random()*1.5+0.5,

        drift:Math.random()*1.2,

        //opacity:Math.random()
        opacity:Math.random()*0.4 + 0.8
      });

    }
  }

  animate=()=>{

    this.ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    for(let p of this.particles){

      let glow=
      this.ctx.createRadialGradient(
        p.x,p.y,0,
        p.x,p.y,p.radius*4
      );

      glow.addColorStop(
        0,
        `rgba(255,220,120,${p.opacity})`
      );

      glow.addColorStop(
        .5,
        `rgba(255,100,30,${
          p.opacity*.7
        })`
      );

      glow.addColorStop(
        1,
        'rgba(255,0,0,0)'
      );

      this.ctx.fillStyle=glow;

      this.ctx.beginPath();

      this.ctx.arc(
        p.x,
        p.y,
        p.radius*4,
        0,
        Math.PI*2
      );

      this.ctx.fill();


      p.y -= p.speedY;

      p.x +=
       Math.sin(
         p.y*0.02
       ) * p.drift;


      if(p.y < -20){

        p.y=
         window.innerHeight+20;

        p.x=
         Math.random()*
         window.innerWidth;
      }
    }

    this.animationId=
      requestAnimationFrame(
        this.animate
      );
  }

}
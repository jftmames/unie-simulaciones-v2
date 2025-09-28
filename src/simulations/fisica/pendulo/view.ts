import { slider, button } from '../../../ui/components';
import { stepRK4 } from '../../../core/integration';

export function penduloView(): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="card">
      <h3>Péndulo simple</h3>
      <p>Ajusta los parámetros y observa la oscilación.</p>
    </div>
  `;
  const card = el.querySelector('.card') as HTMLElement;

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 600; 
  canvas.height = 400;
  const g = canvas.getContext('2d')!;
  card.appendChild(canvas);

  // Parámetros iniciales
  let L = 2;       // longitud (m)
  let G = 9.8;     // gravedad (m/s²)
  let b = 0.05;    // amortiguamiento
  let theta = Math.PI/4; 
  let omega = 0;
  let paused = false;

  // Controles
  card.appendChild(slider('Longitud (m)', 0.5, 5, 0.1, L, (v: number) => L = v));
  card.appendChild(slider('Gravedad (m/s²)', 0, 20, 0.1, G, (v: number) => G = v));
  card.appendChild(slider('Amortiguamiento', 0, 0.2, 0.01, b, (v: number) => b = v));
  card.appendChild(slider('Ángulo inicial (º)', 0, 90, 1, theta*180/Math.PI, (v: number) => {
    theta = v*Math.PI/180; omega = 0;
  }));
  card.appendChild(button('Reiniciar', () => { theta=Math.PI/4; omega=0; }));
  card.appendChild(button('Pausa/Play', () => { paused = !paused; }));

  // Ecuación diferencial
  function deriv([th, om]: number[]): number[] {
    return [om, - (G/L)*Math.sin(th) - b*om];
  }

  // Dibujar
  function draw() {
    g.clearRect(0,0,canvas.width,canvas.height);

    // Soporte
    g.strokeStyle = '#444';
    g.beginPath();
    g.moveTo(canvas.width/2, 50);
    g.lineTo(canvas.width/2 + L*80*Math.sin(theta), 50 + L*80*Math.cos(theta));
    g.stroke();

    // Masa
    g.beginPath();
    g.arc(canvas.width/2 + L*80*Math.sin(theta), 50 + L*80*Math.cos(theta), 20, 0, 2*Math.PI);
    g.fillStyle = '#4ade80';
    g.fill();

    // Texto
    g.fillStyle = '#000';
    g.fillText(`θ = ${(theta*180/Math.PI).toFixed(1)}º`, 20, 20);
    g.fillText(`Periodo ≈ ${(2*Math.PI*Math.sqrt(L/G)).toFixed(2)} s`, 20, 40);
  }

  // Bucle
  function tick() {
    if (!paused) {
      [theta, omega] = stepRK4(deriv, [theta, omega], 0.02);
    }
    draw();
    requestAnimationFrame(tick);
  }
  tick();

  return el;
}

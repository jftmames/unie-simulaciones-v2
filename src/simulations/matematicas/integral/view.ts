import { slider } from '../../../ui/components';

export function integralView(): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="card">
      <h3>Integral como área bajo la curva</h3>
      <p>Función f(x) = x²</p>
    </div>
  `;
  const card = el.querySelector('.card') as HTMLElement;

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 600; canvas.height = 400;
  const g = canvas.getContext('2d')!;
  card.appendChild(canvas);

  // Parámetros
  let a = 0, b = 3, n = 6;

  card.appendChild(slider('a (límite inferior)', -5, 5, 0.1, a, (v: number) => { a = v; }));
  card.appendChild(slider('b (límite superior)', -5, 5, 0.1, b, (v: number) => { b = v; }));
  card.appendChild(slider('Subdivisiones', 1, 50, 1, n, (v: number) => { n = v; }));

  // Función
  function f(x: number) { return x * x; }

  // Dibujar
  function draw() {
    g.clearRect(0,0,canvas.width,canvas.height);

    // Escala
    const ox = 50, oy = 350, sx = 80, sy = 30;

    // Ejes
    g.strokeStyle = '#000';
    g.beginPath();
    g.moveTo(ox, 20); g.lineTo(ox, oy);
    g.lineTo(canvas.width-20, oy);
    g.stroke();

    // Curva
    g.strokeStyle = '#2563eb';
    g.beginPath();
    for (let x = a; x <= b; x+=0.05) {
      const X = ox + x*sx;
      const Y = oy - f(x)*sy;
      if (x === a) g.moveTo(X,Y); else g.lineTo(X,Y);
    }
    g.stroke();

    // Rectángulos de Riemann
    const dx = (b-a)/n;
    g.fillStyle = 'rgba(74,222,128,0.5)';
    for (let i=0; i<n; i++) {
      const xi = a + i*dx;
      const yi = f(xi);
      const X = ox + xi*sx;
      const Y = oy - yi*sy;
      const w = dx*sx;
      const h = yi*sy;
      g.fillRect(X, oy-h, w, h);
    }

    // Texto resultados
    const exact = (Math.pow(b,3)-Math.pow(a,3))/3;
    const approx = Array.from({length:n}, (_,i)=>{
      const xi = a + i*dx;
      return f(xi)*dx;
    }).reduce((s,v)=>s+v,0);

    g.fillStyle = '#000';
    g.fillText(`Área exacta = ${exact.toFixed(2)}`, 20, 20);
    g.fillText(`Área aprox = ${approx.toFixed(2)}`, 20, 40);
  }

  function tick() {
    draw();
    requestAnimationFrame(tick);
  }
  tick();

  return el;
}

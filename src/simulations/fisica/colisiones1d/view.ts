import { slider, button } from '../../../ui/components';

export function colisiones1DView(): HTMLElement {
  const root = document.createElement('div');
  root.innerHTML = `
    <div class="card">
      <h3>Colisiones en 1D — coeficiente de restitución (e)</h3>
      <p>Ajusta masas, velocidades iniciales y e. Observa momento y energía.</p>
    </div>
  `;
  const card = root.querySelector('.card') as HTMLElement;

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 360;
  const g = canvas.getContext('2d')!;
  card.appendChild(canvas);

  // Parámetros (unidades SI)
  let m1 = 1.0, m2 = 2.0;        // kg
  let v1 = 2.0, v2 = -1.0;       // m/s (positiva → derecha)
  let e = 1.0;                   // coef. restitución (1 elástica, 0 inelástica)
  let running = false;

  // Estado espacial (m) → lo llevamos a píxeles con escala
  let x1 = 1.0, x2 = 5.0;        // separación inicial en metros
  const Lm = 8.0;                // longitud “pista” en metros
  const S = (canvas.width - 80) / Lm; // px/m
  const floorY = canvas.height - 80;

  // Dimensiones de los bloques (px), proporcionales a masa (pero acotadas)
  const pxSize = (m: number) => Math.max(34, Math.min(80, 34 + m * 10));

  // Controles
  card.appendChild(slider('m₁ (kg)', 0.5, 5, 0.1, m1, (v: number) => { m1 = v; }));
  card.appendChild(slider('m₂ (kg)', 0.5, 5, 0.1, m2, (v: number) => { m2 = v; }));
  card.appendChild(slider('v₁ (m/s)', -5, 5, 0.1, v1, (v: number) => { v1 = v; }));
  card.appendChild(slider('v₂ (m/s)', -5, 5, 0.1, v2, (v: number) => { v2 = v; }));
  card.appendChild(slider('e (restitución)', 0, 1, 0.01, e, (v: number) => { e = v; }));

  const controls = document.createElement('div');
  controls.style.marginTop = '0.5rem';
  controls.appendChild(button('Iniciar / Pausa', () => { running = !running; }));
  controls.appendChild(button('Reiniciar', () => {
    x1 = 1.0; x2 = 5.0; v1 = 2.0; v2 = -1.0; running = false; collisions = 0;
  }));
  controls.appendChild(button('Intercambiar posiciones', () => {
    const dx = x2 - x1;
    x1 += dx; x2 -= dx; // swap sencillo
  }));
  card.appendChild(controls);

  // Utilidades físicas
  const momentum = () => m1 * v1 + m2 * v2;                         // kg·m/s
  const energy   = () => 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;   // J

  // Colisión 1D con restitución e
  function collide() {
    const nv1 = ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / (m1 + m2);
    const nv2 = ((m2 - e * m1) * v2 + (1 + e) * m1 * v1) / (m1 + m2);
    v1 = nv1; v2 = nv2;
  }

  // Detección de choque (bordes de los bloques)
  const touching = () => {
    const w1 = pxSize(m1), w2 = pxSize(m2);
    const X1 = 40 + x1 * S, X2 = 40 + x2 * S;
    return (X1 + w1 / 2) >= (X2 - w2 / 2);
  };

  // Bordes pista (rebote simple elástico con la pared)
  function wallBounce() {
    const w1 = pxSize(m1), w2 = pxSize(m2);
    const left = 40, right = canvas.width - 40;

    // bloque 1
    let X1 = 40 + x1 * S;
    if (X1 - w1 / 2 < left) { X1 = left + w1 / 2; v1 = Math.abs(v1); }
    if (X1 + w1 / 2 > right) { X1 = right - w1 / 2; v1 = -Math.abs(v1); }
    x1 = (X1 - 40) / S;

    // bloque 2
    let X2 = 40 + x2 * S;
    if (X2 - w2 / 2 < left) { X2 = left + w2 / 2; v2 = Math.abs(v2); }
    if (X2 + w2 / 2 > right) { X2 = right - w2 / 2; v2 = -Math.abs(v2); }
    x2 = (X2 - 40) / S;
  }

  let collisions = 0;

  // Simulación
  const dt = 1 / 60; // s
  function step() {
    if (!running) return;

    // Avanza posiciones
    x1 += v1 * dt;
    x2 += v2 * dt;

    // Choque entre bloques (si se cruzan o tocan)
    if (touching() && (v1 > v2)) {
      // corrige solape: ponlos justo en contacto
      const w1 = pxSize(m1), w2 = pxSize(m2);
      const contactX = ((40 + x1 * S) + (40 + x2 * S)) / 2;
      const leftEdge  = contactX - w1 / 2;
      const rightEdge = contactX + w2 / 2;
      const mid = (leftEdge + rightEdge) / 2;
      // Reubica bordes en el punto medio
      const X1 = mid - 1; // pequeño margen para evitar re-detección por flotantes
      const X2 = mid + 1;
      x1 = (X1 - 40 + w1 / 2) / S;
      x2 = (X2 - 40 - w2 / 2) / S;

      collide();
      collisions++;
    }

    wallBounce();
  }

  // Render
  function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    // pista
    g.strokeStyle = '#d1d5db';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(40, floorY + 40);
    g.lineTo(canvas.width - 40, floorY + 40);
    g.stroke();

    // escala (marcas cada metro)
    g.fillStyle = '#6b7280';
    for (let xm = 0; xm <= Lm; xm += 1) {
      const X = 40 + xm * S;
      g.fillRect(X, floorY + 36, 1, 8);
      g.fillText(`${xm} m`, X - 8, floorY + 28);
    }

    // bloques
    const w1 = pxSize(m1), w2 = pxSize(m2), h = 48;
    const X1 = 40 + x1 * S, X2 = 40 + x2 * S;

    // bloque 1
    g.fillStyle = '#60a5fa';
    g.fillRect(X1 - w1 / 2, floorY - h, w1, h);
    g.fillStyle = '#111827';
    g.fillText(`m₁=${m1.toFixed(1)} kg`, X1 - w1 / 2 + 6, floorY - h - 8);
    g.fillText(`v₁=${v1.toFixed(2)} m/s`, X1 - w1 / 2 + 6, floorY - 14 - 8);

    // bloque 2
    g.fillStyle = '#34d399';
    g.fillRect(X2 - w2 / 2, floorY - h, w2, h);
    g.fillStyle = '#111827';
    g.fillText(`m₂=${m2.toFixed(1)} kg`, X2 - w2 / 2 + 6, floorY - h - 8);
    g.fillText(`v₂=${v2.toFixed(2)} m/s`, X2 - w2 / 2 + 6, floorY - 14 - 8);

    // panel de resultados
    const px = canvas.width - 220, py = 24, pw = 200, ph = 120;
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#e5e7eb';
    g.lineWidth = 1.5;
    g.fillRect(px, py, pw, ph);
    g.strokeRect(px, py, pw, ph);

    g.fillStyle = '#374151';
    g.fillText('Resultados', px + 10, py + 18);
    g.fillStyle = '#111827';
    g.fillText(`p = ${momentum().toFixed(2)} kg·m/s`, px + 10, py + 40);
    g.fillText(`E = ${energy().toFixed(2)} J`,      px + 10, py + 60);
    g.fillText(`e = ${e.toFixed(2)}`,                px + 10, py + 80);
    g.fillText(`colisiones: ${collisions}`,          px + 10, py + 100);
  }

  function loop() {
    step();
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  return root;
}

import { button } from '../../../ui/components';

export function logicaView(): HTMLElement {
  const el = document.createElement('div');
  el.innerHTML = `
    <div class="card">
      <h3>Lógica digital — AND / OR / NOT</h3>
      <p>Conmuta A y B y observa salidas. 1 = encendido (verde), 0 = apagado (gris).</p>
    </div>
  `;
  const card = el.querySelector('.card') as HTMLElement;

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.width = 700; canvas.height = 360;
  const g = canvas.getContext('2d')!;
  card.appendChild(canvas);

  // Estado de entradas
  let A = 0, B = 1;

  // Controles
  const controls = document.createElement('div');
  controls.style.display = 'flex';
  controls.style.gap = '8px';
  controls.appendChild(button('A (toggle)', () => { A = A ? 0 : 1; }));
  controls.appendChild(button('B (toggle)', () => { B = B ? 0 : 1; }));
  controls.appendChild(button('Aleatorio', () => { A = Math.round(Math.random()); B = Math.round(Math.random()); }));
  card.appendChild(controls);

  // Lógica
  const AND = (a:number,b:number)=> a & b;
  const OR  = (a:number,b:number)=> a | b;
  const NOT = (a:number)=> a ? 0 : 1;

  // Estilo
  const C_BG = '#0c0f16', C_ST = '#2b3648', C_TX='#cfe4ff', C_L='#9fb0bd';
  const C_ON = '#4ade80', C_OFF='#64748b';

  function label(text:string,x:number,y:number,color=C_TX){ g.fillStyle=color; g.fillText(text,x,y); }
  function wire(x1:number,y1:number,x2:number,y2:number,val:number){
    g.strokeStyle = val ? C_ON : C_OFF; g.lineWidth = 3;
    g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2,y2); g.stroke();
  }
  function andGate(x:number,y:number,w:number,h:number){
    g.fillStyle=C_BG; g.strokeStyle=C_ST; g.lineWidth=2;
    g.beginPath(); g.moveTo(x,y); g.lineTo(x+w*0.5,y);
    g.arc(x+w*0.5,y+h/2,h/2,-Math.PI/2,Math.PI/2); g.lineTo(x,y+h);
    g.closePath(); g.fill(); g.stroke(); label('AND', x+w*0.28, y+h/2+4, C_L);
  }
  function orGate(x:number,y:number,w:number,h:number){
    g.fillStyle=C_BG; g.strokeStyle=C_ST; g.lineWidth=2;
    g.beginPath();
    g.moveTo(x+w*0.15,y);
    g.quadraticCurveTo(x+w*0.45,y+h/2,x+w*0.15,y+h);
    g.quadraticCurveTo(x+w*0.6,y+h*0.9,x+w,y+h/2);
    g.quadraticCurveTo(x+w*0.6,y+h*0.1,x+w*0.15,y);
    g.closePath(); g.fill(); g.stroke(); label('OR', x+w*0.48-8, y+h/2+4, C_L);
  }
  function notGate(x:number,y:number,w:number,h:number){
    g.fillStyle=C_BG; g.strokeStyle=C_ST; g.lineWidth=2;
    g.beginPath(); g.moveTo(x,y); g.lineTo(x,y+h); g.lineTo(x+w*0.8,y+h/2); g.closePath();
    g.fill(); g.stroke();
    const r=7, cx=x+w*0.8+r, cy=y+h/2;
    g.beginPath(); g.arc(cx,cy,r,0,Math.PI*2); g.fill(); g.stroke();
    label('NOT', x+w*0.3, y+h/2+4, C_L);
  }

  function draw() {
    const W=canvas.width, H=canvas.height;
    g.clearRect(0,0,W,H);
    // tablero
    const board = {x:24,y:48,w:W-48,h:H-72};
    g.fillStyle=C_BG; g.strokeStyle=C_ST; g.lineWidth=2;
    g.fillRect(board.x,board.y,board.w,board.h); g.strokeRect(board.x,board.y,board.w,board.h);
    label('Tablero', board.x+8, board.y-10, C_L);

    // posiciones
    const yA = board.y+80; const yB = yA+50;
    const gw=110, gh=46;
    const andPos = {x: board.x+260, y: yA-24};
    const orPos  = {x: board.x+260, y: yB-24};
    const notPos = {x: andPos.x+gw+70, y: andPos.y};

    // entradas
    label(`A = ${A}`, board.x+10, yA-28, C_L);
    label(`B = ${B}`, board.x+10, yB-28, C_L);
    label('A', board.x+16, yA-6, '#60a5fa');
    label('B', board.x+16, yB-6, '#60a5fa');
    wire(board.x+14,yA, andPos.x, yA, A);
    wire(board.x+14,yB, andPos.x, yB, B);

    // puertas
    andGate(andPos.x, andPos.y, gw, gh);
    orGate(orPos.x, orPos.y, gw, gh);

    const andV = AND(A,B);
    const orV  = OR(A,B);
    const notAnd = NOT(andV);

    // conexiones intermedias
    wire(andPos.x+gw, yA, notPos.x-16, yA, andV);
    notGate(notPos.x, notPos.y, gw, gh);
    wire(notPos.x+gw+14, yA, board.x+board.w-220-14, yA, notAnd);

    wire(orPos.x+gw, yB, board.x+board.w-220-14, yB, orV);

    // etiquetas de salida
    label('¬(A∧B)', board.x+board.w-220-80, yA-8, '#a7f3d0');
    label('A∨B',    board.x+board.w-220-52, yB-8, '#a7f3d0');

    // panel
    const px = board.x+board.w-210, py = board.y+34, pw = 200, ph = 120;
    g.fillStyle='#1b2434'; g.strokeStyle=C_ST; g.lineWidth=2;
    g.fillRect(px,py,pw,ph); g.strokeRect(px,py,pw,ph);
    label('Resultados', px+10, py+18, C_L);
    label(`AND(A,B) = ${andV}`, px+10, py+42);
    label(`OR(A,B)  = ${orV}`,  px+10, py+64);
    label(`NOT(AND) = ${notAnd}`, px+10, py+86);
  }

  function loop(){ draw(); requestAnimationFrame(loop); }
  loop();

  return el;
}

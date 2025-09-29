import './style.css';

import { penduloView } from './simulations/fisica/pendulo/view';
import { colisiones1DView } from './simulations/fisica/colisiones1d/view';
import { integralView } from './simulations/matematicas/integral/view';
import { logicaView } from './simulations/informatica/logica/view';

const app = document.querySelector<HTMLDivElement>('#app')!;

function render(view: () => HTMLElement) {
  app.innerHTML = '';
  app.appendChild(view());
}

function catalogo() {
  app.innerHTML = `
    <h2>Catálogo</h2>
    <ul>
      <li><a href="#/fisica/pendulo">Física · Péndulo simple</a></li>
      <li><a href="#/fisica/colisiones-1d">Física · Colisiones 1D</a></li>
      <li><a href="#/matematicas/integral">Matemáticas · Integral (área bajo la curva)</a></li>
      <li><a href="#/informatica/logica">Informática · Lógica digital básica</a></li>
    </ul>
  `;
}

function router() {
  const hash = location.hash.replace(/^#/, '');
  switch (hash) {
    case '/fisica/pendulo':
      render(penduloView);
      break;
    case '/fisica/colisiones-1d':
      render(colisiones1DView);
      break;
    case '/matematicas/integral':
      render(integralView);
      break;
    case '/informatica/logica':
      render(logicaView);
      break;
    default:
      catalogo();
  }
}

window.addEventListener('hashchange', router);
router();

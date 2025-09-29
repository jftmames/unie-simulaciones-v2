import { penduloView } from './simulations/fisica/pendulo/view';
import { integralView } from './simulations/matematicas/integral/view';
import { logicaView } from './simulations/informatica/logica/view';

const app = document.querySelector<HTMLDivElement>('#app')!;

function router() {
  const hash = location.hash.slice(1);
  app.innerHTML = '';

  switch (hash) {
    case '/fisica/pendulo':
      app.appendChild(penduloView());
      break;
    case '/matematicas/integral':
      app.appendChild(integralView());
      break;
    case '/informatica/logica':
      app.appendChild(logicaView());
      break;
    default:
      app.innerHTML = `
        <h2>Catálogo</h2>
        <ul>
          <li><a href="#/fisica/pendulo">Física · Péndulo simple</a></li>
          <li><a href="#/matematicas/integral">Matemáticas · Integral (área)</a></li>
          <li><a href="#/informatica/logica">Informática · Lógica digital básica</a></li>
        </ul>
      `;
  }
}

window.addEventListener('hashchange', router);
router();


const app = document.querySelector<HTMLDivElement>('#app')!;

function router() {
  const hash = location.hash.slice(1);
  app.innerHTML = '';

  switch (hash) {
    case '/fisica/pendulo':
      app.appendChild(penduloView());
      break;
    case '/matematicas/integral':
      app.appendChild(integralView());
      break;
    default:
      app.innerHTML = `
        <h2>Catálogo</h2>
        <ul>
          <li><a href="#/fisica/pendulo">Física · Péndulo simple</a></li>
          <li><a href="#/matematicas/integral">Matemáticas · Integral (área bajo la curva)</a></li>
        </ul>
      `;
  }
}

window.addEventListener('hashchange', router);
router();

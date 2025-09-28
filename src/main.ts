import { penduloView } from './simulations/fisica/pendulo/view';

const app = document.querySelector<HTMLDivElement>('#app')!;

function router() {
  const hash = location.hash.slice(1);
  app.innerHTML = '';
  if (hash === '/fisica/pendulo') {
    app.appendChild(penduloView());
  } else {
    app.innerHTML = `
      <h2>Catálogo</h2>
      <ul>
        <li><a href="#/fisica/pendulo">Física · Péndulo simple</a></li>
      </ul>
    `;
  }
}

window.addEventListener('hashchange', router);
router();

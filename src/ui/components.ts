// Controles UI básicos reutilizables

export function slider(
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  onChange: (v: number) => void
): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'control';
  const id = 's' + Math.random().toString(36).slice(2);
  wrap.innerHTML = `
    <label for="${id}">${label}: <span id="${id}-val">${value}</span></label><br>
    <input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"/>
  `;
  const input = wrap.querySelector('input') as HTMLInputElement;
  const span = wrap.querySelector('span')!;
  input.oninput = () => {
    const v = parseFloat(input.value);
    span.textContent = v.toFixed(2);
    onChange(v);
  };
  return wrap;
}

export function button(label: string, onClick: () => void): HTMLElement {
  const b = document.createElement('button');
  b.textContent = label;
  b.onclick = onClick;
  return b;
}

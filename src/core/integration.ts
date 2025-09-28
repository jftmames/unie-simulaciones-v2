// Método de integración RK4 simple
export function stepRK4(
  f: (state: number[]) => number[],
  state: number[],
  dt: number
): number[] {
  const k1 = f(state).map(v => v * dt);
  const k2 = f(state.map((s, i) => s + k1[i] / 2)).map(v => v * dt);
  const k3 = f(state.map((s, i) => s + k2[i] / 2)).map(v => v * dt);
  const k4 = f(state.map((s, i) => s + k3[i])).map(v => v * dt);
  return state.map((s, i) => s + (k1[i] + 2*k2[i] + 2*k3[i] + k4[i]) / 6);
}

function getPositionAtCenter(element: HTMLElement | null): { x: number; y: number } | null {
  if (!element) return null;
  const { top, left, width, height } = element.getBoundingClientRect();

  return {
    x: left + width / 2,
    y: top + height / 2,
  };
}

export function getDistanceBetweenElements(a: HTMLElement | null, b: HTMLElement | null): number {
  const aPosition = getPositionAtCenter(a);
  const bPosition = getPositionAtCenter(b);
  if (!aPosition || !bPosition) return 0;

  return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
}

export async function animation(car: HTMLElement | null, distance: number, animationTime: number): Promise<State> {
  let start = 0;
  const state: State = { id: null };

  function step(timestamp: number): void {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const passed = Math.round(time * (distance / animationTime));

    if (car) car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

    if (passed < distance) {
      state.id = window.requestAnimationFrame(step);
    }
  }

  state.id = window.requestAnimationFrame(step);

  return state;
}

export async function raceAll(
  store: Store,
  promises: Promise<{
    success: boolean;
    id: number;
    time: number;
  }>[],
  ids: number[]
): Promise<any> {
  const { success, id, time } = await Promise.race(promises);

  if (!success) {
    const failedIndex = ids.findIndex((i) => i === id);
    const restPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1, promises.length)];
    const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];

    return raceAll(store, restPromises, restIds);
  }

  return { ...store.cars.find((car: { id: number }) => car.id === id), time: +(time / 1000).toFixed(2) };
}

export async function race(
  store: Store,
  action: (store: Store, id: number) => Promise<{ success: boolean; id: number; time: number }>
) {
  const promises = store.cars.map((car: { id: number }) => action(store, car.id));
  const winner = await raceAll(
    store,
    promises,
    store.cars.map((car: { id: number }) => car.id)
  );

  return winner;
}

const models = ['Tesla', 'Mercedes', 'Mazda', 'Audi', 'Ferrari', 'Honda', 'BMW', 'Lamborghini', 'Citroen', 'Toyota'];
const names = ['CLA', 'CX-5', 'Camry', 'Accord', 'SS', 'RX-8', 'Z4', '1000', 'GLA', 'A7'];

export function getRandomName(): string {
  const model = models[Math.floor(Math.random() * models.length)];
  const name = names[Math.floor(Math.random() * names.length)];

  return `${model} ${name}`;
}

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function generateRandomCars(count = 100): { name: string; color: string }[] {
  return new Array(count).fill(1).map(() => {
    return { name: getRandomName(), color: getRandomColor() };
  });
}

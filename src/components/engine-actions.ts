import { drive, startEngine, stopEngine } from './api';
import { animation, getDistanceBetweenElements } from './utils';

export async function startDriving(store: Store, id: number): Promise<{ success: boolean; id: number; time: number }> {
  const startButton = document.getElementById(`start-engine-car-${id}`);
  startButton!.disabled = true;
  document.getElementById(`stop-engine-car-${id}`)!.disabled = false;
  const { velocity, distance } = await startEngine(id);
  const car: HTMLElement | null = document.getElementById(`car-${id}`);
  const flag: HTMLElement | null = document.getElementById(`flag-${id}`);
  const time = Math.round(distance / velocity);
  const htmlDistance = Math.floor(getDistanceBetweenElements(car, flag)) + 50;
  const animationId = await animation(car, htmlDistance, time);
  store.animation.id = animationId.id;

  const { success } = await drive(id);
  if (!success) window.cancelAnimationFrame(animationId.id!);

  return { success, id, time };
}

export async function stopDriving(store: Store, id: number): Promise<void> {
  const stopButton = document.getElementById(`stop-engine-car-${id}`);
  stopButton!.disabled = true;
  await stopEngine(id);
  document.getElementById(`start-engine-car-${id}`)!.disabled = false;
  const car: HTMLElement | null = document.getElementById(`car-${id}`);
  car!.style.transform = `translateX(0)`;
  if (store.animation.id) window.cancelAnimationFrame(store.animation.id);
}

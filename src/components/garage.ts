import { getCarForRender } from './car';

export default function getGarage(store: Store): string {
  return `
    <h1 class="main-title">Garage (${store.carsCount})</h1>
    <h2 class="second-title">Page #${store.carsPage}</h2>
    <ul class="cars-list">
      ${store.cars
        .map(
          (car: { id: number; name: string; color: string; isEngineStarted: boolean }) => `
        <li>${getCarForRender(car)}</li>
      `
        )
        .join('')}
    </ul>
  `;
}

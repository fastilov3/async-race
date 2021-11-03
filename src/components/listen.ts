import {
  createCar,
  deleteCar,
  deleteWinner,
  getCar,
  getCars,
  getWinner,
  getWinners,
  saveWinner,
  updateCar,
} from './api';
import { startDriving, stopDriving } from './engine-actions';
import getGarage from './garage';
import { generateRandomCars, race } from './utils';
import getWinnersForRender from './winners';

let selectedCar: Car | null = null;

export async function updateStateGarage(store: Store) {
  const { items, count } = await getCars(store.carsPage);
  store.cars = items;
  store.carsCount = count;

  if (store.carsPage * 7 < +store.carsCount!) {
    document.getElementById('next')!.disabled = false;
  } else {
    document.getElementById('next')!.disabled = true;
  }

  if (store.carsPage > 1) {
    document.getElementById('prev')!.disabled = false;
  } else {
    document.getElementById('prev')!.disabled = true;
  }
}

export async function updateStateWinners(store: Store) {
  const { items, count } = await getWinners({
    page: store.winnersPage,
    limit: 10,
    sort: store.sortBy,
    order: store.sortOrder,
  });
  store.winners = items;
  store.winnersCount = count;

  if (store.winnersPage * 10 < +store.winnersCount!) {
    document.getElementById('next')!.disabled = false;
  } else {
    document.getElementById('next')!.disabled = true;
  }

  if (store.winnersPage > 1) {
    document.getElementById('prev')!.disabled = false;
  } else {
    document.getElementById('prev')!.disabled = true;
  }
}

export async function setSortOrder(store: Store, sortBy: string) {
  store.sortOrder = store.sortOrder === 'asc' ? 'desc' : 'asc';
  store.sortBy = sortBy;

  await updateStateWinners(store);
  document.getElementById('winners-view')!.innerHTML = getWinnersForRender(store);
}

export function listen(store: Store): void {
  document.body.addEventListener('click', async (e: MouseEvent) => {
    const target = e.target as unknown as HTMLElement;

    if (target.classList.contains('start-engine-button')) {
      const id = +target.id.split('start-engine-car-')[1];
      startDriving(store, id);
    }

    if (target.classList.contains('stop-engine-button')) {
      const id = +target.id.split('stop-engine-car-')[1];
      stopDriving(store, id);
    }

    if (target.classList.contains('select-button')) {
      selectedCar = await getCar(+target.id.split('select-car-')[1]);

      if (selectedCar) {
        document.getElementById('update-name')!.value = selectedCar.name;
        document.getElementById('update-color')!.value = selectedCar.color;
        document.getElementById('update-name')!.disabled = false;
        document.getElementById('update-color')!.disabled = false;
        document.getElementById('update-submit')!.disabled = false;
      }
    }

    if (target.classList.contains('remove-button')) {
      const id = +target.id.split('remove-car-')[1];
      await deleteCar(id);
      await deleteWinner(id);
      await updateStateGarage(store);
      document.getElementById('garage')!.innerHTML = getGarage(store);
    }

    if (target.classList.contains('generator-button')) {
      target.disabled = true;
      const cars = generateRandomCars();
      await Promise.all(cars.map(async (c) => createCar(c)));
      await updateStateGarage(store);
      document.getElementById('garage')!.innerHTML = getGarage(store);
      target.disabled = false;
    }

    if (target.classList.contains('race-button')) {
      target.disabled = true;
      const winner = await race(store, (store: Store, id: number) => startDriving(store, id));
      await saveWinner(winner);
      const message = document.getElementById('message');
      message!.innerHTML = `${winner.name} went first ${winner.time}s!`;
      message?.classList.toggle('visible', true);
      document.getElementById('reset')!.disabled = false;
    }

    if (target.classList.contains('reset-button')) {
      target.disabled = true;
      store.cars.map(({ id }) => stopDriving(store, id));
      const message = document.getElementById('message');
      message?.classList.toggle('visible', false);
      document.getElementById('race')!.disabled = false;
    }

    if (target.classList.contains('prev-button')) {
      switch (store.view) {
        case 'garage': {
          if (store.carsPage < 2) {
            return;
          }

          store.carsPage--;
          await updateStateGarage(store);
          document.getElementById('garage')!.innerHTML = getGarage(store);
          break;
        }

        case 'winners': {
          store.winnersPage--;
          await updateStateGarage(store);
          document.getElementById('winners-view')!.innerHTML = getGarage(store);
          break;
        }
      }
    }

    if (target.classList.contains('next-button')) {
      switch (store.view) {
        case 'garage': {
          store.carsPage++;
          await updateStateGarage(store);
          document.getElementById('garage')!.innerHTML = getGarage(store);
          break;
        }

        case 'winners': {
          store.winnersPage++;
          await updateStateGarage(store);
          document.getElementById('winners-view')!.innerHTML = getGarage(store);
          break;
        }
      }
    }

    if (target.classList.contains('garage-menu-button')) {
      document.getElementById('garage-view')!.style.display = 'block';
      document.getElementById('winners-view')!.style.display = 'none';
    }

    if (target.classList.contains('winners-menu-button')) {
      document.getElementById('winners-view')!.style.display = 'block';
      document.getElementById('garage-view')!.style.display = 'none';
      await updateStateWinners(store);
      document.getElementById('winners-view')!.innerHTML = getWinnersForRender(store);
    }

    if (target.classList.contains('table-wins')) {
      setSortOrder(store, 'wins');
    }

    if (target.classList.contains('table-time')) {
      setSortOrder(store, 'time');
    }
  });

  document.getElementById('create')?.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    const name = document.getElementById('create-name')!.value;
    const color = document.getElementById('create-color')!.value;
    const car = { name, color };
    await createCar(car);
    await updateStateGarage(store);
    document.getElementById('garage')!.innerHTML = getGarage(store);
    document.getElementById('create-name')!.value = '';
    e.target!.disabled = 'true';
  });

  document.getElementById('update')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('update-name')!.value;
    const color = document.getElementById('update-color')!.value;
    const car = { name, color };
    if (selectedCar) await updateCar(selectedCar.id, car);
    await updateStateGarage(store);
    document.getElementById('garage')!.innerHTML = getGarage(store);
    document.getElementById('update-name')!.value = '';
    document.getElementById('update-name')!.disabled = true;
    document.getElementById('update-color')!.disabled = true;
    document.getElementById('update-submit')!.disabled = true;
    document.getElementById('update-color')!.value = '#ffffff';
    selectedCar = null;
  });
}

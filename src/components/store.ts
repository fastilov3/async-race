import { getCars, getWinners } from './api';

export default async function getStore(): Promise<Store> {
  const { items: cars, count: carsCount } = await getCars(1);
  const { items: winners, count: winnersCount }: GetWinners = await getWinners({
    page: 1,
    limit: 10,
    order: null,
    sort: null,
  });
  const store = {
    carsPage: 1,
    cars,
    carsCount,
    winnersPage: 1,
    winners,
    winnersCount,
    animation: { id: null },
    view: 'garage',
    sortBy: '',
    sortOrder: '',
  };

  return store;
}

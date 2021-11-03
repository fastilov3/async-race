const BASE_URL = 'http://localhost:3000';
const GARAGE = `${BASE_URL}/garage`;
const ENGINE = `${BASE_URL}/engine`;
const WINNERS = `${BASE_URL}/winners`;

export async function getCars(page: number, limit = 7): Promise<Cars> {
  const response = await fetch(`${GARAGE}?_page=${page}&_limit=${limit}`);

  return {
    items: await response.json(),
    count: response.headers.get('X-Total-Count'),
  };
}

export async function getCar(id: number): Promise<Car> {
  return (await fetch(`${GARAGE}/${id}`)).json();
}

export async function createCar(body: object) {
  return (
    await fetch(GARAGE, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
}

export async function deleteCar(id: number): Promise<void> {
  try {
    await (await fetch(`${GARAGE}/${id}`, { method: 'DELETE' })).json();
  } catch (error) {
    console.log(error);
  }
}

export async function updateCar(id: number, body: object): Promise<void> {
  (
    await fetch(`${GARAGE}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
}

export async function startEngine(id: number): Promise<{ velocity: number; distance: number; }> {
  return (await fetch(`${ENGINE}?id=${id}&status=started`)).json();
}

export async function stopEngine(id: number): Promise<void> {
  (await fetch(`${ENGINE}?id=${id}&status=stopped`)).json();
}

export async function drive(id: number): Promise<{ success: boolean; }> {
  const response = await fetch(`${ENGINE}?id=${id}&status=drive`).catch();

  return response.status !== 200 ? { success: false } : { ...(await response.json()) };
}

export function getSortOrder(sort: string | null, order: string | null): string {
  if (sort && order) return `&_sort=${sort}&_order=${order}`;

  return '';
}

export async function getWinners({
  page,
  limit = 10,
  sort,
  order,
}: {
  page: number;
  limit: number | null;
  sort: string | null;
  order: string | null;
}): Promise<GetWinners> {
  const p = getSortOrder(sort, order);
  const response = await fetch(`${WINNERS}?_page=${page}&_limit=${limit}${p}`);

  const items = await response.json();

  return {
    items: await Promise.all(
      items.map(async (winner: { id: number; wins: number; time: number }) => {
        return {
          ...winner,
          car: await getCar(winner.id),
        };
      })
    ),
    count: response.headers.get('X-Total-Count'),
  };
}

export async function getWinner(id: number): Promise<Winner> {
  return (await fetch(`${WINNERS}/${id}`)).json();
}

export async function getWinnerStatus(id: number): Promise<number> {
  return (await fetch(`${WINNERS}/${id}`)).status;
}

export async function deleteWinner(id: number): Promise<void> {
  try {
    await (await fetch(`${WINNERS}/${id}`, { method: 'DELETE' })).json();
  } catch (error) {
    console.log(error);
  }
}

export async function createWinner(body: object): Promise<void> {
  (
    await fetch(WINNERS, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
}

export async function updateWinner(id: number, body: object) {
  return (
    await fetch(`${WINNERS}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();
}

export async function saveWinner({ id, time }: { id: number; time: number }) {
  const winnerStatus = await getWinnerStatus(id);

  if (winnerStatus === 404) {
    await createWinner({
      id,
      wins: 1,
      time,
    });
  } else {
    const winner = await getWinner(id);
    await updateWinner(id, {
      id,
      wins: winner.wins + 1,
      time: time < winner.time ? time : winner.time,
    });
  }
}

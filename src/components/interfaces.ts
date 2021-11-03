interface Car {
  name: string;
  color: string;
  id: number;
  isEngineStarted: boolean;
}

interface Cars {
  items: Array<Car>;
  count: string | null
}

interface State {
  id: number | null;
}

interface Winner {
  car: Car;
  wins: number;
  time: number;
  id: number;
}

interface GetWinners {
  items: Array<Winner>;
  count: string | null;
}

interface Anim {
  id: number | null;
}

interface Store {
  carsPage: number;
  cars: Array<Car>;
  carsCount: string | null;
  winnersPage: number;
  winners: Array<Winner>;
  winnersCount: string | null;
  animation: Anim;
  view: string;
  sortBy: string;
  sortOrder: string;
}

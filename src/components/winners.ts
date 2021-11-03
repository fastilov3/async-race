import getCarImgForRender from './car';

export default function getWinnersForRender(store: Store): string {
  return `
    <h1 class="main-title">Winners (${store.winnersCount})</h1>
    <h2 class="second-title">Page #${store.winnersPage}</h2>
    <table class="table" cellspacing="0" border="0" cellpadding="0">
      <thead>
        <th>Number</th>
        <th>Car</th>
        <th>Name</th>
        <th class="table-button table-wins ${
          store.sortBy === 'wins' ? store.sortOrder : ''
        }" id="sort-by-wins">Wins</th>
        <th class="table-button table-time ${
          store.sortBy === 'time' ? store.sortOrder : ''
        }" id="sort-by-wins">Best time (seconds)</th>
      </thead>
      <tbody>
        ${store.winners
          .map(
            (winner: Winner, index: number) => `
          <tr>
            <td>${index + 1}</td>
            <td>${getCarImgForRender(winner.car.color)}</td>
            <td>${winner.car.name}</td>
            <td>${winner.wins}</td>
            <td>${winner.time}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

import getGarage from './garage';
import getWinnersForRender from './winners';

export default function render(store: Store): void {
  const html = `
    <div class="menu">
      <button class="button garage-menu-button primary" id="garage-menu">To garage</button>
      <button class="button winners-menu-button primary" id="winners-menu">To winners</button>
    </div>
    <div id="garage-view"> 
      <div>
        <form class="form" id="create">
          <input class="input" id="create-name" name="name" type="text" value="">  
          <input class="color" id="create-color" name="color" type="color" value="#8000ff">  
          <button class="button" type="submit">Create</button>
        </form>
        <form class="form" id="update">
          <input class="input" id="update-name" name="name" type="text" disabled value="">  
          <input class="color" id="update-color" name="color" type="color" value="#ffffff" disabled>  
          <button class="button" id="update-submit" type="submit" disabled>Update</button>
        </form>
      </div>
      <div class="race-controls">
        <button class="button race-button primary" id="race">Race</button>
        <button class="button reset-button primary" id="reset">Reset</button>
        <button class="button generator-button" id="generator">Generate cars</button>
      </div>
      <div id="garage">
        ${getGarage(store)}
      </div>
      <div>
        <p class="message" id="message"></p>
      </div>
    </div>
    <div id="winners-view" style="display: none">  
      ${getWinnersForRender(store)}
    </div>
    <div class="pagination">
      <button class="button primary prev-button" id="prev">Prev</button>
      <button class="button primary next-button" id="next">Next</button>
    </div>
  `;
  const rootElement = document.createElement('div');
  rootElement.classList.add('main');
  rootElement.innerHTML = html;
  document.body.appendChild(rootElement);
}

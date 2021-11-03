import render from './components/app';
import { listen, updateStateWinners } from './components/listen';
import { getStore } from './components/store';
import './style.scss';

window.onload = async (): Promise<void> => {
  const store = await getStore();
  render(store);
  listen(store);
  updateStateWinners(store);
};

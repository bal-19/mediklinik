import './styles.css';
import { renderApp } from './render-app';

const root = document.getElementById('root');

if (root) {
  root.innerHTML = renderApp(window.location.pathname);
}

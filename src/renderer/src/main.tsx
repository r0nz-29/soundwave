import { render } from 'solid-js/web';
import App from './app';
import { Router } from '@solidjs/router';
import './styles.css';

render(
  () => (
    <Router>
      <App />
    </Router>
  ),
  document.getElementById('root') as HTMLElement
);

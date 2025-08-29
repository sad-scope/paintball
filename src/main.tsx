import { StrictMode } from 'react';
import { ThemeProvider } from '@gravity-ui/uikit';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import './themes.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme="dark">
      <App />
    </ThemeProvider>
  </StrictMode>,
);

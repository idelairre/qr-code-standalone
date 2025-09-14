import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from './components/ui/provider';
import './index.css';

const container = document.getElementById('root');
if (!container) {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
}

// Get the container and ensure it's not null
const rootElement = container || document.getElementById('root');
if (!rootElement) {
    throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
        <Provider>
            <App />
        </Provider>
    </React.StrictMode>
);

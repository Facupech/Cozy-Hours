import { UserProvider } from './context/UserContext';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
        <App />
    </UserProvider>
);

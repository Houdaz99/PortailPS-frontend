import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import './index.css';
import App from './App.jsx';
import { configureStore } from "@reduxjs/toolkit";
import dossierPaiementReducer from "./store"; // Assure-toi que c'est bien importé
import store from './store'; // Import du store complet

// Wrap your App component with Provider and pass the store
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
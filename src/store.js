import { configureStore } from "@reduxjs/toolkit";
import souscompteSlice from './redux/MySlicer';  // Import du slice pour les souscomptes
import reducers from "./redux/MySlicer";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // Import des outils pour créer les actions asynchrones
import axios from "axios";

// Action asynchrone pour récupérer les dossiers de remboursements
export const fetchDossiersRemboursements = createAsyncThunk(
  "dossierPaiement/fetchDossiersRemboursements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/remboursements");
      return response.data; // Assurez-vous que l'API retourne bien un tableau de dossiers
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue");
    }
  }
);

// Action asynchrone pour récupérer les dossiers de paiements
export const fetchDossiersPaiements = createAsyncThunk(
  "dossierPaiement/fetchDossiersPaiements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/paiements");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Action asynchrone pour récupérer les paiements
export const fetchPaiements = createAsyncThunk(
  "dossierPaiement/fetchPaiements",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/paiements");
      return response.data; // Retourner les données de paiements
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Création du slice dossierPaiement
const dossierPaiementSlice = createSlice({
  name: "dossierPaiement",
  initialState: {
    dossiersRemboursements: [],
    loadingRemboursements: false,
    errorRemboursements: null,
    dossiersPaiements: [],
    loadingPaiements: false,
    errorPaiements: null,
    paiements: [], // Ajout d'un état pour les paiements
    loadingPaiementsList: false, // État pour la gestion du chargement des paiements
    errorPaiementsList: null, // État pour la gestion des erreurs des paiements
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Gestion des dossiers de remboursements
      .addCase(fetchDossiersRemboursements.pending, (state) => {
        state.loadingRemboursements = true;
        state.errorRemboursements = null;
      })
      .addCase(fetchDossiersRemboursements.fulfilled, (state, action) => {
        state.loadingRemboursements = false;
        state.dossiersRemboursements = action.payload;
      })
      .addCase(fetchDossiersRemboursements.rejected, (state, action) => {
        state.loadingRemboursements = false;
        state.errorRemboursements = action.payload;
      })

      // Gestion des dossiers de paiements
      .addCase(fetchDossiersPaiements.pending, (state) => {
        state.loadingPaiements = true;
        state.errorPaiements = null;
      })
      .addCase(fetchDossiersPaiements.fulfilled, (state, action) => {
        state.loadingPaiements = false;
        state.dossiersPaiements = action.payload;
      })
      .addCase(fetchDossiersPaiements.rejected, (state, action) => {
        state.loadingPaiements = false;
        state.errorPaiements = action.payload;
      })

      // Gestion des paiements
      .addCase(fetchPaiements.pending, (state) => {
        state.loadingPaiementsList = true;
        state.errorPaiementsList = null;
      })
      .addCase(fetchPaiements.fulfilled, (state, action) => {
        state.loadingPaiementsList = false;
        state.paiements = action.payload;
      })
      .addCase(fetchPaiements.rejected, (state, action) => {
        state.loadingPaiementsList = false;
        state.errorPaiementsList = action.payload;
      });
  },
});

// Configuration du store
const store = configureStore({
  reducer: {
    souscompte: reducers.souscompte, // Slice original
    souscompte2: reducers.souscompte2, // Slice cloné avec état indépendant
  
    dossierPaiement: dossierPaiementSlice.reducer,  // Ajout du reducer pour dossierPaiement
  },
});

export default store;  // Export du store configuré

// Export des actions et du reducer de dossierPaiement
export const { setDossiersRemboursements, setDossiersPaiements } = dossierPaiementSlice.actions;
export const dossierPaiementReducer = dossierPaiementSlice.reducer;

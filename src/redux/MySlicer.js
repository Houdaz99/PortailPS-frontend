import { createSlice } from "@reduxjs/toolkit";

// Initial state pour souscompte
const initialStateSouscompte = {
  souscomptes: [
    { id: 1, nom: "Yusra", prenom: "Mohimi", password: "password1" },
    { id: 2, nom: "Zakaria", prenom: "Hanafia", password: "password2" },
    { id: 3, nom: "Aymen", prenom: "El Idrysy", password: "password3" },
  ],
};

// Initial state pour souscompte2 (indépendant)
const initialStateSouscompte2 = {
  souscomptes: [], // Liste vide ou autre état spécifique
};

// Slice pour souscompte
const souscompteSlice = createSlice({
  name: "souscompte",
  initialState: initialStateSouscompte,
  reducers: {
    addSouscompte: (state, action) => {
      state.souscomptes.push(action.payload);
    },
    deleteSouscompte: (state, action) => {
      state.souscomptes = state.souscomptes.filter((sc) => sc.id !== action.payload);
    },
    updateSouscompte: (state, action) => {
      const { id, nom, prenom, password } = action.payload;
      const index = state.souscomptes.findIndex((sc) => sc.id === id);
      if (index !== -1) {
        state.souscomptes[index] = { id, nom, prenom, password };
      }
    },
  },
});

// Slice pour souscompte2 (indépendant)
const souscompte2Slice = createSlice({
  name: "souscompte2",
  initialState: initialStateSouscompte2,
  reducers: {
    addSouscompte2: (state, action) => {
      state.souscomptes.push(action.payload);
    },
    deleteSouscompte2: (state, action) => {
      state.souscomptes = state.souscomptes.filter((sc) => sc.id !== action.payload);
    },
    updateSouscompte2: (state, action) => {
      const { id, nom, prenom, password } = action.payload;
      const index = state.souscomptes.findIndex((sc) => sc.id === id);
      if (index !== -1) {
        state.souscomptes[index] = { id, nom, prenom, password };
      }
    },
  },
});

export const { addSouscompte, deleteSouscompte, updateSouscompte } = souscompteSlice.actions;
export const { addSouscompte2, deleteSouscompte2, updateSouscompte2 } = souscompte2Slice.actions;

export default {
  souscompte: souscompteSlice.reducer,
  souscompte2: souscompte2Slice.reducer,
};

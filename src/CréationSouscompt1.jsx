// ============================
// IMPORTATION DES DÉPENDANCES
// ============================

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSouscompte2 } from "./redux/MySlicer"; // Action Redux pour ajouter un sous-compte dans un second espace
import { useNavigate } from "react-router-dom"; // Hook de navigation React Router

// ==========================
// COMPOSANT : CréationSouscompt1
// ==========================

const CréationSouscompt1 = () => {
  const dispatch = useDispatch();        // Hook Redux pour dispatcher une action
  const navigate = useNavigate();        // Hook pour redirection de l'utilisateur

  // ==========================
  // ÉTAT LOCAL POUR LE FORMULAIRE
  // ==========================

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    password: ""
  });

  // ==========================
  // GESTIONNAIRE DE CHANGEMENT DE CHAMP
  // ==========================

  const handleChange = (e) => {
    const { name, value } = e.target; // Récupération du nom du champ et de sa valeur
    setFormData({ ...formData, [name]: value }); // Mise à jour du state local
  };

  // ==========================
  // GESTIONNAIRE DE SOUMISSION DU FORMULAIRE
  // ==========================

  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page à la soumission

    // Vérifie que tous les champs sont remplis
    if (!formData.nom || !formData.prenom || !formData.password) return;

    // Création de l'objet sous-compte avec ID unique basé sur le timestamp
    const newSouscompte = {
      id: Date.now(),
      ...formData
    };

    // Envoi de l'action Redux pour ajouter le sous-compte
    dispatch(addSouscompte2(newSouscompte));

    // Réinitialisation des champs du formulaire
    setFormData({ nom: "", prenom: "", password: "" });

    // Redirection vers la page de gestion des sous-comptes correspondante
    navigate("/GéstionSousCompte1");
  };

  // ==========================
  // RENDU DU COMPOSANT
  // ==========================

  return (
    <div className="flex h-screen">
      {/* Conteneur centralisé pour le formulaire */}
      <div className="flex justify-center items-center w-full p-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Créer un Sous-Compte</h2>
          <form onSubmit={handleSubmit}>
            
            {/* Champ : Nom */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Nom</label>
              <input
                className="shadow border rounded w-full py-2 px-3"
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ : Prénom */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Prénom</label>
              <input
                className="shadow border rounded w-full py-2 px-3"
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
              />
            </div>

            {/* Champ : Mot de passe */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Mot de passe</label>
              <input
                className="shadow border rounded w-full py-2 px-3"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Bouton de soumission */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              type="submit"
            >
              Ajouter
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CréationSouscompt1;

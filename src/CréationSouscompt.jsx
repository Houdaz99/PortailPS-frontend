// Importation des hooks et modules nécessaires
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addSouscompte } from "./redux/MySlicer"; // Action Redux pour ajouter un sous-compte
import { useNavigate } from "react-router-dom"; // Hook de navigation
import Asidebar from "./Asidebar"; // Composant de barre latérale (non utilisé ici mais importé)

// Composant principal pour la création d’un sous-compte
const CréationSouscompt = () => {
  const dispatch = useDispatch(); // Initialisation du dispatcher Redux
  const navigate = useNavigate(); // Initialisation de la navigation

  // État local pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    password: ""
  });

  // Gestionnaire de changement de valeur dans les inputs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Gestionnaire de soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    // Validation de base : tous les champs doivent être remplis
    if (!formData.nom || !formData.prenom || !formData.password) return;

    // Création d’un nouvel objet sous-compte avec identifiant unique
    const newSouscompte = {
      id: Date.now(), // Génération d'un ID unique basé sur le timestamp
      ...formData
    };

    dispatch(addSouscompte(newSouscompte)); // Envoi des données au store Redux
    setFormData({ nom: "", prenom: "", password: "" }); // Réinitialisation du formulaire

    navigate("/GéstionSousCompte"); // Redirection vers la page de gestion des sous-comptes
  };

  return (
    <div className="flex h-screen">
      {/* Section centrale contenant le formulaire */}
      <div className="flex justify-center items-center w-full p-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Créer un Sous-Compte</h2>
          <form onSubmit={handleSubmit}>
            {/* Champ du nom */}
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

            {/* Champ du prénom */}
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

            {/* Champ du mot de passe */}
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

export default CréationSouscompt;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Ahospital from "./assets/Ahospital.jpg"; // Vérification du chemin de l'image
import axios from "axios";

export default function Dcnx1() {
  // État local pour stocker les informations de l'utilisateur authentifié
  const [userInfo, setUserInfo] = useState(null);
  
  // Hook pour la redirection de l'utilisateur
  const navigate = useNavigate();

  // Effet déclenché au montage pour récupérer les données de l'utilisateur via le token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Pas de token, l'utilisateur n'est pas connecté.");
      return;
    }

    axios
      .get("/api/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserInfo(response.data);
      })
      .catch((error) => {
        console.error("Erreur de récupération des informations de l'utilisateur :", error);
      });
  }, []);

  // Fonction de gestion de la déconnexion de l'utilisateur
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Pas de token, l'utilisateur n'est pas connecté.");
        return;
      }

      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Suppression des données locales après déconnexion
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("selectedMenu");

      // Redirection vers la page de connexion en cas de succès
      if (response.ok) {
        navigate("/login");
        window.location.reload();
      } else {
        console.error("Échec de la déconnexion", await response.json());
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300">
        
        {/* En-tête de la carte d'accès */}
        <div className="bg-bordeaux-700 text-white text-center py-4">
          <h2 className="text-2xl font-semibold">ACCÈS EXTRANET</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Bloc visuel : Affichage du logo ou image illustrant l'établissement */}
            <div className="flex justify-center">
              <img
                src={Ahospital}
                alt="Hôpital"
                className="w-32 h-32 rounded-lg shadow-md border border-gray-300 object-cover"
              />
            </div>

            {/* Bloc d'information utilisateur : affichage conditionnel des détails du prestataire */}
            <div className="col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Identification du Prestataire
              </h3>
              {userInfo ? (
                <table className="w-full text-gray-700 text-sm">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Nom :</td>
                      <td className="py-2">{userInfo.Nom_Etablissement_Soins}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">INPE :</td>
                      <td className="py-2">{userInfo.INPE}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Adresse :</td>
                      <td className="py-2">{userInfo.Adresse}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Ville :</td>
                      <td className="py-2">{userInfo.Ville}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Email :</td>
                      <td className="py-2">{userInfo.EMAIL}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Compte principal :</td>
                      <td className="py-2">{userInfo.Nature_Compte}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Téléphone :</td>
                      <td className="py-2">{userInfo.Telephone}</td>
                    </tr>
                    {/* 
                      Ligne optionnelle à activer si l'information de dernière connexion est disponible
                      <tr>
                        <td className="py-2 font-medium">Dernière connexion :</td>
                        <td className="py-2">{userInfo.Derniere_Connexion}</td>
                      </tr> 
                    */}
                  </tbody>
                </table>
              ) : (
                <p>Chargement des informations...</p>
              )}
            </div>
          </div>

          {/* Bouton de déconnexion positionné à droite avec style interactif */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-blue-900 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-bordeaux-900 transition-all duration-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

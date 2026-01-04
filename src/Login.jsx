import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cnss2 from "./assets/cnss2.jpeg";

// Composant de connexion principal
export default function Login() {
  // États pour la gestion des champs de formulaire, des erreurs et de l'état de traitement
  const [login, setLogin] = useState('');
  const [mdp, setMdp] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Hook de navigation pour redirection après authentification
  const navigate = useNavigate();

  // Fonction exécutée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setProcessing(true); // Active l'indicateur de traitement
    setErrors({}); // Réinitialise les erreurs

    try {
      // Envoi de la requête d'authentification au backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          login: login.trim(),
          mdp: mdp.trim()
        }),
      });

      // Journaux pour faciliter le débogage
      console.log("Status de la réponse:", response.status);
      console.log("Headers de la réponse:", [...response.headers.entries()]);
      const text = await response.text();
      console.log("Réponse brute:", text);
      console.log("50 premiers caractères:", text.substring(0, 50));
      console.log("50 derniers caractères:", text.substring(text.length - 50));

      // Analyse de la réponse JSON (si présente)
      const data = text ? JSON.parse(text) : {};

      // Si la réponse est positive, stockage des informations utilisateur
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userData', JSON.stringify({
          login: data.compte?.Login,
          inpe: data.compte?.INPE,
          type: data.compte?.Type
        }));

        console.log('Redirection vers la page d\'accueil');
        navigate("/");
        window.dispatchEvent(new Event("storage")); // Pour synchroniser les données dans d'autres onglets si nécessaire
      } else {
        // Gestion des erreurs en cas de réponse invalide
        setErrors(data.errors || { general: data.message || 'Erreur inconnue' });
      }
    } catch (error) {
      // Capture des erreurs inattendues
      console.error("Erreur complète:", error);
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setProcessing(false); // Désactive l'indicateur de traitement
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="flex shadow-2xl rounded-2xl overflow-hidden max-w-5xl w-full flex-row">
        
        {/* Partie gauche : image de fond (affichée uniquement sur les grands écrans) */}
        <div className="relative w-1/2 hidden lg:block">
          <img
            src={cnss2}
            alt="CNSS"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Partie droite : formulaire de connexion */}
        <div className="flex flex-col items-center justify-center text-center p-10 gap-6 bg-white w-full lg:w-1/2">
          <h1 className="text-4xl font-semibold text-blue-900 mb-6">Welcome Back</h1>

          {/* Affichage d'une erreur générale si elle existe */}
          {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

          <form onSubmit={handleSubmit} className="w-full">
            
            {/* Champ de saisie : Login */}
            <div className="flex flex-col text-lg text-left gap-2 w-full">
              <label htmlFor="login" className="text-blue-900">Login</label>
              <input
                id="login"
                type="text"
                className="rounded-md p-2 border-2 border-blue-900 outline-none text-sm"
                placeholder="Enter your Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
              />
            </div>

            {/* Champ de saisie : Mot de passe */}
            <div className="flex flex-col text-lg text-left gap-2 w-full mt-4">
              <label htmlFor="password" className="text-blue-900">Password</label>
              <input
                id="password"
                type="password"
                className="rounded-md p-2 border-2 border-blue-900 outline-none text-sm"
                placeholder="Enter your password"
                value={mdp}
                onChange={(e) => setMdp(e.target.value)}
                required
              />
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              className="px-8 py-2 text-lg rounded-md bg-blue-900 text-white mt-6 disabled:opacity-50"
              disabled={processing}
            >
              {processing ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

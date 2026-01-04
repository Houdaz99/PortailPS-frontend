import apaiement from "./assets/apaiement.jpeg";
import apec from "./assets/apec.jpeg";
import { Link } from "react-router-dom";
export default function Accueil() {
  // Fonction qui gère la sélection du menu et enregistre l'option choisie dans le localStorage  Puis recharge la page pour appliquer les modifications
  const handleMenuSelection = (menu) => {
    // Enregistrement de la sélection dans le localStorage
    localStorage.setItem("selectedMenu", menu);
    // Recharge de la page pour refléter la nouvelle sélection
    window.location.reload();
  };
  return (
    <div className="flex">
      {/* Conteneur principal de la page avec un espacement à gauche et un alignement central */}
      <div className="flex-1 p-8 ml-12 flex justify-center items-center pt-35">
        {/* Grid responsive avec 1 colonne sur mobile et 2 colonnes sur les écrans plus larges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Carte pour la prise en charge (PEC) */}
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            {/* Image représentant la prise en charge */}
            <img className="rounded-t-lg w-full h-48 object-cover" src={apec} alt="Prise en Charge PEC" />
            <div className="p-6">
              {/* Titre de la carte */}
              <h5 className="mb-2 text-2xl font-semibold text-gray-800">Prise en Charge PEC</h5>
              {/* Description de la carte */}
              <p className="mb-3 text-gray-600">
                La plateforme permet une gestion complète des assurés, incluant la consultation des assurés et de leurs prises en charge, ainsi que le suivi des détails des dossiers. Elle offre également un récapitulatif détaillé des informations, permettant une vision claire de l'état des demandes et des paiements.
              </p>
              {/* Lien vers la page des assurés avec gestion de la sélection du menu */}
              <Link
                to="/assures"
                onClick={() => handleMenuSelection("pec")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Consulter
                {/* Icône pour le lien */}
                <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </Link>
            </div>
          </div>
          {/* Carte pour la gestion des paiements */}
          <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105">
            {/* Image représentant les paiements */}
            <img className="rounded-t-lg w-full h-48 object-cover" src={apaiement} alt="Paiement" />
            <div className="p-6">
              {/* Titre de la carte */}
              <h5 className="mb-2 text-2xl font-semibold text-gray-800">Paiement</h5>
              {/* Description de la carte */}
              <p className="mb-3 text-gray-600">
                La plateforme offre une gestion complète des paiements, incluant le suivi des remboursements, la gestion des dossiers de paiement et un récapitulatif des transactions. Elle permet également de gérer les paiements par date d'émission, facilitant ainsi le suivi des paiements effectués et des échéances à venir.
              </p>
              {/* Lien vers la page de suivi des dossiers avec gestion de la sélection du menu */}
              <Link
                to="/SuiviDossierPage"
                onClick={() => handleMenuSelection("paiement")}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Consulter
                {/* Icône pour le lien */}
                <svg className="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
